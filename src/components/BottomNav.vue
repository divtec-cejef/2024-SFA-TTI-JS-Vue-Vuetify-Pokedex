<template>
  <!--
  Barre de navigation inférieure : visible uniquement sur mobile (xs, sm).
    * grow étire les boutons sur toute la largeur disponible.
    * color="primary" colore l'item actif avec la couleur primaire du thème.
    * La classe .safe-bottom ajoute le padding pour respecter la zone de
      home indicator de l'iPhone via env(safe-area-inset-bottom).
  -->
  <v-bottom-navigation
    v-if="mobile"
    v-model="activeRoute"
    class="safe-bottom"
    color="primary"
    grow
  >
    <v-btn
      v-for="link in menuItems"
      :key="link.path"
      :to="link.path"
      :value="link.path"
    >
      <v-icon>{{ link.icon }}</v-icon>
      <span>{{ link.title }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useDisplay } from 'vuetify'

  // useDisplay() expose des breakpoints réactifs. `mobile` = true en dessous
  // du breakpoint md (configurable dans le plugin Vuetify). C'est ce qui
  // permet d'afficher la bottom nav UNIQUEMENT sur petits écrans.
  const { mobile } = useDisplay()

  // Synchronise l'item actif avec la route courante pour conserver l'état
  // après un refresh ou une navigation par lien direct.
  const route = useRoute()
  const activeRoute = computed(() => route.path)

  // Quatre destinations principales accessibles d'un seul tap.
  // Volontairement limité — la convention iOS/Material veut 3 à 5 items max
  // pour éviter de surcharger la zone du pouce.
  const menuItems = [
    { title: 'Accueil', path: '/', icon: 'mdi-pokeball' },
    { title: 'Favoris', path: '/favoris', icon: 'mdi-heart' },
    { title: 'Kanto', path: '/kantomap', icon: 'mdi-map' },
    { title: 'FAQ', path: '/faq', icon: 'mdi-frequently-asked-questions' },
  ]
</script>

<style scoped>
.safe-bottom {
  /* env(safe-area-inset-bottom) vaut 34px sur iPhone avec home indicator,
     0 sur les autres appareils. Le padding garantit qu'aucun bouton n'est
     masqué par la barre système. */
  padding-bottom: env(safe-area-inset-bottom);
  height: calc(56px + env(safe-area-inset-bottom)) !important;
}
</style>
