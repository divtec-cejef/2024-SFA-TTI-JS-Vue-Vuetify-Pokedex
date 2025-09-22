<template>
  <!-- Conteneur principal pour centrer la feuille de connexion -->
  <v-container>
    <!--
    Feuille de connexion
      * v-sheet : Conteneur Vuetify stylisé.
      * class="mx-auto bg-transparent" :
        - mx-auto : Centre horizontalement la feuille.
        - bg-transparent : Fond transparent.
      * max-width="400" : Définit une largeur maximale de 400px.
    -->
    <v-sheet class="mx-auto bg-transparent" max-width="400">
      <!-- Titre de la page -->
      <h1 class="mb-4">Connexion</h1>
      <!--
      Informations de connexion
        * v-sheet : Conteneur Vuetify stylisé.
        * class="pa-2 my-4" : Ajoute une marge intérieure partout (pa) et d'une marge extérieure en haut et en bas (my).
      -->
      <v-sheet class="pa-2 my-4">
        email: <code>sacha@pokemon.com</code> <br>
        password: <code>pika</code>
      </v-sheet>

      <!--
      Formulaire de connexion
        * v-form : Composant Vuetify pour gérer les validations et soumissions de formulaire.
        * @submit.prevent="login" : Intercepte l'envoi pour appeler la méthode `login`.
      -->
      <v-form @submit.prevent="login">
        <!--
        Champ email
          * v-text-field : Composant de champ de texte Vuetify.
          * v-model="loginEmail" : Liaison bidirectionnelle avec la donnée `loginEmail`.
          * aria-label : Améliore l'accessibilité pour les lecteurs d'écran.
          * label="Email" : Affiche un label pour le champ.
          * required : Rend le champ obligatoire.
          * :rules="[validateEmail]" : Applique des règles de validation spécifiques.
          * type="email" : Définit le type du champ pour les navigateurs modernes.
        -->
        <v-text-field
          v-model="loginEmail"
          aria-label="Champ de saisie pour l'email"
          autofocus
          label="Email"
          required
          :rules="[validateEmail]"
          type="email"
        />
        <!--
        Champ mot de passe
          * Similaire au champ email, mais utilise `loginPassword` et une règle de validation différente.
        -->
        <v-text-field
          v-model="loginPassword"
          aria-label="Champ de saisie pour le mot de passe"
          label="Mot de passe"
          required
          :rules="[validatePassword]"
          type="password"
        />

        <!--
        Message d'erreur
          * v-alert : Affiche un message d'avertissement si `errorMessage` est défini.
          * v-if="errorMessage" : Affiche uniquement si une erreur est présente.
          * border="start" : Ajoute une bordure à gauche.
          * class="mb-6" : Ajoute une marge inférieure pour espacer le message.
          * color="warning" : Définit une couleur d'alerte jaune.
        -->
        <v-alert
          v-if="errorMessage"
          border="start"
          class="mb-6"
          color="warning"
        >
          {{ errorMessage }}
        </v-alert>

        <!--
        Bouton de connexion
          * v-btn : Bouton Vuetify.
          * aria-label : Accessibilité pour lecteurs d'écran.
          * color="primary" : Style le bouton avec une couleur principale.
          * size="large" : Définit une taille large pour le bouton.
          * type="submit" : Définit le bouton comme déclencheur de soumission du formulaire.
        -->
        <v-btn
          aria-label="Bouton pour se connecter"
          color="primary"
          size="large"
          type="submit"
        >Se connecter</v-btn>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script setup>
// Importation des dépendances nécessaires
  import { useAuthStore } from '@/stores/authStore'
  import { useRoute, useRouter } from 'vue-router'
  import { ref } from 'vue'

  // Initialisation du router et de la route pour la redirection
  const router = useRouter()
  const route = useRoute()

  // Store d'authentification
  const authStore = useAuthStore()

  // Données réactives pour le formulaire
  const loginEmail = ref('')
  const loginPassword = ref('')

  // Message d'erreur pour les échecs de connexion
  const errorMessage = ref('')

  /**
   * Fonction de connexion
   * - Valide les informations d'identification via le store.
   * - Redirige l'utilisateur en cas de succès ou affiche un message d'erreur.
   */
  async function login () {
    const response = await authStore.login(loginEmail.value, loginPassword.value)

    if (response.success) {
      // Redirection vers la page précédente ou l'accueil
      router.push(route.query.redirect || '/')
    } else {
      // Affichage du message d'erreur
      errorMessage.value = response.message
    }
  }

  /**
   * Règles de validation pour le champ email
   * - Vérifie le format standard d'une adresse email.
   */
  const validateEmail = email => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email) || 'Veuillez entrer un email valide.'
  }

  /**
   * Règles de validation pour le champ mot de passe
   * - Le mot de passe doit contenir au moins 4 caractères.
   */
  const validatePassword = password => {
    return password.length > 3 || 'Le mot de passe doit comporter au moins 4 caractères.'
  }
</script>

<style scoped>
/* Styles spécifiques pour centrer et styliser le formulaire de connexion */
</style>
