# MovieFlix - Full-Stack Movie Reservation Platform

A comprehensive, full-stack web application built with the MERN stack that allows users to browse movies, select seats, and book tickets for different cities and showtimes. Includes a complete admin panel for managing all site content.

**Live Demo Link:** [Your Vercel Link Will Go Here]

![MovieFlix Screenshot](https://i.imgur.com/2f4e4c.jpg)

---

## ✨ Key Features

- **User Authentication:** Secure user registration and login using JWT and bcrypt.
- **Dynamic Homepage:** Features an admin-controlled promotional banner carousel and dynamic movie filtering.
- **City & Category Filtering:** Browse movies available in specific cities and filter by genre.
- **Movie Details & Showtimes:** View detailed information for each movie and its available showtimes.
- **Interactive Seat Selection:** A multi-tiered, visual seat map for selecting seats.
- **Booking System:** Users can book tickets and view their booking history.
- **Comprehensive Admin Panel:** A secure dashboard for admins to perform CRUD operations on:
  - Movies
  - Cities
  - Movie Categories
  - Homepage Banners
  - Showtimes

---

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router, Axios, React-Bootstrap, React-Slick
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JSON Web Tokens (JWT), bcrypt.js
- **DevOps & Deployment:** Docker, Vercel, CI/CD

---

## 🚀 Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Binitpandey09/MovieFlix.git](https://github.com/Binitpandey09/MovieFlix.git)
    cd MovieFlix
    ```

2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    ```
    - Create a `.env` file in the `/backend` directory and add your variables:
      ```
      MONGO_URI=your_mongodb_atlas_connection_string
      JWT_SECRET=your_jwt_secret_key
      PORT=5001
      ```

3.  **Setup Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Run the application:**
    - Run the backend server from the `/backend` directory: `npm start`
    - Run the frontend server from the `/frontend` directory: `npm start`