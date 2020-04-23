//CRUD == create, read, update, delete.
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    //key
    user:{
        //key / type
        type:'ObjectId',
        ref:'User'
    },
    title:{
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date:{
        type:Date,
        default: Date.now
    }
});

//compiles our model
//(uses singular name parameter, schema to base collections upon)
const Post =  mongoose.model('post',PostSchema);

export default Post;