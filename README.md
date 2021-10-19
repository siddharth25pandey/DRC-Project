# DRC

# Steps to run the Project locally
* Clone the Repository
* Now move to drc-app/backend directory and write `pip install - r requirements.txt`. Now check any build folder is present or not. If present, ignore the 4th step
* Now move to drc-app/frontend and write `npm install`
* Now to build it, run `npm run build` and move the build folder from **drc-app/frontend**
to **drc-app/backend**
* Now come to drc-app/backend and write the follwing commands
    * `python manage.py makemigrations`
    * `python manage.py migrate`
    * `python manage.py runserver`
* Now run the following URL `http://localhost:8000/`
