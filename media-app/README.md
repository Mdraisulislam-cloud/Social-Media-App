# Raisbook - Instagram-like MERN Social Media Application

A complete, full-featured Instagram-like social media application built with the MERN stack (MongoDB, Express.js, React, Node.js). This is a simplified educational project designed for university coursework with deployment-ready Docker configuration.

## 🎯 Features

### Authentication & Authorization
- User registration with role selection (Creator/Consumer)
- JWT-based authentication with 7-day token expiry
- Secure password hashing with bcryptjs
- Role-based access control

### Photo Sharing
- **Creators** can upload photos with title, caption, location, and tags
- **All users** can browse and search photos
- Photo detail view with complete information
- Delete own photos (creators only)

### Social Interactions
- Comment system for all users
- Users can delete their own comments
- View creator information on each photo

### Search Functionality
- Search photos by title, caption, or tags
- Real-time search from the navbar

### User Roles
- **Creator**: Can upload photos and view/comment on all photos
- **Consumer**: Can view, search, and comment on photos (but cannot upload)

## 📁 Project Structure

```
media-app/
├── backend/
│   ├── models/              # MongoDB schemas
│   │   ├── User.js
│   │   ├── Photo.js
│   │   └── Comment.js
│   ├── controllers/         # Business logic
│   │   ├── authController.js
│   │   ├── photoController.js
│   │   └── commentController.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── photos.js
│   │   └── comments.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js         # JWT verification
│   │   └── upload.js       # File upload handling
│   ├── uploads/            # Uploaded images storage
│   ├── server.js           # Express server entry point
│   ├── .env                # Environment variables
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── Navbar.js
│   │   │   ├── PhotoCard.js
│   │   │   ├── Comment.js
│   │   │   └── UploadForm.js
│   │   ├── pages/          # Page components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── PhotoDetail.js
│   │   │   ├── Upload.js
│   │   │   └── Profile.js
│   │   ├── context/        # React Context
│   │   │   └── AuthContext.js
│   │   ├── services/       # API communication
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml      # Docker orchestration
├── README.md
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- Docker & Docker Compose (for containerized setup)
- MongoDB (local or Docker)

### Local Development Setup

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   # backend/.env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/raisbook
   JWT_SECRET=your_jwt_secret_key_here_change_this
   NODE_ENV=development
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

6. **Start Frontend Application** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🐳 Docker Deployment

### Prerequisites
- Docker
- Docker Compose

### Run with Docker Compose
```bash
docker-compose up --build
```

This will start:
- **MongoDB**: http://localhost:27017
- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:3000

### Stop Services
```bash
docker-compose down
```

## 📡 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `GET /api/profile` - Get current user profile (protected)

### Photos
- `GET /api/photos` - Get all photos
- `GET /api/photos/:id` - Get single photo
- `POST /api/photos` - Upload photo (creators only, protected)
- `DELETE /api/photos/:id` - Delete photo (creators only, protected)
- `GET /api/photos/search?q=query` - Search photos

### Comments
- `GET /api/photos/:id/comments` - Get comments for a photo
- `POST /api/photos/:id/comments` - Add comment (protected)
- `DELETE /api/photos/comments/:commentId` - Delete comment (protected)

## 🧪 Testing with Postman

1. **Register a user**
   ```
   POST http://localhost:5000/api/register
   Body (JSON):
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "password123",
     "role": "creator"
   }
   ```

2. **Login**
   ```
   POST http://localhost:5000/api/login
   Body (JSON):
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. **Upload Photo** (use token from login)
   ```
   POST http://localhost:5000/api/photos
   Headers: Authorization: Bearer <token>
   Body (form-data):
   - title: "My Amazing Photo"
   - caption: "Beautiful sunset"
   - location: "Beach"
   - tags: "sunset,nature,travel"
   - image: <select image file>
   ```

## 🎨 User Interface

### Pages
- **Home** - Displays grid of all photos with search
- **Login** - User authentication
- **Register** - Create new account with role selection
- **Photo Detail** - Full-size photo with comments
- **Upload** - Creator-only photo upload form
- **Profile** - User information and account details

### Components
- **Navbar** - Navigation and search functionality
- **PhotoCard** - Thumbnail photo display with basic info
- **Comment** - Individual comment display
- **UploadForm** - Photo upload with metadata

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token authentication with 7-day expiry
- Role-based access control
- CORS enabled
- Input validation on all endpoints
- File upload validation (images only, 5MB limit)

## 🌐 Deployment Options

### Heroku
1. Add `Procfile` with: `web: npm start`
2. Deploy backend and frontend separately
3. Set environment variables on Heroku

### AWS
- EC2 instances with Docker
- Elastic Beanstalk for automatic scaling
- RDS for MongoDB Atlas cloud database

### Vercel
- Deploy frontend only
- Point to backend API URL

### MongoDB Atlas
Replace local MongoDB with cloud database:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/raisbook
```

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mediaapp
JWT_SECRET=your_secure_secret_key_here
NODE_ENV=development
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Material-UI** - Component library
- **Context API** - State management

## 📚 Key Features Explained

### Authentication Flow
1. User registers with username, email, password, and role
2. Password is hashed before storage
3. JWT token issued with 7-day expiry
4. Token stored in localStorage
5. Token included in all protected API requests

### Photo Upload
1. Creator selects image file
2. Multer validates and stores file locally
3. Image metadata saved to MongoDB
4. Response includes image URL for retrieval

### Search Functionality
1. Navbar search queries backend with text
2. Backend searches title, caption, and tags
3. Results displayed in grid on home page

## 🎓 Learning Objectives

This project demonstrates:
- Full MERN stack development
- RESTful API design
- JWT authentication
- Role-based authorization
- File upload handling
- Docker containerization
- Component-based React architecture
- Context API for state management
- Responsive UI design

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running on port 27017
- Check MONGODB_URI in .env file

### CORS Error
- Backend CORS is enabled
- Frontend proxy is set in package.json

### File Upload Not Working
- Ensure uploads directory exists
- Check file size (max 5MB)
- Verify image file type (jpeg, jpg, png, gif)

### Token Expiry
- Frontend auto-logout on token expiry
- Re-login required for new token

## 📄 License

This project is for educational purposes. Modify and use as needed for your university project.

## 🤝 Contributing

Feel free to enhance this project with:
- Like/heart system for photos
- Follow users feature
- Direct messaging
- Photo filters
- Advanced search
- Notifications system

---

**Happy coding!** 🚀
