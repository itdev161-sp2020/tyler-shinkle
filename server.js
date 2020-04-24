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
//import json web token
import jwt from 'jsonwebtoken';
//import config...
import config from 'config';
//middleware to verify token 
import auth from './middleware/auth';
//import our post model
import Post from './models/Post';

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
            
            //generate and return JWT
            returnToken(user, res);
        }catch(error){
            res.status(500).send("Server Error!");
        }
     }
    }
 );

 //AUTHORIZE
 //verify token and authenticate user 
 app.get('/api/auth',auth,async(req,res) => {
     try{
         const user = await User.findById(req.user.id);
         res.status(200).json(user);
     }catch(error){
         res.status(500).send('Unkown server error');
     }
 })

 //LOGIN
 app.post(
     //url which triggers this function
     '/api/login',
     //parameters which validate our email and password
     [
         check('email','Please enter a valid email').isEmail(),
         check('password','A password is required').not().isEmpty()
     ],
     //anon async callback method with req / res objects
     async(req,res)=>{
         // set constant to our errors 
        const errors = validationResult(req);
        //if errors is not empty do this, otherwise...
        if(!errors.isEmpty()){
            return res.status(422).json({errors:errors.array()});
        }else{
            //assign values within body to constants of a like key
            const {email, password} = req.body;
            try{
                //check if user exists
                let user = await User.findOne({email: email});
                if(!user){
                    return res
                        .status(400)
                        .json({errors:[{msg: 'Invalid email or password'}] });
                }

                //check password
                const match = await bcrypt.compare(password, user.password);
                if(!match){
                    return res
                        .status(400)
                        .json({errors:[{msg:'Invalid email or password'}] });
                }
                //generate and return a JWT token 
                returnToken(user, res);
            }catch(error){
                res.status(500).send('Server error');
            }
        }
     }
 );

 // Post endpoints
 /*
     @route Post api/posts
     @desc Create post
 */
app.post(
    //url extension
    '/api/posts',
    [
        //auth middleware
        auth,
        [
            //check our fields and load error messages if needed.
            check('title','Title text is required.')
                .not()
                .isEmpty(),
            check('body','Body text is required')
                .not()
                .isEmpty()
        ]
    ],
    //async, doesn't block when used with await
    //return value wrapped in promise
    async (req,res)=>{
        //set out error constant to the return value 
        //of our validation with req passed.
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({errors:errors.array()});
        }else{
            //object deconstructor
            const{ title, body } = req.body;
            try{
                //find user's post
                const user = await User.findById(req.user.id);
                //create a new post 
                const post = new Post({
                    user: user.id,
                    title: title,
                    body: body
                });

                //save to db and return 
                await post.save();

                res.json(post);
            }catch(error){
                console.error(error);
                res.status(500).send('Server error');
            }
        }
    }
);

//GET POSTS
app.get('/api/posts',auth,async(req,res)=>{
    try{
        const posts = await Post.find().sort({date:-1});
        res.json(posts);
    }catch(error){
        console.error(error);
        res.status(500).send('Server error');
    }
});

 const returnToken = (user,res) => {
     const payload ={
         user:{
             id:user.id
         }
     };

     jwt.sign(
         payload,
         config.get('jwtSecret'),
         {expiresIn: '10hr'},
         (err,token) => {
             if(err) throw err;
             res.json({token: token});
         }
     );
 };

//connection listener
//changed ports to prevent interference, template literals require  back ticks ``
const port = 5000;
app.listen(port, ()=>console.log(`Express server running on port ${port}`));

//to test run npm run server and navigate to localhost:3000
//postman helps us test this api and build custom headers / bodies