# TODO
A simple to-do app built using JavaScript, Tailwind CSS, and Flask.


## Background Scenario
A project manager wants to track the progress of tasks conducted by his subordinates. He decides to ask a developer to create a simple to-do app to oversee their performance.

## Requirements
The to-do app should have the following features:
1. User authentication
2. The user can add, edit, or delete a project.
3. The user can add, edit, or delete tasks that belong to specific projects.
4. Each task should have a tag/label to indicate which project it belongs to.
5. The user can view all tasks as a list on the home page.
6. The user can filter the task list by each project.

## Program Scheme
![A flowchart image that explains how the program runs](https://i.imgur.com/Gfn3HWG.jpg)
**START**

1. The user creates an account if they don't already have one, then logs in.
2. The user can add a new project or task.
3. The user can edit a project or task.
4. The user can delete a project or task.
5. The user can mark a task as done/finished, either by clicking a button or dragging the task.
6. The user can filter the task list by their respective project.

**END** 

## Demo
https://mad4869.pythonanywhere.com


## ERD
This app utilizes **PostgreSQL** as the database service. The structure of the schema in the database is as follows:
![Entity Relationship Diagram](https://i.imgur.com/3j3cnDl.png)

## Installation
### 1. Clone the repo
```
git clone https://github.com/mad4869/todo-app.git
```
### 2. Set up the enviromental variables
Create a new file named `.env` in the root directory of the app. Then, inside the `.env` file, add the required variables:
```
FLASK_APP='run.py'
FLASK_DEBUG=1
ENVIRONMENT="development"
SECRET_KEY="some_secret_key"

POSTGRES_USER="postgres"
POSTGRES_PASSWORD="password"
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
POSTGRES_DB="todo-db"

JWT_SECRET_KEY="some_secret_key"
```
Replace the example variables with the corresponding actual values as needed.
### 3. Create a virtual environment (optional)
### 4. Install the dependencies
```
pip install -r requirements.txt
npm install
```
### 5. Build the static assets
```
npm run build
flask digest compile
```
### 6. Run the app
```
flask run
```
## Code Explanation
### 1. Backend (Flask)
The entrypoint of the app is `run.py` while the app directory is `todo`<br>Inside the `todo` module are the followings:
<br>**__init.py\__:** Init file
<br>**config.py:** App configuration
<br>**extensions.py:** Init file for the app's support libraries. This app is using the following libraries:

- `SQLAlchemy:` ORM
- `flask-migrate:` to manage database migration
- `flask-bcrypt:` to generate password hash
- `flask-jwt-extended:` to do authentication and authorization using **JSON Web Token**
- `flask-login:` to manage user session
- `flask-static-digest:` to compile static assets

**forms.py:** All forms used in the app. Using `flask-wtf` as the form library.
<br>**models.py** The models to connect to the database using `SQLAlchemy`

**routes**
- api.py: Handling the routes that serve the data. The list of API endpoints can be viewed [here.](https://documenter.getpostman.com/view/11633108/2s93zH2eWg)
- auth.py: Handling the routes for authentication
- views.py: Handling the routes for rendering HTML templates

**static**
<br>All the static assets

**templates**
<br>HTML templates

### 2. Frontend
This app is using `webpack` to build the assets and insert them inside the `static` directory in the `todo` module. This app is also using `Tailwind CSS` as the CSS framework.

## Test Case
### 1. User authentication
![User login](https://i.imgur.com/Ixc7cnj.png)
![User login successfully](https://i.imgur.com/5JaXSoY.png)
### 2. Add a project and a task
![Add a project](https://i.imgur.com/WwzITC6.png)
![Add a task](https://i.imgur.com/RId6lOv.png)
![Add a task successfully](https://i.imgur.com/KZLHtCg.png)
### 3. Edit a project and a task
![Edit a task](https://i.imgur.com/imdcaJm.png)
![Edit a task successfully](https://i.imgur.com/3VogfZs.png)
![Edit a project](https://i.imgur.com/JxqayPC.png)
![Edit a project successfully](https://i.imgur.com/mQQVRGX.png)
### 4. Delete a project and a task
![Delete a task](https://i.imgur.com/gNxBkIP.png)
![Delete a task successfully](https://i.imgur.com/8oGcSj1.png)
![Delete a project](https://i.imgur.com/lzLTDln.png)
![Delete a project successfully](https://i.imgur.com/EEgEbEN.png)
### 5. Mark a task as finished/done
![Mark a task as finished](https://i.imgur.com/bAVmoBx.png)
### 6. Filter tasks by project
![Filter tasks by project](https://i.imgur.com/l3ckRQK.png)
![Filter tasks by project](https://i.imgur.com/JY5AF9m.png)

## Conclusion
TODO is a simple to-do app that allows users to track their tasks or projects.<br>However, there are a few things that can be done to enhance the app:
1. Implement task pagination to improve the user experience.
2. Optimize the static files to enhance the app's performance.
3. Clean up the code to improve its overall readability.

By implementing these improvements, the overall functionality and performance of the app can be enhanced.