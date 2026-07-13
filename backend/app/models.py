from app.extensions import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


class Organization(db.Model):
    __tablename__ = "organizations"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    org_type = db.Column(db.String(50))  # Hotel, School, College, Hospital, Office, etc.
    address = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    users = db.relationship("User", backref="organization", lazy=True)
    visitors = db.relationship("Visitor", backref="organization", lazy=True)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    organization_id = db.Column(db.Integer, db.ForeignKey("organizations.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Visitor(db.Model):
    __tablename__ = "visitors"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    mobile_number = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120))
    address = db.Column(db.String(255))
    photo_url = db.Column(db.String(255))
    id_type = db.Column(db.String(50))
    id_number = db.Column(db.String(50))
    organization_id = db.Column(db.Integer, db.ForeignKey("organizations.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    visits = db.relationship("Visit", backref="visitor", lazy=True)


class Visit(db.Model):
    __tablename__ = "visits"

    id = db.Column(db.Integer, primary_key=True)
    visitor_id = db.Column(db.Integer, db.ForeignKey("visitors.id"), nullable=False)
    purpose = db.Column(db.String(255))
    department = db.Column(db.String(100))
    host_person = db.Column(db.String(100))
    check_in_time = db.Column(db.DateTime, default=datetime.utcnow)
    check_out_time = db.Column(db.DateTime, nullable=True)
    registered_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)