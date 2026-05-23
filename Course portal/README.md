Course Registration Portal
A web application where students can browse and enroll in courses, and admins can manage everything.
Tech Stack

Backend: Django + Django REST Framework
Frontend: React + Next.js + Tailwind CSS
Database: SQLite
Authentication: JWT Tokens

How to Run
Step 1 — Backend
Open terminal and run these commands one by one:

cd backend/core
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

Backend will start at http://127.0.0.1:8000
After starting — go to http://127.0.0.1:8000/admin and login with your superuser. Find your user and change role to admin.


Step 2 — Frontend
Open a new terminal and run:

cd frontend
npm install
npm run dev

Frontend will start at http://localhost:3000
Demo Accounts
Admin account — created using createsuperuser command above
Student account — create through the signup page at http://localhost:3000/signup
What You Can Do

As a Student

Sign up and login
Browse all available courses
Click on any course to see full details
Enroll in a course
Check your registration status — pending, accepted or rejected

As an Admin

Login and get redirected to admin panel automatically
Add new courses with title, description, instructor, schedule and capacity
Edit or delete existing courses
View all student registrations across all courses
Accept or reject individual student enrollments
Filter registrations by status or course
Click on any course to see which students have registered for it

Project Structure
course-portal/
    backend/
        core/          — Django settings and main URLs
        users/         — Signup, login, user model with role
        courses/       — Course and registration models and APIs
    frontend/
        pages/
            index.js              — Redirects based on login status
            login.js              — Login page
            signup.js             — Signup page
            courses.js            — Browse all courses
            my-registrations.js   — View your enrollment status
            courses/
                [id].js           — Individual course detail page
            admin/
                courses.js        — Admin manage courses
                registrations.js  — Admin view all registrations
                courses/
                    [id].js       — Admin course detail with student list


API Endpoints

Method          URL                     Access          What it does
POST      /api/auth/signup/             Anyone          Create New Account
POST      /api/auth/login/              Anyone          Login and get JWT Token
GET       /api/auth/user/               Anyone          Get currrent logged in user details
GET       /api/courses/                 Anyone          Get list of all courses
GET       /api/courses/{id}/            Anyone          Get details of one courses
POST      /api/courses/                 Admin           Add new courses
PUT       /api/courses/{id}/            Admin           Edit Existing course
DELETE    /api/courses/{id}/            Admin           Delete a course
POST      /api/registrations/           Login User      Enroll in a course
GET       /api/registrations/           Login User      Student sees own registration only
GET       /api/registrations/           Admin           Admin sees all registration
PATCH     /api/registrations/{id}/      Admin           Accept or reject a registration

How permissions work

Anyone can view courses without login
Login is required to enroll in a course
Admin gets full access to create, edit, delete courses
Admin can see all registrations from all students
Regular user can only see their own registrations
Admin pages on frontend are protected — regular users get redirected



Notes

Regular users who sign up always get the student role
Admin accounts must be created manually through Django admin panel
A student cannot enroll in the same course twice
Enroll button is disabled automatically if already enrolled
Admin panel is protected — regular users cannot access it