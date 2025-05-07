// // src/components/FlashMessage.js
// import React from "react";
// import { Card, CardContent, Typography, Button } from "@mui/material";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";

// const FlashMessage = ({ type = "success", onAction }) => {
//   const isSuccess = type === "success";

//   return (
//     <div
//       className={`min-h-screen flex items-center justify-center ${
//         isSuccess ? "bg-green-500" : "bg-red-500"
//       } transition-all`}
//     >
//       <Card
//         className="w-[90%] sm:w-96 max-w-sm shadow-2xl rounded-2xl"
//         style={{ backgroundColor: "transparent", boxShadow: "none" }}
//       >
//         <CardContent className="flex flex-col items-center text-center space-y-6 text-white">
//           {isSuccess ? (
//             <CheckCircleIcon sx={{ fontSize: 80 }} />
//           ) : (
//             <CancelIcon sx={{ fontSize: 80 }} />
//           )}

//           <Typography variant="h5" className="font-bold uppercase">
//             {isSuccess ? "Success" : "Failed"}
//           </Typography>

//           <Typography variant="body1">
//             {isSuccess
//               ? "Your payment has been processed. Check your email for your receipt."
//               : "Your payment was not successfully processed. Please contact customer support or try again."}
//           </Typography>

//           <Button
//             variant="contained"
//             color="inherit"
//             className={`rounded-full px-6 py-2 font-semibold text-${
//               isSuccess ? "green" : "red"
//             }-600`}
//             onClick={onAction}
//           >
//             {isSuccess ? "Continue" : "Try Again"}
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default FlashMessage;
