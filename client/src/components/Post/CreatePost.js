//create post
import React, {useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import './styles.css';

//pass props from tag in app.tsx
const CreatePost = (props)=>{
    let history = useHistory();
    //get token and onPostCreated method from props
    const {token,onPostCreated} = props;
    //current value, function that lets us update it...
    //this is part of useState and what it returns.
    const[postData,setPostData]=useState({
        title: '',
        body:''
    });
    //tie title and body to postData
    const {title,body}=postData;

    //update postData on change with the useState value, function that sets value
    const onChange =  e => {
        const {name,value} = e.target;

        setPostData({
            //update the spread with whatever key :value pair matches
            ...postData,
            [name]:value
        })
    }

    //attempt to add post to db and update page
    const create = async() =>{
        if(!title||!body){
            console.log('Title and body are required!');
        }else{
            const newPost ={
                title: title,
                body: body
            };

            try{
                const config = {
                    headers: {
                        'Content-Type' : 'application/json',
                        'x-auth-token' : token
                    }
                };

                const body = JSON.stringify(newPost);
                const res = await axios.post(
                    'http://localhost:5000/api/posts',
                    body,
                    config
                );

                onPostCreated(res.data);
                history.push('/');
            }catch(error){
                console.error(`Error creating post: ${error.response.data}`);
            }
        }
    }

    return(
        <div className="form-container">
            <h2>Create New Post</h2>
            <input
                name="title"
                type="text"
                placeholder="Title"
                value={title}
                onChange={e=>onChange(e)}
            />
            <textarea
                name="body"
                cols="30"
                rows="10"
                value={body}
                onChange={e=>onChange(e)}
            ></textarea>
            <button onClick={() => create()}>Submit</button>
        </div>
    );
};

export default CreatePost;