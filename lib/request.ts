import axios from "axios";

const request = axios.create({
    baseURL: `${process.env.API_URL}api/v1/`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default request;