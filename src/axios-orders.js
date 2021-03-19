import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burger-builder-d9692-default-rtdb.firebaseio.com/',
});

export default instance;