import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://127.0.0.1:8000/api/v1',
  baseURL: 'https://invoice-extraction-ai-swj3.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;