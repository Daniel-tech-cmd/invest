"use client";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

const NotificationPopup = () => {
  const [notification, setNotification] = useState(null);

  const names = [
    "Jolie",
    "Oliver",
    "Evie",
    "Luke",
    "Chauhan",
    "Alice",
    "Hannah",
    "Gabriel",
    "Benjamin",
    "Eleanor",
    "Catalina",
    "Julian",
    "Anderson",
    "Lucìa",
    "Mile",
    "Lucas",
    "Ethan",
    "Margret",
  ];

  const countries = [
    "San Francisco",
    "UK",
    "Italy",
    "Los Angeles",
    "India",
    "Mexico",
    "Australia",
    "Colombia",
    "US",
    "China",
    "Chile",
    "Norway",
    "US",
    "Cuba",
    "Albania",
    "US",
    "Iceland",
    "Dominica",
  ];
  const transactions = [
    {
      type: "deposited",
      prefix: "deposited",
      color: "text-green-500",
      amount: 2000.89,
    },
    {
      type: "deposited",
      prefix: "deposited",
      color: "text-green-500",
      amount: 4000.0,
    },
    {
      type: "withdrawed",
      prefix: "withdrew",
      color: "text-red-500",
      amount: 9000.78,
    },
    {
      type: "deposited",
      prefix: "deposited",
      color: "text-green-500",
      amount: 3000.0,
    },
    {
      type: "withdrawed",
      prefix: "withdrew",
      color: "text-red-500",
      amount: 10000.9,
    },
    {
      type: "withdrawed",
      prefix: "withdrew",
      color: "text-red-500",
      amount: 1500.0,
    },
    {
      type: "withdrawed",
      prefix: "withdrew",
      color: "text-red-500",
      amount: 6300.7,
    },
    {
      type: "deposited",
      prefix: "deposited",
      color: "text-green-500",
      amount: 7000.0,
    },
    {
      type: "withdrawed",
      prefix: "withdrew",
      color: "text-red-500",
      amount: 650.79,
    },
    {
      type: "deposited",
      prefix: "deposited",
      color: "text-green-500",
      amount: 800.0,
    },
    {
      type: "withdrawed",
      prefix: "withdrew",
      color: "text-red-500",
      amount: 400.0,
    },
    {
      type: "deposited",
      prefix: "deposited",
      color: "text-green-500",
      amount: 25000.9,
    },
    {
      type: "deposited",
      prefix: "deposited",
      color: "text-green-500",
      amount: 14000.56,
    },
    {
      type: "withdrawed",
      prefix: "withdrew",
      color: "text-red-500",
      amount: 7000.0,
    },
    {
      type: "withdrawed",
      prefix: "withdrew",
      color: "text-red-500",
      amount: 5900.0,
    },
    {
      type: "withdrawed",
      prefix: "withdrew",
      color: "text-red-500",
      amount: 30000.0,
    },
    {
      type: "withdrawed",
      prefix: "withdrew",
      color: "text-red-500",
      amount: 45000.0,
    },
    {
      type: "withdrawed",
      prefix: "withdrew",
      color: "text-red-500",
      amount: 890.0,
    },
  ];

  // Function to generate a random notification
  const generateNotification = () => {
    const name = names[Math.floor(Math.random() * names.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    const transactNumber = Math.floor(Math.random() * transactions.length);
    const transaction = transactions[transactNumber];
    const amount = transaction?.amount;

    setNotification({
      message: `${name} from ${country} ${transaction.prefix} $${amount}`,
      color: transaction.color,
    });

    // Hide the notification after 5 seconds
    setTimeout(() => setNotification(null), 3000);
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
