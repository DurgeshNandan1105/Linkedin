import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer"

/**
 * 
 * STEPS for state Management
 * Submit Action
 * Handle action in it's reducer
 * Register Here -> Reducer
 */



export const store = configureStore({
    reducer: {
        auth: authReducer
    }
})