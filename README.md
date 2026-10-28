# 🍽️ El Buen Sabor — Restaurant Management System

A full-stack restaurant management web application built with Flask and MySQL. Designed to manage dishes, user reviews, and restaurant statistics through a responsive and user-friendly interface.

## ✨ Features

- **User Authentication:** Registration, login, and secure password hashing.
- **Role-Based Access Control:** Separate permissions for administrators and regular users.
- **Dish Management:** Create, edit, and delete dishes with descriptions, prices, and images.
- **Reviews & Comments:** Users can share feedback and interact with dishes.
- **Likes & Dislikes:** Track user preferences for restaurant dishes.
- **Dashboard & Statistics:** Visualize restaurant activity and user interactions.
- **Responsive Interface:** User-friendly experience across different screen sizes.

## 🛠️ Technologies

- Python
- Flask
- MySQL
- HTML5
- CSS3
- JavaScript
- Git & GitHub

## 🏗️ Architecture

The application follows the **Model-View-Controller (MVC)** pattern to organize its components:

- **Models:** Database operations and data management.
- **Views:** HTML templates rendered using Flask.
- **Controllers:** Application logic and request handling.
- **Routes:** Application endpoints and navigation.

## 📸 Screenshots

## 📸 Screenshots

### Home page
![Home page](screenshots/home.png)

### Login
![Login](screenshots/login.png)

### Admin dashboard
![Admin dashboard](screenshots/admin.png)

### Statistics dashboard
![Statistics dashboard](screenshots/dashboard.png)

## 🚀 Getting Started

To run the project locally, you need Python, MySQL, and the required dependencies.

1. Clone the repository.
2. Install the dependencies from `requirements.txt`.
3. Configure your local environment variables in a `.env` file.
4. Set up the MySQL database using the provided SQL files.
5. Run the Flask application.

## 🔐 Environment Variables

Configure the following variables in your local `.env` file:

- `SECRET_KEY`
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DB`

**Do not commit your `.env` file or credentials to GitHub.**

## 👨‍💻 Author

Kevin Carvallo

GitHub: [@kevinesty](https://github.com/kevinesty)
