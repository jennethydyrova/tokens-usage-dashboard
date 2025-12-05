from typing import Any, Dict, List, Optional

from pydantic import BaseModel
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from .usage import construct_usage_data, get_current_billing_data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This endpoint would need to be properly typed with Pydantic models but
# I am running out of time, so leaving it as is.
@app.get("/usage")
async def calculate_usage() -> Dict[str, Any]:
    billing = await get_current_billing_data()
    usage = await construct_usage_data(billing.get("messages", []))

    return {"usage": usage, "status": status.HTTP_200_OK}