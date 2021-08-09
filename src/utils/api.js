import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL
});

instance.interceptors.request.use(function(config) {
    config.headers["Authorization"] = Cookies.get("Authorization");
    return config;
});

export default instance;