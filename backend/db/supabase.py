from core.supabase_client import supabase
from schemas.invoice_data import InvoiceExtraction
from fastapi import HTTPException

class DBService:
    @staticmethod
    async def save_invoice(extraction: InvoiceExtraction, file_url: str):
        try:
            # Prepare data for insertion
            # We convert the Pydantic model to a dict and extract key fields for columns
            invoice_data = {
                "file_url": file_url,
                "vendor_name": extraction.vendor_name,
                "total_amount": extraction.total_amount,
                "currency": extraction.currency,
                "invoice_date": extraction.date.isoformat() if extraction.date else None,
                "raw_json": extraction.model_dump() # Stores everything for robustness [cite: 12]
            }

            # Insert into Supabase
            response = supabase.table("invoices").insert(invoice_data).execute()
            
            if not response.data:
                raise Exception("No data returned from database insertion")

            return response.data[0] # Return the created record including the UUID [cite: 22]
            
        except Exception as e:
            print(f"Database Error: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to save invoice to database")

db_service = DBService()