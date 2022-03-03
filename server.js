const express = require("express");
const app = express();
const connectDB = require("./config/db");
const path = require("path");
connectDB();
const cors = require('cors');

const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(express.json());

//Cors

const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(',')
}
app.use(cors(corsOptions));
//Template engine
app.set('views', path.join(__dirname,'/views'))
app.set('view engine', 'ejs')

//Routes
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.get('/', (req,res) => {
    res.render('index');
});
app.use('/files/download', require('./routes/download'));

app.listen(PORT , () => {
    console.log(`server running on port ${PORT}`);
})