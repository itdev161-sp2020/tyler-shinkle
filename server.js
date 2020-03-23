import express from 'express';
import connectDatabase from './config/db';
//importing check and validationResult which are named exports (hence the curly braces)
//no braces will import whatever the default export is...
import {check,validationResult} from 'express-validator';
//allow CORS
import cors from 'cors';
//our model to create users
import User from './models/User';
//used to encrypt password
import bcrypt from 'bcryptjs';

//initialize express application
const app = express();

//connect database // function within db.js file we imported above.
connectDatabase();

//configure middleware (express is the web server framework and cors allows for CORS)
app.use(express.json({extended: false}));
app.use(
    cors({
        origin:'http://localhost:3000'
    })
)

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
     //functions which create an error object if false.
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
     async (req,res)=>{
     //errors caught from imported express-validator and above code
     const errors = validationResult(req);
     //if there is an error return error object array (msg, param, location) are properties of errors
     if(!errors.isEmpty()){
         return res.status(442).json({errors:errors.array() });
     //otherwise return request body
     } else{
        //deconstruct request body into 3 constants
        //const {propName, anotherPropName} = object with matching props;
        const {name, email, password} = req.body;
        try{
            //check if user exists
            let user = await User.findOne({email:email});
            //if user exists, send error message
            if(user){
                return res
                    .status(400)
                    .json({errors: [{msg: 'User already exists'}]});
            }

            //create new user if no match was found
            user = new User({
                name: name,
                email: email,
                password: password
            });

            //encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password,salt);

            //save user to db and return 
            await user.save();
            res.send("User successfully registered!");
        }catch(error){
            res.status(500).send("Server Error!");
        }
     }
    }
 );

//connection listener
//changed ports to prevent interference, template literals require  back ticks ``
const port = 5000;
app.listen(port, ()=>console.log(`Express server running on port ${port}`));

//to test run npm run server and navigate to localhost:3000
//postman helps us test this api and build custom headers / bodies