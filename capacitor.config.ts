import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'ch.divcom.pokedex',
  appName: 'Pokédex',
  webDir: 'dist',
  // Couleur d'arrière-plan de la WebView (visible derrière le contenu
  // pendant le chargement et dans la zone du notch iOS).
  // Doit matcher le fond du thème dark Vuetify pour éviter le flash blanc.
  backgroundColor: '#121212',
  ios: {
    // 'never' : la WebView s'étend SOUS la status bar (le notch).
    // C'est la WebView qui peint l'arrière-plan derrière la status bar,
    // pas iOS — ainsi le thème sombre Vuetify est visible jusqu'en haut.
    // Le padding du header est géré par .app-bar-safe (env(safe-area-inset-top)).
    contentInset: 'never',
  },
  android: {
    allowMixedContent: false,
  },
}

export default config
