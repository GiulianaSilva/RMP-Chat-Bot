
<h1>Respect Me Project Chatbot</h1>


<h3>Description</h3>
RMPbot is a chatbot built using Node.js, TypeScript, and a frontend interface. It allows users to interact with a chatbot via a web page and communicates with the backend server to process requests.

<h2>Installation and Running the Application</h2>
<h3>Prerequisites</h3>

Before running the application, make sure you have the following installed on your machine:

Node.js: Download Node.js (Make sure you have version 14.x or higher)

<h3>Step 1:</h3>
Clone the Repository

<h3>Step 2:</h3> 
Install Dependencies
Run the following command in your terminal to install the required dependencies for the project:
This will install all necessary dependencies for both the backend (server) and frontend (client).

<h4>npm install</h4>



<h3>Step 3: </h3> 
Set Up Environment Variables
Create a .env file in the root directory of the project. This file will store environment variables such as API keys. 


<h3>Step 4:</h3>
Run the Application
To start the backend and frontend, follow these steps:

1. Start the Backend:
In your terminal or command prompt, run the backend server with the following command:
<h4>node server/server.js</h4>

If server has started succesfully you should see a message similar to
Server running at http://localhost:3000



3. Open the Frontend:
To interact with the chatbot, Make sure line 108 in the ChatBox.html file has the adress that corresponds with the one your server is running on. Then open the client/ChatBox.html file in your browser. You can simply double-click the file to open it in your default browser, or you can serve it with a local server if you prefer.


