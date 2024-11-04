"use client";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

const NotificationPopup = () => {
  const [notification, setNotification] = useState(null);

  const names = [
    "Alice",
    "Bob",
    "Charlie",
    "Dave",
    "Emma",
    "James",
    "Sophia",
    "Lucas",
    "Lily",
    "Mason",
    "Olivia",
  ];
  const countries = [
    "Nepal",
    "USA",
    "Germany",
    "Canada",
    "Australia",
    "India",
    "Brazil",
    "Japan",
    "France",
    "Nigeria",
  ];
  const transactions = [
    { type: "withdrawed", prefix: "withdrew", color: "text-red-500" },
    { type: "deposited", prefix: "deposited", color: "text-green-500" },
  ];

  // Function to generate a random notification
  const generateNotification = () => {
    const name = names[Math.floor(Math.random() * names.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    const transaction =
      transactions[Math.floor(Math.random() * transactions.length)];
    const amount = (Math.random() * (500 - 100) + 100).toFixed(2);

    setNotification({
      message: `${name} from ${country} ${transaction.prefix} $${amount}`,
      color: transaction.color,
    });

    // Hide the notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    // Show a new notification every 10-20 seconds
    const interval = setInterval(
      generateNotification,
      Math.random() * (20000 - 10000) + 10000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center z-50">
      {notification && (
        <div
          className={`flex items-center bg-gray-800 text-white px-4 py-2 mt-4 rounded-md shadow-md ${notification.color}`}
        >
          <FaCheckCircle className="mr-2 text-white" />
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default NotificationPopup;
