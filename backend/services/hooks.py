from fastapi import APIRouter, Request, HTTPException
from services.email import email_service
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/new-user")
async def new_user_webhook(request: Request):
    try:
        payload = await request.json()
        logger.info(f"Received new user webhook: {payload}")

        if payload.get("type") == "INSERT" and payload.get("table") == "users":
            record = payload.get("record")
            user_email = record.get("email")
            
            if user_email:
                logger.info(f"Sending welcome email to {user_email}")
                email_service.send_welcome_email(user_email=user_email)
                return {"status": "welcome email sent"}
            else:
                logger.warning("No email found in new user webhook payload")
                return {"status": "no email found"}

        return {"status": "payload not relevant"}
    except Exception as e:
        logger.error(f"Error processing new user webhook: {e}")
        raise HTTPException(status_code=500, detail="Error processing webhook")