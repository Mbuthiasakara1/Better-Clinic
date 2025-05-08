/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */

// import { MuiTelInput } from "mui-tel-input";
// import React, { useEffect, useState } from "react";
// import useStore from "../../Store";
// import { isValidPhoneNumber } from "libphonenumber-js";
// import { useNavigate } from "react-router-dom";
// import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// function Payment() {
// const [phone_number, setPhoneNumber] = useState("");
// const [isSuccessful, setIsSuccessful] = useState(false);
// const [hasError, setHasError] = useState(false);
// const [selectedPayment, setSelectedPayment] = useState(null);
// const { Session } = useStore();
// const navigate = useNavigate();
// const storedSessionId = Session || sessionStorage.getItem("session_id");

// const validatePhone = () => {
//   if (!phone_number || phone_number.length < 10) {
//     toast.error("Invalid phone number! Please enter a valid one.");
//     return false;
//   }
//   return true;
// };

// const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
// console.log(clientId);
// const initialOptions = {
//   clientId: clientId,
//   currency: "USD",
//   intent: "capture",
//   "enable-funding": "paypal,card",
// };

// useEffect(() => {
//   if (isSuccessful && storedSessionId) {
//     axios
//       .patch(`http://127.0.0.1:5000/api/${storedSessionId}/session`, {
//         paid: true,
//       })
//       .then(() => {
//         toast.success("Payment successful! Redirecting to results...");
//         setTimeout(() => {
//           navigate("/results");
//         }, 2000);
//       })

//       .catch((err) => {
//         console.error("Failed to update session:", err);
//         toast.error("Failed to update payment status. Please try again.");
//         toast.error("Failed to update session:", err);
//       });
//   }
// }, [isSuccessful, Session, navigate]);

// async function make_payment() {
//   try {
//     const res = await axios.post(
//       "http://127.0.0.1:5000/make_payment",
//       {
//         phone_number: phone_number,
//         session_id: storedSessionId,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const { transaction_id } = res.data;

//     if (transaction_id) {
//       const paymentStatusRes = await axios.post(
//         "http://127.0.0.1:5000/payment_status",
//         { transaction_id },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       const { status } = paymentStatusRes.data;
//       if (status === "completed") {
//         setIsSuccessful(true);
//       } else {
//         toast.error("Payment not completed successfully. Please try again.");
//         setHasError(true);
//       }
//     }
//   } catch (err) {
//     toast.error("M-Pesa payment failed. Try again.");
//     setHasError(true);
//   }
// }

//   return (
//     <div className="relative w-screen h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 text-gray-900 dark:text-white">
//       <img
//         className="absolute w-full h-full object-cover opacity-100"
//         src="/assets/bg.jpeg"
//         alt="Background"
//       />

//       <div className="absolute h-screen left-1/2 transform -translate-x-1/2 w-[80%] md:w-[60%] lg:w-[40%] text-center px-4 py-10 bg-opacity-50 z-10 justify-center items-center">
//         <div className="flex flex-col justify-center items-center min-h-[60%] gap-4 bg-white p-6 rounded-lg shadow-lg">
//           <p className="font-semibold text-green-800  mb-2 leading relaxed">
//             We need you to pay a small fee to receive your results
//           </p>

//           {/* PayPal Card */}
//           <div
//             className="w-full bg-white rounded-xl shadow-lg p-6 relative border-2 border-gray-300 cursor-pointer"
//             onClick={() => setSelectedPayment("paypal")}
//           >
//             <div className="absolute  right-12 text-xl text-gray-700 font-semibold">
//               $1.99
//             </div>
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center">
//                 <img
//                   src="/assets/paypal.png"
//                   alt="PayPal"
//                   className="w-8 h-8 mr-4"
//                 />
//                 <p className="font-semibold text-green-800">Pay with PayPal</p>
//               </div>
//               <input
//                 type="checkbox"
//                 checked={selectedPayment === "paypal"}
//                 onChange={() => setSelectedPayment("paypal")}
//                 className="w-4 h-4 rounded-full border-2 border-gray-400 appearance-none checked:bg-green-600 checked:border-green-600"
//                 onClick={(e) => e.stopPropagation()}
//               />
//             </div>

//             {selectedPayment === "paypal" && (
//               <PayPalScriptProvider options={initialOptions}>
//                 <PayPalButtons
//                   style={{
//                     shape: "rect",
//                     layout: "vertical",
//                     color: "gold",
//                     label: "paypal",
//                     height: 35,
//                   }}
//                   createOrder={async () => {
//                     try {
//                       const response = await fetch(
//                         "http://127.0.0.1:5000/pay",
//                         {
//                           method: "POST",
//                           headers: {
//                             "Content-Type": "application/json",
//                           },
//                           body: JSON.stringify({
//                             amount: "1.99",
//                             currency: "USD",
//                             session_id: storedSessionId,
//                           }),
//                         }
//                       );

//                       const orderData = await response.json();

//                       if (!orderData || !orderData.order_id) {
//                         throw new Error("No order_id returned from server");
//                       }

//                       return orderData.order_id;
//                     } catch (err) {
//                       toast.error(
//                         "Failed to create PayPal order. Please try again."
//                       );
//                       setHasError(true);
//                       throw err;
//                     }
//                   }}
//                   onApprove={async (data, actions) => {
//                     try {
//                       const details = await actions.order.capture();

//                       const response = await fetch(
//                         "http://127.0.0.1:5000/pay/confirm",
//                         {
//                           method: "POST",
//                           headers: {
//                             "Content-Type": "application/json",
//                           },
//                           body: JSON.stringify({
//                             session_id: storedSessionId,
//                             amount: "1.99",
//                             currency: "USD",
//                             transaction_id: details.id,
//                           }),
//                         }
//                       );

//                       if (response.ok) {
//                         setIsSuccessful(true);
//                       } else {
//                         toast.error("Failed to log the payment.");
//                         setHasError(true);
//                       }
//                     } catch (err) {
//                       toast.error("Payment capture failed. Please try again.");
//                       setHasError(true);
//                     }
//                   }}
//                   onError={(err) => {
//                     toast.error(
//                       "Error during payment process, please try again."
//                     );
//                     setHasError(true);
//                   }}
//                 />
//               </PayPalScriptProvider>
//             )}
//           </div>

//           {/* M-Pesa Card */}
//           <div
//             className="w-full bg-white rounded-xl shadow-lg p-6 relative border-2 border-gray-300 cursor-pointer"
//             onClick={() => setSelectedPayment("mpesa")}
//           >
//             <div className="absolute right-12 text-xl text-gray-700 font-semibold">
//               Ksh 199
//             </div>
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center">
//                 <img
//                   src="assets/M-PESA_LOGO-01.svg"
//                   alt="M-Pesa"
//                   className="w-10 h-10 mr-4"
//                 />
//                 <p className="font-semibold text-green-800">Pay with M-Pesa</p>
//               </div>
//               <input
//                 type="checkbox"
//                 checked={selectedPayment === "mpesa"}
//                 onChange={() => setSelectedPayment("mpesa")}
//                 className="w-4 h-4  rounded-full border-2 border-gray-400 appearance-none checked:bg-green-600 checked:border-green-600"
//                 onClick={(e) => e.stopPropagation()}
//               />
//             </div>

//             {selectedPayment === "mpesa" && (
//               <div className="w-full flex flex-col items-center mt-6">
//                 <label htmlFor="phone" className="block text-gray-700 mb-2">
//                   Enter Phone Number
//                 </label>
//                 <MuiTelInput
//                   value={phone_number}
//                   onChange={setPhoneNumber}
//                   defaultCountry="KE"
//                   className="w-full"
//                 />
//                 <button
//                   onClick={() => {
//                     if (validatePhone()) {
//                       make_payment();
//                     }
//                   }}
//                   className="mt-4 bg-green-600 text-white py-2 px-6 rounded-xl hover:bg-green-700"
//                 >
//                   Pay with M-Pesa
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className="mt-6 pt-4 border-t border-gray-200">
//             <p className="text-xs text-gray-500">
//               Your payment is secure and processed by our trusted payment partners.
//               By continuing, you agree to our Terms of Service and Privacy Policy.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Payment;

import { MuiTelInput } from "mui-tel-input";
import React, { useEffect, useState } from "react";
import useStore from "../../Store";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useNavigate } from "react-router-dom";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";
import { toast } from "react-hot-toast";

function Payment() {
  const [phone_number, setPhoneNumber] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeMethod, setActiveMethod] = useState(null);
  const { Session } = useStore();
  const navigate = useNavigate();
  const storedSessionId = Session || sessionStorage.getItem("session_id");

  const validatePhone = () => {
    if (!phone_number || phone_number.length < 10) {
      toast.error("Invalid phone number! Please enter a valid one.");
      return false;
    }
    return true;
  };

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const initialOptions = {
    clientId: clientId,
    currency: "USD",
    intent: "capture",
    "enable-funding": "paypal,card",
  };

  useEffect(() => {
    if (isSuccessful && storedSessionId) {
      axios
        .patch(`http://127.0.0.1:5000/api/${storedSessionId}/session`, {
          paid: true,
        })
        .then(() => {
          toast.success("Payment successful! Redirecting to results...");
          setTimeout(() => {
            navigate("/results");
          }, 2000);
        })

        .catch((err) => {
          console.error("Failed to update session:", err);
          toast.error("Failed to update payment status. Please try again.");
          toast.error("Failed to update session:", err);
        });
    }
  }, [isSuccessful, storedSessionId, navigate]);

  async function make_payment() {
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/make_payment",
        {
          phone_number: phone_number,
          session_id: storedSessionId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { transaction_id } = res.data;

      if (transaction_id) {
        const paymentStatusRes = await axios.post(
          "http://127.0.0.1:5000/payment_status",
          { transaction_id },
          { headers: { "Content-Type": "application/json" } }
        );

        const { status } = paymentStatusRes.data;
        if (status === "completed") {
          setIsSuccessful(true);
        } else {
          toast.error("Payment not completed successfully. Please try again.");
          setHasError(true);
        }
      }
    } catch (err) {
      toast.error("M-Pesa payment failed. Try again.");
      setHasError(true);
    }
  }

  return (
    <div className="relative w-screen h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 text-gray-900 dark:text-white">
      <img
        className="absolute w-full h-full object-cover opacity-100"
        src="/assets/bg.jpeg"
        alt="Background"
      />

      <div className="absolute left-1/2 transform -translate-x-1/2 w-[90%] md:w-[70%] lg:w-[80%] text-center px-4 py-10 bg-opacity-50 z-10 h-full rounded-3xl flex justify-center items-center p-4 ">
        <div className="bg-white shadow-xl rounded-3xl p-6 max-w-md w-full text-center  flex flex-col justify-center">
          <div className="">
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Results Ready!
            </h2>
            <p className="text-gray-700 mb-4">
              Get your complete mental health assessment results after a small
              fee.
            </p>
          </div>

          <div className="space-y-4">
            {/* Payment method selector buttons */}
            <div className="flex justify-center space-x-3 mb-4">
              <button
                onClick={() => setActiveMethod("paypal")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeMethod === "paypal" || activeMethod === null
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                PayPal ($1.99)
              </button>
              <button
                onClick={() => setActiveMethod("mpesa")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeMethod === "mpesa" || activeMethod === null
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                M-Pesa (Ksh 199)
              </button>
            </div>

            {/* PayPal Payment Card */}
            {activeMethod === "paypal" && (
              <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-blue-200 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <img
                    src="/assets/paypal.png"
                    alt="PayPal"
                    className="w-10 h-10 mr-4"
                  />
                  <h3 className="font-semibold text-blue-700 text-lg">
                    Pay with PayPal
                  </h3>
                  <div className="ml-auto text-xl font-semibold text-gray-700">
                    $1.99
                  </div>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-gray-600 text-sm mb-1">
                    Secure payment via PayPal or credit/debit card
                  </p>
                </div>

                <PayPalScriptProvider options={initialOptions}>
                  <PayPalButtons
                    style={{
                      shape: "rect",
                      layout: "vertical",
                      color: "blue",
                      label: "pay",
                      height: 40,
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
                              amount: "1.99",
                              currency: "USD",
                              session_id: storedSessionId,
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
                        console.log(details.id)

                        const response = await fetch(
                          "http://127.0.0.1:5000/pay/confirm",
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              session_id: storedSessionId,
                              amount: "1.99",
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
                        toast.error(
                          "Payment capture failed. Please try again."
                        );
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
              </div>
            )}

            {/* M-Pesa Payment Card */}
            {activeMethod === "mpesa" && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <img
                    src="/assets/M-PESA_LOGO-01.svg"
                    alt="M-Pesa"
                    className="w-10 h-10 mr-4"
                  />
                  <h3 className="font-semibold text-green-700 text-lg">
                    Pay with M-Pesa
                  </h3>
                  <div className="ml-auto text-xl font-semibold text-gray-700">
                    Ksh 199
                  </div>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-gray-600 text-sm mb-1">
                    Quick and convenient payment via M-Pesa
                  </p>
                </div>

                <div className="w-full flex flex-col items-center">
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 mb-2 self-start font-medium"
                  >
                    Enter Phone Number
                  </label>
                  <MuiTelInput
                    value={phone_number}
                    onChange={setPhoneNumber}
                    defaultCountry="KE"
                    className="w-full mb-4"
                    placeholder="Enter M-Pesa number"
                  />
                  <button
                    onClick={() => {
                      if (validatePhone()) {
                        make_payment();
                      }
                    }}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Pay Now with M-Pesa
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    You will receive a prompt on your phone to complete payment
                  </p>
                </div>
              </div>
            )}

            {/* Initial state - when no method is selected */}
            {!activeMethod && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                <p className="text-gray-700">
                  Please select a payment method above to continue
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Your payment is secure and processed by our trusted payment
              partners. By continuing, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
