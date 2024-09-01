import { useState, useEffect } from "react";

export const useUserID = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userID = window.localStorage.getItem("userID");
    if (userID) {
      // Fetch user data from an API if needed
      setUser({ _id: userID }); // Example if you only store user ID
    }
  }, []);

  return { user };
};
