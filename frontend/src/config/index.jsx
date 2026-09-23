import axios from "axios";

export const BASE_URL = "https://proconnect-1w84.onrender.com"

export const clientServer = axios.create({
    baseURL: BASE_URL,
})
