/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { MuiTelInput } from "mui-tel-input";
import React, { useEffect, useState } from "react";
import useStore from "../../Store";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useNavigate } from "react-router-dom";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaypalPayment from "./PaypalPayment";
import axios from "axios";

function Payment() {
  const { formData, setFormData } = useStore();
  const [isSuccessful, setIsSuccessful] = useState(false);
  const { Session, setSession, user } = useStore();
  const navigate = useNavigate();

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone_number: value });
  };

  const validatePhone = () => {
    if (!isValidPhoneNumber(formData.phone_number, "KE")) {
      alert("Invalid phone number! Please enter a valid one.");
      return false;
    }
    return true;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  // if (!validatePhone()) return;

  // try {
  //   const response = await fetch("http://localhost:3000/users", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(formData),
  //   });

  //   if (!response.ok) throw new Error("Network response was not ok.");

  //   const data = await response.json();
  //   setFormData(data);

  //   setIsSuccessful(true);
  //   // navigate("/payment");
  // } catch (error) {
  //   console.error("Error submitting form:", error);
  //   alert("Transaction was unsuccessful. Please try again.");
  // }
  // };

  const initialOptions = {
    clientId:
      "AVYzf04TRxo6ZzBCDYzq9J36DVh934-1WxZBXRfI4Ma0JTNTHMUeq0CP_MaHt1__yl_QkhkKzuCo5S0s",
    currency: "USD",
    intent: "capture",
  };
  // const priceLabel = paymentMethod === "paypal" ? "$1.00" : "Ksh 100";
  useEffect(() => {
    if (isSuccessful) {
      axios
        .patch(`http://127.0.0.1:5000/api/${Session}/session`, {
          paid: true,
        })
        .then(() => {
          console.log("Session updated successfully.");
          navigate("/results");
        })
        .catch((err) => {
          console.error("Failed to update session:", err);
        });
    }
  }, [isSuccessful]);

  return (
    <div className="relative w-screen h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 text-gray-900 dark:text-white">
      <img
        className="absolute w-full h-full object-cover opacity-100"
        src="/assets/bg.jpeg"
        alt="Background"
      />

      <div className="absolute h-screen  left-1/2 transform -translate-x-1/2 w-[80%] md:w-[60%] lg:w-[50%] text-center px-4 py-10 bg-opacity-50 z-10 ">
        <div className="flex justify-center items-center min-h-[70%]">
          <PayPalScriptProvider options={initialOptions}>
            <div className="w-[300px] h-full bg-white rounded-3xl shadow-xl p-8 ">
              <p className="font-semibold text-green-800">
                In order to view your score, we require you to pay ksh 100
              </p>
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
                    const response = await fetch("http://127.0.0.1:5000/pay", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        amount: "1",
                        currency: "USD",
                        session_id: Session,
                      }),
                    });

                    const orderData = await response.json();
                    console.log("Order Data:", orderData);

                    if (!orderData || !orderData.order_id) {
                      throw new Error("No order_id returned from server");
                    }

                    return orderData.order_id;
                  } catch (err) {
                    console.error("PayPal createOrder error:", err);
                    alert("Failed to create PayPal order. Please try again.");
                    throw err;
                  }
                }}
                onApprove={async (data, actions) => {
                  try {
                    // Capture the order after approval
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
                      alert(
                        `Transaction completed by ${details.payer.name.given_name}`
                      );
                      setIsSuccessful(true);
                    } else {
                      alert("Failed to log the payment.");
                    }
                  } catch (err) {
                    console.error("PayPal approval error:", err);
                    alert("Payment capture failed. Please try again.");
                  }
                }}
                onError={(err) => {
                  console.error("PayPal Button Error:", err);
                  alert("Error during payment process, please try again.");
                }}
              />
            </div>
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  );
}

export default Payment;
