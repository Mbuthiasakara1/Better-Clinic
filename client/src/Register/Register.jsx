/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { MuiTelInput } from "mui-tel-input";
import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { useNavigate } from "react-router-dom";
import useStore from "../../Store";

function Register() {
  const [step, setStep] = useState(1);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const { formData, setFormData } = useStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone_number: value });
  };

  const validatePhone = () => {
    const parsedNumber = parsePhoneNumberFromString(
      formData.phone_number,
      "KE"
    );
    if (!parsedNumber || !parsedNumber.isValid()) {
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
      navigate("/payment");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to register. Please try again.");
    }
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 text-gray-900 dark:text-white">
      <img
        className="absolute w-full h-full object-cover opacity-100"
        src="assets/Flux_Dev_pls_generate_a_image_my_mental_health_app_for_the_bg__3.jpeg"
        alt="Background"
      />
      <div className="absolute h-screen left-1/2 transform -translate-x-1/2 w-[80%] md:w-[60%] lg:w-[50%] text-center px-4 py-10 bg-opacity-50 z-10">
        <div className="flex justify-center items-center min-h-[70%]">
          <form
            className="bg-white p-9 rounded-2xl shadow-lg w-150 h-full"
            onSubmit={handleSubmit}
          >
            <h2 className="text-xl font-semibold text-green-700 text-center mb-4">
              Fill in your information
            </h2>

            {step === 1 && (
              <div className="grid grid-cols-1 gap-6">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                  className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                  className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                />
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

                <select
                  className="col-span-1 md:col-span-2 border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}

            {step === 3 && (
              <div className="text-center text-green-700 font-semibold">
                Proceed to Payment
              </div>
            )}

            <div className="mt-4 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
                >
                  Back
                </button>
              )}
              {step < 2 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
