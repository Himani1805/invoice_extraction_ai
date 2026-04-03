from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date


import datetime

class FileMetadata(BaseModel):
    filename: str
    file_url: str
    content_type: str

class LineItem(BaseModel):
    description: str
    quantity: float
    unit_price: float
    total: float

class InvoiceExtraction(BaseModel):
    vendor_name: Optional[str] = "Unknown Vendor"
    invoice_number: Optional[str] = None
    date: Optional[datetime.date] = None
    total_amount: Optional[float] = 0.0
    currency: Optional[str] = "USD"
    line_items: Optional[List[LineItem]] = Field(default_factory=list)
    confidence_score: Optional[float] = Field(1.0, ge=0, le=1)
    bounding_boxes: Optional[dict] = Field(default_factory=dict)
