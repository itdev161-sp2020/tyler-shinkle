import mongoose from 'mongoose';

//NOTES TO SELF TO ENHANCE UNDERSTANDING
//We already created a cluster in activity #2  with MongoDB
//We also created a .gitignore file to avoid unneccessary file transfers
//We then switched to a new branch and ran npm init which created a package.json file
//We installed various dependencies which were downloaded to our node_modules folder, 
//they were also added to dependency object in our package.json file.

//Create a schema for users, similar to creating a series of tables in SQL
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
});

//Generate a model named 'User' mongoose.model('name',schema)
//Models in mongoose are fancy constructors compiled from schema definitions
const User = mongoose.model('user',UserSchema);

//Export the User model to make it accessible to the rest of your application
//export is a javascript keyword I need to research further...
export default User;

//stage, commit and push branch
//git add . 
//git commit -m "message"
//git -u origin "branchName"