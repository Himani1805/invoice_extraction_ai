import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

# Explicitly load the .env file from the backend directory
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Invoice Extraction AI"
    
    # Database & Storage
    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")
    
    # AI
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY")

    model_config = SettingsConfigDict(case_sensitive=True)

settings = Settings()