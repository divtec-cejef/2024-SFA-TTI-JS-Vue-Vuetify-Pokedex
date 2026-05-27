<template>
  <!--
  Conteneur principal de l'application utilisant Vuetify
    * <v-app> est l'enveloppe principale pour l'intégration des composants Vuetify
  -->
  <v-app>
    <!--
    Menu principal
      * Affiche la barre de navigation principale (header)
      * Inclut le composant personnalisé MenuPrincipal créer dans le fichier `src/components/AppHeader.vue`
    -->
    <menu-principal />

    <!--
    Section principale de l'application
      * <v-main> définit le conteneur principal pour afficher le contenu de l'application
      * <router-view> est une zone de rendu dynamique utilisée par Vue Router
        pour afficher les composants des routes actuelles
    -->
    <v-main>
      <router-view />
    </v-main>
    <!--
    Pied de page de l'application
      * <v-footer> : Composant Vuetify pour un pied de page réactif et stylisé.
      * <div> : Conteneur pour le contenu du pied de page.
        - class="px-4" : Ajoute un padding horizontal (4 * 4px = 16px) pour espacer le contenu des bords.
        - class="text-center" : Centre le texte horizontalement.
        - class="w-100" : Assure que le conteneur occupe toute la largeur disponible.
    -->
    <!--
    Pied de page : visible uniquement sur desktop. Sur mobile la place est
    réservée à la BottomNav (navigation principale au pouce).
    -->
    <v-footer v-if="!mobile">
      <div class="px-4 text-center w-100">2024 - Pokedex</div>
    </v-footer>

    <!--
    Navigation inférieure mobile (Accueil / Favoris / Kanto / FAQ).
    Le composant s'auto-masque sur desktop via useDisplay().
    -->
    <bottom-nav />
  </v-app>
</template>

<script setup>
  import MenuPrincipal from '@/components/AppHeader.vue'
  import BottomNav from '@/components/BottomNav.vue'
  import { onMounted } from 'vue'
  import { useDisplay } from 'vuetify'
  import { useAuthStore } from '@/stores/authStore'
  import { usePokemonStore } from '@/stores/pokemonStore'
  import { Capacitor } from '@capacitor/core'
  import { StatusBar, Style } from '@capacitor/status-bar'

  const { mobile } = useDisplay()

  onMounted(async () => {
    const authStore = useAuthStore()
    authStore.loadToken()

    const pokemonStore = usePokemonStore()
    await pokemonStore.init()

    // Configure la barre de statut native uniquement sur iOS/Android.
    // Style.Dark = texte clair sur fond sombre (cohérent avec notre thème).
    // L'appel est silencieux sur le web grâce au guard isNativePlatform().
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.setStyle({ style: Style.Dark })
        if (Capacitor.getPlatform() === 'android') {
          await StatusBar.setBackgroundColor({ color: '#1e1e1e' })
        }
      } catch (error) {
        console.warn('StatusBar non disponible :', error)
      }
    }
  })
</script>
