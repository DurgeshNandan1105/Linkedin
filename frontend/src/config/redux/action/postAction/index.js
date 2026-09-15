import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async(_, thunkAPI) => {
        try{
            const response = await clientServer.get('/posts')
            return thunkAPI.fulfillWithValue(response.data)

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)

export const createPost = createAsyncThunk(
    "post/createPost",
    async (UserData, thunkAPI) => {
        const {file, body} = UserData;
        try{
            const formData = new FormData();
            formData.append('token', localStorage.getItem('token'))
            formData.append('body', body)
            formData.append('media', file)

            const response = await clientServer.post("/post", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if(response.status === 200) {
                return thunkAPI.fulfillWithValue("Post Uploaded");
            } else {
                return thunkAPI.rejectWithValue("Post not uploaded")
            }

        } catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)