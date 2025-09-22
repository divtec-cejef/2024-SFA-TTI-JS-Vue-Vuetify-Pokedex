import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3535'

axios.defaults.baseURL = API_BASE_URL
axios.defaults.headers.common['Accept-Language'] = 'fr'
axios.defaults.headers.common['Content-Type'] = 'application/json'

export function setAuthToken (token) {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common.Authorization
  }
}

export default axios
