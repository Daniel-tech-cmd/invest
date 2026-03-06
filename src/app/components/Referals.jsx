import React from "react";

const ReferralHistory = ({ data }) => {
  // Show ALL referrals immediately on signup — status column shows deposit state
  const referrals = [...(data?.referals ?? [])];
  const verifiedCount = referrals.filter(
    (r) => r.verified === true,
  ).length;

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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="mb-4 md:mb-0">
          <h1
            className="text-2xl text-white font-bold"
            style={{ fontSize: "19px" }}
          >
            Dashboard
          </h1>
          <p className="text-gray-400">
            / Referral
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-[#232a35] text-white rounded-lg p-4 shadow-lg mb-6">
        <h2 className="text-xl font-bold text-center mb-4">
          Your Referrals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-sm">
              Total Referrals
            </p>
            <h2 className="text-2xl font-bold">
              {referrals.length}
            </h2>
          </div>
          <div>
            <p className="text-gray-400 text-sm">
              Active (Deposited)
            </p>
            <h2 className="text-2xl font-bold">
              {verifiedCount}
            </h2>
          </div>
          <div>
            <p className="text-gray-400 text-sm">
              Total Referral Commission
            </p>
            <h2 className="text-2xl font-bold">
              $
              {Number(
                data.referralBonus || 0,
              ).toFixed(2)}
            </h2>
          </div>
        </div>
      </div>

      {/* Referral History Table */}
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Referral History
      </h2>
      {referrals.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full text-gray-400 text-lg font-semibold">
          No referrals yet. Share your referral
          link to get started!
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Referral ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="text-white">
              {referrals.map(
                (referral, index) => (
                  <tr
                    key={referral.id}
                    className="border-b border-gray-600 hover:bg-[#2b3240]"
                  >
                    <td className="px-6 py-4 text-sm">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {referral.name}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {referral.id}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {referral.verified ? (
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-900/40 text-green-400">
                          Deposited ✓
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-yellow-900/40 text-yellow-400">
                          Pending Deposit
                        </span>
                      )}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReferralHistory;
