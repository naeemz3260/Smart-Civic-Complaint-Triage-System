from typing import Dict, Any

class NotificationService:
    @staticmethod
    def send_resident_update(tracking_code: str, status: str, message: str) -> Dict[str, Any]:
        """
        Simulates SMS/WhatsApp notification dispatch to citizens.
        """
        return {
            "tracking_code": tracking_code,
            "status": status,
            "channel": "SMS / WhatsApp",
            "delivered": True,
            "message": f"Civic Update [{tracking_code}]: {message}"
        }
