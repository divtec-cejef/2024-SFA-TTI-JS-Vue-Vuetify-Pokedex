# 📕 Exercice Pokédex Vuetify
![screeshot-final.png](public/screeshot-final.png)
## 🧭 Introduction

Dans cet exercice, vous allez créer un **Pokédex interactif** avec **Vue.js**, **Vuetify** et **Pinia**.

L’objectif est d’apprendre à développer une application web moderne avec un framework JavaScript puissant (Vue 3) et une bibliothèque de composants (Vuetify 3) qui permet de construire des interfaces élégantes rapidement.

Vous allez découvrir comment :

- concevoir plusieurs pages avec un **routage automatique**,
- utiliser **Pinia** pour partager des données entre vos composants,
- structurer une application **modulaire et évolutive**,
- afficher dynamiquement des données sous forme de **composants réutilisables**,
- enrichir l’expérience utilisateur avec des **animations**, des **boîtes de dialogue**, et des **icônes bien choisies** (promis, pas que des cœurs et des Pokéballs 🥲).

> 🔐 Une **fonctionnalité d’authentification** sera ajoutée plus tard dans l'exercice. Elle permettra aux utilisateurs connectés d’ajouter ou de supprimer des Pokémon.

**Pages à réaliser** :

L'application contiendra les pages suivantes, que vous allez progressivement construire :

- 🏠 **Accueil** : liste des Pokémon avec barre de recherche
- ❤️ **Favoris** : liste des Pokémon ajoutés aux favoris
- ❓ **FAQ** : liste de questions/réponses repliables
- 🗺️ **Monde Pokémon** : carte du monde + texte descriptif
- 🔐 **Connexion (plus tard)** : permet d’ajouter ou supprimer des Pokémon

Exemple de solution : [https://kode.ch/pokedex](https://kode.ch/pokedex)

## ⚙️ Mise en place

### Installer les dépendances

Ouvrez un terminal à la racine du projet et exécutez la commande suivante :

```bash
npm install
```

### Lancer le serveur de développement

Une fois les dépendances installées, démarrez le serveur avec :

```bash
npm run dev
```

### Accéder à l'application dans le navigateur

Ouvrez l'URL affichée dans le terminal (en général [http://localhost:3000](http://localhost:3000)) pour afficher l'application de départ.

Vous devriez apercevoir le résultat suivant :

![screeshot-start.png](public/screeshot-start.png)
---

## 📁 Structure du projet

Voici une vue d'ensemble des différents dossiers et fichiers du projet.

### `public/`

Contient le fichier `index.html`, qui est le point d'entrée statique de l'application.

- `images/` : Contient les images des Pokémons accessibles via des chemins publics (`/images/…`).

### `src/`

Le dossier principal qui contient tout le code source de l'application :

- `assets/` : Contient les ressources statiques comme les images, les icônes, le logo du site, etc.
- `components/` : Composants Vue réutilisables (cartes, puces, header, etc.). Ils sont auto-importés grâce au plugin `unplugin-vue-components`.
- `pages/` : Contient les différentes vues de l'application. Chaque fichier `.vue` correspond automatiquement à une route grâce à `unplugin-vue-router`.
  - `index.vue` : Page d’accueil principale.
  - `[...path].vue` : Page 404 affichée si aucune route ne correspond.
- `stores/` : Gestion d’état avec **Pinia**.
  - `pokemons.js` : Gère la liste, les types et les favoris des Pokémon.
  - `authStore.js` : Simule un système d’authentification locale.
- `plugins/` : Initialisation de Vuetify, Pinia et Vue Router. Le fichier `index.js` centralise l’enregistrement des plugins, `vuetify.js` contient la config Vuetify. `axios.js` contient la configuration d’Axios pour les appels API vers le serveur local.
- `styles/` : Fichier `settings.scss` contenant les personnalisations SCSS pour Vuetify et les animations CSS.
- `utils/` : Fonctions utilitaires comme `getImageUrl()` pour construire des chemins d’image.
- `typed-router.d.ts` : Fichier généré automatiquement pour typer les routes (utile si vous activez TypeScript).
- `App.vue` : Composant racine affichant la structure globale de l’application.
- `main.js` : Point d’entrée de l’application. Crée l’app Vue et enregistre les plugins (router, pinia, vuetify).

### 🧩 Affichage (layout) de base

Le composant principal `App.vue` est composé de trois sections principales :

- `<app-header>` : Charge le composant `components/AppHeader.vue` qui contient l’en-tête du site (logo et menu de navigation).
- `<v-main>` : Contenu principal qui contient le composant `<router-view>`, utilisé pour afficher dynamiquement la page active selon la route.
- `<v-footer>` : Pied de page contenant une ligne simple (ex : date ou nom du projet).

### Fichier de configuration

- `vite.config.mjs` : Configuration Vite : plugins (vuetify, auto-import, layouts...), alias, port local, etc.&#x20;

## ✍️ Travail à réaliser

### 📝 Étape 1 – Créer les pages

Créez une page `.vue` pour chaque section de l'application dans le dossier `src/pages/`.

Chaque page doit contenir un élément `<template>` avec un titre `<h1>` décrivant son contenu. Voici un exemple minimal à copier dans chaque fichier :

```vue
<template>
  <h1>Pokédex : page d'accueil</h1>
</template>
```

Remplacez le texte du `<h1>` en fonction du titre de la page (voir tableau ci-dessous).

Créez 4 fichiers `.vue` dans `src/pages/` contenant chacun un `<h1>` avec le titre suivant :

| Fichier        | Titre affiché             |
| -------------- | ------------------------- |
| `index.vue`    | Pokédex : page d'accueil  |
| `Favoris.vue`  | Mes Pokémons Favoris      |
| `FAQ.vue`      | Foire Aux Questions (FAQ) |
| `KantoMap.vue` | Monde Pokémon             |

**Testez vos pages** :

- [http://localhost:3000/](http://localhost:3000/)
- [http://localhost:3000/favoris](http://localhost:3000/favoris)
- [http://localhost:3000/faq](http://localhost:3000/faq)
- [http://localhost:3000/kantomap](http://localhost:3000/kantomap)

📘 Voir : [Guide sur le routage basé sur les fichiers](https://uvr.esm.is/guide/file-based-routing.html)

---

### 🔗 Étape 2 – Ajouter les liens de menu

Dans le fichier `src/components/AppHeader.vue`, localisez la constante `menuItems` à l'intérieur de la section `<script setup>`.

Ajoutez les objets suivants au tableau, chacun représentant une page à lier dans le menu :

Dans `src/components/AppHeader.vue`, modifiez le tableau `menuItems` pour ajouter les nouvelles pages.

```js
const menuItems = [
    { title: 'Accueil', path: '/', icon: 'mdi-pokeball' },
    // Ajouter ici les autres liens du menu.
    // Vous trouverez des icônes sur https://pictogrammers.com/library/mdi/
    // N'oubliez pas d'ajouter le préfixe 'mdi-' devant le nom de l'icône.
  ]
```

Ce menu utilise le composant `v-app-bar` de Vuetify pour créer une barre de navigation en haut de la page. Voici les éléments principaux du code :

- `v-avatar` : Affiche un avatar représentant une Pokéball qui, lorsqu'on clique dessus, redirige vers la page d'accueil.
- `v-toolbar-title` : Affiche le titre "Pokédex".
- `v-btn` : La directive `v-for` crée un bouton de navigation pour chaque élément du tableau `menuItems` défini dans le `<script>` du composant.

Dans le code de départ, il n'y a qu'un seul élément nommé "Accueil" avec une icône de Pokéball.

Pour ajouter un lien au menu, ajouter  un élément au tableau `menuItems`.

Ce projet utilise les **Material Design Icons**. Pour utiliser l'une de ces icônes, ajoutez simplement le préfixe `mdi-` devant le nom de l'icône. Par exemple, `account` devient `mdi-account`.

🔍 Icônes disponibles sur : https\://pictogrammers.com/library/mdi/

---

### 🗺️ Étape 3 – Contenu de la page "Monde Pokémon"

Dans cette étape, vous allez construire la page `KantoMap.vue` pour présenter visuellement le monde des Pokémon à l’aide d’une carte et d’un petit texte explicatif.

#### 🎯 Objectifs

- Afficher une **image de carte** cliquable
- Présenter un **texte structuré** avec titres et paragraphes
- Afficher l’image en **grand format dans une boîte de dialogue** (bonus)

#### 📌 À faire

1. **Afficher une image**
  - Utilisez le composant `v-img` de Vuetify.
  - L’image se trouve dans le dossier `public/images/pokemon-map.png`.
    Pour l’afficher, utilisez le chemin suivant : `/images/pokemon-map.png`.
  - Vérifiez que l’image est visible et bien dimensionnée.

2. **Ajouter un texte explicatif**
  - Présentez le contenu (texte fourni ci-dessous) dans un composant `v-card` avec une section `v-card-text`.

3. **(Bonus) Afficher l’image en grand au clic**
  - Rendez l’image cliquable.
  - Lors d’un clic, ouvrez une **boîte de dialogue (`v-dialog`)** contenant l’image en grand.
  - Utilisez une variable réactive pour contrôler l’ouverture/fermeture de la boîte.

#### 🧠 Astuces

- Commencez par afficher l’image seule.
- Ensuite, ajoutez le texte.
- Enfin, tentez le système de boîte de dialogue (vous trouverez un exemple dans la [doc Vuetify – Dialog](https://vuetifyjs.com/en/components/dialogs/)).

#### 📝 Texte à insérer dans la carte

Voici le texte à intégrer dans la carte sous forme de titres + paragraphes (utilisez `h2`, `p`, `mt-6`, `mb-3`, etc.) :

```html
<h2>Un univers fascinant à découvrir</h2>
<p>Le monde Pokémon est un vaste et merveilleux univers peuplé de créatures extraordinaires appelées Pokémon. Cette carte représente les différentes régions que les dresseurs peuvent explorer, chacune offrant ses propres défis, Pokémon uniques et aventures palpitantes.</p>

<h2>Des régions diversifiées</h2>
<p>De Kanto à Galar, en passant par Johto, Hoenn, Sinnoh, Unova, Kalos et Alola, chaque région du monde Pokémon possède sa propre identité, sa culture et son écosystème unique. Les paysages varient des montagnes enneigées aux îles tropicales, offrant une diversité incroyable d'habitats pour les différentes espèces de Pokémon.</p>

<h2>Un monde en constante évolution</h2>
<p>Le monde Pokémon est en perpétuelle expansion, avec de nouvelles régions, de nouvelles espèces de Pokémon et de nouvelles aventures qui sont régulièrement découvertes. Cette carte n'est qu'un aperçu d'un univers riche et en constante évolution, prêt à être exploré par les dresseurs audacieux.</p>

<h2>Un appel à l'aventure</h2>
<p>Que vous soyez un dresseur débutant ou expérimenté, le monde Pokémon vous invite à partir à l'aventure. Capturez de nouveaux Pokémon, affrontez des champions d'arènes, déjouez les plans des équipes malveillantes et devenez peut-être le prochain Maître Pokémon. L'aventure commence ici, sur cette carte, mais où vous mènera-t-elle ?</p>
```

📘 Documentation utile :
- [🖼️ v-img (image)](https://vuetifyjs.com/en/components/images/)
- [📄 v-card](https://vuetifyjs.com/en/components/cards/)
- [💬 v-dialog](https://vuetifyjs.com/en/components/dialogs/)

---

### ❓ Étape 4 – Créer la page FAQ

Dans cette étape, vous allez créer une **page de Foire Aux Questions (FAQ)**,
où les utilisateurs pourront lire des réponses à des questions courantes sur le fonctionnement de votre Pokédex.

#### 🎯 Objectif

Créer une liste d'accordéons avec une **question en titre** et une **réponse affichée au clic**.

#### 📌 À faire

1. **Créer la structure HTML de base**
  - Ouvrez le fichier `FAQ.vue`
  - Ajoutez un titre principal `<h1>` pour introduire la page.

2. **Choisir un composant Vuetify adapté**
  - Utilisez le composant `v-expansion-panels` pour créer des éléments repliables.
  - Chaque question-réponse sera placée dans un `v-expansion-panel`.

3. **Afficher une liste dynamique**
  - Stockez la liste des questions dans une **variable réactive (`ref`)**.
  - Parcourez-la avec `v-for` pour générer les panneaux de façon automatique.

4. **Soigner l’apparence**
  - Utilisez `mb-6`, `pa-4` ou d’autres classes utilitaires de Vuetify pour espacer les éléments.

---

#### 💬 Questions à afficher

Utilisez ces données dans votre code (sous forme de tableau dans la partie `<script setup>`) :

```js
[
  {
    question: "Qu'est-ce qu'un Pokédex ?",
    answer: "Un Pokédex est un dispositif électronique qui répertorie et fournit des informations sur les différentes espèces de Pokémon. Notre application est une version numérique de cet outil.",
  },
  {
    question: "Comment puis-je ajouter un Pokémon à mes favoris ?",
    answer: "Pour ajouter un Pokémon à vos favoris, cliquez simplement sur l'icône en forme de cœur sur la carte du Pokémon. L'icône deviendra rouge pour indiquer que le Pokémon est maintenant dans vos favoris.",
  },
  {
    question: "Pourquoi certains Pokémon ont-ils plusieurs types ?",
    answer: "Certains Pokémon possèdent des caractéristiques de plusieurs types, ce qui se reflète dans leurs capacités et leurs faiblesses. Par exemple, Charizard est à la fois de type Feu et Vol.",
  },
  {
    question: "Comment fonctionne la recherche de Pokémon ?",
    answer: "Vous pouvez rechercher des Pokémon en tapant leur nom dans la barre de recherche. La liste se mettra à jour automatiquement pour afficher les Pokémon dont le nom correspond à votre recherche.",
  },
  {
    question: "Que signifient les différentes statistiques des Pokémon ?",
    answer: "Les statistiques comme HP, Attaque, Défense et Vitesse représentent les capacités de base d'un Pokémon. HP représente les points de vie, Attaque la puissance offensive, Défense la résistance aux attaques, et Vitesse détermine l'ordre d'action en combat.",
  },
  {
    question: "L'application est-elle mise à jour régulièrement avec de nouveaux Pokémon ?",
    answer: "Oui, nous nous efforçons de maintenir notre base de données à jour avec les derniers Pokémon découverts. Cependant, la fréquence des mises à jour peut varier en fonction des nouvelles sorties de jeux et d'informations officielles.",
  },
]
```

---

#### 🧠 Aide

- [documentation Vuetify – Expansion Panels](https://vuetifyjs.com/en/components/expansion-panels/)
- N’oubliez pas de donner une **clé unique** à chaque `v-expansion-panel` lors de la boucle (`:key`)

---

### 🧩 Étape 5 – Préparer l’affichage de la liste des Pokémon

Dans cette étape, vous allez préparer la page d’accueil (`index.vue`) pour accueillir une **grille de cartes Pokémon**. Pour l’instant, il ne s’agit que de **créer le layout vide** : l’affichage des vraies données viendra après.

---

#### 🎯 Objectifs

- Mettre en place une **structure responsive** avec Vuetify (`v-container`, `v-row`, `v-col`)
- Préparer un **champ de recherche**
- Comprendre comment fonctionne le **système de colonnes de Vuetify**

---

#### 📌 À faire

1. Ouvrez le fichier `src/pages/index.vue`
2. Remplacez le contenu par la structure suivante :

```vue
<template>
  <v-container>
    <h1 class="mb-6 text-center">Pokédex</h1>

    <v-text-field
      label="Rechercher un Pokémon"
      prepend-icon="mdi-magnify"
      clearable
    />

    <v-row>
      <!-- Exemple de colonne vide (à dupliquer plus tard avec du contenu) -->
      <v-col
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <p>Carte à venir...</p>
      </v-col>
    </v-row>
  </v-container>
</template>
```

---

#### 🧠 Vuetify : système de colonnes (grid system)

Vuetify divise l’espace horizontal en **12 colonnes**. Chaque `v-col` définit **combien de colonnes** il occupe, selon la taille de l’écran :

| Attribut | Écran            | Exemple        | Nombre de cartes par ligne |
|----------|------------------|----------------|-----------------------------|
| `cols`   | par défaut       | `cols="12"`    | 1                          |
| `sm`     | petit écran ≥600px | `sm="6"`     | 2                          |
| `md`     | moyen écran ≥960px | `md="4"`    | 3                          |
| `lg`     | grand écran ≥1280px | `lg="3"`   | 4                          |
| `xl`     | très grand écran ≥1920px | `xl="2"` | 6                    |

💡 Vuetify ajuste automatiquement la disposition selon la taille de l’écran (mobile, tablette, desktop).

---

#### ✅ Ce que vous devez avoir à la fin

Une page avec :
- Un titre centré
- Un champ de recherche (non fonctionnel pour l’instant)
- Une grille avec une ou plusieurs cases affichant "Carte à venir..."

Vous pouvez dupliquer les `v-col` si vous voulez tester l’affichage avec plusieurs colonnes.

---

📘 Ressources utiles :
- [📐 Vuetify – Grid system](https://vuetifyjs.com/en/components/grids/)
- [🖊️ Vuetify – Text fields](https://vuetifyjs.com/en/components/text-fields/)

---

### 🧩 Étape 6 – Se connecter au magasin Pinia

#### 🌟 Qu’est-ce que Pinia ?

Pinia est le système officiel de **gestion d’état** pour les applications Vue.js. Il permet de stocker et manipuler des données **partagées entre plusieurs composants**, comme une mini-base de données locale dans le navigateur.

C’est particulièrement utile dans des projets où plusieurs composants doivent accéder à des **données communes**, comme ici dans une application Pokédex.

---

##### 🧠 À quoi sert un "magasin" Pinia ?

Un **magasin Pinia** (ou store) est un module qui regroupe :

- ✅ des **données** (state),
- 🔍 des **accès intelligents** à ces données (getters),
- ⚙️ des **fonctions pour modifier ces données** (actions).

On y centralise toute la logique métier, ce qui rend l’application plus claire, modulaire et facile à maintenir.

---

##### 📦 Exemple concret : le magasin des Pokémon

Dans notre projet Pokédex, nous avons un seul store `usePokemonStore` qui gère :

- la **liste des Pokémon** (avec leurs types, niveaux, images, stats...),
- la **gestion des favoris**,
- les **ajouts / modifications / suppressions** de Pokémon,
- la **sauvegarde dans le `localStorage`** pour garder les données même après fermeture du navigateur.

Voici un aperçu de sa structure générale :

```js
export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    types,           // Liste des types (Feu, Eau, Plante, etc.)
    pokemons,        // Liste des Pokémon (chargée depuis localStorage ou liste par défaut)
    favorites: [],   // Liste des IDs favoris
  }),
  getters: {
    getTypeById,     // Trouve un type à partir de son ID
    getPokemonById,  // Trouve un Pokémon par son ID
    isFavorite,      // Vérifie si un Pokémon est favori
    getFavorites,    // Liste complète des Pokémon favoris
    totalPokemons,   // Nombre total de Pokémon
    totalFavorites,  // Nombre de favoris
  },
  actions: {
    addPokemon,      // Ajouter un nouveau Pokémon
    updatePokemon,   // Modifier un Pokémon existant
    deletePokemon,   // Supprimer un Pokémon
    toggleFavorite,  // Ajouter ou retirer des favoris
    loadFavorites,   // Charger les favoris depuis le localStorage
  },
})
```

---

##### 🧾 Détails des **états** (`state`)

- `types` : liste fixe des types avec noms et couleurs.
- `pokemons` : tableau d’objets Pokémon. Il est initialisé depuis le `localStorage`, sinon on utilise une liste par défaut.
- `favorites` : tableau d’IDs des Pokémon favoris.

---

##### 🔍 Détails des **getters**

Ce sont des fonctions qui permettent d'accéder facilement à des infos dérivées :

| Getter              | Utilité |
|---------------------|---------|
| `getTypeById(id)`   | Trouver un type (Feu, Eau...) par son ID |
| `getPokemonById(id)`| Obtenir un Pokémon complet par son ID |
| `isFavorite(pokemon)`| Savoir si un Pokémon est marqué comme favori |
| `getFavorites()`    | Récupérer la liste complète des Pokémon favoris |
| `totalPokemons`     | Compter le nombre total de Pokémon |
| `totalFavorites`    | Compter le nombre de favoris |

---

##### ⚙️ Détails des **actions**

Ce sont les fonctions que l’on peut appeler pour **modifier l’état** du magasin :

###### ➕ `addPokemon(pokemon)`
- Ajoute un Pokémon à la liste.
- Génère un identifiant unique.
- Sauvegarde dans le localStorage.

###### ✏️ `updatePokemon(updatedPokemon)`
- Met à jour les infos d’un Pokémon existant.
- Ne vérifie pas les doublons de nom.

###### ❌ `deletePokemon(pokemonId)`
- Supprime un Pokémon de la liste.
- Et aussi des favoris s’il y était.

###### ⭐ `toggleFavorite(pokemon)`
- Si le Pokémon est déjà favori, il est retiré.
- Sinon, il est ajouté.
- Le tableau est ensuite sauvegardé dans le `localStorage`.

###### 📥 `loadFavorites()`
- Recharge la liste des favoris au démarrage de l’app.
- Supprime ceux qui ne sont plus valides (ex. Pokémon supprimé).

---

##### 💾 LocalStorage : garder les données entre deux sessions

Grâce à `localStorage`, la liste des Pokémon et des favoris est **persistante**. Même après avoir fermé le navigateur, l’utilisateur retrouve ses ajouts et favoris au prochain chargement.

---

##### ✅ Exemple d’utilisation dans un composant

```js
<script setup>
import { usePokemonStore } from '@/stores/pokemon'

const pokemonStore = usePokemonStore()

const allPokemons = pokemonStore.pokemons
const favoris = pokemonStore.getFavorites()
const total = pokemonStore.totalPokemons

function ajouterFavori(pokemon) {
  pokemonStore.toggleFavorite(pokemon)
}
</script>
```

::: info
Les données des Pokémons sont récupérées depuis une API locale à l'aide d'axios et stockées dans le store Pinia.
:::

```js
async init () {
    console.log('🚀 Initialisation du store Pokémon...')

    this.isLoading = true

    try {
        // Les fonctions fetchTypes et fetchPokemons sont des actions définies dans le store
        // Elles récupèrent les données depuis l'API et les stockent dans le state
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

```

---

##### 🧩 Conclusion

Ce magasin Pinia rend l'application Pokédex **organisée, évolutive et facile à utiliser**. On peut très facilement :

- **accéder aux données** depuis n’importe quel composant,
- **gérer les favoris**,
- **ajouter ou modifier** un Pokémon,
- **sauvegarder les données** dans le navigateur.
---

C’est le moment de **récupérer les données depuis le magasin `pokemonStore`**, qui contient déjà une liste de Pokémon dans sa version par défaut.

#### 🎯 Objectifs
- Importer `usePokemonStore`
- Initialiser le store dans le script
- Vérifier que les données sont bien là

#### 📌 À faire

1. Dans la section `<script setup>` de `index.vue`, ajoutez :

```js
import { usePokemonStore } from '@/stores/pokemonStore'
```

2. Ensuite, initialisez le store :
```js
const pokemonStore = usePokemonStore()
```

3. Pour vérifier que tout fonctionne, **utilisez la console du navigateur** :
```js
console.log(pokemonStore.pokemons)
```

> 💬 Vous devriez voir un tableau avec plusieurs objets Pokémon dans la console du navigateur.

#### 🧠 Et ensuite ?
À ce stade, vous **n'affichez rien dans la page** avec ces données. On va le faire dans l'étape suivante !

---

### 🧩 Étape 7 – Afficher les Pokémon dans la grille

Maintenant que les données sont disponibles dans `pokemonStore.pokemons`, vous allez les afficher dynamiquement dans la page d’accueil.

#### 🎯 Objectifs
- Parcourir les Pokémon avec `v-for`
- Afficher quelques infos (nom, image, etc.)
- S’assurer que le layout fonctionne

#### 📌 À faire

1. Dans le `<v-row>`, ajoutez un `v-col` par Pokémon :

```vue
<v-col
  v-for="pokemon in pokemonStore.pokemons"
  :key="pokemon.id"
  cols="12"
  sm="6"
  md="4"
  lg="3"
  xl="2"
>
  <p>{{ pokemon.name }}</p>
</v-col>
```

2. (Bonus) Ajoutez une image :

```vue
<v-img :src="`/images/${pokemon.img}`" height="200" contain />
```

> 💡 Utilisez `v-img` avec `contain` pour que l’image garde les proportions, et testez avec quelques noms comme `pikachu.png`, `salameche.png`, etc.

---

📘 Pour aller plus loin :

- [📄 Docs Vuetify – Grid system](https://vuetifyjs.com/en/components/grids/)
- [🖼️ Docs Vuetify – Images](https://vuetifyjs.com/en/components/images/)
- [📦 Docs Pinia – Introduction](https://pinia.vuejs.org/introduction.html)

---

### 🧩 Étape 8 – Créer un composant `PokemonCard.vue`

Maintenant que vous affichez dynamiquement une liste de Pokémon, il est temps d’isoler l’affichage d’un Pokémon dans un **composant dédié**. Cela vous permettra de :

- mieux organiser votre code,
- éviter de dupliquer du HTML,
- et réutiliser facilement cette carte dans d’autres pages (comme les favoris).

---

#### 🎯 Objectifs

- Créer un composant Vue (`PokemonCard.vue`)
- Passer un Pokémon en **prop**
- Afficher le nom, l’image, le niveau et les types du Pokémon

---

#### 📌 À faire

1. Créez un nouveau fichier `PokemonCard.vue` dans le dossier `src/components/`

2. Dans ce fichier, structurez le composant avec :
  - `<template>` : pour l'affichage
  - `<script setup>` : pour recevoir la prop
  - `defineProps({ pokemon: Object })` : pour recevoir l’objet Pokémon

3. Affichez dans la carte :
  - l’image (`v-img`)
  - le nom (`v-card-title`)
  - le niveau (`v-card-subtitle` ou `v-card-text`)
  - les types (un tableau d’`id` à interpréter plus tard)

4. Dans `index.vue`, importez ce composant et remplacez le contenu du `v-col` par :

```vue
<PokemonCard :pokemon="pokemon" />
```

---

#### 💡 Conseils

- Utilisez `v-card` comme base de mise en page (voir [v-card](https://vuetifyjs.com/en/components/cards/)).
- Ajoutez un minimum de styles (`height`, `pa-2`, `elevation`, etc.) pour rendre la carte agréable.
- Pour l’image, utilisez :
  ```vue
  <v-img :src="`/images/${pokemon.img}`" height="200" contain />
  ```
- Ne vous occupez pas encore de rendre la carte cliquable ni des favoris — ça viendra plus tard.

---

#### ✅ Résultat attendu

Une **carte Pokémon réutilisable** et propre, utilisée dans `index.vue` avec un `v-for` :

```vue
<v-col
  v-for="pokemon in pokemonStore.pokemons"
  :key="pokemon.id"
  cols="12"
  sm="6"
  md="4"
  lg="3"
  xl="2"
>
  <PokemonCard :pokemon="pokemon" />
</v-col>
```

---

📘 Voir aussi :
- [🧩 Vuetify – Card](https://vuetifyjs.com/en/components/cards/)
- [📦 Vue – defineProps](https://vuejs.org/guide/components/props.html#defining-props)

---

Parfait ! Voici l’**étape 9** rédigée avec le même soin pédagogique : elle guide les apprentis à filtrer dynamiquement la liste des Pokémon en fonction d’un champ de recherche.

---

### 🧩 Étape 9 – Ajouter la recherche dynamique

Vous avez déjà un champ de recherche visible dans votre page d’accueil. Dans cette étape, vous allez le **connecter à une logique** qui permet de **filtrer dynamiquement** les Pokémon affichés, en fonction du nom saisi.

---

#### 🎯 Objectifs

- Lier le champ de recherche à une variable réactive
- Créer une propriété calculée (`computed`) pour filtrer la liste
- Parcourir la liste filtrée dans la grille

---

#### 📌 À faire

1. Dans la section `<script setup>` de `index.vue`, créez une variable réactive pour stocker la recherche :

```js
import { ref, computed } from 'vue'

const search = ref('')
```

2. Liez cette variable au champ `v-text-field` :

```vue
<v-text-field
  v-model="search"
  label="Rechercher un Pokémon"
  prepend-icon="mdi-magnify"
  clearable
/>
```

3. Créez une propriété calculée qui filtre la liste des Pokémon :

```js
const filteredPokemons = computed(() => {
  const query = search.value.toLowerCase().trim()
  return pokemonStore.pokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(query)
  )
})
```

4. Dans la boucle `v-for`, remplacez `pokemonStore.pokemons` par `filteredPokemons` :

```vue
<v-col
  v-for="pokemon in filteredPokemons"
  :key="pokemon.id"
  ...
>
  <PokemonCard :pokemon="pokemon" />
</v-col>
```

---

#### 🧠 Explication

- `v-model="search"` relie le champ à une variable
- `computed` est recalculé **uniquement si la recherche change**
- `filter()` renvoie une nouvelle liste de Pokémon dont le nom contient le texte tapé
- `.toLowerCase()` permet une recherche **insensible à la casse**

---

📘 Ressources :
- [🔍 Vue – computed](https://vuejs.org/guide/essentials/computed.html)
- [🧠 MDN – Array.prototype.filter()](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

---

### 🧩 Étape 10 – Trier les Pokémon par ordre alphabétique

Avant d’ajouter les favoris, vous allez améliorer l’affichage de la liste des Pokémon en les triant par ordre alphabétique.

#### 🎯 Objectifs

- Afficher les Pokémon **dans l’ordre alphabétique** (A → Z)
- Conserver la compatibilité avec le champ de **recherche dynamique**

---

#### 📌 À faire

1. Ouvrez `index.vue`
2. Dans la section `<script setup>`, entre `pokemonStore.pokemons` et `filteredPokemons`, ajoutez une nouvelle propriété calculée `sortedPokemons` :

```js
const sortedPokemons = computed(() => {
  return [...pokemonStore.pokemons].sort((a, b) =>
    a.name.localeCompare(b.name)
  )
})
```

💡 On utilise `[...]` pour créer une **copie** du tableau, afin de ne pas modifier l’original dans le store.

3. Modifiez `filteredPokemons` pour qu’il filtre **la liste triée** :

```js
const filteredPokemons = computed(() => {
  const query = search.value.toLowerCase().trim()
  return sortedPokemons.value.filter(pokemon =>
    pokemon.name.toLowerCase().includes(query)
  )
})
```

4. La boucle dans le template (`v-for="pokemon in filteredPokemons"`) reste inchangée ✅

---

#### ✅ Résultat attendu

- Les Pokémon apparaissent **classés par nom** même si on ne tape rien
- La recherche continue à fonctionner normalement

---

#### 💡 Pourquoi séparer le tri et la recherche ?

Vous pourriez techniquement **faire le tri et la recherche dans une seule fonction `computed`**, mais ce n’est **pas recommandé**, et voici pourquoi :

##### 🔹 1. Meilleure lisibilité
En séparant :
- `sortedPokemons` → trie les Pokémon
- `filteredPokemons` → applique la recherche

➡️ Chaque fonction fait **une seule chose** clairement. C’est plus facile à comprendre, à lire, à modifier.

##### 🔹 2. Meilleures performances
Si la recherche change, **seul le filtre est recalculé**.  
Si les Pokémon changent, le tri est refait **une seule fois**, et la recherche s'applique sur le résultat.

➡️ Vue réagit mieux, et vous évitez des recalculs inutiles.

##### 🔹 3. Réutilisabilité
Le tableau trié (`sortedPokemons`) pourrait aussi être utilisé ailleurs (par exemple dans une autre page ou une stat).

➡️ Vous évitez de dupliquer la logique de tri dans plusieurs endroits.

---

📘 Ressources utiles :
- [🔠 JS – String.prototype.localeCompare()](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)

🎯 Vous pouvez maintenant passer à l’étape suivante pour gérer les favoris (👉 Étape 11).

---

### 🧩 Étape 11 – Ajouter un système de favoris

Dans cette étape, vous allez permettre à l’utilisateur de **marquer un Pokémon comme favori**. Cette action doit être visible (via une icône ❤️) et mémorisée (stockée dans le store Pinia).

---

#### 🎯 Objectifs

- Utiliser une **icône de type cœur** pour marquer un favori
- Permettre à l’utilisateur de **ajouter ou retirer un favori**
- Mettre à jour l’état via une fonction du store
- Afficher l’état visuel du favori (plein ou vide)

---

#### 📌 À faire

##### 1. Préparer le composant `PokemonCard.vue`

Dans le fichier `PokemonCard.vue` :

- Importez `usePokemonStore()` dans `<script setup>`
- Appelez-le pour avoir accès aux méthodes et aux données
- Ajoutez un bouton dans la carte, avec une icône conditionnelle :

```vue
<v-btn icon @click.prevent="pokemonStore.toggleFavorite(pokemon)">
  <v-icon :color="pokemonStore.isFavorite(pokemon) ? 'red' : ''">
    {{ pokemonStore.isFavorite(pokemon) ? 'mdi-heart' : 'mdi-heart-outline' }}
  </v-icon>
</v-btn>
```

##### 2. Comprendre le fonctionnement

Dans le fichier `pokemonStore.js`, deux fonctions sont déjà prêtes :

- `toggleFavorite(pokemon)` : ajoute ou supprime le Pokémon des favoris
- `isFavorite(pokemon)` : retourne `true` si le Pokémon est favori

📦 Ces fonctions sont déjà connectées au `localStorage`, ce qui permet de **mémoriser vos favoris** même après un rafraîchissement de la page !

---

#### 🧠 Comportement attendu

- Un clic sur l’icône change son état :
  - ❤️ devient 🤍 (et inversement)
- L’icône est **rouge si favori**
- Le changement est immédiat et réactif

---

#### 🧪 Test

1. Cliquez sur plusieurs cœurs pour ajouter des favoris
2. Rafraîchissez la page
3. Vérifiez que les favoris sont conservés

---

📘 Ressources utiles :
- [💡 Vuetify – Boutons avec icônes](https://vuetifyjs.com/en/components/buttons/#icon)
- [❤️ Material Design Icons](https://pictogrammers.com/library/mdi/?q=heart)

---

### 🧩 Étape 12 – Créer la page des favoris

Dans cette étape, vous allez créer une page `Favoris.vue` qui affiche uniquement les Pokémon que l’utilisateur a ajoutés à ses favoris.  
Vous allez réutiliser le composant `PokemonCard.vue` pour afficher chaque carte, comme sur la page d’accueil.

---

#### 🎯 Objectifs

- Créer une nouvelle page accessible via le menu : `/favoris`
- Récupérer les Pokémon favoris depuis le `pokemonStore`
- Réutiliser le composant `PokemonCard.vue`
- Gérer le cas où aucun favori n’est encore sélectionné

---

#### 📌 À faire

1. Ouvrez ou créez le fichier `src/pages/Favoris.vue`
2. Structurez la page avec :
  - un `<v-container>` pour le contenu
  - un titre `<h1>` centré
  - une **grille Vuetify** (`v-row` + `v-col`)
  - et un affichage conditionnel si la liste est vide

3. Dans le `<script setup>` :
  - Importez `usePokemonStore()` et appelez-le
  - Utilisez le **getter `getFavorites`** du store pour récupérer la liste à afficher

---

#### 💡 Exemple de logique

```js
const pokemonStore = usePokemonStore()
const favoris = computed(() => pokemonStore.getFavorites)
```

Et dans le template :

```vue
<v-row v-if="favoris.length > 0">
  <v-col
    v-for="pokemon in favoris"
    :key="pokemon.id"
    cols="12"
    sm="6"
    md="4"
    lg="3"
    xl="2"
  >
    <PokemonCard :pokemon="pokemon" />
  </v-col>
</v-row>

<v-alert
  v-else
  type="info"
  class="text-center"
>
  Vous n'avez pas encore de Pokémon favoris.<br />
  <v-btn to="/">Retourner à la liste</v-btn>
</v-alert>
```

---

#### 🧠 À noter

- Le getter `getFavorites` renvoie un tableau d’objets Pokémon (pas seulement les ID).
- Le message s’affiche automatiquement si la liste est vide.
- Aucun bouton de suppression n’est nécessaire ici (sauf si on souhaite retirer un favori via le cœur).

---

📘 Voir aussi :
- [🧩 Étape 11 – Ajouter les favoris](#)
- [💡 Vuetify – Alert](https://vuetifyjs.com/en/components/alerts/)
- [🗂️ Composant PokemonCard.vue](#)

---

### 🧩 Étape 13 – Rendre la carte Pokémon cliquable

🎯 Objectifs :
- Faire en sorte que chaque carte ouvre une **page de détail**
- Créer une page dynamique avec paramètre `id` (fichier `[id].vue`)
- Récupérer les données du Pokémon depuis le store

---

### 🧩 Étape 14 – Créer une fiche de détail complète

🎯 Objectifs :
- Afficher les infos complètes : nom, image, types, stats, description
- Réutiliser ou créer les composants `PokemonStats` et `PokemonTypesChips`
- Ajouter un bouton "Retour" ou un lien vers la page d’accueil

---

### 🧩 Étape 15 – Ajouter un formulaire d’ajout de Pokémon (avec authentification)

🎯 Objectifs :
- Créer une page de formulaire avec `v-form`
- Ajouter un Pokémon au store avec validation
- Protéger l'accès à cette page avec un login (plus tard)

---

### 🧩 Étape 16 – Ajouter une page de connexion simple

🎯 Objectifs :
- Simuler une authentification avec un store `authStore`
- Ajouter un formulaire de login (email + mot de passe)
- Stocker un token factice et simuler la connexion

---

### 🧩 Étape 17 – Protéger les routes (auth required)

🎯 Objectifs :
- Empêcher l'accès à certaines pages si l'utilisateur n’est pas connecté
- Rediriger automatiquement vers `/login` si non-authentifié

---

### 🧩 Étape 18 – Ajouter la suppression d’un Pokémon (si connecté)

🎯 Objectifs :
- Afficher un bouton "Supprimer" sur la carte (ou la fiche)
- Protéger cette action : visible uniquement si connecté
- Supprimer le Pokémon du store + localStorage

---

### 🧩 Étape 19 – Introduction à Axios et à l'appel API

L’objectif de cette phase est de remplacer les données locales du `pokemonStore` par des données
**récupérées à distance** depuis une API REST (ou Directus, par exemple).

🎯 Objectifs :
- Installer et importer **Axios**
- Comprendre ce qu’est une API REST
- Expliquer comment faire une requête `GET`

📌 À faire :
- Installer Axios via `npm install axios`
- Créer un fichier de test avec un appel `axios.get()` vers une URL de démonstration (ou PokéAPI)

---

### 🧩 Étape 20 – Ajouter la config API dans le store

🎯 Objectifs :
- Ajouter un champ `apiUrl` dans le store
- Préparer le terrain pour les appels API

📌 À faire :
- Ajouter `apiUrl: 'https://localhost'` (ou autre URL) dans `state`
- Ajouter un champ `isLoading` pour gérer un éventuel loader

---

### 🧩 Étape 21 – Récupérer les types depuis l'API

🎯 Objectifs :
- Remplacer la liste locale des types par un appel `GET /items/type` (ou équivalent)
- Stocker la réponse dans `state.types`

📌 À faire :
- Créer une méthode `fetchTypes()` dans le store
- Gérer les erreurs avec `try/catch`
- Appeler `fetchTypes()` dans `App.vue` ou `onMounted`

---

### 🧩 Étape 22 – Récupérer les Pokémon depuis l'API

🎯 Objectifs :
- Remplacer `defaultPokemons` par les données de l'API

📌 À faire :
- Créer une méthode `fetchPokemons()`
- Appeler l’API avec `axios.get()`
- Transformer les données si besoin pour qu’elles soient compatibles avec le format local

---

### 🧩 Étape 23 – Intégrer les images distantes

🎯 Objectifs :
- Gérer les chemins d’image distants (via `/assets` ou une autre structure de fichier)

📌 À faire :
- Ajouter `imageBaseUrl` dans le store
- Modifier `getImageUrl(filename)` pour l’adapter si nécessaire

---

### 🧩 Étape 24 – Désactiver les données locales (optionnel)

🎯 Objectifs :
- Supprimer ou commenter les Pokémon/Types définis en dur
- Ne garder que la structure dynamique

---

### 🧩 Étape 25 – Gérer les favoris avec l'API (niveau avancé)

🎯 Objectifs :
- Sauvegarder les favoris via une API (POST/DELETE)
- Ou synchroniser avec un champ "favori" du back-end

📌 À faire :
- Modifier `toggleFavorite()` pour envoyer une requête
- Ajouter une méthode `fetchFavorites()` si besoin

---

