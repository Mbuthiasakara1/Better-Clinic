/* eslint-disable no-unused-vars */
import { MuiTelInput } from "mui-tel-input";
import React, { useEffect, useState } from "react";
import useStore from "../../Store";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useNavigate } from "react-router-dom";

function Payment() {
  const { formData, setFormData } = useStore();
  const [isSuccessful, setIsSuccessful] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhone()) return;

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Network response was not ok.");

      const data = await response.json();
      setFormData(data);

      setIsSuccessful(true);
      // navigate("/payment");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Transaction was unsuccessful. Please try again.");
    }
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 text-gray-900 dark:text-white">
      <img
        className="absolute w-full h-full object-cover opacity-100"
        src="assets/Flux_Dev_pls_generate_a_image_my_mental_health_app_for_the_bg__3.jpeg"
        alt="Background"
      />
      <div className="absolute h-screen  left-1/2 transform -translate-x-1/2 w-[80%] md:w-[60%] lg:w-[50%] text-center px-4 py-10 bg-opacity-50 z-10 ">
        <div className="flex justify-center items-center min-h-[70%]">
          {isSuccessful ? (
            <div className="w-[300px] h-[300px] bg-white rounded-3xl shadow-xl p-8">
              <h1 className="text-2xl font-semibold text-green-800 mb-6">
                Payment Successful!
              </h1>
              <p>
                Your payment has been processed successfully. You can now access
                your account and start managing your mental health journey.
              </p>
              <button
                className="w-full bg-green-800 text-white hover:bg-green-900 px-4 py-2 rounded-3xl text-sm font-semibold"
                onClick={() => (window.location.href = "/")}
              >
                Go to Homepage
              </button>
            </div>
          ) : (
            <div className="w-[300px] h-full bg-white rounded-3xl shadow-xl p-8 ">
              <p className="font-semibold text-green-800">
                In order to view your score, we require you to pay ksh 100
              </p>
              <form
                action=""
                method="post"
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col space-y-2 mt-3"
              >
                <label htmlFor="phone_number">
                  Phone Number
                  <MuiTelInput
                    defaultCountry="KE"
                    name="phone_number"
                    required
                    onlyCountries={["KE"]}
                    disableDropdown={true}
                    value={formData.phone_number}
                    onChange={handlePhoneChange}
                    onBlur={validatePhone}
                    placeholder="Phone Number"
                    className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </label>
                <label htmlFor="Amount">
                  Amount
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    readOnly
                    defaultValue={100}
                    className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full mt-3 bg-green-800 text-white hover:bg-green-900 px-4 py-2 rounded-3xl text-sm font-semibold"
                  onClick={handleSubmit}
                >
                  Pay Now
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Payment;
