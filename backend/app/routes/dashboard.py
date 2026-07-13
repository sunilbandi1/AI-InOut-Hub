from flask import Blueprint, jsonify
from app.extensions import db
from app.models import Visit, Visitor
from flask_jwt_extended import jwt_required, get_jwt
from datetime import datetime, timedelta
from sqlalchemy import func

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")


@dashboard_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_stats():
    claims = get_jwt()
    organization_id = claims.get("organization_id")

    today_start = datetime.combine(datetime.utcnow().date(), datetime.min.time())

    visitors_today = (
        Visit.query.join(Visitor)
        .filter(Visitor.organization_id == organization_id, Visit.check_in_time >= today_start)
        .count()
    )
    visitors_inside = (
        Visit.query.join(Visitor)
        .filter(Visitor.organization_id == organization_id, Visit.check_out_time.is_(None))
        .count()
    )
    total_visitors = Visitor.query.filter_by(organization_id=organization_id).count()
    total_visits = Visit.query.join(Visitor).filter(Visitor.organization_id == organization_id).count()

    seven_days_ago = today_start - timedelta(days=6)
    daily_counts = (
        db.session.query(func.date(Visit.check_in_time).label("date"), func.count(Visit.id).label("count"))
        .join(Visitor)
        .filter(Visitor.organization_id == organization_id, Visit.check_in_time >= seven_days_ago)
        .group_by(func.date(Visit.check_in_time))
        .all()
    )

    trend = []
    counts_by_date = {str(row.date): row.count for row in daily_counts}
    for i in range(7):
        day = (seven_days_ago + timedelta(days=i)).date()
        trend.append({"date": str(day), "count": counts_by_date.get(str(day), 0)})

    dept_counts = (
        db.session.query(Visit.department, func.count(Visit.id))
        .join(Visitor)
        .filter(
            Visitor.organization_id == organization_id,
            Visit.department.isnot(None),
            Visit.department != "",
        )
        .group_by(Visit.department)
        .all()
    )
    department_breakdown = [{"department": d or "Unspecified", "count": c} for d, c in dept_counts]

    recent = (
        Visit.query.join(Visitor)
        .filter(Visitor.organization_id == organization_id)
        .order_by(Visit.check_in_time.desc())
        .limit(5)
        .all()
    )
    recent_visitors = [
        {
            "name": v.visitor.name,
            "purpose": v.purpose,
            "check_in_time": v.check_in_time.isoformat() + "Z" if v.check_in_time else None,
            "status": "Inside" if not v.check_out_time else "Checked Out",
        }
        for v in recent
    ]

    return jsonify({
        "visitors_today": visitors_today,
        "visitors_inside": visitors_inside,
        "total_visitors": total_visitors,
        "total_visits": total_visits,
        "trend": trend,
        "department_breakdown": department_breakdown,
        "recent_visitors": recent_visitors,
    }), 200