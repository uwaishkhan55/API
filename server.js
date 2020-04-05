const express = require('express');
const mongoose = require('mongoose');
const app = express();



// Database
const uri = "mongodb+srv://Uwaish55:Uwaish55@cluster0-k5soh.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Controllers
const UserControl = require('./controllers/UserControl');

// Routes
app.post('/create', UserControl.create);
app.put('/update', UserControl.update);
app.get('/retrieve/:id', UserControl.retrieve);
app.delete('/delete', UserControl.delete);

// Start Server
app.listen(3000, () => console.log('Server has started on port 3000...'));