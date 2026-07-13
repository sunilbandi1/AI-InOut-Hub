import os
import uuid
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.utils.ocr_helper import extract_id_details

ocr_bp = Blueprint("ocr", __name__, url_prefix="/api/ocr")

UPLOAD_FOLDER = "temp_uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@ocr_bp.route("/scan", methods=["POST"])
@jwt_required()
def scan_id():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "" or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file. Use png, jpg, or jpeg"}), 400

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    temp_filename = f"{uuid.uuid4().hex}_{file.filename}"
    temp_path = os.path.join(UPLOAD_FOLDER, temp_filename)
    file.save(temp_path)

    try:
        result = extract_id_details(temp_path)
    except Exception as e:
        return jsonify({"error": f"OCR processing failed: {str(e)}"}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return jsonify(result), 200