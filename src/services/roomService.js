import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/rooms`;

const getRooms = () => {
  return axios.get(API_URL);
};

export { getRooms };