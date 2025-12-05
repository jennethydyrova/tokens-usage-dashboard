from typing import List
from .utils import calculate_credits_used, safe_fetch_report

BASE_MODEL_RATE = 40

async def construct_usage_data(messages: List) -> List[dict]:
    usage_data = []

    if not messages:
        return usage_data

    for message in messages:
        if 'report_id' in message and message['report_id']:
            report = await safe_fetch_report(message['report_id'])
            # For simplicity, I skip reports that have no data on the /reports/:id endpoint but 
            # it's not a good approach in production setting because some data will be missed. I think we 
            # should fall back here to calculating tokens based on messages.
            if report is None:
                continue
            usage_data.append({
                "message_id": message["id"],
                "timestamp": message["timestamp"],
                "report_name": report.get("name"),
                "credits_used": report.get("credit_cost"),
            })
        else:
            message_txt = message.get("text", "") 
            credits_used = calculate_credits_used(message_txt, BASE_MODEL_RATE)
            usage_data.append({
                "message_id": message["id"],
                "timestamp": message["timestamp"],
                "credits_used": credits_used,
            })

    return usage_data