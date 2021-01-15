const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Cors = require('cors');

const app = express();
app.use(Cors());
mongoose.connect('mongodb+srv://admin:12345@cluster0.4nidw.mongodb.net/node?retryWrites=true&w=majority', {
    //useMongoClient: true
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => {
    console.log('Connected to mongoDB');
});

app.use(bodyParser.json());


//CORS Error handling
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,GET,DELETE');
        return res.status(200).json({});
    }
    next();
});

const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const permissionRouter = require('./routes/permission');

app.use(express.static('public'));
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/permission', permissionRouter);

const socketIo = require("./socket").init(
    app.listen(process.env.PORT || 3000))
socketIo.on('connection', socket => {
    console.log("Connnection Established!!!!");
})