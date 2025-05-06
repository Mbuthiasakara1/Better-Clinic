import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const FlashMessage = ({ type = "success", onAction }) => {
  const isSuccess = type === "success";

  return (
    <div className="relative w-screen h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 text-gray-900 dark:text-white overflow-hidden">
      <img
        className="absolute w-full h-full object-cover opacity-100"
        src="/assets/bg.jpeg"
        alt="Background"
      />
      <div className="absolute left-1/2 transform -translate-x-1/2 w-[90%] md:w-[70%] lg:w-[60%] text-center px-4 py-10 bg-opacity-50 z-10 h-full rounded-3xl flex justify-center items-center p-4">
        <div
          className={`w-full max-w-xs shadow-lg rounded-xl transition-transform duration-300 ease-in-out ${
            isSuccess ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <Card
            className="w-full"
            style={{
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
          >
            <CardContent className="flex flex-col items-center text-center space-y-8 p-5 text-white">
              {isSuccess ? (
                <CheckCircleIcon sx={{ fontSize: 80 }} />
              ) : (
                <CancelIcon sx={{ fontSize: 80 }} />
              )}

              <Typography variant="h6" className="font-bold uppercase">
                {isSuccess ? "Success" : "Failed"}
              </Typography>

              <div className="mb-6">
                <Typography variant="body2">
                  {isSuccess
                    ? "Payment processed."
                    : "Payment failed. Please try again."}
                </Typography>
              </div>

              <Button
                variant="contained"
                sx={{ color: "black", backgroundColor: "white" }}
                onClick={onAction}
                className="rounded-full px-6 py-2 font-semibold m-4"
              >
                {isSuccess ? "Continue" : "Try Again"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlashMessage;
