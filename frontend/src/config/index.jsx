const { default: axios } = require("axios");

const clientServer = axios.create({
    baseURl: "http://localhost:9090",
})