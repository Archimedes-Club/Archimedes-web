**Archimedes Web Portal**

**Project Overview**
The Archimedes Web Portal is designed for the Archimedes Club at Northeastern University, serving all its branches. This platform fosters collaboration between professors and students, enabling them to work together on innovative project ideas.

**User Roles**
The portal defines four types of users:
- Professor (Admin) – Manages the portal, reviews project proposals, and oversees activities.
- Professor (Project Lead) – Creates and leads projects, managing student participation.
- Professor (Member) – Joins projects as a participant without administrative responsibilities.
- Student – Expresses interest in projects, participates in tasks, and can propose new project ideas.


**Key Features**
- User Registration – All users must register using their Northeastern University email.
- Project Management – Professors can create and manage projects, while students can express interest in joining.
- Task Management – Users can create, assign, and track tasks for ongoing projects.
- File Management – Users can upload, view, and remove project-related files.
- Project Proposals – Students & Professors can propose new projects, which require approval or rejection based on discussions with the admin.
- Invitations – Professors have the ability to invite students directly through the portal.

This portal serves as a centralized hub for academic collaboration, streamlining project management and fostering research engagement across the university.

**Author of the Project**
Lopez Plascencia, Fernando Augusto - f.lpezplascencia@northeastern.edu 
Sohni Rais - rais.s@northeastern.edu
Abhinav Eeranti- eeranti.a@northeastern.edu 

**How to set up project locally**
Steps to initialize project:
Once you clone the archimedes-web repository, you must have the following prerequisites to get the application running:

**Prerequisites:**
- MySQL instance running on localhost
- Create a database called archimedes db in your local instance
- PHP ( version > 8)
- Composer - Dependency manager for php 
- Node.js (LTS version)
- MySQL Workbench - To test database using SQL queries if needed

Once the repo is in the local files, open terminal in the root folder of the project,

**Here are some commands you can use:**

- “npm run setup-frontend” - setup the frontend by installing necessary modules 
- “npm run setup-backend” - setup the backend by installing necessary dependencies, creating a .env file, with activation key for the app
- “npm run setup-frontend-backend” - setup both frontend and backend folders 
- “npm run load-database” (should be done once the backend is setup) - Loads your backend with the tables and data
- “npm run start-frontend” - starts a react front-end rendering which can be accessed at  “http://localhost:3000”
- “npm run start-backend” - starts a laravel backend as Rest API which can be tested using URL “http://127.0.0.1:8001/”
- ‘npm run start-frontend-backend” - starts both frontend and backend servers

**Sequential steps to initialize the project:**

1. Initialize a local MySQL server instance
2. Create a database with name “archimedesdb” (Keep note of your mysql credentials)
3. Clone the repository to your local files
4. Open terminal on the root folder of the project OR you can open the project in VS code and use the terminal there
5. Run the command “npm run setup-frontend-backend” this installs all the necessary dependencies in frontend and backend folders, and creates a .env file in the backend folder
6. Open .env file in the backend folder, and edit the database configuration with your MySQL credentials
7. Run the command “npm run load-database”, this will create the tables and inserts data in your MySQL database
8. Depending on your use:
a. To test the backend: Run the command “npm run start-backend” - and test api calls at :”http://127.0.0.1:8000/api/v1/”
b. To test the UI components of frontend: Run the command “npm run start-frontend”
c. To test the whole application: Run the command “npm run start-frontend-backend”

**Link of all the tech spec, uml diagram, product spec, Api definition document, use cases, user stories**

1. **Tech Specification Document** - https://docs.google.com/document/d/1Ys5QWI5XXT6gRgHjWcOwVNO7R5ICWT-3/edit?usp=share_link&ouid=101694166166288235946&rtpof=true&sd=true 
2. **Product Spec Document** - https://docs.google.com/document/d/1Ys5QWI5XXT6gRgHjWcOwVNO7R5ICWT-3/edit?usp=share_link&ouid=101694166166288235946&rtpof=true&sd=true 
3. **UML Diagram** - https://docs.google.com/document/d/1Ys5QWI5XXT6gRgHjWcOwVNO7R5ICWT-3/edit?usp=share_link&ouid=101694166166288235946&rtpof=true&sd=true 
4. **UseCase Diagram** - https://drive.google.com/file/d/1_HpV_qqZJZK_8DWVhky0Xe2JuFFyydKr/view?usp=sharing
5. **Figma UI Design** -
  - **Web UI**: https://www.figma.com/design/qKrtdH1SFhhsLIEjRll8sl/Web-Archimedes-Portal?node-id=0-1&p=f&t=tJJqspbN2tJw2lE3-0 
  - **Mobile UI**: https://www.figma.com/design/7GdKQ51AI4jWC4I3z8jJDL/Archimedes-Mobile-UI?node-id=0-1&p=f&t=RaPCfdbpNI8k8Qlu-0
  - **Figma Wireframe** - 
https://www.figma.com/design/bYd9wasXzItaXUd486P7lT/Archimedes-Club?node-id=0-1&p=f&t=7BG7TSDi1oYj7BJz-0 
6. **API Documentation** - 
https://docs.google.com/document/d/1eonZmpwQTGiR6oaZlusNls6Ak3vsCjJ0/edit?usp=share_link&ouid=101694166166288235946&rtpof=true&sd=true 
