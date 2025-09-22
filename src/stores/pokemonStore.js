/**
 * @file Magasin Pinia connecté à l’API Pokédex.
 * Remplace la version locale (localStorage + tableau en dur) par des appels HTTP.
 * Objectif pédagogique : montrer comment structurer un store simple, séparer l’instance Axios,
 * et gérer les états de chargement + erreurs de façon basique.
 */

import { defineStore } from 'pinia'
import axios from 'axios'

/**
 * Instance Axios centralisée.
 * Avantage : on définit la baseURL une seule fois et on peut injecter facilement des en-têtes (ex. Authorization).
 * VITE_API_URL peut valoir "http://localhost:3535" ou "/api" si vous utilisez un proxy Vite.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3535',
  headers: { 'Accept-Language': 'fr' },
})

export const usePokemonStore = defineStore('pokemon', {
  /**
   * État du store.
   * isLoading : drapeau simple pour bloquer l’UI pendant une requête.
   * types/pokemons : jeux de données récupérés via l’API.
   * selectedPokemon : élément mis en avant pour une page de détail.
   * favorites : liste d’IDs stockée localement (localStorage) côté front.
   * token : jeton d’authentification si votre API protège certaines routes (facultatif en démo).
   */
  state: () => ({
    isLoading: false,
    types: [],
    pokemons: [],
    selectedPokemon: null,
    favorites: [],
    token: null,
  }),

  /**
   * Getters = propriétés calculées du store.
   * But : éviter de répéter des .find(...) dans vos composants.
   */
  getters: {
    /** Nombre de favoris (utile pour un badge ou un compteur dans le header) */
    favoritesCount: s => s.favorites.length,

    /** L’utilisateur est-il connecté ? Ici, on considère que la présence d’un token suffit. */
    isAuthenticated: s => !!s.token,

    /** Récupère un type par son id. Retourne undefined si non trouvé. */
    getTypeById: s => id => s.types.find(t => t.id === id),

    /** Récupère un Pokémon par son id. Retourne undefined si non trouvé. */
    getPokemonById: s => id => s.pokemons.find(p => p.id === id),

    /** Le Pokémon passé en paramètre est-il dans les favoris ? */
    isFavorite: s => pokemon => s.favorites.some(favId => favId === pokemon.id),

    /**
     * Reconstruit la liste d’objets favoris depuis leurs IDs.
     * .filter(Boolean) supprime les trous si un favori n’existe plus dans pokemons.
     */
    getFavorites: s => s.favorites.map(id => s.pokemons.find(p => p.id === id)).filter(Boolean),

    /** Nombre total de Pokémon chargés depuis l’API */
    totalPokemons: s => s.pokemons.length,

    /** Nombre total de favoris */
    totalFavorites: s => s.favorites.length,
  },

  actions: {
    /**
     * Synchronise l’en-tête Authorization de l’instance Axios avec le token du store.
     * À appeler après login() et logout().
     */
    _applyAuthHeader () {
      if (this.token) {
        api.defaults.headers.common.Authorization = `Bearer ${this.token}`
      } else {
        delete api.defaults.headers.common.Authorization
      }
    },

    /**
     * Authentification basique.
     * Selon votre API, changez le body { username, password } en { email, password } ou autre.
     * L’API de démo renvoie typiquement { token }.
     */
    async login (username, password) {
      this.isLoading = true
      try {
        const { data } = await api.post('/login', { username, password })
        // On essaye d’être tolérant sur la forme de la réponse : data.token ou data.data.token
        this.token = data?.token ?? data?.data?.token ?? null
        this._applyAuthHeader()
        return { success: true, message: 'Connexion réussie' }
      } catch (e) {
        // En démo, on reste simple : on n’expose pas les détails techniques à l’étudiant
        return { success: false, message: 'Identifiants invalides' }
      } finally {
        this.isLoading = false
      }
    },

    /** Déconnexion : on supprime le token et on nettoie l’en-tête Authorization */
    logout () {
      this.token = null
      this._applyAuthHeader()
    },

    /**
     * Charge tous les types depuis l’API.
     * Route attendue côté serveur : GET /types
     * La forme de réponse peut varier. On accepte soit { data: [...] } soit directement [...].
     */
    async fetchTypes () {
      this.isLoading = true
      try {
        const { data } = await api.get('/types')
        this.types = data?.data ?? data ?? []
      } catch (e) {
        console.error('Erreur chargement types:', e)
        this.types = []
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Charge tous les pokémons depuis l’API.
     * Route attendue : GET /pokemons
     */
    async fetchPokemons () {
      this.isLoading = true
      try {
        const { data } = await api.get('/pokemons')
        this.pokemons = data?.data ?? data ?? []
      } catch (e) {
        console.error('Erreur chargement pokémons:', e)
        this.pokemons = []
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Création d’un Pokémon.
     * Route attendue : POST /pokemons  avec le body { name, level, types, ... }
     * On repousse la validation au serveur pour simplifier le front des débutants.
     */
    async createPokemon (payload) {
      this.isLoading = true
      try {
        const { data } = await api.post('/pokemons', payload)
        // On ajoute l’élément créé à la liste locale pour réactivité immédiate.
        const created = data?.data ?? data
        if (created) this.pokemons.push(created)
        return { success: true, message: 'Pokémon créé' }
      } catch (e) {
        // On récupère un message d’erreur si le back en fournit un.
        const msg = e.response?.data?.message ||
          e.response?.data?.errors?.[0]?.message ||
          'Erreur lors de la création'
        return { success: false, message: msg }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Modification d’un Pokémon par son id.
     * Route attendue : PUT /pokemons/:id
     */
    async updatePokemon (id, payload) {
      this.isLoading = true
      try {
        const { data } = await api.put(`/pokemons/${id}`, payload)
        const updated = data?.data ?? data
        // Mise à jour optimiste de la liste locale
        const i = this.pokemons.findIndex(p => p.id === id)
        if (i !== -1 && updated) this.pokemons[i] = { ...this.pokemons[i], ...updated }
        return { success: true, message: 'Pokémon modifié' }
      } catch (e) {
        const msg = e.response?.data?.message ||
          e.response?.data?.errors?.[0]?.message ||
          'Erreur lors de la modification'
        return { success: false, message: msg }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Suppression d’un Pokémon par son id.
     * Route attendue : DELETE /pokemons/:id
     * On retire aussi l’élément des favoris s’il y était.
     */
    async deletePokemon (id) {
      this.isLoading = true
      try {
        await api.delete(`/pokemons/${id}`)
        this.pokemons = this.pokemons.filter(p => p.id !== id)
        this.favorites = this.favorites.filter(fid => fid !== id)
        return { success: true, message: 'Pokémon supprimé' }
      } catch {
        return { success: false, message: 'Suppression impossible' }
      } finally {
        this.isLoading = false
      }
    },

    /** Sélectionne un Pokémon pour l’affichage d’une page de détail */
    selectPokemon (id) {
      this.selectedPokemon = this.pokemons.find(p => p.id === id) || null
    },

    /**
     * Charge les favoris depuis le localStorage et nettoie les IDs orphelins
     * (cas typique si on a vidé la base côté back entre deux sessions).
     */
    loadFavorites () {
      this.favorites = JSON.parse(localStorage.getItem('favorites')) || []
      this.favorites = this.favorites.filter(id => this.pokemons.some(p => p.id === id))
    },

    /**
     * Ajoute/retire un favori.
     * On stocke uniquement l’ID pour réduire la taille du localStorage et éviter les doublons de données.
     */
    toggleFavorite (pokemon) {
      const i = this.favorites.findIndex(f => f === pokemon.id)
      if (i === -1) this.favorites.push(pokemon.id)
      else this.favorites.splice(i, 1)
      localStorage.setItem('favorites', JSON.stringify(this.favorites))
    },
  },
})
