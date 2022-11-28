import axios from "../api/http";

const address = 'http://localhost:8888/test'
export const api = p => axios.post(address + "/hello",p)
