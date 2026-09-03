"use client";

import { useState } from "react";
import AmountPad from "../../components/AmountPad";
import DepositForm from "./DepositForm";

export default function DepositWorkspace({ user, wallets, catalog }) {
  const [amount, setAmount] = useState("");
  const [plan, setPlan] = useState("");

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <AmountPad amount={amount} onChange={setAmount} min={catalog[plan]?.min} label="Deposit amount" />
      <DepositForm amount={amount} plan={plan} onPlanChange={setPlan} catalog={catalog} wallets={wallets} />
    </div>
  );
}
