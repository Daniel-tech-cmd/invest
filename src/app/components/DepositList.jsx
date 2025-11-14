"use client";

const DepositList = ({ data }) => {
  const safeNumber = (value) => {
    if (value === null || value === undefined) return 0;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatCurrency = (value) =>
    safeNumber(value).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const checkPlan = (plansArray, planName) => {
    // Find the plan with the specified name in the array
    const plan = plansArray.find((item) => item.planName === planName);

    // Check if plan exists in the array
    if (plan) {
      return {
        found: true,
        amount: plan.amount,
      };
    } else {
      return {
        found: false,
        amount: null,
      };
    }
  };
  const plans = [
    {
      planName: "Basic Plan",
      planDescription: "Plan 1",
      amountRange: "$100.00 - $499.00",
      dailyProfit: "4.60%",
      hasDeposit: checkPlan(data?.plans, "Basic Plan").found,
    },
    {
      planName: "Standard Plan",
      planDescription: "Plan 2",
      amountRange: "$500.00 - $4999.00",
      dailyProfit: "6.80",
      hasDeposit: checkPlan(data?.plans, "Standard Plan").found,
    },
    {
      planName: "Advanced Plan",
      planDescription: "Plan 3",
      amountRange: "$5000.00 - $9999.00",
      dailyProfit: "7.70",
      hasDeposit: checkPlan(data?.plans, "Advanced Plan").found,
    },
    {
      planName: "Silver Plan",
      planDescription: "Plan 4",
      amountRange: "$10000.00 - $19999.00",
      dailyProfit: "8.40",
      hasDeposit: checkPlan(data?.plans, "Silver Plan").found,
    },
    {
      planName: "Gold Plan",
      planDescription: "Plan 5",
      amountRange: "$20000.00 - ∞",
      dailyProfit: "9.20",
      hasDeposit: checkPlan(data?.plans, "Gold Plan").found,
    },
  ];

  const metricCards = [
    {
      label: "Total Balance",
      value: formatCurrency(data?.balance),
    },
    {
      label: "Total Deposit",
      value: formatCurrency(data?.totalDeposit),
    },
    {
      label: "Total Withdrawal",
      value: formatCurrency(data?.totalWithdraw),
    },
    {
      label: "Profit",
      value: formatCurrency(data?.profit),
    },
  ];

  return (
    <div
      className="dash min-h-screen w-full bg-canvas px-4 py-6 sm:px-6 sm:py-10 lg:px-10"
      style={{
        maxWidth: "calc(100vw - 260px)",
        paddingTop: "96px",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <div className="flex flex-col gap-8 text-foreground">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-muted">
                Deposits
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-3xl">
                Deposit Plans Overview
              </h1>
            </div>
            <p className="mt-4 text-sm text-muted md:mt-0">/ Deposit List</p>
          </div>

          <div className="rounded-3xl border border-stroke bg-surface-elevated p-6 shadow-xl transition-colors sm:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metricCards.map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-stroke bg-surface px-5 py-5 shadow-sm transition-colors"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-foreground sm:text-xl">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-stroke bg-surface-elevated p-6 shadow-xl transition-colors">
          <h2 className="text-lg font-semibold text-foreground">Deposit Summary</h2>
          <p className="mt-2 text-sm text-muted">
            Overview of all available plans and your participation
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => {
              const planDetails = checkPlan(data?.plans ?? [], plan.planName);
              const hasDeposit = Boolean(planDetails.found);

              return (
                <div
                  key={plan.planName}
                  className="flex flex-col justify-between gap-6 rounded-2xl border border-stroke bg-surface p-6 shadow-sm transition-colors"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {plan.planName}
                        </h3>
                        <p className="text-xs uppercase tracking-[0.3em] text-muted">
                          {plan.planDescription}
                        </p>
                      </div>
                      <span className="inline-flex items-center rounded-full border border-stroke bg-chip px-3 py-1 text-xs font-medium text-muted">
                        Daily Profit: {plan.dailyProfit}%
                      </span>
                    </div>

                    <div className="rounded-xl border border-stroke bg-surface-muted px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                        Deposit Range
                      </p>
                      <p className="mt-1 text-base font-medium text-foreground">
                        {plan.amountRange}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {hasDeposit ? (
                      <div className="rounded-xl border border-stroke bg-surface-muted px-4 py-3 text-sm text-foreground">
                        <span className="block text-xs font-semibold uppercase tracking-wide text-accent">
                          Active Deposit
                        </span>
                        <span className="mt-1 block text-base font-semibold text-foreground">
                          {formatCurrency(planDetails.amount)}
                        </span>
                        <span className="mt-1 block text-xs text-muted">
                          You currently have funds earning under this plan.
                        </span>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-stroke bg-surface-muted px-4 py-3 text-sm text-muted">
                        <span className="block text-xs font-semibold uppercase tracking-wide text-accent">
                          No Active Deposit
                        </span>
                        <span className="mt-1 block text-xs">
                          Explore this plan to start earning returns.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepositList;
