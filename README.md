MERN Stack side project
- MongoDB for storing user information (along with list of favourite players)
- Node.js and Express.js for the backend
- React.js and Redux for the frontend

Install packages:
- (in root directory) - npm install
- (in client directory) - npm install

Run web app and server:
- (in root directory) npm run dev

Flask server for debugging (flask required):
- (in client directory) pip3 install -r flask-server/requirements.txt
- python3 client/flask-server/server.py (in root directory, or cd into client directory and run the line without the client/)

First version (no backend) currently being hosted on AWS (please be gentle with the API calls I'm using the free version)
http://baseball-stats-bucket.s3-website.us-east-2.amazonaws.com/

Second version with backend (login system) currently in development
