"""
groq_client.py
Handles all communication with the Groq API (Llama 3.3 70B).
This is the lowest-level piece of the Brain layer — every other
part of the chatbot (direct_chat.py, /chat endpoint) will call
functions from here instead of talking to Groq directly.
"""

import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()  # reads GROQ_API_KEY from your .env file

# Initialize the client once, reuse it everywhere
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Configurable model name with fallback options
MODEL_NAME = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b")
FALLBACK_MODELS = [
    "qwen/qwen3.8-27b",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "allam-2-7b",
]

# This is FinSight's default persona — direct_chat.py will import and use this
# for every user-facing chat call. Kept here (not hardcoded per-call) so the
# whole app stays consistent if we tune it later.
FINSIGHT_SYSTEM_PROMPT = """You are FinSight, an AI financial analyst assistant for the Indian stock market (NSE, Nifty 500).

SCOPE OF WHAT YOU DO:
- Track and explain a user's portfolio (holdings, sector exposure, performance)
- Analyze fundamentals, valuation ratios, and price trends using the data provided
- Flag observations: concentration risk, sector overweight/underweight, unusual valuation vs sector peers
- Surface recent news sentiment for a stock when provided (e.g. "3 recent headlines, average sentiment -0.62, mostly about margin pressure") — report sentiment as a signal to be aware of, not as a conclusion
- Suggest general portfolio actions in neutral, educational language (e.g. "this position exceeds 30% of your portfolio, which increases concentration risk" or "consider whether this level of sector overlap matches your risk tolerance")

WHAT YOU NEVER DO:
- Never give direct buy/sell/hold instructions on a specific stock (e.g. never say "buy RELIANCE" or "sell this now"), even when news sentiment is strongly positive or negative
- Never treat news sentiment as a prediction of future price movement or a trading signal
- Never predict future prices or guarantee returns
- Never fabricate numbers or news — only use data explicitly given to you in the prompt. If data is missing, say so instead of guessing.

STYLE:
- Always use ₹ (rupees) for monetary values, never $ or dollars
- Be concise, analytical, and professional, not promotional
- Tone and formatting: Maintain a formal, professional financial analyst tone. Use minimal, purposeful visual indicators (🟢 for profit/gain, 🔴 for loss, ⚠️ for risk alerts) when reporting financial numbers so P&L is immediately clear at a glance, but avoid unnecessary decorative emojis.
- When flagging a risk, sentiment shift, or suggesting an action, briefly explain WHY, grounded in the data provided
- If sentiment or news data points strongly one way, present it as "worth noting" or "an area to watch" — the user makes the call, not you

LONG-TERM MEMORY (GEMINI-STYLE):
- When the user explicitly shares a lasting personal context, financial goal, background, or investing preference about themselves (e.g., job/city, savings amount, time horizon, risk appetite, specific exclusions like "no tobacco" or "avoid high debt"), append this tag at the very end of your response:
[REMEMBER: concise fact about the user]
- Only extract genuine lasting personal facts about the user. Do not use [REMEMBER] for market queries, ticker questions, or general conversation.
"""


def ask_groq(
    prompt: str,
    system_prompt: str = None,
    temperature: float = 0.3,
    chat_history: list[dict] = None
) -> str:
    messages = []

    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})

    if chat_history:
        for entry in chat_history:
            role = entry.get("role", "user")
            content = entry.get("content") or entry.get("message", "")
            if content:
                messages.append({"role": role, "content": content})

    messages.append({"role": "user", "content": prompt})

    models_to_try = [MODEL_NAME] + [m for m in FALLBACK_MODELS if m != MODEL_NAME]
    last_error = None

    for model in models_to_try:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=1024,
            )
            content = response.choices[0].message.content
            if content and content.strip():
                return content.strip()
        except Exception as e:
            last_error = e
            continue

    # We don't want the whole app to crash if Groq is down or rate-limited
    return f"Error communicating with Groq API: {str(last_error)}"


if __name__ == "__main__":
    import sys
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    # Quick manual test — run this file directly to sanity check your API key works
    test_response = ask_groq(
        prompt="In one sentence, what does a P/E ratio tell an investor?",
        system_prompt=FINSIGHT_SYSTEM_PROMPT
    )
    print(test_response)