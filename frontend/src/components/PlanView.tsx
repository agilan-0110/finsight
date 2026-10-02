import React, { useState, useEffect } from "react";
import { api, type FinancialGoal } from "../api/client";
import {
  Compass,
  ShieldAlert,
  Flame,
  Calculator,
  Sliders,
  Plus,
  Trash2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface PlanViewProps {
  onAskAI?: (prompt: string) => void;
}

export const PlanView: React.FC<PlanViewProps> = ({ onAskAI: _onAskAI }) => {
  const [activeTab, setActiveTab] = useState<"goals" | "compounding" | "inflation" | "emergency" | "simulator">("goals");

  // Goals State
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [newGoalTitle, setNewGoalTitle] = useState<string>("College / Wealth");
  const [newGoalAmount, setNewGoalAmount] = useState<number>(500000);
  const [newGoalYears, setNewGoalYears] = useState<number>(8);
  const [savingGoal, setSavingGoal] = useState<boolean>(false);

  // Compounding Calculator State
  const [initialInvestment, setInitialInvestment] = useState<number>(10000);
  const [monthlySIP, setMonthlySIP] = useState<number>(3000);
  const [timeHorizonYears, setTimeHorizonYears] = useState<number>(15);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(12);

  // Inflation Calculator State
  const [inflationTodayAmount, setInflationTodayAmount] = useState<number>(500000);
  const [inflationYears, setInflationYears] = useState<number>(10);
  const [inflationRate, setInflationRate] = useState<number>(6.5);

  // Emergency Fund State
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(25000);
  const [emergencyMonths, setEmergencyMonths] = useState<number>(6);
  const [currentReserve, setCurrentReserve] = useState<number>(40000);

  // Risk Simulator State
  const [stockAllocation, setStockAllocation] = useState<number>(40);
  const [indexFundAllocation, setIndexFundAllocation] = useState<number>(30);
  const [bondAllocation, setBondAllocation] = useState<number>(20);
  const [goldAllocation, setGoldAllocation] = useState<number>(10);
  const [simulatedDrop, setSimulatedDrop] = useState<number>(15);

  useEffect(() => {
    api.getGoals()
      .then((res) => setGoals(res))
      .catch((err) => console.error("Failed to load goals:", err));
  }, []);

  const handleCreateGoal = async () => {
    if (!newGoalTitle || newGoalAmount <= 0) return;
    setSavingGoal(true);
    try {
      // Calculate approximate monthly SIP required at 11% moderate return
      const r = 0.11 / 12;
      const n = newGoalYears * 12;
      const calculatedSIP = (newGoalAmount * r) / ((Math.pow(1 + r, n) - 1) * (1 + r));
      const res = await api.createGoal({
        title: newGoalTitle,
        target_amount: newGoalAmount,
        target_years: newGoalYears,
        monthly_contribution: Math.round(calculatedSIP),
        category: "wealth",
      });
      setGoals([...goals, res]);
      setNewGoalTitle("");
    } catch (err) {
      console.error("Failed to create goal:", err);
    } finally {
      setSavingGoal(false);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    try {
      await api.deleteGoal(id);
      setGoals(goals.filter((g) => g.id !== id));
    } catch (err) {
      console.error("Failed to delete goal:", err);
    }
  };

  // Compounding Calculations
  const calculateCompoundingCurve = () => {
    const data = [];
    const monthlyRate = expectedReturnRate / 100 / 12;
    let totalInvested = initialInvestment;
    let futureValue = initialInvestment;

    for (let yr = 1; yr <= timeHorizonYears; yr++) {
      for (let m = 0; m < 12; m++) {
        futureValue = (futureValue + monthlySIP) * (1 + monthlyRate);
        totalInvested += monthlySIP;
      }
      data.push({
        year: `Yr ${yr}`,
        invested: Math.round(totalInvested),
        wealth: Math.round(futureValue),
      });
    }
    return data;
  };

  const compoundingData = calculateCompoundingCurve();
  const finalCompounding = compoundingData[compoundingData.length - 1] || { invested: 0, wealth: 0 };
  const compoundingGains = Math.max(0, finalCompounding.wealth - finalCompounding.invested);

  // Inflation Calculations
  const futurePurchasingPower = Math.round(
    inflationTodayAmount / Math.pow(1 + inflationRate / 100, inflationYears)
  );
  const futureNominalEquivalent = Math.round(
    inflationTodayAmount * Math.pow(1 + inflationRate / 100, inflationYears)
  );

  // Emergency Fund Calculations
  const targetEmergencyReserve = monthlyExpenses * emergencyMonths;
  const emergencyGap = Math.max(0, targetEmergencyReserve - currentReserve);
  const emergencyCoveragePercent = Math.min(100, Math.round((currentReserve / targetEmergencyReserve) * 100));

  // Risk Simulation Calculations (₹1,00,000 base)
  const baseVirtualPortfolio = 100000;
  // Simulating market drop: stocks drop full %, index drops full %, bonds stay flat/rise +2%, gold stays flat/rises +5%
  const simulatedStockVal = baseVirtualPortfolio * (stockAllocation / 100) * (1 - simulatedDrop / 100);
  const simulatedIndexVal = baseVirtualPortfolio * (indexFundAllocation / 100) * (1 - simulatedDrop / 100);
  const simulatedBondVal = baseVirtualPortfolio * (bondAllocation / 100) * 1.01;
  const simulatedGoldVal = baseVirtualPortfolio * (goldAllocation / 100) * 1.03;
  const totalSimulatedValue = Math.round(simulatedStockVal + simulatedIndexVal + simulatedBondVal + simulatedGoldVal);
  const simulatedNetLoss = baseVirtualPortfolio - totalSimulatedValue;
  const simulatedPortfolioDropPercent = ((simulatedNetLoss / baseVirtualPortfolio) * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Tool Switcher */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">
            Financial Planning &amp; Calculators 🧭
          </h1>
          <p className="font-body text-xs text-on-surface-variant">
            Plan real-life goals, visualize compounding, and understand inflation before investing.
          </p>
        </div>

        {/* Navigation Selector */}
        <div className="flex flex-wrap items-center p-1 bg-surface-container-low rounded-xl border border-outline-variant/30 text-xs font-label font-semibold">
          <button
            onClick={() => setActiveTab("goals")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "goals"
                ? "bg-surface-container-lowest text-primary shadow-sm font-bold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Goal Simulator
          </button>
          <button
            onClick={() => setActiveTab("compounding")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "compounding"
                ? "bg-surface-container-lowest text-primary shadow-sm font-bold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Compounding (SIP)
          </button>
          <button
            onClick={() => setActiveTab("inflation")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "inflation"
                ? "bg-surface-container-lowest text-primary shadow-sm font-bold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Inflation Reality
          </button>
          <button
            onClick={() => setActiveTab("emergency")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "emergency"
                ? "bg-surface-container-lowest text-primary shadow-sm font-bold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Emergency Reserve
          </button>
          <button
            onClick={() => setActiveTab("simulator")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "simulator"
                ? "bg-surface-container-lowest text-primary shadow-sm font-bold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Risk Simulator
          </button>
        </div>
      </div>

      {/* 1. GOAL SIMULATOR */}
      {activeTab === "goals" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Create Goal Form */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary font-headline font-bold text-sm">
              <Compass className="w-4 h-4" />
              <span>Simulate a New Financial Goal</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-label font-semibold text-on-surface block mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Higher Education, Car, ₹10 Lakh Corpus"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-label font-semibold text-on-surface block mb-1">
                  Target Amount: ₹{newGoalAmount.toLocaleString("en-IN")}
                </label>
                <input
                  type="range"
                  min="50000"
                  max="5000000"
                  step="50000"
                  value={newGoalAmount}
                  onChange={(e) => setNewGoalAmount(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="font-label font-semibold text-on-surface block mb-1">
                  Target Time Horizon: {newGoalYears} Years
                </label>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={newGoalYears}
                  onChange={(e) => setNewGoalYears(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            {/* Illustrative Scenarios Box */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
              <span className="font-headline font-bold text-xs text-on-surface block">
                Required Monthly Contribution Scenarios
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                  <span className="text-on-surface-variant">Conservative (8% Hybrid/Debt)</span>
                  <span className="font-bold text-on-surface font-mono">
                    ₹{Math.round((newGoalAmount * (0.08 / 12)) / ((Math.pow(1 + 0.08 / 12, newGoalYears * 12) - 1) * (1 + 0.08 / 12))).toLocaleString("en-IN")}/mo
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <span className="text-primary font-semibold">Moderate (11% Index Funds)</span>
                  <span className="font-bold text-primary font-mono">
                    ₹{Math.round((newGoalAmount * (0.11 / 12)) / ((Math.pow(1 + 0.11 / 12, newGoalYears * 12) - 1) * (1 + 0.11 / 12))).toLocaleString("en-IN")}/mo
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                  <span className="text-on-surface-variant">Aggressive (14% Active Equity)</span>
                  <span className="font-bold text-on-surface font-mono">
                    ₹{Math.round((newGoalAmount * (0.14 / 12)) / ((Math.pow(1 + 0.14 / 12, newGoalYears * 12) - 1) * (1 + 0.14 / 12))).toLocaleString("en-IN")}/mo
                  </span>
                </div>
              </div>

              <p className="font-body text-[10px] text-outline pt-1 italic">
                *Illustrative scenario based on historical annualized models, not a guaranteed return.
              </p>
            </div>

            <button
              type="button"
              disabled={savingGoal}
              onClick={handleCreateGoal}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{savingGoal ? "Saving Goal..." : "Add to My Financial Goals"}</span>
            </button>
          </div>

          {/* Right: Active Goals List */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-headline font-bold text-base text-on-surface">
              Your Saved Financial Goals ({goals.length})
            </h3>

            {goals.length === 0 ? (
              <div className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-center space-y-2">
                <Compass className="w-8 h-8 text-outline mx-auto" />
                <p className="font-headline font-semibold text-sm text-on-surface">
                  No financial goals saved yet
                </p>
                <p className="font-body text-xs text-on-surface-variant">
                  Use the simulator on the left to set your first long-term target.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {goals.map((g) => (
                  <div
                    key={g.id}
                    className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-headline font-bold text-sm text-on-surface">
                          {g.title}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-label font-bold bg-primary/10 text-primary">
                          {g.target_years} Yrs
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-label text-on-surface-variant">
                        <span>Target: <strong className="text-on-surface font-mono">₹{g.target_amount.toLocaleString("en-IN")}</strong></span>
                        <span>Estimated SIP: <strong className="text-primary font-mono">₹{g.monthly_contribution.toLocaleString("en-IN")}/mo</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteGoal(g.id)}
                      className="p-2 text-outline hover:text-error hover:bg-surface-container rounded-lg transition-colors"
                      title="Remove Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. COMPOUNDING & SIP CALCULATOR */}
      {activeTab === "compounding" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-4">
            <h3 className="font-headline font-bold text-sm text-on-surface flex items-center gap-2">
              <Calculator className="w-4 h-4 text-primary" />
              <span>Compounding Simulator</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-label mb-1">
                  <span className="text-on-surface-variant">Starting Lump Sum</span>
                  <span className="font-bold text-on-surface font-mono">₹{initialInvestment.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="5000"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <div className="flex justify-between font-label mb-1">
                  <span className="text-on-surface-variant">Monthly SIP Amount</span>
                  <span className="font-bold text-primary font-mono">₹{monthlySIP.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={monthlySIP}
                  onChange={(e) => setMonthlySIP(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <div className="flex justify-between font-label mb-1">
                  <span className="text-on-surface-variant">Time Period</span>
                  <span className="font-bold text-on-surface font-mono">{timeHorizonYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={timeHorizonYears}
                  onChange={(e) => setTimeHorizonYears(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <div className="flex justify-between font-label mb-1">
                  <span className="text-on-surface-variant">Expected Annual Return</span>
                  <span className="font-bold text-gain font-mono">{expectedReturnRate}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="18"
                  step="0.5"
                  value={expectedReturnRate}
                  onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            {/* Results Snapshot */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Total You Invest:</span>
                <span className="font-bold text-on-surface font-mono">₹{finalCompounding.invested.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Wealth Gained (Returns):</span>
                <span className="font-bold text-gain font-mono">+₹{compoundingGains.toLocaleString("en-IN")}</span>
              </div>
              <div className="pt-2 border-t border-outline-variant/20 flex justify-between">
                <span className="font-bold text-on-surface">Potential Future Corpus:</span>
                <span className="font-headline font-bold text-primary text-sm font-mono">
                  ₹{finalCompounding.wealth.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-4">
            <h3 className="font-headline font-bold text-sm text-on-surface">
              Growth Visualization: Principal Invested vs Compounded Wealth
            </h3>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={compoundingData}>
                  <defs>
                    <linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                  <XAxis dataKey="year" tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis
                    tickLine={false}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                  />
                  <Tooltip
                    formatter={(val: any) => [`₹${Number(val || 0).toLocaleString("en-IN")}`, ""]}
                    labelStyle={{ fontWeight: "bold" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="wealth"
                    name="Compounded Value"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#wealthGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="invested"
                    name="Total Invested"
                    stroke="#64748B"
                    strokeWidth={2}
                    fill="none"
                    strokeDasharray="4 4"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 3. INFLATION REALITY CALCULATOR */}
      {activeTab === "inflation" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-amber-600 font-headline font-bold text-sm">
              <Flame className="w-4 h-4" />
              <span>Inflation &amp; Purchasing Power Calculator</span>
            </div>
            <p className="font-body text-xs text-on-surface-variant">
              Money stored in cash or low-interest accounts loses purchasing power every year.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-label font-semibold text-on-surface block mb-1">
                  Amount Today: ₹{inflationTodayAmount.toLocaleString("en-IN")}
                </label>
                <input
                  type="range"
                  min="50000"
                  max="5000000"
                  step="50000"
                  value={inflationTodayAmount}
                  onChange={(e) => setInflationTodayAmount(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="font-label font-semibold text-on-surface block mb-1">
                  Years into Future: {inflationYears} Years
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={inflationYears}
                  onChange={(e) => setInflationYears(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="font-label font-semibold text-on-surface block mb-1">
                  Average Annual Inflation: {inflationRate}%
                </label>
                <input
                  type="range"
                  min="4"
                  max="10"
                  step="0.5"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </div>

          {/* Results Comparison Card */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-headline font-bold text-sm text-on-surface">
                The Lesson: Nominal Value vs Real Purchasing Power
              </h3>

              <div className="p-4 rounded-xl bg-error/5 border border-error/20 space-y-1">
                <span className="font-label text-xs text-on-surface-variant block">
                  Future Purchasing Power of ₹{inflationTodayAmount.toLocaleString("en-IN")}
                </span>
                <span className="font-headline text-2xl font-bold text-error font-mono">
                  ₹{futurePurchasingPower.toLocaleString("en-IN")}
                </span>
                <p className="font-body text-[11px] text-on-surface-variant">
                  In {inflationYears} years, this money will only buy what ₹{futurePurchasingPower.toLocaleString("en-IN")} buys today.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
                <span className="font-label text-xs text-on-surface-variant block">
                  Amount needed in {inflationYears} years to match today's lifestyle
                </span>
                <span className="font-headline text-2xl font-bold text-on-surface font-mono">
                  ₹{futureNominalEquivalent.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <p className="font-body text-xs text-on-surface-variant italic">
              💡 To build real wealth, your investments must generate returns higher than {inflationRate}%.
            </p>
          </div>
        </div>
      )}

      {/* 4. EMERGENCY RESERVE ADVISOR */}
      {activeTab === "emergency" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary font-headline font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>Emergency Cushion Calculator</span>
            </div>
            <p className="font-body text-xs text-on-surface-variant">
              Before investing in volatile equities, ensure you have 3 to 6 months of essential living expenses saved safely.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-label font-semibold text-on-surface block mb-1">
                  Monthly Essential Expenses (Rent, Food, Bills): ₹{monthlyExpenses.toLocaleString("en-IN")}
                </label>
                <input
                  type="range"
                  min="10000"
                  max="200000"
                  step="5000"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="font-label font-semibold text-on-surface block mb-1">
                  Target Months Cushion: {emergencyMonths} Months
                </label>
                <input
                  type="range"
                  min="3"
                  max="12"
                  value={emergencyMonths}
                  onChange={(e) => setEmergencyMonths(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="font-label font-semibold text-on-surface block mb-1">
                  Current Liquid Reserve in Bank: ₹{currentReserve.toLocaleString("en-IN")}
                </label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="5000"
                  value={currentReserve}
                  onChange={(e) => setCurrentReserve(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-headline font-bold text-sm text-on-surface">
                Emergency Readiness Status
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-label">
                  <span className="text-on-surface-variant">Recommended Safety Cushion:</span>
                  <span className="font-bold text-on-surface font-mono">₹{targetEmergencyReserve.toLocaleString("en-IN")}</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${emergencyCoveragePercent >= 100 ? "bg-gain" : "bg-amber-500"}`}
                    style={{ width: `${emergencyCoveragePercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-label text-outline block text-right">
                  {emergencyCoveragePercent}% Funded
                </span>
              </div>

              {emergencyGap > 0 ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                  <span className="font-bold text-amber-700 block">
                    Deficit: Save ₹{emergencyGap.toLocaleString("en-IN")} before high-risk investing
                  </span>
                  <p className="font-body text-on-surface-variant">
                    Keep this emergency buffer in a High-Interest Savings Account, Liquid Mutual Fund, or Flexible Bank FD.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gain/10 border border-gain/20 text-xs space-y-1">
                  <span className="font-bold text-gain block">
                    ✓ Emergency Cushion Fully Funded!
                  </span>
                  <p className="font-body text-on-surface-variant">
                    You have a rock-solid buffer against job loss or medical emergencies. You are ready to start investing in long-term index funds!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. RISK & DIVERSIFICATION SIMULATOR */}
      {activeTab === "simulator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-4">
            <h3 className="font-headline font-bold text-sm text-on-surface flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              <span>Virtual Portfolio Asset Allocation</span>
            </h3>
            <p className="font-body text-xs text-on-surface-variant">
              Allocate ₹1,00,000 across asset classes and test how your portfolio behaves during a market decline.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-label mb-1">
                  <span>Stocks: {stockAllocation}%</span>
                  <span className="font-mono">₹{((baseVirtualPortfolio * stockAllocation) / 100).toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={stockAllocation}
                  onChange={(e) => setStockAllocation(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <div className="flex justify-between font-label mb-1">
                  <span>Index Funds: {indexFundAllocation}%</span>
                  <span className="font-mono">₹{((baseVirtualPortfolio * indexFundAllocation) / 100).toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={indexFundAllocation}
                  onChange={(e) => setIndexFundAllocation(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <div className="flex justify-between font-label mb-1">
                  <span>Bonds / Fixed Income: {bondAllocation}%</span>
                  <span className="font-mono">₹{((baseVirtualPortfolio * bondAllocation) / 100).toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={bondAllocation}
                  onChange={(e) => setBondAllocation(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <div className="flex justify-between font-label mb-1">
                  <span>Gold: {goldAllocation}%</span>
                  <span className="font-mono">₹{((baseVirtualPortfolio * goldAllocation) / 100).toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={goldAllocation}
                  onChange={(e) => setGoldAllocation(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </div>

          {/* Market Shock Simulation */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-headline font-bold text-sm text-on-surface">
                Simulated Market Fluctuation
              </h3>

              <div className="space-y-2">
                <span className="text-xs font-label font-semibold text-on-surface-variant block">
                  Simulate Stock Market Drop: -{simulatedDrop}%
                </span>
                <div className="flex gap-2">
                  {[10, 15, 20, 30].map((drop) => (
                    <button
                      key={drop}
                      onClick={() => setSimulatedDrop(drop)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-label font-bold transition-all ${
                        simulatedDrop === drop
                          ? "bg-error text-white shadow-sm"
                          : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                      }`}
                    >
                      -{drop}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Original Portfolio:</span>
                  <span className="font-bold text-on-surface font-mono">₹1,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Simulated Value:</span>
                  <span className="font-bold text-on-surface font-mono">₹{totalSimulatedValue.toLocaleString("en-IN")}</span>
                </div>
                <div className="pt-2 border-t border-outline-variant/20 flex justify-between font-bold">
                  <span>Actual Net Portfolio Dip:</span>
                  <span className="text-error font-mono">
                    -{simulatedPortfolioDropPercent}% (-₹{simulatedNetLoss.toLocaleString("en-IN")})
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs">
                <span className="font-bold text-primary block mb-0.5">
                  The Power of Diversification:
                </span>
                <p className="font-body text-on-surface-variant">
                  While the stock market dropped -{simulatedDrop}%, your portfolio only dropped -{simulatedPortfolioDropPercent}% because bonds and gold cushioned the shock.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <span className="font-headline font-bold text-xs text-on-surface block mb-1">
                Would you be comfortable seeing this fluctuation?
              </span>
              <p className="font-body text-[11px] text-outline">
                If seeing a {simulatedPortfolioDropPercent}% dip makes you anxious, consider increasing your bond or fixed deposit allocation.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
