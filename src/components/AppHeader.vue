<template>
  <!--
  Barre d'application plate
    * flat supprime l'ombre sous la barre
  -->
  <v-app-bar flat>
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
      Logo : taille réduite sur mobile pour libérer de l'espace au profit
      du titre et du bouton login (cible 44pt = recommandation Apple HIG).
      -->
      <v-avatar
        class="mr-4 pa-0 cursor-pointer"
        image="@/assets/pokeball.svg"
        :size="mobile ? 44 : 64"
        @click="$router.push('/')"
      />

      <!-- Titre de l'application affiché dans la barre -->
      <v-toolbar-title>Pokedex</v-toolbar-title>

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
