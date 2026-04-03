import hashlib
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.storage_service import storage_service
from services.ai_service import ai_service
from services.db_service import db_service
from schemas.invoice import FileMetadata, InvoiceExtraction

router = APIRouter()

@router.post("/upload")
async def upload_and_process_invoice(file: UploadFile = File(...)):
    # 1. Validation: Ensure format is accepted
    if file.content_type not in ["image/jpeg", "image/png", "application/pdf"]:
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Only JPG, PNG, and PDF are allowed."
        )

    # 2. Read bytes once to avoid "Consumed Stream" errors
    file_bytes = await file.read()

    # 3. BONUS: Detect Duplicate Invoices 
    # Generate a hash of the file to check if it has been uploaded before
    file_hash = hashlib.md5(file_bytes).hexdigest()
    is_duplicate = await db_service.check_duplicate_hash(file_hash)
    if is_duplicate:
        raise HTTPException(
            status_code=409, 
            detail="Duplicate invoice detected. This file has already been processed."
        )

    # 4. Upload to Supabase Storage
    try:
        storage_result = await storage_service.upload_invoice_bytes(
            file_bytes, file.filename, file.content_type
        )
        file_url = storage_result["file_url"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Storage failure: {str(e)}")

    # 5. AI Extraction & Format Detection
    try:
        # Format Detection WOW Factor:
        # We try to infer the vendor from the filename (common in enterprise).
        # If we find a matching vendor in our DB, we retrieve their previous JSON mapping
        # and provide it as Few-Shot Context to the LLM for guaranteed structural accuracy!
        inferred_vendor = file.filename.split("_")[0].split("-")[0].split()[0]
        previous_format = await db_service.get_previous_vendor_format(inferred_vendor)
        
        # Extract core info using the format context if available
        final_extraction = await ai_service.extract_invoice_data(
            file_bytes, file.content_type, previous_format=previous_format
        )
        
        # Determine if we used a known format or if this is entirely new
        is_known = previous_format is not None

        # 6. Persist to Database
        db_record = await db_service.save_invoice(final_extraction, file_url, file_hash)
        
        return {
            "db_id": db_record.get("id"),
            "file_info": storage_result,
            "extraction": final_extraction,
            "format_detected": is_known,
            "status": "Success"
        }

    except Exception as e:
        # Graceful error handling for processing failures
        return {
            "file_info": storage_result,
            "extraction_error": str(e),
            "status": "Partially Successful (Upload OK, Processing Failed)"
        }