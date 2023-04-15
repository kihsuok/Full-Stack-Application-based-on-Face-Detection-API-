# facerecog

This is a Full Stack Application based on a Face Detection API by Clarifai. 
The Front-end is developed using ReactJS and styles are implemented using Tachyons(a npm module) and the Backend Server is Developed using Express.js. The databse is maintained using PostgreSQL.
The password is encrypted using another npm module named bcrypt.
A new user is created in the databse when they register and the data is used when the user tries to sign in next time.
The API built by Clarifai recognises a face in the given URL of an image if any. Every time the user tries to detect a link, the number of uses by them increses in the database. A leaderboard is maintained based on this data which is constantly updated.
It is fully responsive and has implemented everything required for a full stack application.
