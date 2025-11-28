// netlify/functions/rss.js
// Serverless proxy pour RSS feeds (Netlify Functions)
// Usage: /.netlify/functions/rss?id=franceinfo
// Maps id -> target URL pour éviter le proxy arbitraire.

const FEED_MAP = {
  cnews: 'https://www.cnews.fr/rss.xml',
  bfmtv: 'https://www.bfmtv.com/rss/news-24-7/',
  franceinfo: 'https://www.franceinfo.fr/titres.rss',
<<<<<<< HEAD
  afp: 'https://www.afp.com/fr/actus/afp_actualite/792,31,9,7,33/feed',
=======
>>>>>>> e296d3e (new feature)
  rmc: 'https://rmc.bfmtv.com/rss/actualites/',
  '20minutes': 'https://www.20minutes.fr/feeds/rss-une.xml',
  figaro: 'https://www.lefigaro.fr/rss/figaro_actualites.xml',
  lemonde: 'https://www.lemonde.fr/rss/une.xml',
<<<<<<< HEAD
=======
  lexpress: 'https://www.lexpress.fr/arc/outboundfeeds/rss/alaune.xml',
  valeurs: 'https://www.valeursactuelles.com/feed?post_type=post',
>>>>>>> e296d3e (new feature)
}

export async function handler(event) {
  const id = (event.queryStringParameters && event.queryStringParameters.id) || ''
  const target = FEED_MAP[id]

  if (!target) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unknown feed id' }),
    }
  }

  try {
    const res = await fetch(target, { method: 'GET' })
    if (!res.ok) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Bad response from source (${res.status})` }),
      }
    }
    const text = await res.text()
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: text,
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message || 'Fetch error' }),
    }
  }
}