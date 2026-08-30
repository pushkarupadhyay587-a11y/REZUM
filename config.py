import os

from dotenv import load_dotenv


load_dotenv()


class Settings:
    google_api_key: str = os.getenv("GOOGLE_API_KEY", "").strip().strip('"').strip("'")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-3-flash-preview")
    max_resume_chars: int = int(os.getenv("MAX_RESUME_CHARS", "30000"))


settings = Settings()