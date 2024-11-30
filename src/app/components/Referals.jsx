import React from "react";

const ReferralHistory = ({ data }) => {
  // Filter referrals to include only those with verified set to true
  const referrals = [...data?.referals].filter(
    (referral) => referral.verified === true
  );

  const totalReferrals = referrals.length;
  // const activeReferrals = referrals.filter((ref) => ref.active === true).length;
  // const totalCommission = referrals.reduce(
  //   (sum, ref) => sum + (ref.commission || 0),
  //   0
  // );

  const upline = data?.upline || "N/A";

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
          <p className="text-gray-400">/ Referral</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-[#232a35] text-white rounded-lg p-4 shadow-lg mb-6">
        <h2 className="text-xl font-bold text-center mb-4">Your Referrals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-sm">Referrals</p>
            <h2 className="text-2xl font-bold">{totalReferrals}</h2>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Active Referrals</p>
            <h2 className="text-2xl font-bold">{data.activereferrals}</h2>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Referral Commission</p>
            <h2 className="text-2xl font-bold">
              ${data.referralBonus.toFixed(2)}
            </h2>
          </div>
          {/* <div>
            <p className="text-gray-400 text-sm">Your Upline</p>
            <h2 className="text-xl font-bold">{upline}</h2>
          </div> */}
        </div>
      </div>

      {/* Referral History Table */}
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
                  Referral ID
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
                  <td className="px-6 py-4 text-sm">{referral.id}</td>
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
