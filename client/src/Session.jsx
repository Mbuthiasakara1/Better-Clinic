/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import axios from "axios";
import useStore from "../Store";

function Session() {
  // const { Session, setSession } = useStore();
  // const user_id = localStorage.getItem("user_id");
  // const { user, setUser } = useStore();

  // useEffect(() => {
  //   axios
  //     .get("http://127.0.0.1:5000/api/user", { withCredentials: true })
  //     .then((response) => {
  //       console.log("response from user endpoint", response.data);
  //       setUser(response.data.user_id); 

  //       console.log("User ID:", response.data.user_id);
  //     })
  //     .catch((error) => console.error("Failed to get user:", error));
  // }, [setUser]);

  // useEffect(() => {
  //   if (!user_id) return;

  //   axios
  //     .post("http://127.0.0.1:5000/api/sessions", { user_id })
  //     .then((response) => {
  //       setSession(response.data);
  //       console.log("Session aubmitted successfully:", response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching session:", error);
  //     });
  // }, [user_id, setSession]);
}
//   return (
//     <div>
//       {Session ? <p>Session ID: {Session}</p> : <p>Loading session...</p>}
//     </div>
//   );
// }

export default Session;
