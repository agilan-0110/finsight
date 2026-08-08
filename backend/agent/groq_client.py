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

MODEL_NAME = "llama-3.3-70b-versatile"


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
- Be concise and analytical, not promotional
- When flagging a risk, sentiment shift, or suggesting an action, briefly explain WHY, grounded in the data provided
- If sentiment or news data points strongly one way, present it as "worth noting" or "an area to watch" — the user makes the call, not you
"""


def ask_groq(prompt: str, system_prompt: str = None, temperature: float = 0.3) -> str:
    """
    Send a prompt to Groq's Llama 3.3 70B model and return the text response.

    Args:
        prompt: The user's question or the message to send to the model.
        system_prompt: Optional instructions that set the model's behavior
                        (e.g. "You are a financial analyst, not an advisor").
        temperature: Controls randomness. Lower = more focused/factual,
                     which is what we want for a finance assistant.

    Returns:
        The model's text response as a string.
    """
    messages = []

    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})

    messages.append({"role": "user", "content": prompt})

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,
            temperature=temperature,
            max_tokens=1024,
        )
        return response.choices[0].message.content

    except Exception as e:
        # We don't want the whole app to crash if Groq is down or rate-limited
        return f"Error communicating with Groq API: {str(e)}"


if __name__ == "__main__":
    # Quick manual test — run this file directly to sanity check your API key works
    test_response = ask_groq(
        prompt="In one sentence, what does a P/E ratio tell an investor?",
        system_prompt=FINSIGHT_SYSTEM_PROMPT
    )
    print(test_response)