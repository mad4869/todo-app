from flask import Blueprint, render_template, redirect, url_for, request, flash, abort
from flask_login import login_required, current_user

from ..extensions import db, login_manager
from ..models import Users, Projects, Todos
from ..forms import *

views_bp = Blueprint("views", __name__)


@login_manager.user_loader
def load_user(user_id):
    user = db.session.execute(
        db.select(Users).filter_by(user_id=user_id)
    ).scalar_one_or_none()
    return user


@login_manager.unauthorized_handler
def unauthorized():
    return abort(401)


@views_bp.route("/welcome", strict_slashes=False)
def welcome_page():
    return render_template("welcome.html")


@views_bp.route("/", strict_slashes=False)
def landing_page():
    if current_user.is_authenticated:
        return redirect(url_for("views.home_page"))

    return render_template("landing.html")


@views_bp.route("/home", strict_slashes=False)
@login_required
def home_page():
    add_todo_form = AddTodoForm()
    add_todo_form.load_choices(current_user.user_id)

    edit_todo_form = EditTodoForm()
    edit_todo_form.load_choices(current_user.user_id)

    add_project_form = AddProjectForm()

    return render_template(
        "index.html",
        add_todo_form=add_todo_form,
        add_project_form=add_project_form,
        edit_todo_form=edit_todo_form,
    )


@views_bp.route("/register", methods=["GET", "POST"], strict_slashes=False)
def register_page():
    form = RegisterForm()

    return render_template("register.html", form=form)


@views_bp.route("/login", methods=["GET", "POST"], strict_slashes=False)
def login_page():
    form = LoginForm()

    return render_template("login.html", form=form)


@views_bp.route("/profile", strict_slashes=False)
@login_required
def profile_page():
    return render_template("profile.html")


@views_bp.route(
    "/projects", methods=["GET", "POST", "PUT", "DELETE"], strict_slashes=False
)
@login_required
def projects_page():
    add_todo_form = AddTodoForm()
    add_todo_form.load_choices(current_user.user_id)

    add_project_form = AddProjectForm()
    edit_project_form = EditProjectForm()

    if request.method == "POST":
        form = request.form
        method = form.get("_method", "").upper()
        if method == "PUT":
            if edit_project_form.validate_on_submit():
                old_project = db.session.execute(
                    db.select(Projects).filter(
                        Projects.project_id == edit_project_form.project_id.data
                    )
                ).scalar_one()
                old_project.title = edit_project_form.title.data
                old_project.description = edit_project_form.description.data

                flash(f"Your project has been updated!", category="success")

                db.session.commit()
                return redirect(url_for("views.projects_page"))

        if add_todo_form.validate_on_submit():
            todo = Todos(
                title=add_todo_form.title.data,
                description=add_todo_form.description.data,
                project_id=add_todo_form.project.data,
            )
            db.session.add(todo)
            flash(f"Your new task has been added to the list!", category="success")

        elif add_project_form.validate_on_submit():
            project = Projects(
                title=add_project_form.title.data,
                description=add_project_form.description.data,
                user_id=current_user.user_id,
            )
            db.session.add(project)
            flash(f"Your new project has been added to the list!", category="success")

        db.session.commit()
        return redirect(url_for("views.projects_page"))

    return render_template(
        "projects.html",
        add_todo_form=add_todo_form,
        add_project_form=add_project_form,
        edit_project_form=edit_project_form,
    )
