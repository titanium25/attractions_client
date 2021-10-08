import axios from "axios";

const url = 'https://att-api-alex.herokuapp.com/api/att';

const getAtt = () => {
    return axios.get(url)
}

export default {getAtt}
