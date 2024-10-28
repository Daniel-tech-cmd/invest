"use client";
import { useState } from "react";

const DepositList = ({ data }) => {
  const [total, setTotal] = useState(0.0);
  const [plans] = useState([
    {
      planName: "Basic Plan",
      planDescription: "Plan 1",
      amountRange: "$100.00 - $499.00",
      dailyProfit: "4.60%",
      hasDeposit: false,
    },
    {
      planName: "Standard Plan",
      planDescription: "Plan 2",
      amountRange: "$500.00 - $4999.00",
      dailyProfit: "6.80",
      hasDeposit: false,
    },
    {
      planName: "Advanced Plan",
      planDescription: "Plan 3",
      amountRange: "$5000.00 - $9999.00",
      dailyProfit: "7.70",
      hasDeposit: false,
    },
    {
      planName: "Silver Plan",
      planDescription: "Plan 4",
      amountRange: "$10000.00 - $19999.00",
      dailyProfit: "8.40",
      hasDeposit: false,
    },
    {
      planName: "Gold Plan",
      planDescription: "Plan 5",
      amountRange: "$20000.00 - ∞",
      dailyProfit: "9.20",
      hasDeposit: false,
    },
  ]);

  return (
    <div
      style={{
        backgroundColor: "#131722",
        color: "#fff",
        padding: "70px 20px",
        width: "100%",
        maxWidth: "calc(100vw - 260px)",
        margin: "0",
      }}
      className="dash"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="mb-4 md:mb-0">
          <h1
            className="text-2xl text-white font-bold"
            style={{ fontSize: "19px" }}
          >
            Dashboard
          </h1>
          <p className="text-gray-400">/ Dashboard</p>
        </div>

        {/* Total Balance and Total Withdraw Section */}
        <div className="flex gap-6 md:gap-4 sm:justify-between sm:flex-row sm:items-center sm:text-left text-white cont-bal">
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm md:text-base">Total Balance</p>
            <h2 className="text-xl md:text-2xl font-semibold md:font-bold">
              ${data?.balance.toFixed(2)}
            </h2>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm md:text-base">Total Withdraw</p>
            <h2 className="text-xl md:text-2xl font-semibold md:font-bold">
              ${data?.totalWithdraw.toFixed(2)}
            </h2>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "rgb(251 146 60 / var(--tw-text-opacity))",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "15px",
          fontWeight: "bold",
        }}
      >
        Your deposits
      </div>
      <div
        style={{
          backgroundColor: "#202631",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <p style={{ color: "#4caf50", fontWeight: "bold" }}>
          TOTAL: ${data?.totalDeposit.toFixed(2)}
        </p>
      </div>

      {plans.map((plan, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: "#2a2e3e",
          }}
        >
          <div
            style={{
              display: "flex",

              backgroundColor: "#202631",
              padding: "10px",
              color: "#fff",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
            className="profit"
          >
            <span style={{ flex: 1, textAlign: "center" }}>Plan</span>
            <span style={{ flex: 1, textAlign: "center" }}>
              Amount Spent ($)
            </span>
            <span style={{ flex: 1, textAlign: "center" }}>
              Daily Profit (%)
            </span>
          </div>
          <div
            style={{
              display: "flex",
              backgroundColor: "#f68c1f",
              padding: "15px",
              borderBottom: "1px solid #333",
              color: "#fff",
            }}
            className="amount"
          >
            <span style={{ flex: 1, textAlign: "center" }}>
              {plan.planName}
            </span>
            <span style={{ flex: 1, textAlign: "center" }}>
              {plan.amountRange}
            </span>
            <span style={{ flex: 1, textAlign: "center" }}>
              {plan.dailyProfit}
            </span>
          </div>
          <div
            style={{
              padding: "10px",
              textAlign: "center",
              color: "#aaa",
              fontSize: "0.9em",
            }}
          >
            {plan.planDescription}
          </div>
          {!plan.hasDeposit && (
            <div
              style={{
                textAlign: "center",
                padding: "10px",
                backgroundColor: "transparent",
                border: "1px solid #ff4d4d",
                color: "#ff4d4d",
                width: "fit-content",
                borderRadius: "4px",
                textTransform: "capitalize !important",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              NO DEPOSITS FOR THIS PLAN
            </div>
          )}
        </div>
      ))}

      <style jsx>{`
        @media (max-width: 1000px) {
          div {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default DepositList;
