/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { MuiTelInput } from "mui-tel-input";
import React, { useEffect, useState } from "react";
import useStore from "../../Store";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useNavigate } from "react-router-dom";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";
import { toast } from "react-hot-toast";
import FlashMessage from "./Flashmessages";

function Payment() {
  const { formData, setFormData } = useStore();
  const [phone_number, setPhoneNumber] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const { Session, setSession, user } = useStore();
  const navigate = useNavigate();

  const validatePhone = () => {
    if (!phone_number || phone_number.length < 10) {
      alert("Invalid phone number! Please enter a valid one.");
      return false;
    }
    return true;
  };

  const initialOptions = {
    clientId:
      "AWpDWEI5qM9CRjviYOjGYIqbozIo9qgLdDjhbeIpISjZfgS0ot1qKBau2-rlEfN1Z89G0gt45CTeFiSA",
    currency: "USD",
    intent: "capture",
    "enable-funding": "paypal,card",
  };

  useEffect(() => {
    if (isSuccessful) {
      axios
        .patch(`http://127.0.0.1:5000/api/${Session}/session`, {
          paid: true,
        })
        .then(() => {
          // toast.success("Responses submitted successfully!");
          setTimeout(() => {
            navigate("/results");
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to update session:", err);
        });
    }
  }, [isSuccessful]);

  async function make_payment() {
    try {
      const res = await axios.post("http://127.0.0.1:5000/make_payment", {
        phone_number: phone_number,
        session_id: Session,
      });

      if (res.status === 200) {
        setIsSuccessful(true);
      } else {
        throw new Error("Error making payment");
      }
    } catch (err) {
      toast.error("M-Pesa payment failed. Try again.");
      setHasError(true);
    }
  }

  if (isSuccessful) {
    return (
      <FlashMessage type="success" onAction={() => navigate("/results")} />
    );
  }

  if (hasError) {
    return (
      <FlashMessage type="error" onAction={() => window.location.reload()} />
    );
  }

  return (
    <div className="relative w-screen h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 text-gray-900 dark:text-white">
      <img
        className="absolute w-full h-full object-cover opacity-100"
        src="/assets/bg.jpeg"
        alt="Background"
      />

      <div className="absolute h-screen left-1/2 transform -translate-x-1/2 w-[80%] md:w-[60%] lg:w-[40%] text-center px-4 py-10 bg-opacity-50 z-10 justify-center items-center">
        <div className="flex flex-col justify-center items-center min-h-[60%] gap-4 bg-white p-6 rounded-lg shadow-lg">
          <p className="font-semibold text-green-800  mb-2 leading relaxed">
            We need you to pay a small fee to receive your results
          </p>

          {/* PayPal Card */}
          <div
            className="w-full bg-white rounded-xl shadow-lg p-6 relative border-2 border-gray-300 cursor-pointer"
            onClick={() => setSelectedPayment("paypal")}
          >
            <div className="absolute  right-12 text-xl text-gray-700 font-semibold">
              $1.99
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  src="/assets/paypal.png"
                  alt="PayPal"
                  className="w-8 h-8 mr-4"
                />
                <p className="font-semibold text-green-800">Pay with PayPal</p>
              </div>
              <input
                type="checkbox"
                checked={selectedPayment === "paypal"}
                onChange={() => setSelectedPayment("paypal")}
                className="w-4 h-4 rounded-full border-2 border-gray-400 appearance-none checked:bg-green-600 checked:border-green-600"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {selectedPayment === "paypal" && (
              <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                  style={{
                    shape: "rect",
                    layout: "vertical",
                    color: "gold",
                    label: "paypal",
                    height: 35,
                  }}
                  createOrder={async () => {
                    try {
                      const response = await fetch(
                        "http://127.0.0.1:5000/pay",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            amount: "1",
                            currency: "USD",
                            session_id: Session,
                          }),
                        }
                      );

                      const orderData = await response.json();

                      if (!orderData || !orderData.order_id) {
                        throw new Error("No order_id returned from server");
                      }

                      return orderData.order_id;
                    } catch (err) {
                      toast.error(
                        "Failed to create PayPal order. Please try again."
                      );
                      setHasError(true);
                      throw err;
                    }
                  }}
                  onApprove={async (data, actions) => {
                    try {
                      const details = await actions.order.capture();

                      const response = await fetch(
                        "http://127.0.0.1:5000/pay/confirm",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            session_id: Session,
                            amount: "1",
                            currency: "USD",
                            transaction_id: details.id,
                          }),
                        }
                      );

                      if (response.ok) {
                        setIsSuccessful(true);
                      } else {
                        toast.error("Failed to log the payment.");
                        setHasError(true);
                      }
                    } catch (err) {
                      toast.error("Payment capture failed. Please try again.");
                      setHasError(true);
                    }
                  }}
                  onError={(err) => {
                    toast.error(
                      "Error during payment process, please try again."
                    );
                    setHasError(true);
                  }}
                />
              </PayPalScriptProvider>
            )}
          </div>

          {/* M-Pesa Card */}
          <div
            className="w-full bg-white rounded-xl shadow-lg p-6 relative border-2 border-gray-300 cursor-pointer"
            onClick={() => setSelectedPayment("mpesa")}
          >
            <div className="absolute right-12 text-xl text-gray-700 font-semibold">
              Ksh 199
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  src="assets/M-PESA_LOGO-01.svg"
                  alt="M-Pesa"
                  className="w-10 h-10 mr-4"
                />
                <p className="font-semibold text-green-800">Pay with M-Pesa</p>
              </div>
              <input
                type="checkbox"
                checked={selectedPayment === "mpesa"}
                onChange={() => setSelectedPayment("mpesa")}
                className="w-4 h-4  rounded-full border-2 border-gray-400 appearance-none checked:bg-green-600 checked:border-green-600"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {selectedPayment === "mpesa" && (
              <div className="w-full flex flex-col items-center mt-6">
                <label htmlFor="phone" className="block text-gray-700 mb-2">
                  Enter Phone Number
                </label>
                <MuiTelInput
                  value={phone_number}
                  onChange={setPhoneNumber}
                  defaultCountry="KE"
                  className="w-full"
                />
                <button
                  onClick={() => {
                    if (validatePhone()) {
                      make_payment();
                    }
                  }}
                  className="mt-4 bg-green-600 text-white py-2 px-6 rounded-xl hover:bg-green-700"
                >
                  Pay with M-Pesa
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
