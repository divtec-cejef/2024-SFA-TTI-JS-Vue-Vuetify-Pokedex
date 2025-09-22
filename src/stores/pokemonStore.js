import { defineStore } from 'pinia'
import axios from 'axios'

export const usePokemonStore = defineStore('pokemon', {
  /**
   * Définit l'état initial du store Pokemon.
   * @returns {Object} - L'état initial de l'application Pokémon.
   */
  state: () => ({
    isLoading: false, // Indicateur de chargement global
    apiUrl: 'http://localhost:3535/', // URL de base pour accéder à l'API
    types: [], // Liste des types de Pokémon obtenue depuis l'API
    pokemons: [], // Liste des Pokémon obtenue depuis l'API
    selectedPokemon: null, // Pokémon actuellement sélectionné pour affichage en détail
    favorites: [], // Liste des Pokémon favoris
    token: null, // Token d'authentification pour les requêtes API sécurisées
  }),

  getters: {
    /**
     * Compte le nombre de Pokémon dans les favoris.
     * @param {Object} state - L'état actuel du store.
     * @returns {number} - Le nombre total de Pokémon favoris.
     */
    favoritesCount: state => state.favorites.length,

    /**
     * Détermine si l'utilisateur est actuellement authentifié.
     * @param {Object} state - L'état actuel du store.
     * @returns {boolean} - `true` si un token est présent, indiquant une connexion.
     */
    isAuthenticated: state => !!state.token,
  },

  actions: {
    /**
     * Authentifie l'utilisateur avec email et mot de passe.
     * Enregistre le token dans l'état en cas de succès.
     * @param {string} email - L'email de l'utilisateur.
     * @param {string} password - Le mot de passe de l'utilisateur.
     * @returns {Promise<Object>} - Objet contenant le statut `success` et un `message`.
     */
    async login (email, password) {
      this.isLoading = true
      try {
        const response = await axios.post(`${this.apiUrl}/auth/login`, {
          email,
          password,
        })
        // Stocke le token en cas de succès
        this.token = response.data.data.access_token
        // Configure les entêtes de requête pour inclure le token
        axios.defaults.headers.common.Authorization = `Bearer ${this.token}`
        axios.defaults.headers.common['Accept-Language'] = 'fr'
        // Ajoute un délai de 3 secondes avant de retourner la réponse
        await new Promise(resolve => setTimeout(resolve, 3000))

        return {
          success: true,
          message: 'Connexion réussie',
        }
      } catch (error) {
        return {
          success: false,
          message: 'Mauvais email ou mot de passe !',
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Déconnecte l'utilisateur en supprimant le token.
     */
    logout () {
      this.token = null
      delete axios.defaults.headers.common.Authorization
    },

    /**
     * Crée un nouveau Pokémon en envoyant les données à l'API.
     * @param {Object} data - Les données du Pokémon à créer.
     * @returns {Promise<void>}
     */
    async createPokemon (data) {
      this.isLoading = true
      try {
        const response = await axios.post(`${this.apiUrl}/items/pokemon`, data)
        // Ajoute le nouveau Pokémon à la liste locale
        this.pokemons.push(response.data.data)
      } catch (error) {
        // Récupère un message d'erreur spécifique si disponible, sinon un message par défaut
        const errorMessage = error.response?.data?.errors?.[0]?.message || 'Une erreur est survenue lors de la création du Pokémon.'
        throw new Error(errorMessage)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Supprime un Pokémon en envoyant une requête DELETE à l'API.
     * @param {number} id - L'ID du Pokémon à supprimer.
     * @returns {Promise<void>}
     */
    async deletePokemon (id) {
      this.isLoading = true
      try {
        await axios.delete(`${this.apiUrl}/items/pokemon/${id}`)
        // Supprime le Pokémon de la liste locale
        this.pokemons = this.pokemons.filter(p => p.id !== id)
        // Supprime également des favoris s'il y est présent
        this.favorites = this.favorites.filter(p => p.id !== id)
      } catch (error) {
        throw new Error('Suppression impossible !')
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Récupère tous les types de Pokémon et les stocke dans l'état.
     */
    async fetchTypes () {
      this.isLoading = true
      try {
        const typesResponse = await axios.get(`${this.apiUrl}/items/type`)
        this.types = typesResponse.data.data
      } catch (error) {
        console.error('Erreur lors du chargement des types:', error)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Récupère tous les Pokémon depuis l'API et les stocke dans l'état.
     */
    async fetchPokemons () {
      this.isLoading = true
      try {
        const response = await axios.get(`${this.apiUrl}/items/pokemon?fields=*,images.*,types.type_id.*&limit=-1`)
        this.pokemons = response.data.data
      } catch (error) {
        console.error('Erreur lors du chargement des pokémons:', error)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Sélectionne un Pokémon à afficher en détail par son ID.
     * @param {number} id - L'ID du Pokémon à sélectionner.
     */
    selectPokemon (id) {
      this.selectedPokemon = this.pokemons.find(p => p.id === id) || null
    },

    /**
     * Charge la liste des Pokémon favoris depuis le localStorage.
     */
    loadFavorites () {
      this.favorites = JSON.parse(localStorage.getItem('favorites')) || []
    },

    /**
     * Ajoute ou retire un Pokémon des favoris et met à jour le localStorage.
     * @param {Object} pokemon - Le Pokémon à ajouter ou retirer des favoris.
     */
    toggleFavorite (pokemon) {
      const index = this.favorites.findIndex(fav => fav.id === pokemon.id)
      if (index === -1) {
        this.favorites.push(pokemon)
      } else {
        this.favorites.splice(index, 1)
      }
      // Sauvegarde la liste des favoris dans le localStorage
      localStorage.setItem('favorites', JSON.stringify(this.favorites))
    },

    /**
     * Vérifie si un Pokémon est dans les favoris.
     * @param {Object} pokemon - Le Pokémon à vérifier.
     * @returns {boolean} - `true` si le Pokémon est dans les favoris.
     */
    isFavorite (pokemon) {
      return this.favorites.some(fav => fav.id === pokemon.id)
    },
  },
})
