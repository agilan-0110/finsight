import React from "react";
import {
  ShieldCheck,
  Sparkles,
  UploadCloud,
  GraduationCap,
  ArrowRight,
  PieChart,
  BarChart3,
  CheckCircle2,
  Lock,
  Zap,
} from "lucide-react";

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenAcademy: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onOpenAcademy,
}) => {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full px-6 md:px-12 h-20 flex items-center justify-between bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-headline font-bold text-lg shadow-sm">
            <span>F</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-lg font-bold tracking-tight text-on-surface leading-tight">
              FinSight Intelligence
            </span>
            <span className="text-[11px] font-medium text-on-surface-variant">
              Indian Equities &amp; Portfolio Research
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-on-surface-variant">
          <a href="#features" className="hover:text-on-surface transition-colors">
            Features
          </a>
          <a href="#brokers" className="hover:text-on-surface transition-colors">
            Supported Brokers
          </a>
          <a href="#academy" className="hover:text-on-surface transition-colors">
            Market Academy
          </a>
          <a href="#security" className="hover:text-on-surface transition-colors">
            Privacy &amp; Security
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenLogin}
            className="px-4 py-2 text-xs font-semibold text-on-surface hover:text-primary transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onOpenRegister}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dim text-on-primary font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.99]"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Release Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/40 text-xs font-medium text-on-surface mb-6 shadow-stitch-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="w-2 h-2 rounded-full bg-gain animate-pulse"></span>
          <span className="font-semibold text-primary">FinSight v4.2 Live</span>
          <span className="text-outline">•</span>
          <span>Zero-Cost Multi-Tenant AI Financial Hub</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl font-extrabold text-on-surface tracking-tight max-w-4xl leading-[1.15] mb-6">
          Autonomous Portfolio Intelligence &amp; Valuation for Indian Equities
        </h1>

        {/* Subhead */}
        <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed mb-8">
          Upload statements directly from <strong>Zerodha</strong>, <strong>Groww</strong>, <strong>AngelOne</strong>, or <strong>Upstox</strong>. 
          Analyze portfolio risk, evaluate P/E multiples, and ask your private institutional AI co-pilot before making your next trade.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-14 w-full sm:w-auto">
          <button
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-primary hover:bg-primary-dim text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-stitch-md transition-all active:scale-[0.99]"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/50 text-on-surface font-semibold text-sm transition-all"
          >
            Sign In to Dashboard
          </button>

          <button
            onClick={onOpenAcademy}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-secondary/40 bg-secondary-container/30 hover:bg-secondary-container/60 text-on-secondary-container font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <GraduationCap className="w-4 h-4 text-secondary" />
            <span>Market Academy Tutorial</span>
          </button>
        </div>

        {/* Interactive Dashboard Preview Mockup Card */}
        <div className="w-full max-w-5xl rounded-2xl bg-surface-container-lowest border border-outline-variant/50 shadow-stitch-lg p-5 md:p-7 text-left space-y-5 relative overflow-hidden">
          {/* Mockup Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-outline-variant/30 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-xs font-bold text-on-primary-container">
                AV
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">Private Portfolio Dashboard</p>
                <p className="text-[11px] text-on-surface-variant">Live NSE Market Sync • Isolated Multi-Tenant Account</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-gain/10 text-gain font-semibold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zerodha Kite Statement Synced</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface font-semibold text-[11px]">
                Health Score: 88/100
              </span>
            </div>
          </div>

          {/* 3 Mock Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Total Portfolio Value</p>
              <p className="font-headline text-2xl font-extrabold text-on-surface mt-1">₹4,28,450</p>
              <p className="text-[11px] font-semibold text-gain mt-1">▲ +₹42,120 (+10.89%)</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Invested Capital</p>
              <p className="font-headline text-2xl font-extrabold text-on-surface mt-1">₹3,86,330</p>
              <p className="text-[11px] font-medium text-on-surface-variant mt-1">12 Active Positions on NSE</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Diversification Index</p>
              <p className="font-headline text-2xl font-extrabold text-primary mt-1">Optimal (88%)</p>
              <p className="text-[11px] font-medium text-on-surface-variant mt-1">Balanced across IT, Auto, Banking</p>
            </div>
          </div>

          {/* Sample Holdings Row Snippet */}
          <div className="p-3 rounded-xl bg-surface-container-low/40 border border-outline-variant/20 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-[10px]">
                TM
              </span>
              <span className="font-bold text-on-surface">TATAMOTORS.NS</span>
              <span className="text-[11px] text-on-surface-variant">45 shares @ ₹920.00</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-on-surface">₹44,550.00</span>
              <span className="text-gain font-semibold">+₹3,150 (+7.6%)</span>
              <span className="text-[10px] font-semibold text-primary px-2 py-0.5 rounded bg-primary-container">
                P/E: 14.8x (Undervalued)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Brokers Logo Strip */}
      <section id="brokers" className="py-12 border-y border-outline-variant/30 bg-surface-container-low/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-outline mb-6">
            Instant One-Click Statement Ingestion From All Major Indian Brokers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            <div className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm font-semibold text-xs text-on-surface">
              Zerodha Kite &amp; Console
            </div>
            <div className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm font-semibold text-xs text-on-surface">
              Groww App
            </div>
            <div className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm font-semibold text-xs text-on-surface">
              AngelOne SmartAPI
            </div>
            <div className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm font-semibold text-xs text-on-surface">
              Upstox Pro
            </div>
            <div className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm font-semibold text-xs text-on-surface">
              Excel / Standard CSV
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-headline text-2xl sm:text-4xl font-bold text-on-surface">
            Everything You Need to Manage &amp; Grow Your Wealth
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-3">
            Combining institutional quantitative models with conversational generative AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-7 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm hover:shadow-stitch-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-primary mb-5 shadow-sm">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-base font-bold text-on-surface mb-2">
              Multi-Broker Statement Sync
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              No manual ticker entry required. Upload your monthly or annual trade statement in CSV or Excel format. Our parser normalizes prices, cleans noise, and maps to official NSE symbols automatically.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-7 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm hover:shadow-stitch-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-5 shadow-sm">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-headline text-base font-bold text-on-surface mb-2">
              FinSight AI Research Co-Pilot
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Ask deep questions about any Indian company: evaluate balance sheet debt, ROE profitability, P/E multiples, and recent news sentiment before executing a buy order on your broker app.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-7 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm hover:shadow-stitch-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-surface mb-5 shadow-sm">
              <PieChart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-headline text-base font-bold text-on-surface mb-2">
              Automated Rebalancing Engine
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              FinSight continuously tracks your sector exposure and concentration risks. It alerts you if a single stock exceeds 15-20% of your total capital and recommends tactical rebalancing adjustments.
            </p>
          </div>
        </div>
      </section>

      {/* Stock Market Academy Spotlight */}
      <section id="academy" className="py-16 px-6 md:px-12 bg-surface-container-low/50 border-y border-outline-variant/30">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Free Educational Academy</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface">
              New to Investing? Learn the Stock Market from the Ground Up
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              We believe every investor deserves institutional-grade financial literacy. Our built-in Academy teaches you how equity ownership works, how to avoid overhyped stocks with P/E ratios, and how to protect capital through diversification.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onOpenAcademy}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dim text-on-primary font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <span>Launch Interactive Academy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-outline font-medium">Takes only 3 minutes</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:max-w-md">
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm">
              <p className="font-bold text-xs text-on-surface">1. What is a Share?</p>
              <p className="text-[11px] text-on-surface-variant mt-1">Real business ownership vs gambling on price fluctuations.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm">
              <p className="font-bold text-xs text-on-surface">2. Valuation &amp; P/E Ratio</p>
              <p className="text-[11px] text-on-surface-variant mt-1">Why ₹100 is not necessarily cheaper than ₹2,000.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm">
              <p className="font-bold text-xs text-on-surface">3. Portfolio Defense</p>
              <p className="text-[11px] text-on-surface-variant mt-1">Sector balance and the 15% maximum single-stock rule.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm">
              <p className="font-bold text-xs text-on-surface">4. AI Co-Pilot Research</p>
              <p className="text-[11px] text-on-surface-variant mt-1">Checking debt &amp; earnings in seconds before buying.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Multi-Tenancy Section */}
      <section id="security" className="py-20 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gain/10 text-gain flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
            Your Financial Privacy is Non-Negotiable
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            FinSight is built with complete zero-cost local architecture. Your trade statements, positions, and conversational memory are stored securely in your isolated PostgreSQL instance with strict user row-level boundaries. We never sell, track, or share your financial data with third-party brokers.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-on-surface">
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-primary" />
              <span>Bcrypt Password Encryption</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-primary" />
              <span>JWT Session Security</span>
            </span>
            <span className="flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span>Multi-Tenant Portfolios</span>
            </span>
          </div>
        </div>
      </section>

      {/* Final Call to Action Banner */}
      <section className="py-16 px-6 md:px-12 bg-primary text-on-primary">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-headline text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Take Command of Your Portfolio?
          </h2>
          <p className="text-xs sm:text-sm text-on-primary/80 max-w-xl mx-auto leading-relaxed">
            Join FinSight today. Import your broker holdings or learn market fundamentals at your own pace.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenRegister}
              className="px-7 py-3 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container font-bold text-xs shadow-stitch-md transition-all active:scale-[0.99]"
            >
              Create Free Account
            </button>
            <button
              onClick={onOpenLogin}
              className="px-6 py-3 rounded-xl border border-on-primary/30 hover:bg-on-primary/10 text-on-primary font-semibold text-xs transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t border-outline-variant/30 bg-surface-container-low text-xs text-on-surface-variant">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary text-on-primary font-bold text-xs flex items-center justify-center">
              F
            </div>
            <span className="font-semibold text-on-surface">FinSight Intelligence Enterprise</span>
            <span className="text-outline">•</span>
            <span>© 2026 All Rights Reserved</span>
          </div>
          <div className="text-[11px] text-outline text-center sm:text-right">
            For financial research and educational intelligence only • Not a SEBI registered investment adviser
          </div>
        </div>
      </footer>
    </div>
  );
};
