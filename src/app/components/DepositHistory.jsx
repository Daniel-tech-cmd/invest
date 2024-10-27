import React from "react";

const DepositHistory = () => {
  // Dummy data for deposits
  const deposits = [
    {
      amount: 300,
      status: "approved",
      method: "BTC",
      date: new Date("2023-10-19T10:33:22.835+00:00"),
      index: 1,
      transactid: "TX123456",
      receipt: {
        url: "https://example.com/receipt1.jpg",
        public_id: "receipt1",
      },
    },
    {
      amount: 450,
      status: "pending",
      method: "ETH",
      date: new Date("2023-10-20T12:45:00.835+00:00"),
      index: 2,
      transactid: "TX654321",
      receipt: null,
    },
    {
      amount: 1000,
      status: "declined",
      method: "USDT",
      date: new Date("2023-10-21T09:15:00.835+00:00"),
      index: 3,
      transactid: "TX789456",
      receipt: {
        url: "https://example.com/receipt3.jpg",
        public_id: "receipt3",
      },
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
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Deposit History
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#232a35] rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-[#323a47] text-gray-400">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Status
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
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Receipt
              </th>
            </tr>
          </thead>
          <tbody className="text-white">
            {deposits.map((deposit, index) => (
              <tr
                key={deposit.index}
                className="border-b border-gray-600 hover:bg-[#2b3240]"
              >
                <td className="px-6 py-4 text-sm">{index + 1}</td>
                <td className="px-6 py-4 text-sm">
                  ${deposit.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-md font-semibold ${
                      deposit.status === "approved"
                        ? "bg-green-600 text-green-100"
                        : deposit.status === "pending"
                        ? "bg-yellow-500 text-yellow-100"
                        : "bg-red-600 text-red-100"
                    }`}
                  >
                    {deposit.status.charAt(0).toUpperCase() +
                      deposit.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{deposit.method}</td>
                <td className="px-6 py-4 text-sm">
                  {formatDate(deposit.date)}
                </td>
                <td className="px-6 py-4 text-sm">{deposit.transactid}</td>
                <td className="px-6 py-4 text-sm">
                  {deposit.receipt ? (
                    <a
                      href={deposit.receipt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline hover:text-blue-300"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepositHistory;
