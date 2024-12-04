import { useState, useEffect } from "react";

export const useAuth = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    console.log("Checking token:", token)
    setLoggedIn(!!token); 
  }, []); 

  return loggedIn;
};
