from core.supabase_client import supabase
from fastapi import HTTPException

class AnalyticsService:
    @staticmethod
    async def get_dashboard_stats():
        try:
            # 1. Total count of processed invoices
            count_res = supabase.table("invoices").select("*", count="exact").execute()
            total_invoices = count_res.count if count_res.count else 0

            # 2. Total spend by vendor
            vendor_res = supabase.table("invoices").select("vendor_name, total_amount").execute()
            vendor_stats = {}
            for row in vendor_res.data:
                v = row['vendor_name'] or "Unknown"
                vendor_stats[v] = vendor_stats.get(v, 0.0) + float(row['total_amount'] or 0.0)

            # 3. Currency-wise totals
            currency_res = supabase.table("invoices").select("currency, total_amount").execute()
            currency_stats = {}
            for row in currency_res.data:
                c = row['currency'] or "USD"
                currency_stats[c] = currency_stats.get(c, 0.0) + float(row['total_amount'] or 0.0)

            # 4. Monthly spend trends
            trend_res = supabase.table("invoices").select("invoice_date, total_amount").execute()
            monthly_trends = {}
            for row in trend_res.data:
                if row['invoice_date']:
                    month_key = row['invoice_date'][:7] # YYYY-MM
                    monthly_trends[month_key] = monthly_trends.get(month_key, 0.0) + float(row['total_amount'] or 0.0)

            return {
                "total_processed": total_invoices,
                "spend_by_vendor": vendor_stats,
                "currency_totals": currency_stats,
                "monthly_trends": monthly_trends
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Analytics Error: {str(e)}")

analytics_service = AnalyticsService()