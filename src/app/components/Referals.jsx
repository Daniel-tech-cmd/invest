import React from "react";
import { formatDate } from "../utils/formdate"; // Assuming you have a formatDate utility

const ReferralHistory = ({ data }) => {
  // Dummy data for referrals
  const referrals = [...data?.referals];

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
          <p className="text-gray-400">/ Referral</p>
        </div>

        {/* Total Referrals */}
        <div className="flex gap-6 md:gap-4 sm:justify-between sm:flex-row sm:items-center sm:text-left text-white cont-bal">
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm md:text-base">
              Total Referrals
            </p>
            <h2 className="text-xl md:text-2xl font-semibold md:font-bold">
              {referrals.length}
            </h2>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Referral History
      </h2>
      {referrals.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full text-gray-400 text-lg font-semibold">
          No referrals found.
        </div>
      ) : (
        <div className="overflow-x-auto w-full max-w-5xl">
          <table className="min-w-full bg-[#232a35] rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-[#323a47] text-gray-400">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Name
                </th>

                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Referral Date
                </th>
              </tr>
            </thead>
            <tbody className="text-white">
              {referrals.map((referral, index) => (
                <tr
                  key={referral.id}
                  className="border-b border-gray-600 hover:bg-[#2b3240]"
                >
                  <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm">{referral.name}</td>
                  <td className="px-6 py-4 text-sm">
                    {formatDate(referral.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReferralHistory;
