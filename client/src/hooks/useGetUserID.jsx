export const useGetUserID = () => {
  return window.localStorage.getItem("userID");
};


// import { useState, useEffect } from 'react';

// export const useGetUserID = () => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const userID = window.localStorage.getItem("userID");
//     if (userID) {
//       // Fetch user data from an API if needed
//       setUser({ _id: userID }); // Example if you only store user ID
//     }
//   }, []);

//   return { user };
// };
