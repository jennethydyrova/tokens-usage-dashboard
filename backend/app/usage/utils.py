import re
import httpx

BASE_URL = "https://owpublic.blob.core.windows.net/tech-task"

# I would add some retry and timeout logic here as well because it's
# an external endpoint but keeping it as is because of time contstraints.
async def get_current_billing_data():
    url = f"{BASE_URL}/messages/current-period"
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()

async def fetch_report(report_id: int):
    url = f"{BASE_URL}/reports/{report_id}"
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()

# We need this function because some report ids are either invalid
# or do not have data on reports/id endpoint.
async def safe_fetch_report(report_id: int):
    try:
        return await fetch_report(report_id)
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return None
        raise  
    
def calculate_tokens(message: str) -> float:
    # Get only a sequence of letters, plus ' and -
    pattern = r"[-a-zA-Z']+"
    words = re.findall(pattern, message)
    
    total_chars = sum(len(word) for word in words)
    
    # Calculate tokens, we assume 1 token consists of 4 chars
    tokens = total_chars / 4
    return tokens
    
def calculate_credits_used(message: str, BASE_MODEL_RATE: int) -> float:
    tokens = calculate_tokens(message)
    
    # Calculate credits based on the the following formula
    # credits_used = (estimated_count / 100) * base_model_rate
    credits_used = (tokens / 100) * BASE_MODEL_RATE
    credits_used = round(credits_used, 2)
    
    return max(1.00, credits_used)