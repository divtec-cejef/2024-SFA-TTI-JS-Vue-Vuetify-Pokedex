/**
 * @file Magasin d'authentification factice
 * Utilise Pinia pour gérer les états et actions liés à l'authentification des utilisateurs.
 * Ce magasin simule la connexion et la déconnexion avec des données factices.
 * Remarque : en production, ce magasin doit être remplacé par une intégration avec une API réelle.
 * @version 1.0
 * @since 2024-01-31
 */

import { defineStore } from 'pinia'
import { setAuthToken } from '@/plugins/axios'

/**
 * Données factices utilisées pour simuler l'authentification.
 * Inclut un utilisateur factice, un mot de passe, et un jeton d'authentification.
 */
const utilisateurFactice = {
  email: 'sacha@pokemon.com', // Email de l'utilisateur pour la simulation.
  name: 'Sacha Ketchum', // Nom de l'utilisateur simulé.
}

const passwordFactice = 'pika' // Mot de passe correspondant à l'utilisateur factice.
const tokenFactice = '0b042934e5df02c9786efb364d946e64' // Jeton factice simulant une session active.

/**
 * Magasin Pinia pour gérer l'état d'authentification.
 * Fournit des fonctionnalités pour simuler la connexion, la déconnexion et vérifier l'état de connexion.
 */
export const useAuthStore = defineStore('auth', {
  /**
   * État initial du magasin
   * - `user` : Informations sur l'utilisateur actuellement connecté (null si non connecté).
   * - `token` : Jeton d'authentification (null si non connecté).
   */
  state: () => ({
    user: null, // Représente les données de l'utilisateur connecté.
    token: null, // Contient le jeton d'authentification si connecté.
  }),

  /**
   * Actions pour modifier l'état du magasin.
   * Inclut des méthodes pour la gestion de la connexion et de la déconnexion.
   */
  actions: {
    /**
     * Simule la connexion d'un utilisateur.
     * Vérifie les identifiants par rapport aux données factices et met à jour l'état en cas de succès.
     * @param {string} email - Adresse email saisie par l'utilisateur.
     * @param {string} password - Mot de passe saisi par l'utilisateur.
     * @returns {Object} Résultat de la tentative de connexion (succès ou échec).
     */
    login (email, password) {
      if (email === utilisateurFactice.email && password === passwordFactice) {
        // Mise à jour de l'état en cas de succès.
        this.user = utilisateurFactice
        this.token = tokenFactice
        setAuthToken(this.token)
        // Stockage du jeton d'authentification dans le stockage local.
        localStorage.setItem('token', this.token)
        return {
          success: true,
          message: 'Connexion réussie',
        }
      } else {
        // Réinitialisation de l'état en cas d'échec.
        this.user = null
        this.token = null
        setAuthToken(null)
        // Suppression du jeton d'authentification du stockage local.
        localStorage.removeItem('token')
        return {
          success: false,
          message: 'Mauvais email ou mot de passe !',
        }
      }
    },

    /**
     * Simule la déconnexion de l'utilisateur.
     * Réinitialise l'état du magasin pour supprimer les informations de l'utilisateur et le jeton.
     * @returns {Object} Confirmation de la déconnexion.
     */
    logout () {
      this.user = null
      this.token = null
      setAuthToken(null)
      // Suppression du jeton d'authentification du stockage local.
      localStorage.removeItem('token')
      return {
        success: true,
        message: 'Déconnexion réussie',
      }
    },
    /**
     * Charge le jeton d'authentification à partir du stockage local.
     * Utilisé pour maintenir la connexion lors du rechargement de la page.
     */
    loadToken () {
      /* Chargement factice du jeton d'authentification à partir du stockage local. */
      const token = localStorage.getItem('token')
      if (token) {
        this.user = utilisateurFactice
        this.token = token
        setAuthToken(token)
      }
    },
  },

  /**
   * Getters pour accéder aux données calculées basées sur l'état.
   */
  getters: {
    /**
     * Vérifie si un utilisateur est connecté.
     * Retourne `true` si un token est présent, sinon `false`.
     * @param {Object} state - État actuel du magasin.
     * @returns {boolean} Indique si l'utilisateur est authentifié.
     */
    isAuthenticated: state => !!state.token,
  },
})
