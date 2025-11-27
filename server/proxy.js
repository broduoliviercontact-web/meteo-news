import express from 'express'

const app = express()
const PORT = process.env.PORT || 5174

// targets
const TARGET_CNEWS = 'https://www.cnews.fr/rss.xml'
const TARGET_20MIN = 'https://www.20minutes.fr/feeds/rss-une.xml'
const TARGET_FIGARO = 'https://www.lefigaro.fr/rss/figaro_actualites.xml'
const TARGET_LEMONDE = 'https://www.lemonde.fr/rss/une.xml'

async function fetchAndForward(target, res) {
  try {
    const response = await fetch(target)
    if (!response.ok) {
      return res.status(502).send('Bad response from source')
    }
    const text = await response.text()
    res.set('Content-Type', 'application/xml; charset=utf-8')
    res.set('Access-Control-Allow-Origin', '*')
    res.send(text)
  } catch (err) {
    console.error('Proxy error', err)
    res.status(500).send({ error: err.message })
  }
}

app.get('/rss-cnews', async (req, res) => {
  await fetchAndForward(TARGET_CNEWS, res)
})

app.get('/rss-20minutes', async (req, res) => {
  await fetchAndForward(TARGET_20MIN, res)
})

app.get('/rss-figaro', async (req, res) => {
  await fetchAndForward(TARGET_FIGARO, res)
})

// 🔽 AJOUTE :
app.get('/rss-lemonde', async (req, res) => {
  await fetchAndForward(TARGET_LEMONDE, res)
})
// 🔼 FIN AJOUTE

// backward-compatible single /rss that returns CNEWS
app.get('/rss', async (req, res) => {
  await fetchAndForward(TARGET_CNEWS, res)
})

// explicit endpoints used by the frontend
app.get('/rss-cnews', async (req, res) => {
  await fetchAndForward(TARGET_CNEWS, res)
})

app.get('/rss-20minutes', async (req, res) => {
  await fetchAndForward(TARGET_20MIN, res)
})

app.get('/rss-figaro', async (req, res) => {
  await fetchAndForward(TARGET_FIGARO, res)
})

app.listen(PORT, () => {
  console.log(`RSS proxy listening on http://localhost:${PORT}`)
  console.log('Available endpoints: /rss, /rss-cnews, /rss-20minutes, /rss-figaro')
})