import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";

export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI) => {
      try {
        const response = await clientServer.post(`/login`, {
            email: user.email,
            password: user.password
        });

        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        } else {
            return thunkAPI.rejectWithValue({
                message: "token not provided"
            });
        }

        return thunkAPI.fulfillWithValue(response.data.token);

      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || { message: error.message });
      }
    }
) 

export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {
      try {
        const request = await clientServer.post("/register", {
          username: user.username,
          password: user.password,
          email: user.email,
          name: user.name,
        });

        return request.data;
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
      }
    }
)

export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkAPI) => {
    try{
      console.log(`Token: ${user.token}`)
      const response = await clientServer.get("/get_user_and_profile", {
        params: {
          token: user.token
        }
      })
      return thunkAPI.fulfillWithValue(response.data);

    } catch(err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: err.message })
    }
  }
)
