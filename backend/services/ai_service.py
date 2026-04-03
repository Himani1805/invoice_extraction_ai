import google.generativeai as genai
import json
import re
from core.config import settings
from schemas.invoice import InvoiceExtraction

class AIService:
    def __init__(self):
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        #  self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def extract_invoice_data(self, file_bytes: bytes, mime_type: str, previous_format: str = None) -> InvoiceExtraction:
        # Improve accuracy by reusing parsing logic/template hints [cite: 29, 30]
        format_hint = f"\nBONUS CONTEXT: We have processed an invoice from this vendor before. Here is the previous structured JSON for reference:\n{previous_format}\nTry to maintain exact structural consistency based on this mapping!" if previous_format else ""
        
        prompt = f"""
        {format_hint}
        Act as an expert OCR and financial data extraction system. 
        Analyze the provided invoice and extract data into a STRICT JSON format.
        
        Rules:
        1. If a field is missing, return null.
        2. Ensure 'total_amount' is a number.
        3. For 'bounding_boxes', extract the bounding box for 'vendor_name' and 'total_amount' as an array [ymin, xmin, ymax, xmax] scaled strictly between 0 and 1000.
        4. Return ONLY the JSON object. No markdown.

        Structure:
        {{
            "vendor_name": "string",
            "invoice_number": "string",
            "date": "YYYY-MM-DD",
            "total_amount": 0.0,
            "currency": "ISO Code",
            "line_items": [{{"description": "", "quantity": 0, "unit_price": 0.0, "total": 0.0}}],
            "confidence_score": 0.0,
            "bounding_boxes": {{
                "vendor_name": [100, 100, 200, 400],
                "total_amount": [500, 600, 550, 800]
            }}
        }}
        """

        try:
            content = [{"mime_type": mime_type, "data": file_bytes}, prompt]
            response = self.model.generate_content(content)
            
            clean_json = re.sub(r'```json|```', '', response.text).strip()
            data = json.loads(clean_json)
            
            return InvoiceExtraction(**data) # Graceful error/validation handling [cite: 14]
            
        except json.JSONDecodeError:
            raise ValueError("Gemini failed to return valid JSON.")
        except Exception as e:
            raise Exception(f"AI Extraction Error: {str(e)}")

ai_service = AIService()