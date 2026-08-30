from io import BytesIO
from pathlib import Path


def extract_resume_text(filename: str, content: bytes) -> str:
    extension = Path(filename).suffix.lower()
    if extension in {".txt", ".md", ".csv"}:
        return content.decode("utf-8", errors="replace")
    if extension == ".pdf":
        return _extract_pdf(content)
    if extension == ".docx":
        return _extract_docx(content)
    raise ValueError("Unsupported file type. Upload a PDF, DOCX, TXT, MD, or CSV resume.")


def _extract_pdf(content: bytes) -> str:
    from pypdf import PdfReader

    try:
        reader = PdfReader(BytesIO(content))
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    except Exception as error:
        raise ValueError(f"Could not read PDF resume: {error}") from error


def _extract_docx(content: bytes) -> str:
    from docx import Document

    try:
        document = Document(BytesIO(content))
        return "\n".join(paragraph.text for paragraph in document.paragraphs)
    except Exception as error:
        raise ValueError(f"Could not read DOCX resume: {error}") from error