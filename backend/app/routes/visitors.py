from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Visitor, Visit
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.utils.decorators import role_required
from datetime import datetime

visitors_bp = Blueprint("visitors", __name__, url_prefix="/api/visitors")


@visitors_bp.route("/register", methods=["POST"])
@role_required("receptionist", "guard")
def register_visitor():
    data = request.get_json()
    claims = get_jwt()
    organization_id = claims.get("organization_id")

    name = data.get("name")
    mobile_number = data.get("mobile_number")

    if not name or not mobile_number:
        return jsonify({"error": "name and mobile_number are required"}), 400

    visitor = Visitor(
        name=name,
        mobile_number=mobile_number,
        email=data.get("email"),
        address=data.get("address"),
        id_type=data.get("id_type"),
        id_number=data.get("id_number"),
        organization_id=organization_id,
    )
    db.session.add(visitor)
    db.session.flush()

    visit = Visit(
        visitor_id=visitor.id,
        purpose=data.get("purpose"),
        department=data.get("department"),
        host_person=data.get("host_person"),
        registered_by=get_jwt_identity(),
    )
    db.session.add(visit)
    db.session.commit()

    return jsonify({
        "message": "Visitor registered and checked in",
        "visitor_id": visitor.id,
        "visit_id": visit.id
    }), 201


@visitors_bp.route("/checkout/<int:visit_id>", methods=["PUT"])
@jwt_required()
def checkout_visitor(visit_id):
    claims = get_jwt()
    organization_id = claims.get("organization_id")

    visit = (
        Visit.query.join(Visitor)
        .filter(Visit.id == visit_id, Visitor.organization_id == organization_id)
        .first()
    )

    if not visit:
        return jsonify({"error": "Visit not found"}), 404

    if visit.check_out_time:
        return jsonify({"error": "Visitor already checked out"}), 400

    visit.check_out_time = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": "Visitor checked out successfully"}), 200


@visitors_bp.route("/", methods=["GET"])
@jwt_required()
def list_visitors():
    claims = get_jwt()
    organization_id = claims.get("organization_id")

    visits = (
        Visit.query.join(Visitor)
        .filter(Visitor.organization_id == organization_id)
        .order_by(Visit.check_in_time.desc())
        .all()
    )

    result = []
    for v in visits:
        result.append({
            "visit_id": v.id,
            "visitor_id": v.visitor.id,
            "name": v.visitor.name,
            "mobile_number": v.visitor.mobile_number,
            "purpose": v.purpose,
            "department": v.department,
            "host_person": v.host_person,
            "check_in_time": v.check_in_time.isoformat() + "Z" if v.check_in_time else None,
            "check_out_time": v.check_out_time.isoformat() + "Z" if v.check_out_time else None,
            "status": "Inside" if not v.check_out_time else "Checked Out",
        })

    return jsonify(result), 200