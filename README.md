# 🏨 Hotel Booking System

A full-stack hotel booking application built with Spring Boot microservices and Angular frontend.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/User)
- Secure token management
- Session validation

### 🏨 Hotel Management
- Browse hotels by city
- Paginated hotel listings
- Hotel details and information
- Search and filter capabilities

### 📅 Booking System
- Create hotel bookings
- View booking history
- Booking management
- Date-based availability

### 🎨 User Interface
- Responsive Angular frontend
- Bootstrap-based UI
- Modern, clean design
- Mobile-friendly interface

## 🛠 Tech Stack

### Backend
- **Java 17** - Programming language
- **Spring Boot 4.0.6** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Data persistence
- **H2 Database** - In-memory database (development)
- **Maven** - Dependency management
- **Lombok** - Code generation

### Frontend
- **Angular 21** - Frontend framework
- **TypeScript** - Programming language
- **Bootstrap 5** - CSS framework
- **RxJS** - Reactive programming
- **npm** - Package management

### DevOps & Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server & reverse proxy
- **Heroku** - Cloud deployment platform

## 🚀 Quick Start

### Prerequisites
- **Java 17+** installed
- **Node.js 18+** and npm installed
- **Maven 3.6+** installed
- **Git** for version control

### 1. Clone Repository
```bash
git clone <repository-url>
cd hotel-booking-system
```

### 2. Start Backend Services
```bash
# Terminal 1 - Auth Service
cd auth-service
mvn spring-boot:run

# Terminal 2 - Hotel Service  
cd hotel-service
mvn spring-boot:run
```

### 3. Start Frontend
```bash
# Terminal 3 - Angular App
cd hotel-web-app
npm install
npm start
```

### 4. Access Application
- **Web Application**: http://localhost:4200
- **Auth Service**: http://localhost:8082
- **Hotel Service**: http://localhost:8081

### 5. Default Login
- **Admin**: `admin` / `admin123`
- **User**: `user` / `user123`

## 📁 Project Structure

```
hotel-booking-system/
├── auth-service/                 # Authentication microservice
│   ├── src/main/java/com/example/auth_service/
│   │   ├── controller/          # REST controllers
│   │   ├── service/             # Business logic
│   │   ├── entity/              # JPA entities
│   │   ├── dto/                 # Data transfer objects
│   │   ├── config/              # Configuration classes
│   │   └── repository/          # Data repositories
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── application-prod.properties
│   └── pom.xml                  # Maven dependencies
│
├── hotel-service/               # Hotel management microservice
│   ├── src/main/java/com/example/hotel_service/
│   │   ├── controller/          # REST controllers
│   │   ├── service/             # Business logic
│   │   ├── entity/              # JPA entities
│   │   ├── dto/                 # Data transfer objects
│   │   ├── config/              # Configuration classes
│   │   └── repository/          # Data repositories
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── application-prod.properties
│   └── pom.xml                  # Maven dependencies
│
├── hotel-web-app/               # Angular frontend application
│   ├── src/
│   │   ├── app/                 # Angular components & services
│   │   ├── assets/              # Static assets
│   │   └── environments/        # Environment configurations
│   ├── package.json             # npm dependencies
│   └── angular.json             # Angular configuration
│
├── docs/                        # Documentation
│   ├── DEPLOYMENT_GUIDE.md      # Deployment instructions
│   ├── LIVE_DEPLOYMENT.md       # Live deployment options
│   ├── ARCHITECTURE.md          # System architecture
│   └── AI_USAGE.md              # AI development process
│
└── deployment/                  # Deployment configurations
    ├── docker-compose.yml       # Docker orchestration
    ├── Dockerfile.*             # Container definitions
    ├── nginx.conf               # Web server config
    └── *.bat                    # Windows deployment scripts
```

## 📚 API Documentation

### Authentication Service (Port 8082)

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

#### Validate Token
```http
GET /api/auth/validate
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Hotel Service (Port 8081)

#### Get Hotels (Paginated)
```http
GET /api/hotels?city=Mumbai&page=0&size=10
```

#### Get All Hotels
```http
GET /api/hotels/all?city=Mumbai
```

#### Get Hotel by ID
```http
GET /api/hotels/{id}
```

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "hotelId": 1,
  "checkInDate": "2024-12-01",
  "checkOutDate": "2024-12-05",
  "guests": 2
}
```

#### Get User Bookings
```http
GET /api/bookings
Authorization: Bearer <token>
```

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd auth-service && mvn test
cd hotel-service && mvn test

# Frontend tests
cd hotel-web-app && npm test
```

### Building for Production
```bash
# Backend
cd auth-service && mvn clean package -Pprod
cd hotel-service && mvn clean package -Pprod

# Frontend
cd hotel-web-app && npm run build
```

### Database Access
- **H2 Console (Auth)**: http://localhost:8082/h2-console
- **H2 Console (Hotel)**: http://localhost:8081/h2-console
- **JDBC URL**: `jdbc:h2:mem:auth-db` or `jdbc:h2:mem:hotel-db`
- **Username**: `sa`
- **Password**: (empty)

### Code Style
- **Java**: Follow Spring Boot conventions
- **TypeScript**: Follow Angular style guide
- **Formatting**: Use IDE auto-formatting
- **Naming**: Use descriptive, camelCase names

## 🚀 Deployment

### Quick Deployment Options

#### 1. Docker (Recommended)
```bash
# Create environment file
cp .env.example .env
# Edit .env with your passwords

# Deploy
docker-compose up --build -d

# Access at http://localhost
```

#### 2. Heroku (Live URL)
```bash
# Prerequisites: Heroku account & CLI
heroku login

# Deploy (Windows)
heroku-deploy.bat

# Deploy (Mac/Linux)
./deploy-heroku.sh
```

#### 3. Instant Share (Ngrok)
```bash
# Download ngrok from ngrok.com
# Run your app locally, then:
ngrok http 4200

# Share the HTTPS URL
```

### Production Considerations
- **Database**: Migrate from H2 to PostgreSQL/MySQL
- **Security**: Configure CORS, HTTPS, strong JWT secrets
- **Monitoring**: Add logging, health checks, metrics
- **Scaling**: Use load balancers, multiple instances

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Guidelines
- Write tests for new features
- Follow existing code style
- Update documentation
- Ensure all tests pass

### Reporting Issues
- Use GitHub Issues
- Provide detailed description
- Include steps to reproduce
- Add relevant logs/screenshots

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Angular team for the powerful frontend framework
- Bootstrap for the responsive UI components
- H2 Database for development convenience

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check existing documentation
- Review API documentation above

---

**Happy Coding! 🚀**
