import axios from "axios";

const ROOMS_API_URL = `${import.meta.env.VITE_API_URL}/api/rooms`;
const BOOKINGS_API_URL = `${import.meta.env.VITE_API_URL}/api/bookings`;

const getDashboardRooms = () => {
  return axios.get(ROOMS_API_URL);
};

const getDashboardBookings = () => {
  return axios.get(BOOKINGS_API_URL);
};

export { getDashboardRooms, getDashboardBookings };