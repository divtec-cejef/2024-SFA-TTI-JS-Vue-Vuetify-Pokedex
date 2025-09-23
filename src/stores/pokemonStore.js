/**
 * @file Gestionnaire de magasin pour les données des Pokémon.
 * Utilise Pinia pour gérer les types de Pokémon, la liste des Pokémon,
 * les opérations CRUD (Create, Read, Update, Delete) et les favoris.
 * Communique avec une API backend pour persister les données.
 * @version 2.0
 * @since 2024-09-22
 */

import { defineStore } from 'pinia'
import api from '@/plugins/axios'

/**
 * Client Axios partagé configuré dans `src/plugins/axios.js`.
 * Les en-têtes (dont Authorization) sont gérés globalement par
 * le store d'authentification (src/stores/authStore.js).
 */

/**
 * Magasin Pinia pour gérer toutes les données relatives aux Pokémon.
 * Ce magasin s'occupe uniquement de tout ce qui concerne les Pokémon :
 * - Charger la liste des Pokémon depuis l'API
 * - Ajouter, modifier, supprimer des Pokémon
 * - Gérer les types de Pokémon
 * - Gérer les favoris (stockage local)
 * - Sélectionner un Pokémon pour affichage détaillé
 */
export const usePokemonStore = defineStore('pokemon', {
  /**
   * État initial du magasin Pokémon.
   * Ces données représentent toutes les informations sur les Pokémon gérées par l'app.
   */
  state: () => ({
    /**
     * Indique si une opération de chargement est en cours.
     * Permet d'afficher des spinners ou désactiver des boutons pendant les requêtes API.
     * @type {boolean}
     */
    isLoading: false,

    /**
     * Liste de tous les types de Pokémon disponibles.
     * Chaque type contient un id, un nom, et une couleur pour l'affichage.
     * Exemples : Feu, Eau, Plante, Électrique, etc.
     * @type {Array<{id: number, name: string, color: string}>}
     */
    types: [],

    /**
     * Liste de tous les Pokémon chargés depuis l'API.
     * Chaque Pokémon contient ses informations complètes : nom, types, niveau, stats, etc.
     * @type {Array<Object>}
     */
    pokemons: [],

    /**
     * Le Pokémon actuellement sélectionné pour affichage détaillé.
     * Utilisé pour les pages de détail d'un Pokémon spécifique.
     * Vaut `null` si aucun Pokémon n'est sélectionné.
     * @type {Object|null}
     */
    selectedPokemon: null,

    /**
     * Liste des identifiants des Pokémon marqués comme favoris par l'utilisateur.
     * Ces favoris sont stockés localement dans le navigateur (localStorage).
     * On ne stocke que les IDs pour économiser l'espace et éviter les doublons.
     * @type {Array<string>}
     */
    favorites: [],
  }),

  /**
   * Getters : propriétés calculées basées sur l'état du magasin.
   * Ces fonctions permettent d'accéder facilement à des données dérivées.
   */
  getters: {
    /**
     * Compte le nombre total de Pokémon chargés.
     * Utile pour afficher des statistiques ou des compteurs dans l'interface.
     * @param {Object} state - L'état actuel du magasin
     * @returns {number} Le nombre total de Pokémon dans la liste
     */
    totalPokemons: state => {
      return state.pokemons.length
    },

    /**
     * Compte le nombre total de favoris.
     * Pratique pour afficher un badge avec le nombre de favoris dans l'interface.
     * @param {Object} state - L'état actuel du magasin
     * @returns {number} Le nombre de Pokémon favoris
     */
    totalFavorites: state => {
      return state.favorites.length
    },

    /**
     * Trouve un type de Pokémon par son identifiant.
     * Évite de réécrire la logique de recherche dans chaque composant.
     * @param {Object} state - L'état actuel du magasin
     * @returns {function(number): Object|undefined} Fonction qui prend un ID et retourne le type correspondant
     */
    getTypeById: state => {
      return typeId => {
        return state.types.find(type => type.id === typeId)
      }
    },

    /**
     * Trouve un Pokémon par son identifiant.
     * Très utile pour récupérer les détails d'un Pokémon spécifique.
     * @param {Object} state - L'état actuel du magasin
     * @returns {function(string): Object|undefined} Fonction qui prend un ID et retourne le Pokémon correspondant
     */
    getPokemonById: state => {
      return pokemonId => {
        return state.pokemons.find(pokemon => pokemon.id === pokemonId)
      }
    },

    /**
     * Vérifie si un Pokémon donné est dans les favoris.
     * Permet d'afficher différemment les Pokémon favoris dans l'interface (cœur rouge, etc.).
     * @param {Object} state - L'état actuel du magasin
     * @returns {function(Object): boolean} Fonction qui prend un Pokémon et retourne `true` s'il est favori
     */
    isFavorite: state => {
      return pokemon => {
        return state.favorites.includes(pokemon.id)
      }
    },

    /**
     * Récupère la liste complète des objets Pokémon favoris.
     * Transforme la liste d'IDs de favoris en liste d'objets Pokémon complets.
     * Filtre automatiquement les favoris qui n'existent plus.
     * @param {Object} state - L'état actuel du magasin
     * @returns {Array<Object>} Liste des Pokémon favoris (objets complets)
     */
    getFavorites: state => {
      // On parcourt la liste des IDs favoris
      const favoritePokemons = state.favorites.map(favoriteId => {
        // Pour chaque ID, on cherche le Pokémon correspondant
        return state.pokemons.find(pokemon => pokemon.id === favoriteId)
      })

      // On filtre pour éliminer les undefined (favoris qui n'existent plus)
      return favoritePokemons.filter(pokemon => pokemon !== undefined)
    },
  },

  /**
   * Actions : méthodes qui peuvent modifier l'état du magasin.
   * Toute la logique métier concernant les Pokémon se trouve ici.
   */
  actions: {
    /**
     * Initialise le store Pokémon au démarrage de l'application.
     * Cette méthode doit être appelée une seule fois dans main.js.
     *
     * ÉTAPES DE CETTE MÉTHODE :
     * 1. Charger types et pokémons en parallèle
     * 2. Restaurer les favoris depuis le localStorage
     * 3. Afficher un message de confirmation
     */
    async init () {
      console.log('🚀 Initialisation du store Pokémon...')

      this.isLoading = true

      try {
        await Promise.all([
          this.fetchTypes({ withLoader: false }),
          this.fetchPokemons({ withLoader: false }),
        ])

        // Charger les favoris sauvegardés dans le navigateur
        this.loadFavorites()

        console.log('✅ Store Pokémon initialisé')
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation du store Pokémon:', error)
      } finally {
        this.isLoading = false
      }

      console.log('ℹ️ Les requêtes utilisent maintenant la configuration axios globale')
    },

    /**
     * Charge tous les types de Pokémon depuis l'API.
     * Les types sont utilisés pour catégoriser les Pokémon (Feu, Eau, Plante, etc.).
     *
     * ÉTAPES DE CETTE MÉTHODE :
     * 1. Activer l'indicateur de chargement
     * 2. Faire la requête GET vers l'API
     * 3. Stocker les types reçus dans le state
     * 4. Gérer les erreurs éventuelles
     * 5. Désactiver l'indicateur de chargement
     *
     * @returns {Promise<void>}
     */
    async fetchTypes ({ withLoader = true } = {}) {
      console.log('📥 Chargement des types de Pokémon depuis l\'API...')

      // ÉTAPE 1 : Activer l'indicateur de chargement
      if (withLoader) this.isLoading = true

      try {
        // ÉTAPE 2 : Requête GET vers l'API
        // Le token d'authentification est automatiquement ajouté par la configuration d'Axios
        const response = await api.get('/types')

        // ÉTAPE 3 : Traitement de la réponse
        // L'API peut retourner les données dans différents formats, on s'adapte
        if (response.data && response.data.data) {
          // Format : { data: [...] }
          this.types = response.data.data
        } else if (response.data) {
          // Format direct : [...]
          this.types = response.data
        } else {
          // Format inattendu, on met un tableau vide
          this.types = []
        }

        console.log('✅ Types de Pokémon chargés:', this.types.length, 'éléments')
      } catch (error) {
        // ÉTAPE 4 : Gestion des erreurs
        console.error('❌ Erreur lors du chargement des types:', error.message)

        // En cas d'erreur, on met un tableau vide pour éviter les plantages
        this.types = []

        // Afficher une erreur plus détaillée si disponible
        if (error.response) {
          console.error('   Détail de l\'erreur serveur:', error.response.status, error.response.data)
        }
      } finally {
        // ÉTAPE 5 : Désactiver l'indicateur de chargement dans tous les cas
        if (withLoader) this.isLoading = false
      }
    },

    /**
     * Charge tous les Pokémon depuis l'API.
     * Récupère la liste complète des Pokémon avec leurs informations détaillées.
     *
     * ÉTAPES DE CETTE MÉTHODE :
     * 1. Activer l'indicateur de chargement
     * 2. Faire la requête GET vers l'API
     * 3. Stocker les Pokémon reçus dans le state
     * 4. Nettoyer les favoris obsolètes
     * 5. Gérer les erreurs éventuelles
     * 6. Désactiver l'indicateur de chargement
     *
     * @returns {Promise<void>}
     */
    async fetchPokemons ({ withLoader = true } = {}) {
      console.log('📥 Chargement des Pokémon depuis l\'API...')

      // ÉTAPE 1 : Activer l'indicateur de chargement
      if (withLoader) this.isLoading = true

      try {
        // ÉTAPE 2 : Requête GET vers l'API
        const response = await api.get('/pokemons')

        // ÉTAPE 3 : Traitement de la réponse
        if (response.data && response.data.data) {
          this.pokemons = response.data.data
        } else if (response.data) {
          this.pokemons = response.data
        } else {
          this.pokemons = []
        }

        console.log('✅ Pokémon chargés:', this.pokemons.length, 'éléments')

        // ÉTAPE 4 : Nettoyer les favoris qui ne correspondent plus à des Pokémon existants
        this.cleanupFavorites()
      } catch (error) {
        // ÉTAPE 5 : Gestion des erreurs
        console.error('❌ Erreur lors du chargement des Pokémon:', error.message)

        this.pokemons = []

        if (error.response) {
          console.error('   Détail de l\'erreur serveur:', error.response.status, error.response.data)
        }
      } finally {
        // ÉTAPE 6 : Désactiver l'indicateur de chargement dans tous les cas
        if (withLoader) this.isLoading = false
      }
    },

    /**
     * Ajoute un nouveau Pokémon via l'API.
     *
     * ÉTAPES DE CETTE MÉTHODE :
     * 1. Valider les données du Pokémon
     * 2. Activer l'indicateur de chargement
     * 3. Envoyer la requête POST à l'API
     * 4. Ajouter le nouveau Pokémon à la liste locale
     * 5. Retourner le résultat de l'opération
     * 6. Gérer les erreurs éventuelles
     * 7. Désactiver l'indicateur de chargement
     *
     * @param {Object} pokemonData - Les données du Pokémon à créer
     * @param {string} pokemonData.name - Le nom du Pokémon
     * @param {number} pokemonData.level - Le niveau du Pokémon
     * @param {Array<number>} pokemonData.types - Les IDs des types du Pokémon
     * @returns {Promise<Object>} Objet avec `success` (boolean) et `message` (string)
     */
    async addPokemon (pokemonData) {
      console.log('➕ Tentative d\'ajout d\'un nouveau Pokémon:', pokemonData)

      // ÉTAPE 1 : Validation basique des données
      if (!pokemonData.name || !pokemonData.level) {
        const errorMessage = 'Le nom et le niveau du Pokémon sont obligatoires'
        console.error('❌', errorMessage)
        return {
          success: false,
          message: errorMessage,
        }
      }

      // ÉTAPE 2 : Activer l'indicateur de chargement
      this.isLoading = true

      try {
        // ÉTAPE 3 : Envoyer les données à l'API
        const response = await api.post('/pokemons', pokemonData)

        // ÉTAPE 4 : Récupérer le Pokémon créé depuis la réponse
        let newPokemon = null
        if (response.data && response.data.data) {
          newPokemon = response.data.data
        } else if (response.data) {
          newPokemon = response.data
        }

        // ÉTAPE 5 : Ajouter le nouveau Pokémon à la liste locale
        if (newPokemon) {
          this.pokemons.push(newPokemon)
          console.log('✅ Pokémon créé avec succès:', newPokemon.name)
        }

        return {
          success: true,
          message: 'Pokémon ajouté avec succès !',
        }
      } catch (error) {
        // ÉTAPE 6 : Gestion des erreurs
        console.error('❌ Erreur lors de l\'ajout du Pokémon:', error.message)

        let errorMessage = 'Erreur lors de l\'ajout du Pokémon'

        if (error.response) {
          // Essayer de récupérer un message d'erreur précis depuis l'API
          if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message
          } else if (error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
            errorMessage = error.response.data.errors[0].message
          }
        }

        return {
          success: false,
          message: errorMessage,
        }
      } finally {
        // ÉTAPE 7 : Désactiver l'indicateur de chargement dans tous les cas
        this.isLoading = false
      }
    },

    /**
     * Met à jour un Pokémon existant via l'API.
     *
     * @param {string} pokemonId - L'identifiant du Pokémon à modifier
     * @param {Object} updatedData - Les nouvelles données du Pokémon
     * @returns {Promise<Object>} Objet avec `success` (boolean) et `message` (string)
     */
    async updatePokemon (pokemonId, updatedData) {
      console.log('✏️ Modification du Pokémon', pokemonId, 'avec:', updatedData)

      this.isLoading = true

      try {
        // Envoyer les modifications à l'API
        const response = await api.put(`/pokemons/${pokemonId}`, updatedData)

        // Récupérer les données mises à jour
        let updatedPokemon = null
        if (response.data && response.data.data) {
          updatedPokemon = response.data.data
        } else if (response.data) {
          updatedPokemon = response.data
        }

        // Mettre à jour le Pokémon dans la liste locale
        if (updatedPokemon) {
          const pokemonIndex = this.pokemons.findIndex(pokemon => pokemon.id === pokemonId)
          if (pokemonIndex !== -1) {
            // Fusionner les anciennes données avec les nouvelles
            this.pokemons[pokemonIndex] = { ...this.pokemons[pokemonIndex], ...updatedPokemon }
            console.log('✅ Pokémon modifié avec succès')
          }
        }

        return {
          success: true,
          message: 'Pokémon modifié avec succès !',
        }
      } catch (error) {
        console.error('❌ Erreur lors de la modification du Pokémon:', error.message)

        let errorMessage = 'Erreur lors de la modification du Pokémon'
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        }

        return {
          success: false,
          message: errorMessage,
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Supprime un Pokémon via l'API.
     * Supprime également le Pokémon des favoris s'il y était.
     *
     * @param {string} pokemonId - L'identifiant du Pokémon à supprimer
     * @returns {Promise<Object>} Objet avec `success` (boolean) et `message` (string)
     */
    async deletePokemon (pokemonId) {
      console.log('🗑️ Suppression du Pokémon', pokemonId)

      this.isLoading = true

      try {
        // Supprimer le Pokémon via l'API
        await api.delete(`/pokemons/${pokemonId}`)

        // Supprimer le Pokémon de la liste locale
        this.pokemons = this.pokemons.filter(pokemon => pokemon.id !== pokemonId)

        // Supprimer le Pokémon des favoris s'il y était
        this.favorites = this.favorites.filter(favoriteId => favoriteId !== pokemonId)
        this.saveFavorites()

        console.log('✅ Pokémon supprimé avec succès')

        return {
          success: true,
          message: 'Pokémon supprimé avec succès !',
        }
      } catch (error) {
        console.error('❌ Erreur lors de la suppression du Pokémon:', error.message)

        return {
          success: false,
          message: 'Erreur lors de la suppression du Pokémon',
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Sélectionne un Pokémon pour l'affichage détaillé.
     * Utile pour les pages de détail d'un Pokémon.
     *
     * @param {string} pokemonId - L'identifiant du Pokémon à sélectionner
     */
    selectPokemon (pokemonId) {
      // Chercher le Pokémon dans la liste
      const pokemon = this.pokemons.find(p => p.id === pokemonId)

      if (pokemon) {
        this.selectedPokemon = pokemon
        console.log('👆 Pokémon sélectionné:', pokemon.name)
      } else {
        this.selectedPokemon = null
        console.log('👆 Pokémon non trouvé pour l\'ID:', pokemonId)
      }
    },

    /**
     * Charge les favoris depuis le stockage local du navigateur (localStorage).
     * Cette méthode est appelée au démarrage pour restaurer les favoris précédents.
     */
    loadFavorites () {
      try {
        // Récupérer les favoris depuis localStorage
        const savedFavorites = localStorage.getItem('pokemon_favorites')

        if (savedFavorites) {
          // Parser le JSON et stocker dans le state
          this.favorites = JSON.parse(savedFavorites)
          console.log('💾 Favoris chargés depuis le navigateur:', this.favorites.length, 'éléments')
        } else {
          // Pas de favoris sauvegardés, initialiser un tableau vide
          this.favorites = []
          console.log('💾 Aucun favori sauvegardé trouvé')
        }
      } catch (error) {
        // En cas d'erreur (données corrompues), réinitialiser
        console.error('❌ Erreur lors du chargement des favoris:', error)
        this.favorites = []
      }
    },

    /**
     * Sauvegarde les favoris dans le stockage local du navigateur.
     * Appelée automatiquement chaque fois que la liste des favoris change.
     */
    saveFavorites () {
      try {
        // Convertir la liste en JSON et sauvegarder
        localStorage.setItem('pokemon_favorites', JSON.stringify(this.favorites))
        console.log('💾 Favoris sauvegardés dans le navigateur')
      } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde des favoris:', error)
      }
    },

    /**
     * Nettoie les favoris en supprimant les IDs qui ne correspondent plus à des Pokémon existants.
     * Appelée automatiquement après le chargement des Pokémon.
     */
    cleanupFavorites () {
      const initialCount = this.favorites.length

      // Filtrer pour ne garder que les IDs qui correspondent à des Pokémon existants
      this.favorites = this.favorites.filter(favoriteId => {
        return this.pokemons.some(pokemon => pokemon.id === favoriteId)
      })

      const removedCount = initialCount - this.favorites.length

      if (removedCount > 0) {
        console.log('🧹 Nettoyage des favoris:', removedCount, 'favoris obsolètes supprimés')
        this.saveFavorites()
      }
    },

    /**
     * Ajoute ou retire un Pokémon des favoris.
     * Si le Pokémon est déjà favori, on le retire. Sinon, on l'ajoute.
     *
     * @param {Object} pokemon - Le Pokémon à ajouter ou retirer des favoris
     */
    toggleFavorite (pokemon) {
      // Chercher si ce Pokémon est déjà dans les favoris
      const favoriteIndex = this.favorites.findIndex(favoriteId => favoriteId === pokemon.id)

      if (favoriteIndex === -1) {
        // Le Pokémon n'est pas favori, on l'ajoute
        this.favorites.push(pokemon.id)
        console.log('❤️ Pokémon ajouté aux favoris:', pokemon.name)
      } else {
        // Le Pokémon est déjà favori, on le retire
        this.favorites.splice(favoriteIndex, 1)
        console.log('💔 Pokémon retiré des favoris:', pokemon.name)
      }

      // Sauvegarder les changements dans le navigateur
      this.saveFavorites()
    },

    /**
     * Méthode utilitaire pour déboguer l'état du store Pokémon.
     * Affiche toutes les informations importantes dans la console du navigateur.
     *
     * Usage : pokemonStore.debugPokemon() dans la console ou dans le code
     */
    debugPokemon () {
      console.log('🐛 ===== DEBUG STORE POKÉMON =====')
      console.log('📊 Pokémon chargés:', this.pokemons.length)
      console.log('🏷️ Types chargés:', this.types.length)
      console.log('❤️ Favoris:', this.favorites.length)
      console.log('👆 Pokémon sélectionné:', this.selectedPokemon?.name || 'aucun')
      console.log('⏳ Chargement en cours:', this.isLoading)
      if (this.pokemons.length > 0) {
        console.log('🔍 Premier Pokémon (exemple):', this.pokemons[0])
      }

      if (this.favorites.length > 0) {
        console.log('🔍 IDs favoris:', this.favorites)
      }

      console.log('🐛 ==============================')
    },
  },
})
