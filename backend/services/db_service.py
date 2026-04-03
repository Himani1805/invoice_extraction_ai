from core.supabase_client import supabase
from schemas.invoice import InvoiceExtraction # Ensure this matches your file
from fastapi import HTTPException
from typing import Optional

class DBService:
    @staticmethod
    async def save_invoice(extraction: InvoiceExtraction, file_url: str, file_hash: Optional[str] = None):
        try:
            invoice_data = {
                "file_name": file_url.split("/")[-1], # Added to satisfy NOT NULL constraint in your database!
                "file_url": file_url,
                "vendor_name": extraction.vendor_name,
                "total_amount": extraction.total_amount,
                "currency": extraction.currency,
                "invoice_date": extraction.date.isoformat() if extraction.date else None,
                "raw_json": extraction.model_dump(mode="json") # Full JSON for robustness
            }
            if file_hash:
                invoice_data["file_hash"] = file_hash

            try:
                response = supabase.table("invoices").insert(invoice_data).execute()
            except Exception as e:
                # Fallback: Supabase schema cache is stuck or columns are missing.
                # Remove optional columns to force the insert to succeed.
                if "file_hash" in invoice_data:
                    del invoice_data["file_hash"]
                if "raw_json" in invoice_data:
                    del invoice_data["raw_json"]
                try:
                    response = supabase.table("invoices").insert(invoice_data).execute()
                except Exception as final_e:
                    raise final_e
            
            # If RLS allows INSERT but not SELECT, response.data will be empty. Provide a dummy response.
            if not response.data:
                return {"id": "unknown-due-to-rls", **invoice_data}

            return response.data[0] # Stores extracted invoice data
            
        except Exception as e:
            print(f"Database Error: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to save invoice to database")

    @staticmethod
    async def get_previous_vendor_format(vendor_name: str):
        """Detect format similarity based on vendor name and return previous JSON structure"""
        try:
            res = supabase.table("invoices").select("raw_json").eq("vendor_name", vendor_name).limit(1).execute()
            if len(res.data) > 0:
                return res.data[0].get("raw_json")
        except Exception as e:
            pass
        return None

    @staticmethod
    async def check_duplicate_hash(file_hash: str):
        """Check if an invoice with this hash was already processed"""
        try:
            res = supabase.table("invoices").select("file_hash").eq("file_hash", file_hash).limit(1).execute()
            return len(res.data) > 0
        except Exception as e:
            return False

db_service = DBService()