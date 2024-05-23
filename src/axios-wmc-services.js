import axios from "axios";

const instance = axios.create({
  baseURL: "https://wmc-services-default-rtdb.firebaseio.com/",
});

export default instance;