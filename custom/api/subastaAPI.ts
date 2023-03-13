import axios from "axios";

const subastaAPI = axios.create({
    baseURL: '/api'
});

export default subastaAPI;