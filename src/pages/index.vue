<template>
  <!-- Conteneur principal pour structurer la disposition de la page -->
  <v-container>
    <!--
    Titre de la page
      * mb-6 permet d'ajouter une Marge en Bas de 6 unités
      * text-center permet de centrer le texte
    -->
    <h1 class="mb-6 text-center">
      Pokédex
      <!--
      bouton pour ajouter un pokémon
        * aria-label permet d'ajouter une description pour les lecteurs d'écran utilisés par les personnes malvoyantes
        * v-tooltip permet d'afficher une info-bulle au survol du bouton
        * @click permet de naviguer vers la page d'ajout de pokémon
      -->
      <!--
      Sur mobile, ce bouton est remplacé par un FAB (Floating Action Button)
      en bas-droite de l'écran : voir plus bas dans ce composant.
      -->
      <v-btn
        v-if="!mobile"
        v-tooltip.bottom="'Ajouter un Pokémon'"
        aria-label="Ajouter un Pokémon"
        class="ml-4"
        color="primary"
        icon="mdi-plus"
        @click="$router.push('pokemons/create')"
      />
    </h1>

    <!--
    Champ de texte pour la recherche de Pokémon
      * v-model lie bidirectionnellement la valeur de la recherche (search) avec l'entrée utilisateur
      * clearable ajoute une icône pour effacer rapidement le champ
      * label affiche un texte indicatif pour guider l'utilisateur
      * prepend-icon ajoute une icône "loupe" (mdi-magnify) à gauche du champ
    -->
    <v-text-field
      v-model="search"
      clearable
      label="Trouver un Pokémon"
      prepend-icon="mdi-magnify"
    />

    <!--
    Grille pour afficher les cartes des Pokémon
      * v-row crée une rangée pour organiser les colonnes des cartes
    -->
    <v-row>
      <!--
      Affiche les cartes des pokémons
      * v-for permet de parcourir les pokémons
      * :key permet de donner une clé unique à chaque pokémon
      * cols définit la taille par défaut d'une colonne sur un maximum de 12 cols
        si on met cols="6" un colonne occupe au maximum la moitié de la grille (12/6=2)
        Ici on met cols="12" pour que chaque carte puisse occuper toute la largeur de la grille
      * xl, lg, md, sm, xs permettent de définir le nombre de colonnes max pour chaque taille d'écran
        par exmple lg="3" signifie que sur grand écran on affiche 4 cartes par ligne (12/3=4)
        https://vuetifyjs.com/en/components/grids/
      -->
      <v-col
        v-for="pokemon in filteredPokemons"
        :key="pokemon.id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
        xl="2"
        xs="12"
        xxl="2"
      >
        <!--
        composant "maison" de carte de pokémon
          * :pokemon permet de passer le pokémon à afficher au composant via une prop
          * le composant PokemonCard est dans le dossier src/components/PokemonCard.vue
        -->
        <pokemon-card :pokemon="pokemon" />
      </v-col>
    </v-row>

    <!--
    FAB (Floating Action Button) mobile pour ajouter un Pokémon.
      * Visible uniquement sur mobile (sur desktop, le bouton est dans le h1 ci-dessus).
      * Position fixe en bas-droite — zone du pouce sur mobile.
      * bottom-calc : 56px (hauteur bottom nav) + env(safe-area-inset-bottom)
        (home indicator iPhone) + 16px (marge esthétique).
    -->
    <v-btn
      v-if="mobile"
      aria-label="Ajouter un Pokémon"
      class="add-pokemon-fab"
      color="primary"
      icon="mdi-plus"
      size="large"
      @click="$router.push('pokemons/create')"
    />
  </v-container>
</template>

<script setup>
  // Importation des dépendances nécessaires
  import { computed, ref } from 'vue' // Importe computed pour créer une propriété calculée
  import { useDisplay } from 'vuetify' // Hook responsive pour détecter le mobile
  import { usePokemonStore } from '@/stores/pokemonStore' // Importe le magasin Pinia des Pokémons
  import PokemonCard from '@/components/PokemonCard.vue' // Importe le composant de carte des Pokémons

  // useDisplay() expose `mobile` (= true sous le breakpoint md de Vuetify).
  // Sert à basculer entre le bouton "+" intégré au header (desktop) et le
  // FAB en bas-droite (mobile, accessible au pouce).
  const { mobile } = useDisplay()

  // Initialisation du magasin Pinia des Pokémons
  const pokemonStore = usePokemonStore()

  /*
  Définition de la recherche utilisateur comme une propriété réactive
    * la donnée search et lié au champ de recherche grâce à v-model <v-text-field v-model="search" />
    * ref('') rend la constant search réactive et l'initialise lune valeur par défaut vide ('')
    * Cette liaison bidirectionnelle permet de mettre à jour la recherche en temps réel dans les deux sens.
      Si la valeur de search change, le champ de recherche est mis à jour et vice versa.
  */
  const search = ref('')

  /**
   * Propriété calculée qui retourne une **COPIE triée** des Pokémon par nom.
   * Cela permet de centraliser l’opération de tri, qui est **coûteuse** si appelée souvent.
   * Comme on utilise un computed, elle ne sera recalculée que si `pokemonStore.pokemons` change.
   */
  const sortedPokemons = computed(() =>
    [...pokemonStore.pokemons].sort((a, b) => a.name.localeCompare(b.name))
  )

  /**
   * Propriété calculée qui filtre les Pokémon **déjà triés** en fonction de la recherche.
   * On a séparé les méthodes de tri et de filtre pour éviter de recalculer le tri à chaque recherche.
   * Ce qui va améliorer les performances de l'application.
   */
  const filteredPokemons = computed(() => {
    // Récupère la valeur de recherche sans les espaces inutiles et en minuscules
    const searchQuery = search.value.trim().toLowerCase()
    // Si la recherche est vide, retourne les Pokémon triés
    if (!searchQuery) {
      return sortedPokemons.value
    }
    // Sinon, filtre les Pokémon triés par nom en fonction de la recherche
    return sortedPokemons.value.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchQuery)
    )
  })

</script>

<style scoped>
/*
FAB (Floating Action Button) position fixe en bas-droite.

Le calcul du `bottom` empile :
  - 56px = hauteur de la bottom nav (BottomNav.vue)
  - env(safe-area-inset-bottom, 0px) = home indicator iPhone
  - 16px = marge esthétique entre le FAB et la bottom nav

z-index: 4 pour passer au-dessus des cartes mais sous les overlays
Vuetify (snackbar = 5, dialog = 2400).
*/
.add-pokemon-fab {
  position: fixed;
  bottom: calc(56px + env(safe-area-inset-bottom, 0px) + 16px);
  right: 16px;
  z-index: 4;
}
</style>
