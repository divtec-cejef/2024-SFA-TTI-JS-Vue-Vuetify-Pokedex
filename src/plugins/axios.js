import axios from 'axios'

// URL de l'API : Vercel par défaut (utilisable depuis le web ET les apps mobiles
// iOS/Android compilées via Capacitor). Pour passer en local, définir
// VITE_API_URL=http://localhost:3535 dans un fichier .env.local
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://2025-sfa-pokedex-api.vercel.app'

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
