from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import User, Organization
from flask_jwt_extended import create_access_token, get_jwt
from app.utils.decorators import role_required

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register-organization", methods=["POST"])
def register_organization():
    data = request.get_json()

    org_name = data.get("organization_name")
    org_type = data.get("organization_type")
    admin_name = data.get("admin_name")
    email = data.get("email")
    password = data.get("password")

    if not org_name or not admin_name or not email or not password:
        return jsonify({"error": "organization_name, admin_name, email, and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    org = Organization(name=org_name, org_type=org_type)
    db.session.add(org)
    db.session.flush()  # gets org.id before commit

    admin = User(name=admin_name, email=email, role="admin", organization_id=org.id)
    admin.set_password(password)
    db.session.add(admin)
    db.session.commit()

    return jsonify({"message": "Organization and admin account created successfully"}), 201


@auth_bp.route("/register", methods=["POST"])
@role_required("admin")
def register():
    data = request.get_json()
    claims = get_jwt()
    organization_id = claims.get("organization_id")

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "receptionist")

    if role not in ("admin", "receptionist", "guard"):
        return jsonify({"error": "Invalid role"}), 400

    if not name or not email or not password:
        return jsonify({"error": "name, email, and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    user = User(name=name, email=email, role=role, organization_id=organization_id)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "role": user.role,
            "name": user.name,
            "organization_id": user.organization_id,
        },
    )

    return jsonify({
        "access_token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "organization_id": user.organization_id,
            "organization_name": user.organization.name if user.organization else None,
        }
    }), 200