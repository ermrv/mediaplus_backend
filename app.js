const express = require('express');
const path = require('path');
const morgan = require("morgan");
// const socketio = require('socket.io')();
const http = require('http');

// MongoDB Connection
const mongo = require('./3_SystemKernel/database/connection')
const db = require('./3_SystemKernel/database/models')

// // socket configuration
// const WebSockets = require('./utils/WebSockets.js');

// Set up the express app
const app = express();
app.use(morgan("dev"));
// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cors
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}
	next();
});

// /** catch 404 and forward to error handler */
// app.use('*', (req, res) => {
// 	return res.status(404).json({
// 		success: false,
// 		message: 'API endpoint doesnt exist'
// 	})
// });


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//..........................Routes..............................
app.get('/', (req, res) => res.json({ message: "You are on homepage" }))
app.use('/api', require('./1_Routes/routes'));

/** Create HTTP server. */
const server = http.createServer(app);
/** Create socket connection */

// global.io = socketio.listen(server);
// global.io.on('connection', WebSockets.connection)


//........................Connections...........................
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
