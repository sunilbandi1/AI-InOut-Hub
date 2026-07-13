import re
import easyocr

_reader = None


def get_reader():
    global _reader
    if _reader is None:
        _reader = easyocr.Reader(["en"], gpu=False)
    return _reader


AADHAAR_PATTERN = re.compile(r"\b\d{4}\s?\d{4}\s?\d{4}\b")
PAN_PATTERN = re.compile(r"\b[A-Z]{5}[0-9]{4}[A-Z]\b")
DOB_PATTERN = re.compile(r"\b(\d{2}[/-]\d{2}[/-]\d{4})\b")
GENDER_KEYWORDS = ["MALE", "FEMALE"]

SKIP_WORDS = {
    "GOVERNMENT", "OF", "INDIA", "INCOME", "TAX", "DEPARTMENT",
    "PERMANENT", "ACCOUNT", "NUMBER", "CARD", "DOB", "DATE",
    "BIRTH", "MALE", "FEMALE", "SIGNATURE", "AUTHORITY", "UNIQUE",
    "IDENTIFICATION",
}


def guess_name(lines):
    for line in lines:
        cleaned = line.strip()
        if any(ch.isdigit() for ch in cleaned):
            continue
        words = cleaned.split()
        if 2 <= len(words) <= 4 and all(w.isalpha() for w in words):
            if not any(w.upper() in SKIP_WORDS for w in words):
                return cleaned.title()
    return None


def extract_id_details(image_path):
    reader = get_reader()
    lines = reader.readtext(image_path, detail=0)

    full_text = " ".join(lines)
    full_text_no_space = full_text.replace(" ", "")

    id_number = None
    id_type = None

    aadhaar_match = AADHAAR_PATTERN.search(full_text)
    pan_match = PAN_PATTERN.search(full_text_no_space)

    if aadhaar_match:
        id_number = aadhaar_match.group().replace(" ", "")
        id_type = "Aadhaar"
    elif pan_match:
        id_number = pan_match.group()
        id_type = "PAN"

    dob_match = DOB_PATTERN.search(full_text)
    dob = dob_match.group() if dob_match else None

    gender = None
    for word in GENDER_KEYWORDS:
        if word in full_text.upper():
            gender = word.capitalize()
            break

    return {
        "raw_text_lines": lines,
        "name": guess_name(lines),
        "id_type": id_type,
        "id_number": id_number,
        "dob": dob,
        "gender": gender,
    }