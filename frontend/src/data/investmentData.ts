/**
 * FinSight Investment Catalog & Educational Data
 * Covers 10 distinct Indian investment categories with standardized detail models,
 * comparison matrices, and 5-level Academy curriculum.
 */

export interface InvestmentCategory {
  id: string;
  name: string;
  categoryTag: string;
  shortDesc: string;
  icon: string;
  typicalHorizon: string;
  complexity: "Low" | "Medium" | "High";
  marketRisk: string;
  diversification: string;
  liquidity: string;
  keyTakeaways: string[];
  
  // Standardized Detail View
  whatIsIt: string;
  howItWorks: string;
  makeOrLoseMoney: string;
  timeHorizonDetails: string;
  liquidityDetails: string;
  costsAndFees: string;
  taxConsiderations: string;
  whoGenerallyUsesIt: string;
  whatToLearnFirst: string[];
  commonMistakes: string[];
  practicalExample: string;
}

export const INVESTMENT_CATEGORIES: InvestmentCategory[] = [
  {
    id: "index_funds",
    name: "Index Funds",
    categoryTag: "Passive Equity",
    shortDesc: "Low-cost mutual funds engineered to automatically mirror the performance of a market benchmark like Nifty 50.",
    icon: "🧺",
    typicalHorizon: "Long term (5-10+ yrs)",
    complexity: "Low",
    marketRisk: "Market-Linked",
    diversification: "Broad / Multi-Stock",
    liquidity: "Instant (T+1)",
    keyTakeaways: ["Tracks Nifty 50 or Sensex", "Ultra-low expense ratio (0.1–0.2%)", "No fund manager bias", "Broad instant diversification"],
    whatIsIt: "An index fund is an open-ended mutual fund that buys all the stocks in a market index (such as Nifty 50) in the exact same proportion as the index itself.",
    howItWorks: "Instead of paying an active manager to pick winners and losers, a computer algorithm simply mirrors the index constituents. When a company enters or exits Nifty 50, the fund adjusts automatically.",
    makeOrLoseMoney: "You earn when the overall Indian economy and the top 50 companies grow in earnings and valuation. You make money via NAV appreciation and reinvested dividends. You lose value temporarily during broad market corrections.",
    timeHorizonDetails: "Ideal for 5 to 10+ years. Over short periods (1-2 years), the index can be volatile, but historically 7+ year rolling returns for Nifty 50 have beaten inflation comfortably.",
    liquidityDetails: "High liquidity. You can redeem your mutual fund units on any business day. Funds hit your bank account within T+1 to T+2 days.",
    costsAndFees: "Total Expense Ratio (TER) is exceptionally low, usually between 0.05% to 0.20% per year for direct plans. Zero exit load after 7 to 30 days.",
    taxConsiderations: "Equity mutual fund taxation: Units held for >1 year attract Long Term Capital Gains (LTCG) tax of 12.5% on profits exceeding ₹1.25 lakh per financial year. Units held <1 year attract Short Term Capital Gains (STCG) of 20%.",
    whoGenerallyUsesIt: "Beginners, busy working professionals, and seasoned investors who want broad market growth without the stress of analyzing individual financial balance sheets.",
    whatToLearnFirst: ["Tracking error & tracking difference", "Expense ratio comparison", "SIP vs Lump sum compounding", "Historical volatility cycles"],
    commonMistakes: ["Stopping SIPs during market declines when units are actually cheap", "Paying high commissions for 'Regular' plans instead of Direct plans", "Expecting guaranteed fixed returns"],
    practicalExample: "Investing ₹3,000/month in a Nifty 50 Index Fund means you automatically own fractions of Reliance, TCS, HDFC Bank, Infosys, and 46 other top enterprises.",
  },
  {
    id: "stocks",
    name: "Individual Stocks (Equities)",
    categoryTag: "Direct Equity",
    shortDesc: "Direct fractional ownership in publicly listed Indian corporations traded on NSE and BSE.",
    icon: "📈",
    typicalHorizon: "Long term (5-10+ yrs)",
    complexity: "High",
    marketRisk: "High",
    diversification: "Single Asset",
    liquidity: "Instant (T+1)",
    keyTakeaways: ["Fractional business ownership", "High upside potential", "Requires balance sheet research", "Company-specific downside risk"],
    whatIsIt: "Buying a share of a stock means buying a fractional piece of ownership in an active business like Tata Motors, Infosys, or State Bank of India.",
    howItWorks: "Companies sell shares to raise capital. Once listed on the National Stock Exchange (NSE), shares trade between buyers and sellers based on supply, demand, and corporate earnings.",
    makeOrLoseMoney: "You make money if the company grows profits, resulting in higher share prices (capital appreciation) and regular dividend payouts. You lose money if company profits deteriorate, debt becomes unsustainable, or valuation collapses.",
    timeHorizonDetails: "5 to 10+ years. Single stock prices fluctuate significantly daily based on news, quarterly reports, and economic sentiment.",
    liquidityDetails: "Instant liquidity. Liquid stocks on NSE trade millions of shares daily. Sales settle into your Demat account on T+1.",
    costsAndFees: "Zero brokerage for delivery trades on modern discount brokers, but subject to exchange transaction charges, GST, SEBI turnover fees, and STT (Securities Transaction Tax).",
    taxConsiderations: "Long Term (>1 year holding): 12.5% tax on gains above ₹1.25 lakh/year. Short Term (<1 year holding): Flat 20% on realized capital gains. Dividends are taxed at your income tax slab rate.",
    whoGenerallyUsesIt: "Investors who enjoy reading annual reports, tracking corporate governance, analyzing valuation ratios (P/E, ROE, D/E), and building concentrated conviction.",
    whatToLearnFirst: ["Reading balance sheets and income statements", "Price to Earnings (P/E) & Return on Equity (ROE)", "Debt to Equity safety limits", "Competitive moats"],
    commonMistakes: ["Buying based on social media 'tips' or WhatsApp groups", "Treating stock investing like a lottery ticket", "Failing to diversify across sectors"],
    practicalExample: "Buying 10 shares of Tata Power at ₹400 makes you an equity owner. As India's renewable energy consumption grows and Tata Power expands earnings, your shares appreciate.",
  },
  {
    id: "mutual_funds",
    name: "Active Mutual Funds",
    categoryTag: "Professional Managed",
    shortDesc: "Pooled investment funds managed by professional fund managers who pick stocks aiming to beat the market benchmark.",
    icon: "📊",
    typicalHorizon: "Long term (5-10+ yrs)",
    complexity: "Medium",
    marketRisk: "Market-Linked",
    diversification: "Broad / Multi-Stock",
    liquidity: "Instant (T+1)",
    keyTakeaways: ["Professional fund manager management", "Flexi-cap, Large-cap, Small-cap varieties", "Higher fee than index funds (0.5–1.5%)", "Active alpha potential"],
    whatIsIt: "A pooled fund where thousands of investors pool their money, and a certified SEBI-registered Asset Management Company (AMC) invests in a diversified basket of stocks or bonds.",
    howItWorks: "A professional fund manager and team of equity analysts select securities aligned with the fund's mandate (e.g., Large Cap, Mid Cap, Flexi Cap, or Sectoral).",
    makeOrLoseMoney: "Unit values (NAV) fluctuate with the collective market value of all underlying portfolio holdings.",
    timeHorizonDetails: "Recommended 5+ years for equity funds. Liquid / ultra-short debt mutual funds can be held for weeks or months.",
    liquidityDetails: "High. Units can be redeemed through your broker or AMC app anytime with funds credited in 1 to 2 working days.",
    costsAndFees: "Total Expense Ratio (TER) varies between 0.50% to 1.80% depending on fund size and whether you select Direct or Regular plans.",
    taxConsiderations: "Classified as Equity funds if >65% invested in domestic equities (12.5% LTCG > ₹1.25L, 20% STCG). Debt funds are taxed according to your personal income slab rate.",
    whoGenerallyUsesIt: "Investors seeking professionally managed asset allocation without having to select and track 20 individual stocks themselves.",
    whatToLearnFirst: ["Direct plan vs Regular plan differences", "Expense ratio drag over decades", "Fund manager tenure and track record", "Portfolio turnover ratio"],
    commonMistakes: ["Investing in 15 different mutual funds that all own the exact same 30 stocks", "Chasing last year's top-performing fund right after its bull run", "Buying Regular plans and paying hidden agent commissions"],
    practicalExample: "A Flexi-Cap fund manager shifts allocation between banking, tech, and manufacturing stocks depending on macroeconomic opportunities.",
  },
  {
    id: "etfs",
    name: "Exchange Traded Funds (ETFs)",
    categoryTag: "Exchange Traded",
    shortDesc: "Baskets of securities that track an index, sector, or commodity, bought and sold in real-time on the stock exchange.",
    icon: "⚡",
    typicalHorizon: "Medium to Long term",
    complexity: "Medium",
    marketRisk: "Market-Linked",
    diversification: "Broad / Sectoral",
    liquidity: "Instant (Traded intraday)",
    keyTakeaways: ["Trades like a stock during market hours", "Real-time pricing vs end-of-day NAV", "Ultra-low management expense", "Requires a Demat account"],
    whatIsIt: "An ETF is like an index fund that trades directly on the stock exchange just like an individual stock ticker (e.g., NIFTYBEES, GOLDBEES).",
    howItWorks: "Authorized participants create and redeem ETF shares with the fund house to keep the trading price aligned with the Net Asset Value (NAV) of the underlying index.",
    makeOrLoseMoney: "Track the underlying index (Nifty 50, Bank Nifty, Silver, Gold). Value rises and falls continuously during trading hours (9:15 AM – 3:30 PM IST).",
    timeHorizonDetails: "3 to 10+ years depending on whether the ETF tracks broad equities (NIFTYBEES) or commodities (GOLDBEES).",
    liquidityDetails: "Instant. You can buy or sell anytime during trading hours. However, check trading volume to avoid wide bid-ask spreads on niche ETFs.",
    costsAndFees: "Very low TER (often 0.05% to 0.25%). Standard stock exchange brokerage and demat fees apply upon trade execution.",
    taxConsiderations: "Equity ETFs follow standard equity taxation (12.5% LTCG > ₹1.25L, 20% STCG). Gold and international ETFs are taxed at individual income slab rates.",
    whoGenerallyUsesIt: "Investors who want intraday price control, low expense ratios, and simple tracking of broad indexes or commodities through their Demat broker.",
    whatToLearnFirst: ["Bid-ask spread and trading volume", "Limit orders vs Market orders", "iNAV (Intraday Indicative NAV)", "Tracking difference"],
    commonMistakes: ["Placing large market orders on illiquid ETFs with wide spreads", "Confusing trading price with true NAV during volatile market open"],
    practicalExample: "Buying 5 units of NIFTYBEES at ₹280 gives you immediate fractional exposure to India's top 50 corporations through your stock broker app.",
  },
  {
    id: "fixed_deposits",
    name: "Fixed Deposits (FD & RD)",
    categoryTag: "Fixed Income",
    shortDesc: "Guaranteed-return deposits placed with scheduled commercial banks or post offices for a fixed tenure.",
    icon: "🏦",
    typicalHorizon: "Short to Medium term (6 mo – 5 yrs)",
    complexity: "Low",
    marketRisk: "Very Low",
    diversification: "Single Asset",
    liquidity: "Moderate (Premature fee)",
    keyTakeaways: ["Guaranteed principal & interest", "Insured up to ₹5 lakh by DICGC", "Zero market volatility", "Risk of losing purchasing power to inflation"],
    whatIsIt: "A financial instrument provided by banks where you deposit a lump sum for a predetermined period at a guaranteed interest rate.",
    howItWorks: "The bank lends your deposit to borrowers at a higher rate and pays you a fixed guaranteed interest (e.g., 6.5% – 7.5% per annum) regardless of stock market fluctuations.",
    makeOrLoseMoney: "You receive guaranteed interest payouts monthly, quarterly, or upon maturity. You do not suffer market losses, but real wealth can erode if the post-tax return is lower than inflation.",
    timeHorizonDetails: "7 days to 10 years. Popular tenures are 1 to 3 years for short-term emergency cushions or upcoming known expenses.",
    liquidityDetails: "High. Can be broken anytime via netbanking, but usually incurs a small premature penalty (typically 0.5% – 1% lower interest rate).",
    costsAndFees: "Zero fees to open. Banks may levy 0.5% – 1% penalty on interest if broken prior to maturity.",
    taxConsiderations: "Interest is fully taxable at your personal income tax slab rate. TDS (Tax Deducted at Source) is deducted by banks if annual interest exceeds ₹40,000 (₹50,000 for senior citizens).",
    whoGenerallyUsesIt: "Emergency fund reserves, senior citizens wanting predictable income, and risk-averse investors saving for expenses due in under 2 years.",
    whatToLearnFirst: ["DICGC insurance limit (₹5 lakh per bank)", "Post-tax real returns formula (Return - Tax - Inflation)", "Cumulative vs Non-cumulative interest"],
    commonMistakes: ["Putting 100% of 20-year retirement savings into FDs where inflation silently eats purchasing power", "Forgetting that interest is taxed at your highest slab rate"],
    practicalExample: "Placing ₹50,000 in a 1-year FD at 7.0% gives you guaranteed ₹53,500 at maturity, safe from all stock market fluctuations.",
  },
  {
    id: "government_securities",
    name: "Government Securities (G-Secs & T-Bills)",
    categoryTag: "Sovereign Debt",
    shortDesc: "Sovereign debt instruments issued by the Reserve Bank of India on behalf of the Government of India with zero credit risk.",
    icon: "🏛",
    typicalHorizon: "Short term (T-Bills) to Long (G-Secs)",
    complexity: "Medium",
    marketRisk: "Low",
    diversification: "Sovereign Backed",
    liquidity: "Moderate (RBI Retail Direct / NSE)",
    keyTakeaways: ["Sovereign guarantee (zero default risk)", "Treasury Bills (91, 182, 364 days)", "Long-term bonds up to 40 years", "Available directly via RBI Retail Direct"],
    whatIsIt: "Debt papers issued by the central or state governments to fund national infrastructure, fiscal projects, and development.",
    howItWorks: "You lend money directly to the Indian Government. In exchange, the government pays regular semi-annual coupon interest and returns your entire principal on the maturity date.",
    makeOrLoseMoney: "You receive fixed coupon payments. If you hold until maturity, your capital is 100% returned with zero default risk. If sold early on the secondary exchange, bond prices move inversely to interest rates.",
    timeHorizonDetails: "Treasury Bills (T-Bills) range from 91 days to 364 days. Long-term dated G-Secs span 5 years to 40 years.",
    liquidityDetails: "Can be held to maturity or traded on the secondary market via RBI Retail Direct or NSE debt segment.",
    costsAndFees: "Zero account opening and zero bidding fees on the RBI Retail Direct platform.",
    taxConsiderations: "Interest is taxed as income at your marginal income slab rate. No TDS is deducted on G-Sec coupon payments.",
    whoGenerallyUsesIt: "Institutions, pension funds, and safety-conscious retail investors looking for higher yields than bank FDs with ultimate sovereign safety.",
    whatToLearnFirst: ["Inverse relationship between interest rates and bond prices", "Yield to Maturity (YTM)", "RBI Retail Direct platform"],
    commonMistakes: ["Confusing credit risk (zero for GoI) with interest rate risk (market price fluctuation before maturity)"],
    practicalExample: "Buying a 10-year GoI 7.18% 2033 bond pays you 3.59% coupon every 6 months like clockwork, backed by the sovereign credit of India.",
  },
  {
    id: "gold",
    name: "Gold (Sovereign Gold Bonds & ETFs)",
    categoryTag: "Commodity Hedge",
    shortDesc: "A traditional store of value and hedge against currency devaluation and global macroeconomic instability.",
    icon: "🥇",
    typicalHorizon: "Long term (5-8+ yrs)",
    complexity: "Low",
    marketRisk: "Moderate",
    diversification: "Diversifier",
    liquidity: "High (Gold ETFs) / Moderate (SGB)",
    keyTakeaways: ["Natural hedge against inflation & crises", "Historically low correlation with equities", "Digital Gold, ETFs, and SGBs avoid jewelry making charges", "Portfolio stabilizer"],
    whatIsIt: "Investing in gold as an asset class through digital instruments rather than physical jewelry to avoid making charges, purity issues, and storage theft.",
    howItWorks: "Gold prices move based on international bullion markets, currency exchange rates (USD/INR), inflation expectations, and global geopolitical stress.",
    makeOrLoseMoney: "You earn through price appreciation when gold prices rise. Sovereign Gold Bonds (SGBs) also paid an additional 2.5% annual interest. You lose when bullion prices undergo multi-year sideways or corrective phases.",
    timeHorizonDetails: "5 to 8+ years. Ideal allocation in a balanced portfolio is typically 5% to 10% as insurance.",
    liquidityDetails: "Gold ETFs (e.g. GOLDBEES) are instantly liquid on the stock market. SGBs have an 8-year tenure with early redemption windows after year 5.",
    costsAndFees: "Gold ETFs have low expense ratios (~0.3% – 0.5%). Zero storage or insurance fees compared to physical lockers.",
    taxConsiderations: "Sovereign Gold Bonds held to full maturity (8 years) are 100% EXEMPT from capital gains tax! Gold ETFs are taxed at your income slab rate.",
    whoGenerallyUsesIt: "Long-term investors who want portfolio stability and insurance during stock market crashes or high global inflation.",
    whatToLearnFirst: ["Why jewelry is a poor investment (10-25% lost to making charges and GST)", "Gold ETF vs SGB differences", "Historical gold vs equity returns"],
    commonMistakes: ["Allocating 50%+ of net worth to gold (limits productive economic compounding)", "Buying physical gold jewelry and counting it as investment"],
    practicalExample: "Holding 10% of your portfolio in Gold ETFs often stays stable or rises during severe equity market crashes, reducing overall portfolio shock.",
  },
  {
    id: "bonds",
    name: "Corporate Bonds",
    categoryTag: "Corporate Debt",
    shortDesc: "Fixed-income debt instruments issued by Indian corporations offering higher interest yields than bank deposits.",
    icon: "💰",
    typicalHorizon: "Medium term (1-5 yrs)",
    complexity: "Medium",
    marketRisk: "Low to Moderate",
    diversification: "Single Issuer",
    liquidity: "Moderate (Secondary Market)",
    keyTakeaways: ["Higher yields than bank FDs (8%–11%)", "Credit ratings: AAA (safest) to D (default)", "Predictable coupon schedule", "Credit risk applies"],
    whatIsIt: "A loan you provide to a company (e.g., L&T Finance, HDFC, Mahindra Finance). In return, the company pays a fixed interest rate and repays your principal on a defined date.",
    howItWorks: "Companies issue Non-Convertible Debentures (NCDs) or corporate bonds to fund business growth without diluting equity ownership.",
    makeOrLoseMoney: "Earn steady coupon interest. Risk of principal loss exists if the borrowing company defaults or experiences credit downgrades.",
    timeHorizonDetails: "1 to 7 years. Most retail corporate bonds have 2- to 3-year tenures.",
    liquidityDetails: "Traded on BSE/NSE debt segments, but retail liquidity is often thinner than equity markets.",
    costsAndFees: "Zero fees on bond investment platforms like GoldenPi, Wint Wealth, or direct broker order books.",
    taxConsiderations: "Interest is fully taxable at your individual income tax slab rate. Capital gains on transfer follow debt asset rules.",
    whoGenerallyUsesIt: "Investors seeking higher fixed income than bank deposits who understand how to check CRISIL/ICRA credit ratings.",
    whatToLearnFirst: ["CRISIL, ICRA, and CARE credit ratings", "Secured vs Unsecured bonds", "Senior debt vs Subordinated debt"],
    commonMistakes: ["Chasing 13%+ yields on poorly rated (BBB or below) bonds without understanding default risk"],
    practicalExample: "Investing in a AAA-rated Mahindra Finance bond paying 8.2% annual interest for 3 years provides steady, predictable income with strong safety.",
  },
  {
    id: "reits",
    name: "REITs (Real Estate Investment Trusts)",
    categoryTag: "Commercial Real Estate",
    shortDesc: "SEBI-regulated trusts that own income-generating commercial real estate (offices, tech parks), distributing 90% of cash flows as dividends.",
    icon: "🏢",
    typicalHorizon: "Long term (5+ yrs)",
    complexity: "Medium",
    marketRisk: "Moderate",
    diversification: "Multi-Property Commercial",
    liquidity: "Instant (Traded on NSE/BSE)",
    keyTakeaways: ["Own commercial grade-A offices for ₹300", "Mandatory 90% cash flow distribution", "Quarterly dividend payouts", "Inflation-linked rent escalations"],
    whatIsIt: "REITs allow small retail investors to own a fraction of massive tech parks, IT hubs, and commercial offices (e.g., Embassy Office Parks, Mindspace, Brookfield) traded directly on NSE.",
    howItWorks: "The trust leases premium office spaces to top multinational corporations (Google, Microsoft, TCS, etc.), collects rental income, and distributes at least 90% of Net Distributable Cash Flows to unit-holders every quarter.",
    makeOrLoseMoney: "Quarterly dividend/interest distributions + long-term capital appreciation of underlying real estate assets. Vulnerable to office vacancy rates and high interest rates.",
    timeHorizonDetails: "5+ years. Designed for steady dividend yield combined with modest property value growth.",
    liquidityDetails: "High. Trades on NSE just like a common stock during market hours.",
    costsAndFees: "Standard stock brokerage and exchange charges apply. Management fees are deducted by the REIT manager prior to net distributions.",
    taxConsiderations: "Unique hybrid taxation: Distributions are split into Dividend, Interest, and Repayment of Capital, each with specific tax treatment outlined in quarterly investor reports.",
    whoGenerallyUsesIt: "Investors seeking real estate exposure without the nightmare of buying physical flats, paying property taxes, dealing with tenants, or locking up ₹50 lakh+.",
    whatToLearnFirst: ["Occupancy rates & WALE (Weighted Average Lease Expiry)", "Dividend yield vs Rental yield", "Distribution breakdown components"],
    commonMistakes: ["Expecting rapid 30% yearly price spikes like small-cap stocks (REITs are hybrid income instruments)"],
    practicalExample: "Buying 100 units of Embassy REIT gives you fractional ownership in premium IT parks in Bengaluru and Mumbai, yielding steady quarterly dividends.",
  },
  {
    id: "ppf_nps",
    name: "PPF & NPS (Retirement & Sovereign Wealth)",
    categoryTag: "Government Retirement",
    shortDesc: "Government-backed long-term wealth builders offering sovereign safety, compounding, and major tax exemptions.",
    icon: "🧓",
    typicalHorizon: "Ultra long (15+ yrs)",
    complexity: "Low",
    marketRisk: "Very Low (PPF) / Balanced (NPS)",
    diversification: "Sovereign / Multi-Asset",
    liquidity: "Locked-in period",
    keyTakeaways: ["Triple EEE tax exemption on PPF", "NPS low-cost pension wealth builder", "Disciplined long-term lock-in prevents panic selling", "Ideal for retirement"],
    whatIsIt: "Public Provident Fund (PPF) and National Pension System (NPS) are premier government-sponsored long-term retirement and wealth building vehicles.",
    howItWorks: "PPF pays government-set guaranteed interest (e.g. 7.1% compounded annually). NPS invests your contributions across Equities (E), Corporate Debt (C), and Government Bonds (G) managed by certified PFRDA pension managers.",
    makeOrLoseMoney: "PPF provides guaranteed compounding. NPS grows with the chosen equity/debt asset mix at extremely low fund management costs (0.01% – 0.05%).",
    timeHorizonDetails: "PPF has a 15-year tenure (extendable in 5-year blocks). NPS matures at age 60.",
    liquidityDetails: "Low liquidity with strict lock-in, which acts as a psychological advantage to prevent emotional premature withdrawals.",
    costsAndFees: "PPF: 100% free. NPS: World's lowest fund management fee (~0.03% to 0.09%).",
    taxConsiderations: "PPF enjoys EEE status: Investment is tax-deductible under 80C, interest earned is 100% tax-free, and maturity amount is 100% tax-free! NPS provides extra ₹50,000 deduction under Section 80CCD(1B).",
    whoGenerallyUsesIt: "Every Indian investor building a rock-solid, tax-free retirement foundation.",
    whatToLearnFirst: ["EEE (Exempt-Exempt-Exempt) tax superpower", "NPS Auto Choice vs Active Choice asset allocation", "Annuity requirements on NPS maturity"],
    commonMistakes: ["Ignoring PPF early in life; starting at age 22 allows maturity by age 37 with a substantial tax-free corpus"],
    practicalExample: "Investing ₹1.5 lakh every April in PPF at 7.1% builds over ₹40 lakh completely tax-free over 15 years.",
  },
];

export interface ComparisonFactor {
  factor: string;
  fd: string;
  indexFund: string;
  gold: string;
  gSec: string;
}

export const COMPARISON_TABLE: ComparisonFactor[] = [
  {
    factor: "Return Mechanism",
    fd: "Guaranteed fixed interest",
    indexFund: "Market growth & company dividends",
    gold: "Global price movement & inflation hedge",
    gSec: "Sovereign coupon payments",
  },
  {
    factor: "Market Volatility",
    fd: "Zero (Stable)",
    indexFund: "High short-term / Smooth long-term",
    gold: "Moderate",
    gSec: "Low to None (held to maturity)",
  },
  {
    factor: "Diversification Power",
    fd: "Low (Single bank credit)",
    indexFund: "Broad (Top 50 Indian companies)",
    gold: "High (Protects during crashes)",
    gSec: "Sovereign anchor",
  },
  {
    factor: "Liquidity",
    fd: "Instant (Small penalty on interest)",
    indexFund: "T+1 business days",
    gold: "Instant (Gold ETFs on exchange)",
    gSec: "T+1 (Secondary market)",
  },
  {
    factor: "Complexity",
    fd: "Low (Very simple)",
    indexFund: "Low to Medium",
    gold: "Low",
    gSec: "Medium",
  },
  {
    factor: "Main Risk",
    fd: "Inflation eroding purchasing power",
    indexFund: "Short-term market corrections",
    gold: "Multi-year sideways price cycles",
    gSec: "Interest rate shifts if sold early",
  },
  {
    factor: "Typical Purpose",
    fd: "Emergency fund & capital safety",
    indexFund: "Long-term wealth creation (5+ yrs)",
    gold: "Portfolio insurance & stabilization",
    gSec: "Safe predictable income",
  },
];

// FinSight Academy 5-Level Curriculum Data
export interface AcademyLesson {
  id: string;
  level: number;
  levelTitle: string;
  title: string;
  durationMinutes: number;
  summary: string;
  explanation: string;
  analogy: string;
  practicalExample: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const ACADEMY_LESSONS: AcademyLesson[] = [
  // LEVEL 1: Money Basics
  {
    id: "l1_saving_vs_investing",
    level: 1,
    levelTitle: "Level 1 — Money Basics",
    title: "Saving vs. Investing & The Inflation Monster",
    durationMinutes: 4,
    summary: "Why leaving money in a savings account actually makes you poorer over time due to inflation.",
    explanation: "Saving is putting aside surplus money in a secure place (like a bank account) for emergencies or upcoming expenses. Investing is putting that money to work in productive assets (equities, index funds, bonds) so that it earns returns and outpaces inflation.",
    analogy: "Think of money like fresh fruit. If you store fruit in a pantry (savings account) without preserving it, it slowly shrinks and spoils due to inflation. Investing is planting the fruit's seeds into productive soil to grow new trees.",
    practicalExample: "If annual inflation in India is 6%, an item costing ₹100 today costs ₹106 next year. A savings account paying 3% gives you ₹103. You have lost ₹3 of purchasing power. To grow real wealth, your returns must exceed inflation.",
    quiz: {
      question: "If inflation is 6% per year and your savings account pays 3.5% interest, what happens to your money?",
      options: [
        "Your purchasing power grows by 3.5%",
        "Your purchasing power shrinks by about 2.5% per year",
        "Your money is completely safe and unaffected",
        "You automatically double your savings in 10 years"
      ],
      correctIndex: 1,
      explanation: "Real return = Nominal Return (3.5%) minus Inflation (6.0%) = -2.5%. While the balance number goes up, what you can actually buy with it goes down.",
    },
  },
  {
    id: "l1_magic_of_compounding",
    level: 1,
    levelTitle: "Level 1 — Money Basics",
    title: "The Math of Compounding: Why Time Beats Timing",
    durationMinutes: 5,
    summary: "How small regular monthly investments snowball into life-changing wealth over 10 to 20 years.",
    explanation: "Compounding occurs when the returns you earn on your investment start generating returns of their own. In year 1, you earn returns on principal. In year 10, you earn returns on the principal plus 9 years of accumulated earnings.",
    analogy: "A snowball rolling down a snowy mountain: at the top it is the size of an apple, but with each rotation it collects more snow, accelerating in size exponentially.",
    practicalExample: "Investing ₹2,000 per month at 12% annual return for 20 years: You personally invest ₹4.8 lakh. Your compounding return adds ₹15.2 lakh. Your total portfolio becomes ~₹20 lakh!",
    quiz: {
      question: "Who will likely build more total wealth at age 50?",
      options: [
        "Person A: Starts investing ₹1,500/month at age 20 and stops at age 35",
        "Person B: Starts investing ₹5,000/month at age 35 until age 50",
        "Both will have exactly the same amount",
        "Compounding has no impact after 5 years"
      ],
      correctIndex: 0,
      explanation: "Person A gives their money 30 years to compound! The earliest invested rupees do the heaviest lifting because exponential curves accelerate dramatically in their final decades.",
    },
  },

  // LEVEL 2: Market Basics
  {
    id: "l2_what_is_a_stock",
    level: 2,
    levelTitle: "Level 2 — Market Basics",
    title: "What is a Stock & Why Do Companies Issue Them?",
    durationMinutes: 4,
    summary: "Understand fractional business ownership, the role of NSE/BSE, and what share price represents.",
    explanation: "When a company needs capital to build factories, hire engineers, or expand stores, it can either borrow from banks or sell fractional ownership shares to the public through an Initial Public Offering (IPO). Once listed, these shares trade on the National Stock Exchange (NSE).",
    analogy: "If you and 3 friends open a bakery for ₹1,00,000, each putting in ₹25,000, you each own 25% of the bakery. If the bakery profits ₹40,000 in a year, your 25% share of profit is ₹10,000.",
    practicalExample: "Buying 1 share of Infosys at ₹1,500 does not make you a trader; it makes you a legitimate fractional owner of Infosys's global contracts, cash reserves, and future profit stream.",
    quiz: {
      question: "When you purchase a share of a company on the NSE, what do you legally own?",
      options: [
        "A loan that the company must repay to you next month",
        "A fractional ownership piece of the corporation and its earnings",
        "A guaranteed lottery ticket with fixed returns",
        "A temporary rental pass to use their products for free"
      ],
      correctIndex: 1,
      explanation: "Equities represent fractional equity ownership. You participate in the real economic fortunes of the underlying enterprise.",
    },
  },
  {
    id: "l2_nifty_and_sensex",
    level: 2,
    levelTitle: "Level 2 — Market Basics",
    title: "Demystifying NIFTY 50 & SENSEX Benchmarks",
    durationMinutes: 4,
    summary: "What news anchors mean when they say 'The market is up 200 points today.'",
    explanation: "You cannot buy every single company in India easily. So exchanges built 'Indexes' to serve as the nation's financial thermometer. Nifty 50 tracks the 50 largest, most liquid companies on the NSE across 13 sectors. Sensex tracks the top 30 on the BSE.",
    analogy: "Think of Nifty 50 like the Indian National Cricket Team: the top 50 star players represent the country. If a company stops performing, it is dropped from the team and a rising star replaces it.",
    practicalExample: "When Nifty 50 rises 1%, it means the collective market valuation of India's 50 bellwether companies (TCS, Reliance, HDFC Bank, ICICI Bank, etc.) grew by 1%.",
    quiz: {
      question: "What happens if a company in the Nifty 50 consistently loses market share and profits?",
      options: [
        "The entire index goes to zero",
        "The index committee replaces it with a better-performing large-cap company during semi-annual rebalancing",
        "The government forces investors to bail it out",
        "Nifty 50 stops operating"
      ],
      correctIndex: 1,
      explanation: "Indices are self-cleansing! Declining companies fall out, and thriving new industry leaders enter, maintaining the quality of the index automatically.",
    },
  },

  // LEVEL 3: Understanding Stocks & Ratios
  {
    id: "l3_pe_ratio_demystified",
    level: 3,
    levelTitle: "Level 3 — Understanding Valuation",
    title: "The P/E Ratio: How Much Are You Paying for Profit?",
    durationMinutes: 5,
    summary: "Learn how to compare stock prices sensibly using the Price-to-Earnings ratio.",
    explanation: "A share price alone tells you nothing about whether a stock is cheap or expensive. A ₹1,000 share can be cheap, while a ₹20 share can be astronomically expensive! The Price-to-Earnings (P/E) ratio compares the price per share to the company's annual profit per share (EPS).",
    analogy: "If Store A costs ₹100 and makes ₹10 profit/year, P/E = 10. If Store B costs ₹100 and makes only ₹1 profit/year, P/E = 100. Store A pays for itself in 10 years; Store B takes 100 years!",
    practicalExample: "Company XYZ trades at ₹300 per share and earned ₹15 profit per share this year. P/E = 300 / 15 = 20x. You are paying ₹20 for every ₹1 of profit XYZ earns.",
    quiz: {
      question: "Company A trades at ₹500 with EPS of ₹50. Company B trades at ₹50 with EPS of ₹1. Which is trading at a lower valuation multiple (P/E)?",
      options: [
        "Company B is cheaper because ₹50 is less than ₹500",
        "Company A is cheaper because its P/E is 10x, whereas Company B's P/E is 50x",
        "Both have identical valuations",
        "Share price is the only metric that matters"
      ],
      correctIndex: 1,
      explanation: "Company A: 500 / 50 = 10x P/E. Company B: 50 / 1 = 50x P/E. Company A offers 5 times more earnings per rupee invested despite having a higher nominal share price!",
    },
  },
  {
    id: "l3_roe_and_debt",
    level: 3,
    levelTitle: "Level 3 — Understanding Valuation",
    title: "Return on Equity (ROE) & Debt-to-Equity Safety",
    durationMinutes: 5,
    summary: "How to spot high-quality businesses that generate strong returns without dangerous debt.",
    explanation: "Return on Equity (ROE) measures how many rupees of net profit a company generates for every ₹100 of shareholder capital. Debt-to-Equity (D/E) measures how much borrowed bank debt the company carries compared to its net worth.",
    analogy: "If a contractor builds a house using their own savings and earns 25% profit with zero bank loans, they are financially resilient. If they borrow 95% from loan sharks, a minor delay bankrupts them.",
    practicalExample: "A great IT company like TCS has ROE > 35% and Debt/Equity of ~0.02 (virtually debt-free). It generates huge cash without relying on bank loans.",
    quiz: {
      question: "Which of the following company profiles is generally the safest for a conservative long-term investor?",
      options: [
        "ROE of 5%, Debt-to-Equity of 4.5",
        "ROE of 22%, Debt-to-Equity of 0.15",
        "ROE of -10%, Debt-to-Equity of 2.0",
        "Debt is always good regardless of company earnings"
      ],
      correctIndex: 1,
      explanation: "An ROE of 22% indicates strong business profitability, and a D/E of 0.15 means the company operates with very low financial stress from interest payments.",
    },
  },

  // LEVEL 4: Portfolio Management
  {
    id: "l4_diversification_principles",
    level: 4,
    levelTitle: "Level 4 — Portfolio Management",
    title: "Diversification: The Only Free Lunch in Finance",
    durationMinutes: 5,
    summary: "Why putting your eggs in different baskets lowers risk without necessarily sacrificing long-term returns.",
    explanation: "Diversification means allocating your money across different sectors (IT, Banking, Pharma, Manufacturing) and different asset classes (Equities, Debt, Gold). When one sector experiences a cyclical slump, other sectors often hold steady or rise.",
    analogy: "An umbrella seller who also sells sunglasses. On rainy days, umbrellas sell out. On sunny days, sunglasses sell out. Business cash flow remains steady in all weather conditions.",
    practicalExample: "If 100% of your money was in Banking stocks in 2020 during the banking moratorium, your portfolio took a direct hit. If you also owned IT and Pharma stocks, their rapid growth cushioned the blow.",
    quiz: {
      question: "If an investor owns shares in TCS, Infosys, Wipro, HCL Tech, and Tech Mahindra, are they well diversified?",
      options: [
        "Yes, because they own 5 different famous companies",
        "No, because 100% of their money is concentrated in a single sector (Information Technology)",
        "Yes, owning more than 3 stocks is all the diversification anyone needs",
        "Technology stocks never drop"
      ],
      correctIndex: 1,
      explanation: "All 5 companies belong to the IT services sector! A slowdown in US tech spending affects all 5 simultaneously. True diversification spans multiple independent sectors and asset classes.",
    },
  },
];
