const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const exphbs = require('express-handlebars');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();
const app = express();


//settings
app.set('views', path.join(__dirname, 'public'));

app.use(cors())
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({limit: "50mb", extended: false, parameterLimit:50000}));
app.use(compression())

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/uploads'),
  filename: (_req, file, cd) => {
    cd(null, new Date().getTime() + path.extname(file.originalname));
  }
});
app.use(multer({storage}).single('image'));

app.use("/api/employees", require('./back-end/routes/employees.routes'));
app.use("/api/users", require('./back-end/routes/users.routes'));
app.use("/api/inventory", require('./back-end/routes/inventory.routes'));
app.use("/api/navigation", require('./back-end/routes/navigation.routes'));

// Start Server
app.use(express.static(__dirname + '/dist/angular-v14'));
app.get('/*', function(_req,res){
    res.sendFile(path.join(__dirname+'/dist/angular-v14/index.html'))
})


module.exports = app;
