<template>
  <!--
  Conteneur principal pour structurer la page
    * v-container : Fournit une mise en page fluide et centrée sur l'écran.
  -->
  <v-container>
    <!--
    Feuille contenant le formulaire
      * class="mx-auto bg-transparent" : Centre le contenu horizontalement (mx-auto) et applique un fond transparent (bg-transparent).
      * max-width="400" : Définit une largeur maximale de 400px pour la feuille.
    -->
    <v-sheet class="mx-auto bg-transparent" max-width="400">
      <!-- Titre principal de la page -->
      <h1 class="mb-4">Ajouter un Pokémon</h1>

      <!--
      Formulaire d'ajout de Pokémon
        * @submit.prevent="addPokemon" : Empêche le comportement par défaut du formulaire (rechargement de la page) et exécute la fonction `addPokemon`.
      -->
      <v-form @submit.prevent="addPokemon">
        <!--
        Champ de texte pour le nom du Pokémon
          * v-model.trim="pokemonData.name" : Liaison bidirectionnelle avec suppression des espaces inutiles en début et fin de texte.
          * label="Nom" : Ajoute une étiquette pour le champ.
          * :rules="[val => !!val || 'Le nom est requis']" : Définit une règle pour le champ (le nom est requis).
        -->
        <v-text-field
          v-model.trim="pokemonData.name"
          label="Nom"
          :rules="[val => !!val || 'Le nom est requis']"
        />

        <!--
        Champ numérique pour le niveau du Pokémon
          * v-model.number="pokemonData.level" : Liaison bidirectionnelle avec conversion en nombre.
          * label="Niveau" : Ajoute une étiquette pour le champ.
          * :rules="[val => !!val || 'Le niveau est requis']" : Définit une règle pour le champ (le niveau est requis).
          * type="number" : Définit le champ comme numérique.

        -->
        <v-text-field
          v-model.number="pokemonData.level"
          label="Niveau"
          :rules="[val => !!val || 'Le niveau est requis']"
          type="number"
        />

        <!--
        Champ texte pour l'image du Pokémon
          * v-model.trim="pokemonData.img" : Liaison bidirectionnelle avec suppression des espaces inutiles.
          * label="Image du Pokémon" : Ajoute une étiquette pour le champ.
          * class="pb-0 mb-0" : Supprime les marges en bas pour une mise en page compacte.
        -->
        <v-text-field
          v-model.trim="pokemonData.img"
          class="pb-0 mb-0"
          label="Image du Pokémon"
        />

        <!--
        Composant pour sélectionner une image de test
          * @select : Écoute l'événement `select` et met à jour le champ image (`pokemonData.img`) avec l'image sélectionnée.
        -->
        <SelectImageTest @select="(imageTest) => pokemonData.img = imageTest" />

        <!--
        Champ de texte étendu pour la description
          * v-model.trim="pokemonData.description" : Liaison bidirectionnelle avec suppression des espaces inutiles.
          * label="Description" : Ajoute une étiquette pour le champ.
        -->
        <v-textarea
          v-model.trim="pokemonData.description"
          label="Description"
        />

        <!--
        Groupe de cases à cocher pour sélectionner les types
          * fieldset : Regroupe visuellement les cases sous une légende.
          * class="pa-6 mb-6" : Ajoute un padding (pa-6) et une marge inférieure (mb-6) pour espacer le groupe.
        -->
        <fieldset class="pa-6 mb-6">
          <legend class="font-weight-bold">Types</legend>
          <!--
          Ligne contenant les cases à cocher
            * v-row : Organise les cases en ligne avec des colonnes.
          -->
          <v-row>
            <!--
            Colonne pour chaque type
              * v-for="type in pokemonStore.types" : Itère sur les types disponibles dans le magasin.
              * :key="type.id" : Associe une clé unique basée sur l'identifiant du type.
              * class="pa-0 ma-0" : Supprime le padding et la marge pour une mise en page compacte.
              * cols="4" : Définit chaque case à occuper 4 colonnes sur 12 dans la grille.
            -->
            <v-col
              v-for="type in pokemonStore.types"
              :key="type.id"
              class="pa-0 ma-0"
              cols="4"
            >
              <!--
              Case à cocher pour un type
                * v-model="pokemonData.types" : Liaison bidirectionnelle avec la liste des types sélectionnés.
                * :label="type.name" : Définit l'étiquette de la case avec le nom du type.
                * :value="type.id" : Définit la valeur de la case à l'identifiant du type.
                * density="compact" : Réduit la taille de la case pour une meilleure utilisation de l'espace.
              -->
              <v-checkbox
                v-model="pokemonData.types"
                density="compact"
                :label="type.name"
                :value="type.id"
              />
            </v-col>
          </v-row>
        </fieldset>

        <!--
        Message d'erreur affiché si l'ajout échoue
          * v-if="msgErreur" : Affiche l'alerte uniquement si un message d'erreur existe.
          * class="mb-6" : Ajoute une marge en bas pour espacer l'alerte des éléments suivants.
          * color="warning" : Définit la couleur de l'alerte comme jaune.
          * type="error" : Spécifie que l'alerte est de type erreur.
        -->
        <v-alert
          v-if="msgErreur"
          border="start"
          class="mb-6"
          color="warning"
          type="error"
        >
          {{ msgErreur }}
        </v-alert>

        <!--
        Bouton pour soumettre le formulaire
          * color="primary" : Applique la couleur principale (bleu par défaut).
          * size="large" : Définit un bouton plus grand.
          * type="submit" : Indique que ce bouton soumet le formulaire.
        -->
        <v-btn
          color="primary"
          size="large"
          type="submit"
        >
          Ajouter le Pokémon
        </v-btn>
      </v-form>

      <!--
      Snackbar pour afficher un message de succès
        * v-model="msgSucces" : Affiche ou cache le snackbar en fonction de `msgSucces`.
        * color="success" : Définit la couleur comme verte pour indiquer un succès.
      -->
      <v-snackbar
        v-model="msgSucces"
        color="success"
      >
        Pokémon créé avec succès !
      </v-snackbar>
    </v-sheet>
  </v-container>
</template>

<script setup>
  import SelectImageTest from '@/components/SelectImageTest.vue'
  import { ref } from 'vue'
  import { usePokemonStore } from '@/stores/pokemonStore'
  import { useRouter } from 'vue-router'

  // Utilisation du magasin Pokémon
  const pokemonStore = usePokemonStore()
  // Routeur pour redirection
  const router = useRouter()

  // Objet pour stocker les données du formulaire
  const pokemonData = ref({
    name: '', // Nom du Pokémon
    level: null, // Niveau du Pokémon
    description: '', // Description du Pokémon
    types: [], // Types sélectionnés
  })

  // Gestion des messages d'état
  const msgErreur = ref(null) // Message d'erreur en cas d'échec
  const msgSucces = ref(false) // Indicateur de succès

  /**
   * Fonction pour ajouter un Pokémon
   * Utilise le magasin Pinia pour créer un Pokémon et gère les messages d'état.
   */
  async function addPokemon () {
    msgErreur.value = null
    msgSucces.value = false

    const response = await pokemonStore.addPokemon(pokemonData.value)

    if (!response.success) {
      msgErreur.value = response.message
      return
    }

    // Réinitialise les données après succès
    pokemonData.value = { name: '', level: '', description: '', types: [] }
    msgSucces.value = true
    // Redirige vers la page d'accueil après un court délai de 500ms
    setTimeout(() => router.push('/'), 500)
  }
</script>

<style scoped>
/* Ajoutez ici des styles spécifiques pour cette page */
</style>
