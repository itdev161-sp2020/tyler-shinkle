import express from 'express';
import connectDatabase from './config/db';

//initialize express application
const app = express();

//connect database
connectDatabase();

//configure middleware
app.use(express.json({extended: false}));

//API endpoints

/**
 * @route GET / 
 * @desc Test endpoint
 */
app.get('/',(req,res)=>
    res.send('http get request sent to root api endpoint')
);

/**
 * @route POST api/users
 * @desc Register user
 */

 //When a post is made to our 'api/users' page log the request body and respond with it.
 app.post('/api/users',(req,res)=>{
     console.log(req.body);
     res.send(req.body);
 });

//connection listener
app.listen(3000, ()=>console.log('Express server running on port 3000'));

//to test run npm run server and navigate to localhost:3000