# user-management

Project Setup WEB and API Documentation


1 ### Step 1: Clone the Repository git clone https://github.com/sakthivellingiri/user-management.git

Frontend Setup
--------------

1. Clone the repository to your local machine:
   ```bash
   git clone <repository-url>

2. Navigate to the 'frontend' directory:
   cd frontend

3. Install the required dependencies:
   npm install

4. Run the development server:
   npm run dev

   The application will run on http://localhost:5173.

File Format
-----------
- The application supports importing users in XLSX format. Only FYR files are accepted.

Backend Setup
-------------
1. Navigate to the 'backend' directory:
   cd backend

2. Install the required dependencies:
   npm install

3. Run the backend development server:
   npm run dev

4. Update your '.env' file with the correct MONGO_URL:
   MONGO_URL=<your-updated-url>

API Endpoints
-------------
Authentication
--------------
- Login  
  POST - http://localhost:5001/api/auth/login

- Register  
  POST - http://localhost:5001/api/auth/register

User Management
---------------
- Import Users  
  POST - http://localhost:5001/api/upload-users  
  Requires JWT token.

- Get All Users (Role: User)  
  GET - http://localhost:5001/api/users  
  Requires JWT token.

- Get User by ID  
  GET - http://localhost:5001/api/user/{id}  
  Requires JWT token.

- Update User by ID  
  PUT - http://localhost:5001/api/user/{id}  
  Requires JWT token.

- Delete User by ID  
  DELETE - http://localhost:5001/api/user/{id}  
  Requires JWT token.

- Export Users  
  GET - http://localhost:5001/api/export-users  
  Requires JWT token.

Please ensure you have your JWT token for authorized endpoints.


