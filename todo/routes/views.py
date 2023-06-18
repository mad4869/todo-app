from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, current_user, logout_user, login_required

from ..extensions import db
from ..models import *
from ..forms import *

views_bp = Blueprint("views", __name__)


@views_bp.route("/welcome", strict_slashes=False)
def welcome_page():
    return render_template("welcome.html")


@views_bp.route("/", methods=["GET", "POST", "PUT"], strict_slashes=False)
@views_bp.route("/home", methods=["GET", "POST", "PUT"], strict_slashes=False)
def home_page():
    if not current_user.is_authenticated:
        return render_template("landing.html")

    add_todo_form = AddTodoForm()
    add_todo_form.load_choices(current_user.user_id)

    edit_todo_form = EditTodoForm()
    edit_todo_form.load_choices(current_user.user_id)

    add_project_form = AddProjectForm()

    if request.method == "POST":
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

    elif request.method == "PUT":
        if edit_todo_form.validate_on_submit():
            todo = db.session.execute(
                db.select(Todos).filter(Todos.todo_id == edit_todo_form.todo_id.data)
            ).scalar_one()
            todo.title = edit_todo_form.title.data
            todo.description = edit_todo_form.description.data
            todo.project_id = edit_todo_form.project.data

            print(todo)

        db.session.commit()
        return redirect(url_for("views.home_page"))

    return render_template(
        "index.html",
        add_todo_form=add_todo_form,
        add_project_form=add_project_form,
        edit_todo_form=edit_todo_form,
    )


@views_bp.route("/login", methods=["GET", "POST"], strict_slashes=False)
def login_page():
    form = LoginForm()

    if request.method == "POST":
        if form.validate_on_submit():
            email_registered = Users.query.filter_by(email=form.email.data).first()
            if email_registered and email_registered.password_auth(
                password_input=form.password.data
            ):
                login_user(email_registered, remember=True)
                flash(f"Welcome back, {email_registered.name}!", category="success")
                return redirect(url_for("views.home_page"))
            else:
                flash(
                    "Email and password are not match! Please try again.",
                    category="error",
                )

    return render_template("login.html", form=form)


@views_bp.route("/logout", strict_slashes=False)
def logout_page():
    logout_user()
    flash("You have been logged out!", category="info")

    return redirect(url_for("views.home_page"))


@views_bp.route("/register", methods=["GET", "POST"], strict_slashes=False)
def register_page():
    form = RegisterForm()
    if request.method == "POST":
        if form.validate_on_submit():
            user = Users(
                name=form.name.data,
                role=form.role.data,
                email=form.email.data,
                password=form.password.data,
            )

            db.session.add(user)
            db.session.commit()

            flash(
                f"Congratulation, {form.name.data}! Your account has been successfully registered. Please login to continue.",
                category="success",
            )

            return redirect(url_for("views.login_page"))
        if form.errors != {}:
            for error in form.errors.values():
                flash(error)

    return render_template("register.html", form=form)


@views_bp.route("/profile", strict_slashes=False)
@login_required
def profile_page():
    return render_template("profile.html")
