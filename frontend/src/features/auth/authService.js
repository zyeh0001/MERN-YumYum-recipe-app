import axios from 'axios';

const API_URL = '/api/users';

//register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

//login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

//logout user
const logout = () => localStorage.removeItem('user');

//get username by id
const getUsername = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.name;
};

//get user fav collection by id
const getUserFav = async (uid) => {
  const response = await axios.get(`${API_URL}/${uid}`);
  localStorage.setItem('favorite', JSON.stringify(response.data.favCollection));
  return response.data.favCollection;
};

const authService = {
  register,
  logout,
  login,
  getUsername,
  getUserFav,
};

export default authService;
