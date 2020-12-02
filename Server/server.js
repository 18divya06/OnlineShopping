const express= require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Cors = require('cors');


const app=express();
app.use(Cors());
mongoose.connect('mongodb+srv://admin:' + process.env.MONGO_ATLAS_PWD + '@node-shop.t2vdl.mongodb.net/' + process.env.DB + '?retryWrites=true&w=majority', {
    //useMongoClient: true
    useCreateIndex: true,
    useUnifiedTopology: true, 
    useNewUrlParser: true
});
const db= mongoose.connection;
db.on('error', error => console.error(error));
db.once('open',()=> {console.log('Connected to mongoDB');
});

app.use(bodyParser.json());


//CORS Error handling
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,GET,DELETE');
        return res.status(200).json({});
    }
    next();
});

const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');

app.use(express.static('public'));
app.use('/',indexRouter);
app.use('/user',userRouter);
/*if none of the routes work
app.use((req, res)=>{
    const error= new Error('Not Found');
    error.status=404;
    next(error);
});
process.on('warning', (warning) => {
    console.log(warning.stack);
});*/

app.listen(process.env.PORT || 3000)