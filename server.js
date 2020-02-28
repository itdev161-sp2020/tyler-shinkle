import express from 'express';
import connectDatabase from './config/db';
//importing check and validationResult which are named exports (hence the curly braces)
//no braces will import whatever the default export is...
import {check,validationResult} from 'express-validator';

//initialize express application
const app = express();

//connect database // function within db.js file we imported above.
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
 app.post(
     //destination
     '/api/users',
     //functions which return an error if true.
     [
        check('name','Please enter your name.')
            .not()
            .isEmpty(),
        check(
            'password',
            'Please enter a password with 6 or more characters.'
        ).isLength({min:6})
     ],
     //function with request and response objects
     (req,res)=>{
     //errors caught from imported express-validator and above code
     const errors = validationResult(req);
     //if there is an error return error object array
     if(!errors.isEmpty()){
         return res.status(442).json({errors:errors.array() });
     //otherwise return request body
     } else{
         return res.send(req.body);
     }
    }
 );

//connection listener
app.listen(3000, ()=>console.log('Express server running on port 3000'));

//to test run npm run server and navigate to localhost:3000
//postman helps us test this api and build custom headers / bodies