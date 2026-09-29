import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/rooms`;

const getRooms = () => {
  return axios.get(API_URL);
};

const createRoom = (room) => {
  return axios.post(API_URL, room);
};

const updateRoom = (id, room) => {
  return axios.put(`${API_URL}/${id}`, room);
};

const deleteRoom = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
};