import React from "react";

const WithdrawalHistory = () => {
  // Dummy data for withdrawals
  const withdrawals = [
    {
      amount: 500,
      status: "approved",
      wallet: "0xABCD1234EFGH5678",
      method: "BTC",
      date: new Date("2023-10-21T10:30:00.835+00:00"),
      index: 1,
      transactid: "WX123456",
    },
    {
      amount: 700,
      status: "pending",
      wallet: "0xWXYZ9876JKLM5432",
      method: "ETH",
      date: new Date("2023-10-22T14:45:00.835+00:00"),
      index: 2,
      transactid: "WX654321",
    },
    {
      amount: 1200,
      status: "declined",
      wallet: "0xLMNO1234PQRS5678",
      method: "USDT",
      date: new Date("2023-10-23T09:20:00.835+00:00"),
      index: 3,
      transactid: "WX789456",
    },
  ];

  // Format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div
      className="min-h-screen bg-[#1c222c] p-4 md:p-6 w-full dash"
      style={{
        maxWidth: "calc(100vw - 260px)",
        padding: "70px 20px",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
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
              $0
            </h2>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm md:text-base">Total Withdraw</p>
            <h2 className="text-xl md:text-2xl font-semibold md:font-bold">
              $0.00
            </h2>
          </div>
        </div>
      </div>
      <div className="min-h-screen bg-[#1c222c] p-4 w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Withdrawal History
        </h2>

        {withdrawals.length === 0 ? (
          <div className="flex items-center justify-center w-full h-full text-gray-400 text-lg font-semibold">
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto w-full max-w-5xl">
            <table className="min-w-full bg-[#232a35] rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-[#323a47] text-gray-400">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Wallet
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody className="text-white">
                {withdrawals.map((withdrawal, index) => (
                  <tr
                    key={withdrawal.index}
                    className="border-b border-gray-600 hover:bg-[#2b3240]"
                  >
                    <td className="px-6 py-4 text-sm">{index + 1}</td>
                    <td className="px-6 py-4 text-sm">
                      ${withdrawal.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-md font-semibold ${
                          withdrawal.status === "approved"
                            ? "bg-green-600 text-green-100"
                            : withdrawal.status === "pending"
                            ? "bg-yellow-500 text-yellow-100"
                            : "bg-red-600 text-red-100"
                        }`}
                      >
                        {withdrawal.status.charAt(0).toUpperCase() +
                          withdrawal.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm break-all">
                      {withdrawal.wallet}
                    </td>
                    <td className="px-6 py-4 text-sm">{withdrawal.method}</td>
                    <td className="px-6 py-4 text-sm">
                      {formatDate(withdrawal.date)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {withdrawal.transactid}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalHistory;
