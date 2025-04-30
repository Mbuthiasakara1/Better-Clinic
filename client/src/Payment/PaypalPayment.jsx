/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

const PaypalPayment = () => {
  const [user, setUser] = useState([]);
  const [message, setMessage] = useState("");
  return (
    <>
      <div className="paypal-container">
        <PayPalButtons
          fundingSource="paypal"
          style={{
            shape: "rect",
            layout: "vertical",
            color: "gold",
            label: "paypal",
          }}
          createOrder={async () => {
            try {
              if (!user.name || !user.email || !user.membership) {
                throw new Error("User information is incomplete.");
              }
              const response = await fetch("http://127.0.0.1:5000/api/orders", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  membership: user.membership,
                  name: user.name,
                  email: user.email,
                }),
              });
              const orderData = await response.json();
              if (orderData.id) {
                return orderData.id;
              } else {
                const errorDetail = orderData?.details?.[0];
                throw new Error(
                  errorDetail?.description || "Order creation failed"
                );
              }
            } catch (error) {
              console.error(error);
              setMessage(
                `Could not initiate PayPal Checkout... ${error.message}`
              );
            }
          }}
          onApprove={async (data, actions) => {
            try {
              const response = await fetch(
                `http://127.0.0.1:5000/api/orders/${data.orderID}/capture`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              const orderData = await response.json();
              if (orderData?.details?.[0]?.issue === "INSTRUMENT_DECLINED") {
                return actions.restart();
              } else if (orderData?.status === "COMPLETED") {
                const transaction =
                  orderData.purchase_units[0].payments.captures[0];
                setMessage(
                  `Transaction ${transaction.status}: ${transaction.id}`
                );

                // Update payment status in DB
                await handlePaymentSuccess(transaction.id, user.email);

                // Save the payment in the database
                const paymentData = {
                  membership: user.membership,
                  transaction_id: transaction.id,
                  amount: transaction.amount.value,
                  payer_name: user.name,
                };

                // Send the payment data to backend to store it
                const paymentResponse = await fetch(
                  "http://127.0.0.1:5000/capture-payment",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(paymentData),
                  }
                );

                const paymentResult = await paymentResponse.json();
                if (paymentResult.success) {
                  console.log("Payment saved in the database.");
                } else {
                  console.error("Failed to save payment.");
                }
              } else {
                throw new Error("Transaction failed");
              }
            } catch (error) {
              console.error(error);
              setMessage(
                `Sorry, your transaction could not be processed... ${error.message}`
              );
            }
          }}
        />
        {message && <p className="error-message">{message}</p>}
      </div>
    </>
  );
};

export default PaypalPayment;
