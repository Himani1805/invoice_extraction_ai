from core.supabase_client import supabase
from fastapi import UploadFile, HTTPException

class StorageService:
    @staticmethod
    async def upload_invoice(file: UploadFile, bucket_name: str = "invoice-files"):
        try:
            # Read file content
            content = await file.read()
            file_path = f"uploads/{file.filename}"

            # Upload to Supabase Storage 
            # Note: Ensure the 'invoice-files' bucket is created in your Supabase dashboard
            response = supabase.storage.from_(bucket_name).upload(
                path=file_path,
                file=content,
                file_options={"content-type": file.content_type}
            )

            # Get the public URL
            public_url = supabase.storage.from_(bucket_name).get_public_url(file_path)

            return {
                "filename": file.filename,
                "file_url": public_url,
                "content_type": file.content_type
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Storage Upload Failed: {str(e)}")

    @staticmethod
    async def upload_invoice_bytes(file_bytes: bytes, filename: str, content_type: str, bucket_name: str = "invoice-files"):
        try:
            file_path = f"uploads/{filename}"

            # Upload to Supabase Storage 
            response = supabase.storage.from_(bucket_name).upload(
                path=file_path,
                file=file_bytes,
                # TESTING ONLY: "upsert": "true" overwrites existing files. Remove for production!
                file_options={"content-type": content_type, "upsert": "true"}
                # file_options={"content-type": content_type}
            )

            # Get the public URL
            public_url = supabase.storage.from_(bucket_name).get_public_url(file_path)

            return {
                "filename": filename,
                "file_url": public_url,
                "content_type": content_type
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Storage Upload Failed: {str(e)}")

storage_service = StorageService()