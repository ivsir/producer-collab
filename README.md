# Producer Collab

A full-stack social media application built with React, Node.js, Express, MongoDB, GraphQL, and AWS services.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Demonstration](#demonstration)
- [API Documentation](#api-documentation)
- [License](#license)
- [Contact](#contact)

## Features

- User authentication and authorization (JWT)
- User profiles
- Posts (text, images, and audio)
- Comments and likes
- Responsive design

## Technologies Used

- **Frontend:**
  - React
  - Tailwind CSS
  - Apollo Client (GraphQL)
  - WaveSurfer.js (audio playback)
- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - GraphQL
  - JWT
  - AWS Lambda
  - AWS S3

## Architecture

The application follows a microservices architecture with the following main components:

- **Frontend:** Built with React, styled with Tailwind CSS, and uses Apollo Client for GraphQL queries and mutations.
- **Backend:** Node.js with Express, MongoDB for database, and GraphQL for the API.
- **Serverless Functions:** AWS Lambda functions handle various backend processes.
- **Storage:** AWS S3 for storing images and audio files.

## Setup and Installation

### Prerequisites

- Node.js (>=14.x)
- npm (>=6.x)
- MongoDB
- AWS account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ivsir/producer-collab.git
   cd producer-collab

2. **Install Dependencies:**
   npm install

3. **Set up environment variables in root folder:**
Root Folder:
Create a .env file in the root directory of your project and add the following:

   MONGODB_URI=your_mongodb_connection_string
   MY_AWS_PROFILE=your_aws_profile_name
   MY_AWS_REGION=your_aws_region_name
   S3_BUCKET_NAME=your_s3_bucket_name

Server Folder:
Create a .env file in the server directory and add the following:

   MONGODB_URI=your_mongodb_connection_string
   MY_AWS_PROFILE=your_aws_profile_name
   MY_AWS_REGION=your_aws_region_name
   S3_BUCKET_NAME=your_s3_bucket_name

Client Folder:
Create a .env file in the client directory and add the following:

   REACT_APP_API_URL=your_react_app_api_url

### Usage
Running Locally
After setting up and installing, you can run the application locally. 
1. **Run Frontend:**
npm start

2. **Run Backend:**
serverless offline

The backend server runs on http://localhost:4001/dev and the frontend runs on http://localhost:3000.

### Demonstration


https://github.com/ivsir/producer-collab/assets/106352994/7e2b958d-fe05-4525-8505-609329067083



### API Documentation
User Endpoints
Register: /dev/graphql
Login: /dev/graphql
Profile: /dev/graphql

Post Endpoints
Create Post: /dev/graphql
Get Posts: /dev/graphql/singlepost-image
Like Post: /dev/graphql

Comment Endpoints
Add Comment: /dev/graphql
Get Comments: /dev/graphql

Example Requests
Create Post

### License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

Thanks to the following people who have contributed to this project:

- [@rasheemtrq](https://github.com/rasheemtrq)
- [@brigantinojoe](https://github.com/brigantinojoe)
- [@DallasSybrowsky](https://github.com/DallasSybrowsky)
- [@Sydneychick2748](https://github.com/Sydneychick2748)

### Contact
Risvi Tareq

Email: ivsirqerat@gmail.com
GitHub: [ivsir](https://github.com/ivsir)
LinkedIn: https://linkedin.com/in/risvi-tareq

