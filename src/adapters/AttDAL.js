import axios from "axios";

const url = 'http://13.51.205.210:2020/api/att';

const getAtt = () => {
    return axios.get(url)
}

export default {getAtt}
