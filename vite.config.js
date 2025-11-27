import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // CNEWS
      '/rss-cnews': {
        target: 'https://www.cnews.fr',
        changeOrigin: true,
        rewrite: () => '/rss.xml',
      },
      // BFMTV
      '/rss-bfmtv': {
        target: 'https://www.bfmtv.com',
        changeOrigin: true,
        rewrite: () => '/rss/news-24-7/',
      },
      // franceinfo
      '/rss-franceinfo': {
        target: 'https://www.franceinfo.fr',
        changeOrigin: true,
        rewrite: () => '/titres.rss',
      },
      // AFP// 20 MINUTES
'/rss-20minutes': {
  target: 'https://www.20minutes.fr',
  changeOrigin: true,
  rewrite: () => '/feeds/rss-une.xml',
},

// LE FIGARO
'/rss-figaro': {
  target: 'https://www.lefigaro.fr',
  changeOrigin: true,
  rewrite: () => '/rss/figaro_actualites.xml',
},

// LE MONDE
'/rss-lemonde': {
  target: 'https://www.lemonde.fr',
  changeOrigin: true,
  rewrite: () => '/rss/une.xml',
},
      '/rss-afp': {
        target: 'https://www.afp.com',
        changeOrigin: true,
        rewrite: () => '/fr/actus/afp_actualite/792,31,9,7,33/feed',
      },
      // RMC
      '/rss-rmc': {
        target: 'https://rmc.bfmtv.com',
        changeOrigin: true,
        rewrite: () => '/rss/actualites/',
      },
      
    },
  },
})