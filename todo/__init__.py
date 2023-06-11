from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    from .routes import todo_bp
    from . import models

    app = Flask(__name__)

    app.config.from_pyfile("../config.py")
    app.register_blueprint(todo_bp)

    db.init_app(app)
    migrate.init_app(app, db)

    return app


app = create_app()
