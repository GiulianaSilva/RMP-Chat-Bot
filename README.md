RMPbot
Description
RMPbot is a chatbot built using Node.js, TypeScript, and a simple frontend interface. It allows users to interact with a chatbot via a web page and communicates with the backend server to process requests.

Installation and Running the Application
Prerequisites
Before running the application, make sure you have the following installed on your machine:

Node.js: Download Node.js (Make sure you have version 14.x or higher)

npm: npm comes bundled with Node.js, so once you install Node.js, you'll automatically have npm.

Step 1: Clone the Repository

Step 2: Install Dependencies
Run the following command in your terminal to install the required dependencies for the project:

npm install
This will install all necessary dependencies for both the backend (server) and frontend (client).

Step 3: Set Up Environment Variables
Create a .env file in the root directory of the project. This file will store environment variables such as API keys or ports. 


Step 4: Run the Application
To start the backend and frontend, follow these steps:

1. Start the Backend:
In the terminal, run the backend server with the following command:

node server/server.js
This will start the backend server

2. Open the Frontend:
To interact with the chatbot, open the client/ChatBox.html file in your browser. You can simply double-click the file to open it in your default browser, or you can serve it with a local server if you prefer.

Step 5: Access the Application
Once the backend is running and the frontend is open in your browser, navigate to http://localhost:3000 (or the URL that corresponds to your local setup) to start chatting with the bot.

