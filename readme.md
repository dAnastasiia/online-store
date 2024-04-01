# Online Store Server Application

This is an online store **view-based** server application built with Node.js, utilizing either MongoDB with Mongoose or MySQL with Sequelize as the database, providing functionalities such as user authentication, product management, cart management, and order processing. The application also incorporates various third-party services like Nodemailer with SendGrid for email functionalities and Stripe for payment processing.

## Disclaimer
Experimentation purposes only.  
**Please Note:** This project is a learning project created for exploring different functionalities and technologies. As such, it contains code duplication, comments, or described errors that are solely for educational purposes and may not adhere to best practices in software development. 

## Technologies Used

- **Node.js**: Server-side JavaScript runtime environment for building scalable network applications.
- **Express.js**: Web application framework for Node.js used to build the RESTful APIs.
- **MongoDB (with Mongoose)**: A NoSQL database used for storing application data in a flexible, JSON-like format.
- **MySQL (with Sequelize)**: A relational database management system used for storing structured data.
- **Nodemailer with SendGrid**: Used for sending emails for functionalities like account activation, password reset, etc.
- **Stripe**: A payment processing platform used for handling payments securely.
- **PDFKit**: A PDF generation library used for generating order PDFs.

## Functionality Overview

### Authentication
- **Signup**: Users can create a new account by providing necessary details like email and password.
- **Login**: Registered users can log in using their credentials.
- **Reset Password**: Password reset functionality is available for users who forget their passwords.

### Product Management (Admins)
- **Add Products**: Admins can add new products to the store, specifying details such as name, description, price, etc.
- **Edit Products**: Admins can modify existing product details.
- **Delete Products**: Admins can remove products from the store.
- **Show Product List**: Admins can view the list of all products available in the store.

### Cart Management
- Users can add products to their cart while browsing the store.
- Users can modify the quantity of products in their cart or remove them.

### Order Processing
- **Payment Handling**: Users can proceed to checkout and make payments securely using Stripe.
- **Order Creation**: After successful payment, orders are created and stored in the database.
- **Order PDF Generation**: PDF invoices are generated using PDFKit for each order.

## Branches
- **MongoDB + Mongoose**: This branch utilizes MongoDB as the database, with Mongoose as the ODM (Object Data Modeling) library for MongoDB and Express.js for handling server requests.
- **MySQL + Sequelize**: This branch uses MySQL as the database, with Sequelize as the ORM (Object-Relational Mapping) library for Node.js.

## Getting Started
To get started with the project, follow these steps:

1. Clone the repository.
2. Choose the branch based on your preferred database (MongoDB or MySQL).
3. Install dependencies using `npm install`.
4. Set up the database configurations.
5. Configure environment variables for services like SendGrid API key, Stripe API key, etc.
6. Run the application using `npm start`.
