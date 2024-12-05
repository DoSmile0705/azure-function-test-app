# Task Management App

This is a role-based task management app built with React and Azure Functions.

## Running the app locally

1. Frontend:
   - Navigate to the `frontend` directory
   - Run `npm install`
   - Run `npm start`

2. Backend:
   - Navigate to the `backend` directory
   - Run `func start`

## API Endpoints

1. /api/login
   - Purpose: Authenticates users and returns a token with user role
   - Method: POST
   - Body: { username, password }
   - Response: { token, role }

2. /api/tasks
   - Purpose: Returns a list of tasks based on user role
   - Method: GET
   - Headers: Authorization: Bearer <token>
   - Response: Array of task objects
