<template>
  <!--
  Barre d'application plate
    * flat supprime l'ombre sous la barre
  -->
  <!--
  v-app-bar avec respect des safe areas iOS (notch / Dynamic Island).
  La classe .app-bar-safe ajoute le padding-top env(safe-area-inset-top)
  pour que le contenu ne passe pas sous la barre de statut système.
  -->
  <v-app-bar class="app-bar-safe" flat>
    <!--
    Conteneur de la barre d'application
      * class="d-flex align-start align-center" aligne les éléments de manière flexible, alignés en haut et centrés verticalement
    -->
    <v-container class="d-flex align-start align-center">
      <!--
      Logo de l'application cliquable
        * class="mr-4 pa-0 cursor-pointer" ajoute une marge à droite, retire le padding, et change le curseur pour indiquer la cliquabilité
        * image définit le chemin vers le logo (Poké Ball) de l'application
        * size="64" définit la taille de l'avatar
        * @click redirige vers la page d'accueil
      -->
      <!--
      Logo : icône pokéball Material Design (native, garantie visible
      sur fond sombre, colorisable via le thème — contrairement à un
      PNG dont la lisibilité dépend du fond).
      Taille adaptée mobile (cible 44pt Apple HIG) vs desktop (64).
      -->
      <v-btn
        class="mr-4"
        color="red"
        :icon="mobile ? 'mdi-pokeball' : 'mdi-pokeball'"
        :size="mobile ? 'large' : 'x-large'"
        variant="text"
        @click="$router.push('/')"
      />

      <!--
      Titre "Pokedex" : visible uniquement sur desktop. Sur mobile,
      le logo pokéball à gauche fait office d'identité visuelle —
      ça libère de la place pour le bouton login et évite la collision
      avec le notch / Dynamic Island iOS.
      -->
      <v-toolbar-title v-if="!mobile">Pokedex</v-toolbar-title>

      <!--
      Liens de navigation générés dynamiquement
        * v-for parcourt chaque élément dans menuItems pour créer un lien de navigation
        * :key utilise link.title pour définir une clé unique par lien
        * :icon affiche l'icône spécifiée pour chaque lien
        * :to utilise le chemin vers la route spécifiée pour chaque lien
      -->
      <v-btn
        v-for="link in menuItems"
        v-show="!mobile"
        :key="link.title"
        :icon="link.icon"
        :to="link.path"
      />

      <!--
      Bouton de déconnexion
        * v-if="authStore.isAuthenticated" affiche le bouton si l'utilisateur est connecté
        * icon="mdi-logout" affiche l'icône de déconnexion
        * @click déclenche la fonction de déconnexion (logout)
      -->
      <v-btn
        v-if="authStore.isAuthenticated"
        icon="mdi-logout"
        @click="logout"
      />

      <!--
      Bouton de connexion (affiché si l'utilisateur n'est pas connecté)
        * v-else affiche ce bouton seulement si authStore.isAuthenticated n'existe pas
        * icon="mdi-login" affiche l'icône de connexion
        * @click redirige vers la page de connexion
      -->
      <v-btn
        v-else
        icon="mdi-login"
        @click="$router.push('/login')"
      />
    </v-container>
  </v-app-bar>

  <!--
  Notification de déconnexion réussie
    * v-model="snackbar" contrôle la visibilité du snackbar
    * color="success" applique une couleur de succès (verte) au snackbar
  -->
  <v-snackbar
    v-model="snackbar"
    color="success"
  >
    Déconnexion réussie !
  </v-snackbar>
</template>

<script setup>
  import router from '@/router'
  import { useAuthStore } from '@/stores/authStore'
  import { ref } from 'vue'
  import { useDisplay } from 'vuetify'

  // useDisplay() expose `mobile` (true en dessous du breakpoint md).
  // Sur mobile, les liens de navigation passent dans BottomNav.vue.
  const { mobile } = useDisplay()

  // Utilisation du authStore pour gérer l'état de connexion de l'utilisateur
  const authStore = useAuthStore()

  /*
Définition des éléments de menu pour la navigation
  - Chaque élément contient :
    * title : le titre du lien
    * path : le chemin de la route
    * icon : l'icône du lien
*/
  const menuItems = [
    { title: 'Accueil', path: '/', icon: 'mdi-pokeball' },
    { title: 'Favoris', path: '/favoris', icon: 'mdi-heart' },
    { title: 'FAQ', path: '/faq', icon: 'mdi-frequently-asked-questions' },
    { title: 'Kanto', path: '/kantomap', icon: 'mdi-map' },
  ]

  // État pour contrôler l'affichage du snackbar de déconnexion
  const snackbar = ref(false)

  /*
Fonction de déconnexion
- Affiche le snackbar de déconnexion
- Déconnecte l'utilisateur en appelant la méthode logout() du authStore
- Redirige l'utilisateur vers la page d'accueil après la déconnexion
*/
  function logout () {
    snackbar.value = true // Afficher la notification de déconnexion
    authStore.logout() // Appeler la méthode de déconnexion du authStore
    router.push('/') // Rediriger l'utilisateur vers la page d'accueil
  }
</script>

<style scoped>
/*
Respect des safe areas iOS sur la barre d'application.

Sans ce padding, le contenu du v-app-bar passe SOUS la zone du notch
ou de la Dynamic Island sur iPhone, ce qui cache une partie du logo
et rend les boutons partiellement inaccessibles.

env(safe-area-inset-top) :
  - vaut ~47px sur iPhone avec Dynamic Island
  - vaut ~44px sur iPhone avec notch (X à 14)
  - vaut 24px sur Android (status bar)
  - vaut 0 sur desktop et anciens téléphones sans encoche

Le calc() ajuste la hauteur totale pour conserver l'espace visible
de 64px en plus du padding nécessaire.
*/
.app-bar-safe {
  padding-top: env(safe-area-inset-top, 0px);
  height: calc(64px + env(safe-area-inset-top, 0px)) !important;
}
</style>
