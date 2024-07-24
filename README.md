# Role-Based Task Management API

This project is a Node.js API for managing tasks with role-based access control. It uses Express for the REST API and Sequelize ORM for database interactions.

## Features

- Role-based users (Admin & Client)
- User authentication (Sign Up, Login)
- Admin invite mechanism to authorize new users
- Task management with status (Pending or Completed)
- Pagination and filtering for task listing
- Offset-based and cursor-based pagination
- SQLite database for development

## Project Structure

```
role-based-app/
├── config/
│   └── config.json
├── migrations/
├── models/
│   ├── index.js
│   ├── task.js
│   └── user.js
├── routes/
│   ├── auth.js
│   └── tasks.js
├── seeders/
│   └── {timestamp}-admin-user.js
├── .env
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://<GITHUB_ACCESS_TOKEN>@github.com/khuramzahid/role-based-task-management.git
   cd role-based-task-management
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```sh
   cp .env.example .env
   ```

4. **Run migrations and seeders:**
   ```sh
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

### Running the Server

To start the server in development mode, use:

```sh
npm run dev
```

This will start the server on the port specified in the `.env` file (default is 3000).

### API Endpoints

#### Authentication

- **Login**
  ```
  POST /auth/login
  {
    "email": "admin@example.com",
    "password": "adminpassword"
  }
  ```

- **Generate Invite Token (Admin Only)**
  ```
  POST /auth/invite
  Headers: { "Authorization": "Bearer <admin_token>" }
  {
    "email": "newuser@example.com"
  }
  ```

- **Register with Invite Token**
  ```
  POST /auth/register
  {
    "token": "<invite_token>",
    "password": "newpassword"
  }
  ```

#### Tasks

- **Create Task**
  ```
  POST /tasks
  Headers: { "Authorization": "Bearer <user_token>" }
  {
    "title": "New Task",
    "description": "Task description",
    "status": "Pending"
  }
  ```

- **Get Tasks (Paginated, Admin can filter by user)**
  ```
  GET /tasks?page=1&limit=10&status=Pending&userId=1
  Headers: { "Authorization": "Bearer <user_token>" }
  ```

- **Get Tasks (Cursor-based Pagination)**
  ```
  GET /tasks/cursor?cursor=<task_id>&limit=10&status=Pending&userId=1
  Headers: { "Authorization": "Bearer <user_token>" }
  ```
