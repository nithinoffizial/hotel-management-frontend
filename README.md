# Hotel Management System

A full-stack Hotel Management System built using React, Spring Boot, MySQL, Docker, and cloud deployment technologies.

## Project Overview

The Hotel Management System is a web-based application designed to simplify the management of essential hotel operations.

The system provides a dashboard with dedicated modules for managing:

- Rooms
- Customers
- Bookings

The application follows a full-stack architecture where the React frontend communicates with a Spring Boot REST API, which uses Spring Data JPA to interact with a MySQL database.

The application supports complete CRUD operations for rooms, customers, and bookings.

## Key Features

### Dashboard

- Provides an overview of hotel information
- Displays room and booking information
- Provides navigation to the main management modules

### Room Management

The Rooms module allows administrators to:

- View all rooms
- Add new rooms
- Edit existing rooms
- Delete rooms
- Manage room numbers
- Manage room types
- Manage prices per night
- Manage room descriptions
- Update room status

Available room statuses:

- `AVAILABLE`
- `OCCUPIED`
- `MAINTENANCE`

### Customer Management

The Customers module allows administrators to:

- View all customers
- Add new customers
- Edit customer information
- Delete customers
- Manage customer names
- Manage customer email addresses
- Manage customer phone numbers

### Booking Management

The Bookings module allows administrators to:

- View all bookings
- Create new bookings
- Edit existing bookings
- Delete bookings
- Select customers
- Select rooms
- Set check-in dates
- Set check-out dates
- Manage booking status

Available booking statuses:

- `CONFIRMED`
- `CHECKED_IN`
- `CHECKED_OUT`
- `CANCELLED`

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- React Router
- Axios
- HTML
- CSS

### Backend

- Java
- Spring Boot 4.1.1
- Spring Data JPA
- Maven
- REST APIs
- Java JDK 25

### Database

- MySQL 8

### Containerization

- Docker
- Docker Compose
- Nginx

### Deployment

- Render
- Aiven MySQL

## System Architecture

```text
┌─────────────────────────┐
│      React Frontend     │
│       React + Vite      │
└────────────┬────────────┘
             │
             │ Axios HTTP Requests
             ▼
┌─────────────────────────┐
│   Spring Boot Backend   │
│       REST APIs         │
└────────────┬────────────┘
             │
             │ Spring Data JPA
             ▼
┌─────────────────────────┐
│       MySQL Database    │
└─────────────────────────┘

Production Architecture
┌──────────────────┐
│   User Browser   │
└────────┬─────────┘
         │
         │ HTTPS
         ▼
┌────────────────────────────┐
│ Render - React Frontend    │
│ React + Vite + Nginx       │
└────────────┬───────────────┘
             │
             │ REST API / HTTPS
             ▼
┌────────────────────────────┐
│ Render - Spring Boot       │
│ Backend REST API           │
└────────────┬───────────────┘
             │
      │ MySQL Connection
             ▼
┌────────────────────────────┐
│ Aiven MySQL                │
│ Production Database        │
└────────────────────────────┘

Project Structure
Frontend

frontend/
│
├── src/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Rooms.jsx
│   │   ├── Customers.jsx
│   │   └── Bookings.jsx
│   │
│   ├── services/
│   │   ├── roomService.js
│   │   ├── customerService.js
│   │   ├── bookingService.js
│   │   └── dashboardService.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── Dockerfile
├── nginx.conf
├── package.json
└── README.md

Backend
The Spring Boot backend is maintained as a separate repository.
The backend follows a layered architecture consisting of:
Controller
    ↓
Service
    ↓
Repository
    ↓
MySQL Database

REST API
The backend exposes REST APIs for the main application entities.
Rooms API
Method	Endpoint	Description
GET	/api/rooms	Retrieve all rooms
POST	/api/rooms	Create a new room
PUT	/api/rooms/{id}	Update a room
DELETE	/api/rooms/{id}	Delete a room


Customers API
Method	Endpoint	Description
GET	/api/customers	Retrieve all customers
POST	/api/customers	Create a new customer
PUT	/api/customers/{id}	Update a customer
DELETE	/api/customers/{id}	Delete a customer


Bookings API
Method	Endpoint	Description
GET	/api/bookings	Retrieve all bookings
POST	/api/bookings	Create a new booking
PUT	/api/bookings/{id}	Update a booking
DELETE	/api/bookings/{id}	Delete a booking


Local Development
Prerequisites
The following software is required for local development:
- Node.js
- Java JDK 25
- MySQL 8
- Docker Desktop (optional)
The backend project includes the Maven Wrapper, so a separate Maven installation is not required to build the backend

Frontend Setup
Navigate to the frontend directory:
cd frontend

Install dependencies:
npm install

Create a .env file in the frontend directory:
VITE_API_URL=http://localhost:8081

Start the development server:
npm run dev

The Vite development server runs on:
http://localhost:5173

Backend Setup
Navigate to the Spring Boot backend project.
Build the backend:
.\mvnw clean package -DskipTests

Run the backend:
.\mvnw spring-boot:run

The Spring Boot backend runs on:
http://localhost:8081

Environment Configuration
The frontend uses the following environment variable:
VITE_API_URL

For local development:
VITE_API_URL=http://localhost:8081

The production frontend receives the production API URL through the Render environment and Docker build configuration.
Sensitive production configuration such as database credentials is stored through environment variables and is not committed to GitHub.
Production Build
Frontend
To create a production build:
npm run build

The generated production files are placed in:
dist/

The production build was successfully verified using Vite.
Backend
To create a production Spring Boot JAR:
.\mvnw clean package -DskipTests

The generated JAR is placed in:
target/

Docker
The frontend uses a multi-stage Docker build.
Frontend Docker Process
The first stage uses Node.js to:
1. Install dependencies
2. Copy the application source
3. Build the React/Vite application
The second stage uses Nginx to:
1. Serve the generated production files
2. Expose the application through port 80
The frontend Docker build accepts the VITE_API_URL as a build argument so that the correct backend API URL is included in the production Vite bundle.
Example:
docker build --build-arg VITE_API_URL=http://localhost:8081 -t hotel-frontend .

The backend also contains a Dockerfile for containerized deployment.
Docker Compose
The project also supports local containerized execution using Docker Compose.
The local architecture consists of:
React Frontend
      ↓
Spring Boot Backend
      ↓
MySQL

The backend communicates with the MySQL container through the Docker network.
Deployment
The application is deployed using the following services:
Component	Platform
Frontend	Render
Backend	Render
Production Database	Aiven MySQL
Containerization	Docker
Web Server	Nginx


The frontend and backend are deployed as separate Render services.
The production frontend communicates with the production Spring Boot backend through REST APIs over HTTPS.
CORS Configuration
The Spring Boot backend is configured to allow requests from the required frontend environments.
This allows the React frontend to communicate with the backend during:
- Local development
- Local Docker execution
- Production deployment
Database
The application uses MySQL as its relational database.
The main application data consists of:
- Rooms
- Customers
- Bookings
The Spring Boot backend uses Spring Data JPA for database operations.
The production database is hosted using Aiven MySQL.
Testing and Verification
The following functionality has been successfully tested:
Frontend
- React application starts successfully
- Vite development server works
- Production build completes successfully
- Dashboard loads correctly
- Rooms page works correctly
- Customers page works correctly
- Bookings page works correctly
- Navigation works correctly
CRUD Operations
Rooms
- Create room
- Read rooms
- Update room
- Delete room
Customers
- Create customer
- Read customers
- Update customer
- Delete customer
Bookings
- Create booking
- Read bookings
- Update booking
- Delete booking
Backend
- Maven build completed successfully
- Spring Boot application compiled successfully
- Production JAR generated successfully
- REST APIs tested successfully
Docker
- Frontend Docker image built successfully
- Vite production API URL verified inside the Docker build
- Nginx production serving verified
Production
- Render frontend deployment verified
- Render backend deployment verified
- Production frontend-to-backend communication verified
- Production database operations verified
- CORS configuration verified
GitHub Repositories
Frontend Repository
nithinoffizial/hotel-management-frontend

Backend Repository
nithinoffizial/hotel-management-backend

Both repositories are maintained separately and use the main branch.
Current Project Status
The Hotel Management System is fully implemented and deployed.
The following components have been completed and verified:
- React frontend
- Spring Boot backend
- MySQL database
- REST API integration
- Dashboard
- Room management
- Customer management
- Booking management
- CRUD operations
- Docker configuration
- Nginx configuration
- CORS configuration
- Render deployment
- Aiven production database
- Production API communication
The frontend and backend Git repositories are synchronized with their respective main branches, and the working trees are clean.
Project Highlights
- Full-stack web application
- RESTful backend architecture
- CRUD-based hotel management
- React component-based frontend
- Spring Boot layered backend
- MySQL relational database
- Docker containerization
- Nginx production serving
- Cloud deployment
- Production database integration
- Environment-based configuration
Author
Nithin