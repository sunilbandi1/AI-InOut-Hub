import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-later")

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "mysql+pymysql://root:password@mysql:3306/inouthub_db"
)

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-dev-secret")