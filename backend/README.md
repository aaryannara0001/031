# Citizen Engagement Backend

A professional FastAPI backend for a citizen engagement platform built with modern Python technologies.

## Features

- **FastAPI**: High-performance async web framework
- **SQLAlchemy**: Modern ORM with async support
- **PostgreSQL**: Robust relational database
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Citizen, Fieldworker, Staff, Admin roles
- **RESTful API**: Well-structured endpoints with OpenAPI documentation
- **Data Validation**: Pydantic schemas for request/response validation
- **File Upload**: Support for image uploads
- **Comprehensive Testing**: Pytest with async support

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT with refresh tokens
- **Validation**: Pydantic
- **Security**: bcrypt password hashing
- **Documentation**: Auto-generated OpenAPI/Swagger
- **Development**: Hot reload, comprehensive logging

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── api.py          # Main API router
│   │       └── endpoints/      # API endpoints
│   │           ├── auth.py     # Authentication endpoints
│   │           ├── users.py    # User management
│   │           ├── issues.py   # Issue reporting
│   │           └── tasks.py    # Task management
│   ├── auth/                   # Authentication logic
│   │   ├── dependencies.py    # FastAPI dependencies
│   │   └── security.py        # JWT & password utilities
│   ├── core/                  # Core functionality
│   │   ├── config.py          # Settings & configuration
│   │   ├── database.py        # Database connection
│   │   └── logging.py         # Logging setup
│   ├── models/                # SQLAlchemy models
│   │   └── __init__.py        # Database models
│   └── schemas/               # Pydantic schemas
│       ├── user.py            # User schemas
│       ├── issue.py           # Issue schemas
│       └── task.py            # Task schemas
├── main.py                    # FastAPI application
├── seed.py                    # Database seeding script
├── requirements.txt           # Python dependencies
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## Quick Start

### Prerequisites

- Python 3.9+
- PostgreSQL
- pip (Python package manager)

### Installation

1. **Clone and navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Create virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Set up PostgreSQL database:**

   ```bash
   createdb citizen_engagement
   ```

6. **Run database migrations:**

   ```bash
   python -c "from app.core.database import create_tables; import asyncio; asyncio.run(create_tables())"
   ```

7. **Seed the database:**

   ```bash
   python seed.py
   ```

8. **Start the development server:**
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/api/v1/openapi.json

## Default Users

After seeding, these test accounts are available:

| Role        | Email                | Password   |
| ----------- | -------------------- | ---------- |
| Admin       | admin@city.gov       | admin123   |
| Staff       | staff@city.gov       | staff123   |
| Fieldworker | fieldworker@city.gov | field123   |
| Citizen     | citizen@example.com  | citizen123 |

## API Endpoints

### Authentication

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/change-password` - Change password

### Users

- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update current user profile
- `GET /api/v1/users/` - List users (staff/admin)
- `GET /api/v1/users/{user_id}` - Get user by ID (staff/admin)
- `PUT /api/v1/users/{user_id}` - Update user (admin)
- `DELETE /api/v1/users/{user_id}` - Delete user (admin)

### Issues

- `POST /api/v1/issues/` - Create issue
- `GET /api/v1/issues/` - List issues
- `GET /api/v1/issues/{issue_id}` - Get issue details
- `PUT /api/v1/issues/{issue_id}` - Update issue
- `POST /api/v1/issues/{issue_id}/comments` - Add comment
- `GET /api/v1/issues/{issue_id}/comments` - Get comments
- `POST /api/v1/issues/{issue_id}/vote` - Vote on issue

### Tasks

- `POST /api/v1/tasks/` - Create task (staff/admin)
- `GET /api/v1/tasks/` - List tasks
- `GET /api/v1/tasks/{task_id}` - Get task details
- `PUT /api/v1/tasks/{task_id}` - Update task
- `POST /api/v1/tasks/{task_id}/assign` - Reassign task

## Development

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
# Install development dependencies
pip install black isort flake8

# Format code
black .
isort .

# Lint code
flake8 .
```

### Database Management

**Create migration:**

```bash
alembic revision --autogenerate -m "Description of changes"
```

**Run migrations:**

```bash
alembic upgrade head
```

## Security Features

- **JWT Authentication** with access and refresh tokens
- **Password Hashing** using bcrypt
- **Role-based Access Control** with granular permissions
- **CORS Protection** with configurable origins
- **Rate Limiting** on sensitive endpoints
- **Input Validation** using Pydantic
- **SQL Injection Protection** via SQLAlchemy ORM

## Production Deployment

1. Set `ENVIRONMENT=production` in `.env`
2. Use a production WSGI server like Gunicorn
3. Set up proper logging and monitoring
4. Configure HTTPS
5. Set up database connection pooling
6. Configure proper CORS origins
7. Set strong SECRET_KEY and database credentials

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
