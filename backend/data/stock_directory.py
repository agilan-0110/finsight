"""
FinSight — Comprehensive NSE Equities Index & Search Directory
Supports searching stocks by company name, popular brand names, products,
ticker symbols, and sectors for Indian equities.
"""

from typing import TypedDict

class StockEntry(TypedDict):
    symbol: str
    name: str
    sector: str
    keywords: str

# Curated high-precision index of premier NSE equities
INDIAN_STOCKS: list[StockEntry] = [
    # --- Tata Group ---
    {"symbol": "TCS", "name": "Tata Consultancy Services Limited", "sector": "Information Technology", "keywords": "tata tcs it consulting software tech services"},
    {"symbol": "TMCV", "name": "Tata Motors Limited (Commercial Vehicles)", "sector": "Automotive", "keywords": "tata motors tatamotors cars commercial vehicles trucks jlr jaguar rover"},
    {"symbol": "TMPV", "name": "Tata Motors Passenger Vehicles Limited", "sector": "Automotive", "keywords": "tata motors passenger vehicles cars ev nexon punch tiago harrier safari"},
    {"symbol": "TATASTEEL", "name": "Tata Steel Limited", "sector": "Metals & Mining", "keywords": "tata steel iron ore mining metal sheets"},
    {"symbol": "TATAPOWER", "name": "Tata Power Company Limited", "sector": "Utilities & Power", "keywords": "tata power electricity renewable solar ev charging wind"},
    {"symbol": "TATACONSUM", "name": "Tata Consumer Products Limited", "sector": "Consumer Goods", "keywords": "tata consumer tea salt coffee starbucks sampann soulfull tetley"},
    {"symbol": "TATACOMM", "name": "Tata Communications Limited", "sector": "Telecommunications", "keywords": "tata comm communications telecom network cloud cybersecurity"},
    {"symbol": "TATAELXSI", "name": "Tata Elxsi Limited", "sector": "Information Technology", "keywords": "tata elxsi design engineering software iot automotive ai"},
    {"symbol": "TATACHEM", "name": "Tata Chemicals Limited", "sector": "Chemicals", "keywords": "tata chemicals soda ash specialty chemicals fertilizers"},
    {"symbol": "TITAN", "name": "Titan Company Limited", "sector": "Consumer Discretionary", "keywords": "tata titan tanishq jewellery watches fastrack zoya mia eyewear"},
    {"symbol": "TRENT", "name": "Trent Limited", "sector": "Retail", "keywords": "tata trent zudio westside star bazaar retail fashion apparel"},
    {"symbol": "VOLTAS", "name": "Voltas Limited", "sector": "Consumer Durables", "keywords": "tata voltas air conditioner ac cooling refrigeration home appliances"},

    # --- Reliance / Ambani ---
    {"symbol": "RELIANCE", "name": "Reliance Industries Limited", "sector": "Conglomerate & Energy", "keywords": "reliance rIL mukesh ambani jio telecommunications digital 5g retail oil chemicals refinery petrol"},
    {"symbol": "JIOFIN", "name": "Jio Financial Services Limited", "sector": "Financial Services", "keywords": "jio financial jfs ambani blackrock lending credit mutual fund fintech"},
    {"symbol": "RPOWER", "name": "Reliance Power Limited", "sector": "Utilities & Power", "keywords": "reliance power anil ambani energy thermal"},
    {"symbol": "RELINFRA", "name": "Reliance Infrastructure Limited", "sector": "Infrastructure", "keywords": "reliance infra anil ambani infrastructure metro defense"},

    # --- Banking & Financial Institutions ---
    {"symbol": "HDFCBANK", "name": "HDFC Bank Limited", "sector": "Banking", "keywords": "hdfc bank banking private finance loans credit cards housing loans mortgage"},
    {"symbol": "HDFCLIFE", "name": "HDFC Life Insurance Limited", "sector": "Insurance", "keywords": "hdfc life insurance term life policy savings pension"},
    {"symbol": "HDFCAMC", "name": "HDFC Asset Management Company", "sector": "Financial Services", "keywords": "hdfc amc mutual funds investment portfolio wealth management"},
    {"symbol": "ICICIBANK", "name": "ICICI Bank Limited", "sector": "Banking", "keywords": "icici bank banking private loans credit cards imobile"},
    {"symbol": "ICICIPRULI", "name": "ICICI Prudential Life Insurance", "sector": "Insurance", "keywords": "icici prudential life insurance policy savings"},
    {"symbol": "ICICIGI", "name": "ICICI Lombard General Insurance", "sector": "Insurance", "keywords": "icici lombard motor insurance health travel car general insurance"},
    {"symbol": "SBIN", "name": "State Bank of India", "sector": "Banking", "keywords": "state bank of india sbi sbin public sector psu bank government yono national"},
    {"symbol": "SBILIFE", "name": "SBI Life Insurance Company", "sector": "Insurance", "keywords": "sbi life insurance policy savings"},
    {"symbol": "SBICARD", "name": "SBI Cards and Payment Services", "sector": "Financial Services", "keywords": "sbi card credit cards payments reward points"},
    {"symbol": "KOTAKBANK", "name": "Kotak Mahindra Bank Limited", "sector": "Banking", "keywords": "kotak mahindra bank uday kotak banking loans wealth management"},
    {"symbol": "AXISBANK", "name": "Axis Bank Limited", "sector": "Banking", "keywords": "axis bank banking loans credit cards burgundy"},
    {"symbol": "INDUSINDBK", "name": "IndusInd Bank Limited", "sector": "Banking", "keywords": "indusind bank banking private vehicle loans commercial"},
    {"symbol": "BANKBARODA", "name": "Bank of Baroda", "sector": "Banking", "keywords": "bank of baroda bob psu bank public sector government bob world"},
    {"symbol": "PNB", "name": "Punjab National Bank", "sector": "Banking", "keywords": "punjab national bank pnb psu public bank"},
    {"symbol": "CANBK", "name": "Canara Bank", "sector": "Banking", "keywords": "canara bank psu public sector government banking"},
    {"symbol": "UNIONBANK", "name": "Union Bank of India", "sector": "Banking", "keywords": "union bank of india psu banking"},
    {"symbol": "IDFCFIRSTB", "name": "IDFC FIRST Bank Limited", "sector": "Banking", "keywords": "idfc first bank v vaidyanathan savings credit cards banking"},
    {"symbol": "FEDERALBNK", "name": "The Federal Bank Limited", "sector": "Banking", "keywords": "federal bank private banking south kerala"},
    {"symbol": "BAJFINANCE", "name": "Bajaj Finance Limited", "sector": "Financial Services", "keywords": "bajaj finance nbfc consumer durable loans emi card lending credit"},
    {"symbol": "BAJAJFINSV", "name": "Bajaj Finserv Limited", "sector": "Financial Services", "keywords": "bajaj finserv holding insurance financial services"},
    {"symbol": "CHOLAFIN", "name": "Cholamandalam Investment & Finance", "sector": "Financial Services", "keywords": "cholamandalam chola finance vehicle finance murugappa group nbfc"},
    {"symbol": "MUTHOOTFIN", "name": "Muthoot Finance Limited", "sector": "Financial Services", "keywords": "muthoot finance gold loans gold lending nbfc"},
    {"symbol": "SHRIRAMFIN", "name": "Shriram Finance Limited", "sector": "Financial Services", "keywords": "shriram finance commercial vehicle loans nbfc"},

    # --- Information Technology ---
    {"symbol": "INFY", "name": "Infosys Limited", "sector": "Information Technology", "keywords": "infosys infy narayana murthy software it tech consulting digital transformation cloud ai finacle"},
    {"symbol": "WIPRO", "name": "Wipro Limited", "sector": "Information Technology", "keywords": "wipro azim premji software it consulting digital technology services"},
    {"symbol": "HCLTECH", "name": "HCL Technologies Limited", "sector": "Information Technology", "keywords": "hcl tech shiv nadar software technology cloud cybersecurity ai"},
    {"symbol": "TECHM", "name": "Tech Mahindra Limited", "sector": "Information Technology", "keywords": "tech mahindra mahindra group software telecom it services cloud ai"},
    {"symbol": "LTIM", "name": "LTIMindtree Limited", "sector": "Information Technology", "keywords": "lti mindtree larsen toubro ltimindtree software it digital"},
    {"symbol": "PERSISTENT", "name": "Persistent Systems Limited", "sector": "Information Technology", "keywords": "persistent systems software cloud product engineering"},
    {"symbol": "COFORGE", "name": "Coforge Limited", "sector": "Information Technology", "keywords": "coforge niit software banking insurance travel it"},
    {"symbol": "LTTS", "name": "L&T Technology Services Limited", "sector": "Information Technology", "keywords": "ltts l&t technology engineering r&d er&d industrial automotive"},
    {"symbol": "MPHASIS", "name": "Mphasis Limited", "sector": "Information Technology", "keywords": "mphasis software cloud banking capital markets it"},
    {"symbol": "KPITTECH", "name": "KPIT Technologies Limited", "sector": "Information Technology", "keywords": "kpit software automotive mobility electric vehicles autonomous driving"},

    # --- Automotive ---
    {"symbol": "MARUTI", "name": "Maruti Suzuki India Limited", "sector": "Automotive", "keywords": "maruti suzuki cars passenger vehicles swift baleno brezza grand vitara dzire"},
    {"symbol": "M&M", "name": "Mahindra & Mahindra Limited", "sector": "Automotive", "keywords": "mahindra m&m suv scorpio thar xuv700 bolero tractors farm equipment ev"},
    {"symbol": "BAJAJ-AUTO", "name": "Bajaj Auto Limited", "sector": "Automotive", "keywords": "bajaj auto pulsar bikes motorcycles 2-wheeler chetak ev 3-wheeler auto rickshaw"},
    {"symbol": "HEROMOTOCO", "name": "Hero MotoCorp Limited", "sector": "Automotive", "keywords": "hero motocorp splendor hf deluxe bikes motorcycles 2-wheeler vida ev"},
    {"symbol": "EICHERMOT", "name": "Eicher Motors Limited", "sector": "Automotive", "keywords": "eicher royal enfield bullet classic 350 hunter meteor bikes commercial vehicles vovlo"},
    {"symbol": "TVSMOTOR", "name": "TVS Motor Company Limited", "sector": "Automotive", "keywords": "tvs motor apache jupiter ntorq iqube electric 2-wheeler motorcycles"},
    {"symbol": "ASHOKLEY", "name": "Ashok Leyland Limited", "sector": "Automotive", "keywords": "ashok leyland hinduja trucks buses commercial vehicles dost"},
    {"symbol": "BHARATFORG", "name": "Bharat Forge Limited", "sector": "Automotive & Industrial", "keywords": "bharat forge kalyani forgings automotive defense artillery defense components"},
    {"symbol": "MOTHERSON", "name": "Samvardhana Motherson International", "sector": "Automotive Components", "keywords": "motherson sumi wiring harnesses automotive mirrors components"},

    # --- Consumer FMCG & Retail ---
    {"symbol": "ITC", "name": "ITC Limited", "sector": "FMCG", "keywords": "itc cigarettes tobacco aashirvaad atta sunfeast bingo yippee noodles classmate hotels paper paperboards agri"},
    {"symbol": "HINDUNILVR", "name": "Hindustan Unilever Limited", "sector": "FMCG", "keywords": "hul hindustan unilever soap detergent surf excel rin lux dove lifebuoy horlicks boost clinic plus sunsilk fair lovely pond's kwality walls tea bru"},
    {"symbol": "NESTLEIND", "name": "Nestle India Limited", "sector": "FMCG", "keywords": "nestle maggi noodles kitkat nescafe milkmaid cerelac baby food dairy confectionary"},
    {"symbol": "BRITANNIA", "name": "Britannia Industries Limited", "sector": "FMCG", "keywords": "britannia good day biscuits marie gold bourbon bread cheese dairy cakes rusk"},
    {"symbol": "DABUR", "name": "Dabur India Limited", "sector": "FMCG", "keywords": "dabur chyawanprash real juice vatika amla hair oil honey ayurveda ayurvedic"},
    {"symbol": "MARICO", "name": "Marico Limited", "sector": "FMCG", "keywords": "marico parachute coconut oil saffola cooking oil edible oil beardo personal care"},
    {"symbol": "GODREJCP", "name": "Godrej Consumer Products Limited", "sector": "FMCG", "keywords": "godrej consumer goodknight hit mosquito repellent cinthol godrej no 1 hair color"},
    {"symbol": "COLPAL", "name": "Colgate-Palmolive (India) Limited", "sector": "FMCG", "keywords": "colgate palmolive toothpaste oral care toothbrush vedshakti"},
    {"symbol": "VBL", "name": "Varun Beverages Limited", "sector": "Beverages", "keywords": "varun beverages vbl pepsi mirinda mountain dew sting 7up tropicana aquafina bottler"},
    {"symbol": "DMART", "name": "Avenue Supermarts Limited (DMart)", "sector": "Retail", "keywords": "dmart avenue supermarts radhakishan damani grocery supermarket retail discount store"},

    # --- New-Age Tech & Internet Platforms ---
    {"symbol": "ZOMATO", "name": "Zomato Limited", "sector": "Internet & Delivery", "keywords": "zomato blinkit food delivery quick commerce grocery dining restaurant ordering deepinder goyal"},
    {"symbol": "SWIGGY", "name": "Swiggy Limited", "sector": "Internet & Delivery", "keywords": "swiggy instamart food delivery quick commerce grocery dineout"},
    {"symbol": "PAYTM", "name": "One97 Communications Limited (Paytm)", "sector": "Fintech & Payments", "keywords": "paytm one97 upi payments soundbox pos wallet vijay shekhar sharma fintech"},
    {"symbol": "NYKAA", "name": "FSN E-Commerce Ventures Limited (Nykaa)", "sector": "E-Commerce & Retail", "keywords": "nykaa fsn beauty cosmetics fashion makeup personal care falguni nayar"},
    {"symbol": "POLICYBZR", "name": "PB Fintech Limited (Policybazaar)", "sector": "Fintech & Insurance", "keywords": "policybazaar paisabazaar pb fintech insurance loans comparison"},
    {"symbol": "NAUKRI", "name": "Info Edge (India) Limited", "sector": "Internet Platforms", "keywords": "naukri info edge 99acres jeevansathi shiksha recruitment real estate matrimonial"},
    {"symbol": "DELHIVERY", "name": "Delhivery Limited", "sector": "Logistics & Supply Chain", "keywords": "delhivery courier express parcel logistics ecommerce delivery freight"},

    # --- Telecom & Media ---
    {"symbol": "BHARTIARTL", "name": "Bharti Airtel Limited", "sector": "Telecommunications", "keywords": "airtel bharti sunil mittal telecom 5g mobile network broadband dth data"},
    {"symbol": "IDEA", "name": "Vodafone Idea Limited", "sector": "Telecommunications", "keywords": "vi vodafone idea telecom cellular mobile 4g"},
    {"symbol": "ZEEL", "name": "Zee Entertainment Enterprises", "sector": "Media & Entertainment", "keywords": "zee zeel television zee5 broadcast entertainment movies"},
    {"symbol": "PVRINOX", "name": "PVR INOX Limited", "sector": "Entertainment & Cinema", "keywords": "pvr inox cinema movies theatre multiplex popcorn tickets"},

    # --- Energy, Oil & Power ---
    {"symbol": "ONGC", "name": "Oil & Natural Gas Corporation", "sector": "Oil & Gas", "keywords": "ongc oil natural gas exploration psu crude petroleum"},
    {"symbol": "NTPC", "name": "NTPC Limited", "sector": "Utilities & Power", "keywords": "ntpc national thermal power corporation electricity psu coal solar green"},
    {"symbol": "POWERGRID", "name": "Power Grid Corporation of India", "sector": "Utilities & Power", "keywords": "powergrid power grid electricity transmission psu grid infrastructure"},
    {"symbol": "BPCL", "name": "Bharat Petroleum Corporation", "sector": "Oil & Gas", "keywords": "bpcl bharat petroleum petrol pump fuel refinery diesel lpg bharatgas"},
    {"symbol": "IOC", "name": "Indian Oil Corporation", "sector": "Oil & Gas", "keywords": "ioc iocl indian oil petrol pump fuel refinery diesel indane lpg"},
    {"symbol": "COALINDIA", "name": "Coal India Limited", "sector": "Mining & Energy", "keywords": "coal india cil mining coal psu thermal energy"},
    {"symbol": "GAIL", "name": "GAIL (India) Limited", "sector": "Gas Utility", "keywords": "gail gas authority natural gas pipeline lpg city gas psu"},
    {"symbol": "NHPC", "name": "NHPC Limited", "sector": "Utilities & Power", "keywords": "nhpc hydro power hydroelectric green energy renewable psu"},

    # --- Adani Group ---
    {"symbol": "ADANIENT", "name": "Adani Enterprises Limited", "sector": "Conglomerate", "keywords": "adani enterprises gautam adani airports solar manufacturing defense mining roads"},
    {"symbol": "ADANIPORTS", "name": "Adani Ports and Special Economic Zone", "sector": "Infrastructure & Logistics", "keywords": "adani ports mundra port logistics shipping maritime cargo"},
    {"symbol": "ADANIGREEN", "name": "Adani Green Energy Limited", "sector": "Renewable Energy", "keywords": "adani green renewable solar wind clean energy khavda"},
    {"symbol": "ADANIPOWER", "name": "Adani Power Limited", "sector": "Utilities & Power", "keywords": "adani power thermal electricity power plants"},
    {"symbol": "ATGL", "name": "Adani Total Gas Limited", "sector": "Gas Utility", "keywords": "adani total gas cng piped natural gas png city gas"},
    {"symbol": "ADANIENSOL", "name": "Adani Energy Solutions Limited", "sector": "Utilities & Power", "keywords": "adani energy solutions transmission power distribution mumbai electricity smart meter"},
    {"symbol": "AMBUJACEM", "name": "Ambuja Cements Limited", "sector": "Cement & Building Materials", "keywords": "adani ambuja cement concrete construction building materials"},
    {"symbol": "ACC", "name": "ACC Limited", "sector": "Cement & Building Materials", "keywords": "adani acc cement concrete building materials construction"},

    # --- Pharmaceuticals & Healthcare ---
    {"symbol": "SUNPHARMA", "name": "Sun Pharmaceutical Industries", "sector": "Pharmaceuticals", "keywords": "sun pharma dilip shanghvi generic drugs medicine specialty dermatological healthcare"},
    {"symbol": "DRREDDY", "name": "Dr. Reddy's Laboratories Limited", "sector": "Pharmaceuticals", "keywords": "dr reddy dr reddys generic medicines pharma api biosimilars"},
    {"symbol": "CIPLA", "name": "Cipla Limited", "sector": "Pharmaceuticals", "keywords": "cipla inhalers asthma respiratory generic medicine generic drugs healthcare"},
    {"symbol": "DIVISLAB", "name": "Divi's Laboratories Limited", "sector": "Pharmaceuticals & APIs", "keywords": "divis divi labs active pharmaceutical ingredients api contract manufacturing cdmo"},
    {"symbol": "APOLLOHOSP", "name": "Apollo Hospitals Enterprise", "sector": "Healthcare Services", "keywords": "apollo hospitals clinics pharmacy apollo 247 healthcare diagnostics doctors"},
    {"symbol": "LUPIN", "name": "Lupin Limited", "sector": "Pharmaceuticals", "keywords": "lupin generic medicines cardiovascular respiratory diabetes pharma"},
    {"symbol": "TORNTPHARM", "name": "Torrent Pharmaceuticals Limited", "sector": "Pharmaceuticals", "keywords": "torrent pharma medicine cardiovascular cns gastrointestinal"},
    {"symbol": "ZYDUSLIFE", "name": "Zydus Lifesciences Limited", "sector": "Pharmaceuticals", "keywords": "zydus cadila healthcare vaccines generic formulations"},
    {"symbol": "MANKIND", "name": "Mankind Pharma Limited", "sector": "Pharmaceuticals", "keywords": "mankind pharma manforce presto gaso mankind medicine consumer healthcare"},
    {"symbol": "MAXHEALTH", "name": "Max Healthcare Institute Limited", "sector": "Healthcare Services", "keywords": "max healthcare max hospitals medical care tertiary care"},

    # --- Metals, Mining & Materials ---
    {"symbol": "JSWSTEEL", "name": "JSW Steel Limited", "sector": "Metals & Mining", "keywords": "jsw steel sajjan jindal steel sheets coils coated steel"},
    {"symbol": "HINDALCO", "name": "Hindalco Industries Limited", "sector": "Metals & Mining", "keywords": "hindalco aditya birla group aluminum copper novelis rolled aluminum"},
    {"symbol": "VEDL", "name": "Vedanta Limited", "sector": "Metals & Mining", "keywords": "vedanta anil agarwal zinc oil aluminium iron ore copper sterlite"},
    {"symbol": "JINDALSTEL", "name": "Jindal Steel & Power Limited", "sector": "Metals & Mining", "keywords": "jindal steel jspl naveen jindal steel rails power"},
    {"symbol": "NMDC", "name": "NMDC Limited", "sector": "Mining", "keywords": "nmdc iron ore mining psu public sector national mineral"},
    {"symbol": "SAIL", "name": "Steel Authority of India Limited", "sector": "Metals & Mining", "keywords": "sail steel authority public sector psu bhilai rourkela bokaro"},
    {"symbol": "NATIONALUM", "name": "National Aluminium Company (NALCO)", "sector": "Metals & Mining", "keywords": "nalco national aluminium bauxite alumina psu"},

    # --- Infrastructure, Capital Goods & Defense ---
    {"symbol": "LT", "name": "Larsen & Toubro Limited", "sector": "Construction & Engineering", "keywords": "l&t larsen toubro infrastructure engineering construction defense bridges metro epc"},
    {"symbol": "HAL", "name": "Hindustan Aeronautics Limited", "sector": "Aerospace & Defense", "keywords": "hal fighter jets tejas helicopters defense aircraft psu aerospace"},
    {"symbol": "BEL", "name": "Bharat Electronics Limited", "sector": "Defense Electronics", "keywords": "bel radar avionics defense electronics evm electronic voting machines psu"},
    {"symbol": "BHEL", "name": "Bharat Heavy Electricals Limited", "sector": "Capital Goods", "keywords": "bhel turbines boilers power equipment psu heavy engineering"},
    {"symbol": "SIEMENS", "name": "Siemens Limited", "sector": "Industrial Engineering", "keywords": "siemens automation energy digital industry trains mobility electrification"},
    {"symbol": "ABB", "name": "ABB India Limited", "sector": "Industrial Engineering", "keywords": "abb robotics automation electrification motors drives"},
    {"symbol": "MAZDOCK", "name": "Mazagon Dock Shipbuilders Limited", "sector": "Defense Shipbuilding", "keywords": "mazagon dock warships submarines destroyers defense naval psu"},
    {"symbol": "RVNL", "name": "Rail Vikas Nigam Limited", "sector": "Railways & Infrastructure", "keywords": "rvnl railway tracks infrastructure vande bharat psu railway projects"},
    {"symbol": "IRFC", "name": "Indian Railway Finance Corporation", "sector": "Financial Services", "keywords": "irfc railway financing rolling stock leasing psu"},
    {"symbol": "IRCTC", "name": "Indian Railway Catering and Tourism", "sector": "Travel & Tourism", "keywords": "irctc train tickets booking catering food rail neer tourism"},

    # --- Cement, Paints & Chemicals ---
    {"symbol": "ULTRACEMCO", "name": "UltraTech Cement Limited", "sector": "Cement & Building Materials", "keywords": "ultratech cement aditya birla group concrete rmc construction building"},
    {"symbol": "GRASIM", "name": "Grasim Industries Limited", "sector": "Materials & Textiles", "keywords": "grasim viscose staple fibre birla opus paints chemicals caustic soda"},
    {"symbol": "ASIANPAINT", "name": "Asian Paints Limited", "sector": "Paints & Decor", "keywords": "asian paints wall paint royale apcolite home decor waterproofing berger"},
    {"symbol": "BERGEPAINT", "name": "Berger Paints India Limited", "sector": "Paints & Decor", "keywords": "berger paints wall coatings waterproofing paints"},
    {"symbol": "PIDILITIND", "name": "Pidilite Industries Limited", "sector": "Chemicals & Adhesives", "keywords": "pidilite fevicol m-seal dr fixit fevikwik adhesives sealants waterproofing"},
    {"symbol": "HAVELLS", "name": "Havells India Limited", "sector": "Consumer Electricals", "keywords": "havells lloyd fans cables wires switches lighting appliances"},
    {"symbol": "POLYCAB", "name": "Polycab India Limited", "sector": "Electricals & Cables", "keywords": "polycab wires cables fmege fans switchgear"},

    # --- Real Estate ---
    {"symbol": "DLF", "name": "DLF Limited", "sector": "Real Estate", "keywords": "dlf residential luxury homes commercial offices malls cybercity gurgaon real estate"},
    {"symbol": "GODREJPROP", "name": "Godrej Properties Limited", "sector": "Real Estate", "keywords": "godrej properties residential flats apartments real estate housing"},
    {"symbol": "LODHA", "name": "Macrotech Developers (Lodha)", "sector": "Real Estate", "keywords": "lodha macrotech luxury apartments residential commercial palava real estate"},
    {"symbol": "OBEROIRLTY", "name": "Oberoi Realty Limited", "sector": "Real Estate", "keywords": "oberoi realty luxury residential mumbai commercial malls real estate"},
]


def search_local_stocks(query: str, limit: int = 8) -> list[dict]:
    """
    Fast local matching against the curated Indian equities index.
    Matches against symbols, company names, brands, and keywords.
    """
    q = query.lower().strip()
    if not q:
        return []

    tokens = q.split()
    matches = []

    for entry in INDIAN_STOCKS:
        sym = entry["symbol"].lower()
        name = entry["name"].lower()
        kw = entry["keywords"].lower()
        combined = f"{sym} {name} {kw}"

        # Match scoring
        score = 0
        if sym == q:
            score = 100  # Exact ticker match
        elif sym.startswith(q):
            score = 85   # Ticker prefix
        elif name.lower().startswith(q):
            score = 75   # Name prefix
        elif all(token in name.lower() for token in tokens):
            score = 65   # All query words in company name
        elif all(token in combined for token in tokens):
            score = 50   # All query words in combined text
        elif len(tokens) == 1 and any(tokens[0] in word for word in combined.split()):
            score = 25   # Single token partial match

        if score > 0:
            matches.append((score, {
                "symbol": entry["symbol"],
                "name": entry["name"],
                "sector": entry["sector"],
                "exchange": "NSE"
            }))

    # Sort descending by relevance score
    matches.sort(key=lambda x: x[0], reverse=True)
    return [item[1] for item in matches[:limit]]


SYMBOL_ALIASES = {
    "TATAMOTORS": "TMCV",
    "TATA MOTORS": "TMCV",
    "TATA MOTOR": "TMCV",
    "HDFC": "HDFCBANK",
    "SBI": "SBIN",
    "AIRTEL": "BHARTIARTL",
    "L&T": "LT",
    "LARSEN": "LT",
    "M&M": "M&M",
    "MAHINDRA": "M&M",
}


def resolve_symbol_or_name(query: str) -> str | None:
    """
    Given a query (which may be a ticker, alias, or common company name like 'Tata Motors'),
    returns the cleanest NSE symbol, or None if unresolved.
    """
    clean = query.strip().upper().replace(".NS", "")
    if clean in SYMBOL_ALIASES:
        return SYMBOL_ALIASES[clean]

    # If it's already a recognized symbol in our directory
    for item in INDIAN_STOCKS:
        if item["symbol"] == clean:
            return clean

    # Otherwise run local matching
    results = search_local_stocks(query, limit=1)
    if results:
        return results[0]["symbol"]

    return None
