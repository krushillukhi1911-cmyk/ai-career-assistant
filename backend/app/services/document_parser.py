import io
import fitz  # PyMuPDF
import docx
from app.core.exceptions import BadRequestException


class DocumentParser:
    @staticmethod
    def extract_text_from_pdf(content: bytes) -> str:
        try:
            doc = fitz.open(stream=content, filetype="pdf")
            text_blocks = []
            for page in doc:
                text_blocks.append(page.get_text("text"))
            full_text = "\n".join(text_blocks).strip()
            if not full_text:
                raise BadRequestException("PDF file contains no readable text.")
            return full_text
        except Exception as e:
            if isinstance(e, BadRequestException):
                raise
            raise BadRequestException(f"Failed to extract text from PDF: {str(e)}")

    @staticmethod
    def extract_text_from_docx(content: bytes) -> str:
        try:
            doc = docx.Document(io.BytesIO(content))
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            full_text = "\n".join(paragraphs).strip()
            if not full_text:
                raise BadRequestException("DOCX file contains no readable text.")
            return full_text
        except Exception as e:
            if isinstance(e, BadRequestException):
                raise
            raise BadRequestException(f"Failed to extract text from DOCX: {str(e)}")

    @staticmethod
    def extract_text_from_txt(content: bytes) -> str:
        try:
            return content.decode("utf-8", errors="ignore").strip()
        except Exception as e:
            raise BadRequestException(f"Failed to read TXT file: {str(e)}")

    @classmethod
    def parse_document(cls, filename: str, content: bytes) -> tuple[str, str]:
        """
        Parses document bytes based on file extension.
        Returns tuple of (extracted_text, file_extension).
        """
        ext = filename.lower().split(".")[-1]
        if ext == "pdf":
            return cls.extract_text_from_pdf(content), "pdf"
        elif ext in ["docx", "doc"]:
            return cls.extract_text_from_docx(content), "docx"
        elif ext == "txt":
            return cls.extract_text_from_txt(content), "txt"
        else:
            raise BadRequestException("Unsupported file type. Please upload PDF, DOCX, or TXT.")
