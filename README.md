Install packages in root directory and in client directory
- (in root directory) npm install
- (cd into client directory) npm install

Run web app and server:
- npm run dev

Flask server for debugging (flask required):
- cd into client
- pip3 install -r flask-server/requirements.txt
- python3 flask-server/server.py

Make sure to run npm install on both the root directory and client directory

First version (no backend) currently being hosted on AWS (please be gentle with the API calls I'm using the free version)
http://baseball-stats-bucket.s3-website.us-east-2.amazonaws.com/

Second version with backend (login system) currently in development
