import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/bookings`;

const getBookings = () => {
  return axios.get(API_URL);
};

export { getBookings };