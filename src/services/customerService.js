import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/customers`;

const getCustomers = () => {
  return axios.get(API_URL);
};

const createCustomer = (customer) => {
  return axios.post(API_URL, customer);
};

const updateCustomer = (id, customer) => {
  return axios.put(`${API_URL}/${id}`, customer);
};

const deleteCustomer = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
};