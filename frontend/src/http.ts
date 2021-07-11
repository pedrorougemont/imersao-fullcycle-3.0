import axios from 'axios';

const http = axios.create({
    baseURL: `http://${process.env.REACT_APP_AXIOS_HOSTNAME}:${process.env.REACT_APP_AXIOS_PORT}/api`
})

export default http;