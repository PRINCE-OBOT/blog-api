# Blog API

A full-stack blogging platform built as part of [The Odin Project NodeJS Curriculum](https://www.theodinproject.com/lessons/node-path-nodejs-blog-api).

The project consists of a RESTful API, an author dashboard for managing blog posts, and a reader-facing application where visitors can browse posts, leave comments, and interact with published content.

## Live Demo

**Reader Frontend**


[Live Preview](https://blog-api-reader.vercel.app/)

**Author Frontend**

[Live Preview](https://blog-api-author.vercel.app/)

**Source Code**

https://github.com/PRINCE-OBOT/blog-api

---

## Features

### Authentication

* User registration and login
* JWT-based authentication
* Protected author routes
* Persistent login using JSON Web Tokens

### Author Dashboard

* Create blog posts
* Edit existing posts
* Delete posts
* Publish and unpublish posts
* Upload hero images with Cloudinary
* Rich text editing using TinyMCE

### Reader Experience

* Browse published blog posts
* View individual blog posts
* Responsive reading experience
* Display post metadata including author and publish date

### Comments

* Leave comments on blog posts
* Like comments
* View latest comments first

### Likes

* Like blog posts
* Like comments

### Security

* Protected API endpoints
* JWT authorization middleware
* Password hashing with bcrypt
* Server-side validation
* Image upload validation

---

## Built With

### Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT Authentication
* bcryptjs
* Multer
* Cloudinary
* Express Validator

### Frontend

* React
* TypeScript
* Vite
* React Router
* TinyMCE

### Deployment

* Render
* Vercel
* Supabase PostgreSQL
* Cloudinary

---

## Database Design

### User

* First name
* Last name
* Username
* Password
* Authored blog posts

### Post

* Title
* Subtitle
* Hero image
* Rich HTML content
* Published status
* Author relationship
* Likes
* Comments
* Timestamps

### Comment

* Username
* Comment content
* Post relationship
* Likes
* Timestamps

### Post Like

* Stores likes for blog posts

### Comment Like

* Stores likes for comments

---

## What I Learned

This project provided hands-on experience with:

* Building a RESTful API using Express and TypeScript
* Designing relational databases with Prisma ORM
* Implementing JWT authentication and authorization
* Building two independent React frontends that consume the same API
* Integrating TinyMCE for rich text editing
* Uploading and managing images with Cloudinary
* Deploying a full-stack application using Render, Vercel, and Supabase PostgreSQL

---

## Challenge

The biggest challenge in this project was designing and deploying a production-ready API that served two separate frontend applications. Managing authentication across multiple clients, integrating Prisma with PostgreSQL, configuring image uploads with Cloudinary, and deploying each service independently required careful planning and troubleshooting. Converting local development into a reliable production deployment was the most demanding part of the project.

---

## API Endpoints

### Authentication

* Register
* Login
* Verify authenticated user

### Posts

* Get all published posts
* Get single post
* Create post
* Update post
* Delete post
* Publish/Unpublish post

### Comments

* Create comment
* Like comment

### Likes

* Like post

---

## `.env`

```env
DATABASE_URL=
DIRECT_URL=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

READER_FRONTEND_URL=
AUTHOR_FRONTEND_URL=
```

## Acknowledgements

This project was completed as part of the NodeJS course from [The Odin Project](https://www.theodinproject.com/).

---

