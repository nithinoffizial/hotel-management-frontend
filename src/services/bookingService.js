import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/bookings`;

const getBookings = () => {
  return axios.get(API_URL);
};

const createBooking = (booking) => {
  return axios.post(API_URL, booking);
};

const updateBooking = (id, booking) => {
  return axios.put(`${API_URL}/${id}`, booking);
};

const deleteBooking = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
};