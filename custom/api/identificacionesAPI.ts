import axios from "axios";

const consultaAPI = axios.create({
    baseURL: 'https://perseo.app/api/datos'
});

export default consultaAPI;