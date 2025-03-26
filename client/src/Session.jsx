/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import useStore from "../Store";

function Session() {
  const {Session, setSession} = useStore();
  const user_id = localStorage.getItem("user_id")

  useEffect(() => {
    axios
      .post("http://127.0.0.1:5000/api/sessions",{
        user_id: user_id,
      })
      .then((response) => {
        const data = response.data;
       
      })
      .catch((error) => {
        console.error("Error fetching  Session:", error);
      });
  }, []);

  return <div>{Session ? <p>Session ID: {Session}</p> : <p>Loading session...</p>}</div>;
 
}

export default Session;
