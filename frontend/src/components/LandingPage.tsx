import React from "react";
import {
  ShieldCheck,
  Sparkles,
  UploadCloud,
  GraduationCap,
  ArrowRight,
  PieChart,
  BarChart3,
  Lock,
  Zap,
  CheckCircle2,
  FileSpreadsheet,
  ChevronRight,
  Sliders,
  Building2,
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
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full px-6 md:px-12 h-20 flex items-center justify-between bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-headline font-bold text-lg shadow-sm">
            <span>F</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-lg font-bold tracking-tight text-on-surface leading-tight">
              FinSight
            </span>
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Intelligence
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-on-surface-variant">
          <a href="#features" className="hover:text-on-surface transition-colors">
            Capabilities
          </a>
          <a href="#brokers" className="hover:text-on-surface transition-colors">
            Broker Statement Sync
          </a>
          <a href="#academy" className="hover:text-on-surface transition-colors">
            Market Academy
          </a>
          <a href="#security" className="hover:text-on-surface transition-colors">
            Security &amp; Privacy
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
            <span>Create Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-24 px-6 md:px-12 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/40 text-xs font-semibold text-on-surface mb-8 shadow-stitch-sm">
          <span className="w-2 h-2 rounded-full bg-gain animate-pulse"></span>
          <span>Institutional Research for Indian Equities</span>
          <span className="text-outline">•</span>
          <span className="text-primary font-bold">NSE Real-Time</span>
        </div>

        {/* Clean, high-impact headline */}
        <h1 className="font-headline text-4xl sm:text-6xl md:text-7xl font-extrabold text-on-surface tracking-tight leading-[1.1] mb-6">
          The Intelligent Operating System for Indian Investors
        </h1>

        {/* Crisp Value Proposition */}
        <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed mb-10">
          Sync your portfolio in seconds by uploading statements from <strong>Zerodha</strong>, <strong>Groww</strong>, <strong>AngelOne</strong>, or <strong>Upstox</strong>. 
          Audit valuation multiples, detect portfolio risks, and perform deep fundamental balance sheet checks with your private AI co-pilot.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-6">
          <button
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-dim text-on-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-stitch-md transition-all active:scale-[0.99]"
          >
            <span>Start Free Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/50 text-on-surface font-semibold text-xs sm:text-sm transition-all"
          >
            Sign In to Dashboard
          </button>
        </div>

        {/* Secondary Academy Hook */}
        <button
          onClick={onOpenAcademy}
          className="inline-flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors py-1 group"
        >
          <GraduationCap className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
          <span>New to investing? Take our free 3-minute Stock Market Academy</span>
          <ChevronRight className="w-3.5 h-3.5 text-outline group-hover:translate-x-0.5 transition-transform" />
        </button>
      </section>

      {/* Production Metrics & Social Proof Ribbon */}
      <section className="border-y border-outline-variant/30 bg-surface-container-low/50 py-8">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface">2,000+</p>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">NSE Equities &amp; Indices</p>
          </div>
          <div>
            <p className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface">1-Click</p>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">Broker Statement Ingestion</p>
          </div>
          <div>
            <p className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface">Gemma-27B</p>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">Local AI Financial Co-Pilot</p>
          </div>
          <div>
            <p className="font-headline text-2xl sm:text-3xl font-extrabold text-gain">100% Private</p>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">Zero Cloud Data Sharing</p>
          </div>
        </div>
      </section>

      {/* Supported Brokers Section */}
      <section id="brokers" className="py-16 px-6 md:px-12 max-w-6xl mx-auto text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-outline mb-8">
          Compatible with tradebook &amp; holding statements from leading Indian brokers
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm flex flex-col items-center justify-center space-y-1">
            <Building2 className="w-5 h-5 text-primary mb-1" />
            <span className="font-bold text-xs text-on-surface">Zerodha Kite</span>
            <span className="text-[10px] text-on-surface-variant">CSV &amp; Console XLSX</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm flex flex-col items-center justify-center space-y-1">
            <Building2 className="w-5 h-5 text-primary mb-1" />
            <span className="font-bold text-xs text-on-surface">Groww</span>
            <span className="text-[10px] text-on-surface-variant">Holdings Excel &amp; CSV</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm flex flex-col items-center justify-center space-y-1">
            <Building2 className="w-5 h-5 text-primary mb-1" />
            <span className="font-bold text-xs text-on-surface">AngelOne</span>
            <span className="text-[10px] text-on-surface-variant">Trade Summary CSV</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm flex flex-col items-center justify-center space-y-1">
            <FileSpreadsheet className="w-5 h-5 text-primary mb-1" />
            <span className="font-bold text-xs text-on-surface">Upstox &amp; Custom</span>
            <span className="text-[10px] text-on-surface-variant">Standard Spreadsheets</span>
          </div>
        </div>
      </section>

      {/* Production Bento Grid: Core Platform Capabilities */}
      <section id="features" className="py-16 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-on-surface">
            Institutional-Grade Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-2">
            Powerful quantitative analytics paired with conversational intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Bento Card 1: Statement Ingestion Engine (7 cols) */}
          <div className="md:col-span-7 p-7 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm hover:shadow-stitch-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-primary mb-4 shadow-sm">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface mb-2">
                Frictionless Multi-Broker Statement Ingestion
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Eliminate manual portfolio tracking. Simply drop your monthly tradebook or holdings export. FinSight automatically normalizes broker headers, cleans currency noise, and resolves messy scrip names (e.g. <code>TATA MOTORS LTD - EQ</code>) into canonical NSE tickers (<code>TATAMOTORS.NS</code>).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center gap-2 text-[11px] font-semibold text-gain">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero manual entry • Automatic stock symbol mapping</span>
            </div>
          </div>

          {/* Bento Card 2: AI Co-Pilot (5 cols) */}
          <div className="md:col-span-5 p-7 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm hover:shadow-stitch-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-4 shadow-sm">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface mb-2">
                FinSight AI Co-Pilot
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Powered by a private local Gemma-27B model. Ask complex balance sheet queries, inspect debt trajectories, and analyze recent news sentiment before buying on your broker app.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center gap-2 text-[11px] font-semibold text-primary">
              <Zap className="w-4 h-4" />
              <span>Zero API cost • Instant financial reasoning</span>
            </div>
          </div>

          {/* Bento Card 3: Valuation Radar (5 cols) */}
          <div className="md:col-span-5 p-7 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm hover:shadow-stitch-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface mb-4 shadow-sm">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface mb-2">
                Deep Valuation &amp; Fundamental Radar
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Track live Price-to-Earnings (P/E), Return on Equity (ROE), Debt-to-Equity, and 52-week price bands. Identify whether a stock is genuinely undervalued or overbought.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center gap-2 text-[11px] font-semibold text-on-surface-variant">
              <span>Continuous NSE data updates</span>
            </div>
          </div>

          {/* Bento Card 4: Autonomous Rebalancing Engine (7 cols) */}
          <div className="md:col-span-7 p-7 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm hover:shadow-stitch-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-primary mb-4 shadow-sm">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface mb-2">
                Concentration Risk Guard &amp; Rebalancing
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Protect your wealth against unexpected single-company drawdowns. FinSight calculates your Diversification Score and warns you whenever a position exceeds 15-20% of your portfolio weight, providing tactical rebalancing recommendations.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center gap-2 text-[11px] font-semibold text-gain">
              <PieChart className="w-4 h-4" />
              <span>Institutional capital protection safeguards</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stock Market Academy Educational Section */}
      <section id="academy" className="py-16 px-6 md:px-12 bg-surface-container-low/40 border-y border-outline-variant/30">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Beginner Educational Hub</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface">
              Starting Your Investment Journey?
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Before risking real capital in the markets, master the foundational mechanics of equity investing. Our interactive Stock Market Academy breaks down complex financial ideas into 4 actionable, 60-second lessons with clear real-world examples.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenAcademy}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dim text-on-primary font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <span>Launch Interactive Academy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full lg:max-w-md">
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm">
              <span className="text-[10px] font-bold text-primary uppercase">Lesson 1</span>
              <p className="font-bold text-xs text-on-surface mt-1">What is a Share?</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Real business ownership vs price speculation.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm">
              <span className="text-[10px] font-bold text-primary uppercase">Lesson 2</span>
              <p className="font-bold text-xs text-on-surface mt-1">Valuation &amp; P/E Ratio</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Why price alone does not determine fair value.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm">
              <span className="text-[10px] font-bold text-primary uppercase">Lesson 3</span>
              <p className="font-bold text-xs text-on-surface mt-1">Portfolio Defense</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Sector balance and the 15% maximum position rule.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-stitch-sm">
              <span className="text-[10px] font-bold text-primary uppercase">Lesson 4</span>
              <p className="font-bold text-xs text-on-surface mt-1">AI-Assisted Research</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Inspecting balance sheets before placing a broker order.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Data Sovereignty Section */}
      <section id="security" className="py-20 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <div className="w-12 h-12 rounded-2xl bg-primary-container text-primary flex items-center justify-center mx-auto mb-4 shadow-sm">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface mb-3">
          Absolute Financial Data Sovereignty
        </h2>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed mb-8">
          FinSight requires no brokerage API credentials, no trading passwords, and no third-party data tracking. 
          Your statements, holdings, and private notes are stored in your isolated PostgreSQL database.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-semibold text-on-surface">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/30">
            <Lock className="w-4 h-4 text-primary" />
            <span>Bcrypt Hashed Passwords</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/30">
            <Zap className="w-4 h-4 text-primary" />
            <span>Stateless JWT Authentication</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/30">
            <ShieldCheck className="w-4 h-4 text-gain" />
            <span>Isolated Multi-Tenant Schemas</span>
          </span>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-6 md:px-12 bg-primary text-on-primary">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <h2 className="font-headline text-3xl sm:text-4xl font-extrabold tracking-tight">
            Elevate Your Portfolio Today
          </h2>
          <p className="text-xs sm:text-sm text-on-primary/80 max-w-md mx-auto leading-relaxed">
            Free forever for personal investors. Import your broker holdings or master the stock market with FinSight.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenRegister}
              className="px-8 py-3 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container font-bold text-xs shadow-stitch-md transition-all active:scale-[0.99]"
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
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary text-on-primary font-bold text-xs flex items-center justify-center">
              F
            </div>
            <span className="font-semibold text-on-surface">FinSight Intelligence</span>
            <span className="text-outline">•</span>
            <span>© 2026 All Rights Reserved</span>
          </div>
          <div className="text-[11px] text-outline text-center sm:text-right">
            Financial analytics &amp; educational research tool • Not a SEBI registered investment adviser
          </div>
        </div>
      </footer>
    </div>
  );
};
