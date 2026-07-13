from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from app.extensions import db, jwt
from app import models  # noqa: F401
from app.routes.auth import auth_bp
from app.routes.visitors import visitors_bp
from app.routes.dashboard import dashboard_bp
from app.routes.ocr import ocr_bp
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    CORS(app)
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(auth_bp)
    app.register_blueprint(visitors_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(ocr_bp)
    return app