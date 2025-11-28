// src/NewsTicker_V2.jsx
import React, { useEffect, useRef, useState } from 'react'

// ================== CONFIG FLUX ==================
const FEEDS = [
  { id: 'cnews',      label: 'CNEWS',      proxyUrl: '/.netlify/functions/rss?id=cnews',      directUrl: 'https://www.cnews.fr/rss.xml' },
  { id: 'bfmtv',      label: 'BFMTV',      proxyUrl: '/.netlify/functions/rss?id=bfmtv',      directUrl: 'https://www.bfmtv.com/rss/news-24-7/' },
  { id: 'franceinfo', label: 'FRANCEINFO', proxyUrl: '/.netlify/functions/rss?id=franceinfo', directUrl: 'https://www.franceinfo.fr/titres.rss' },
  { id: 'rmc',        label: 'RMC',        proxyUrl: '/.netlify/functions/rss?id=rmc',        directUrl: 'https://rmc.bfmtv.com/rss/actualites/' },
  { id: '20minutes',  label: '20 MIN',     proxyUrl: '/.netlify/functions/rss?id=20minutes',  directUrl: 'https://www.20minutes.fr/feeds/rss-une.xml' },
  { id: 'figaro',     label: 'FIGARO',     proxyUrl: '/.netlify/functions/rss?id=figaro',     directUrl: 'https://www.lefigaro.fr/rss/figaro_actualites.xml' },
  { id: 'lemonde',    label: 'LE MONDE',   proxyUrl: '/.netlify/functions/rss?id=lemonde',    directUrl: 'https://www.lemonde.fr/rss/une.xml' },
  {
    id: 'lexpress',
    label: "L'EXPRESS",
    proxyUrl: '/.netlify/functions/rss?id=lexpress',
    directUrl: 'https://www.lexpress.fr/arc/outboundfeeds/rss/alaune.xml',
  },
  {
    id: 'valeurs',
    label: 'VALEURS ACTUELLES',
    proxyUrl: '/.netlify/functions/rss?id=valeurs',
    directUrl: 'https://www.valeursactuelles.com/feed?post_type=post',
  },
]


// ================== MOTS-CLÉS ISLAM ==================

const ISLAM_KEYWORDS = [
  'islam','musulman','musulmane','musulmans','musulmanes','ramadan','coran','allah',
  'mosquée','mosquee','imam','charia','sharia','burqa','niqab','hijab','hidjab',
  'voile islamique','islamisme','islamiste','djihad','djihadiste','jihad','jihadiste',
]

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isIslamRelatedText(text) {
  if (!text) return false
  const t = text.toLowerCase()
  return ISLAM_KEYWORDS.some((k) => t.includes(k.toLowerCase()))
}

// helper pour enlever le HTML / entités des descriptions
function stripHtml(html) {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return (tmp.textContent || tmp.innerText || '').trim()
}

// ================== MISE EN ÉVIDENCE COMBINÉE ==================

function highlightCombined(text, query) {
  if (!text) return text
  const q = (query || '').trim()
  const includeQuery = q.length >= 2

  const keywords = ISLAM_KEYWORDS.slice()
  if (includeQuery) keywords.push(q)

  keywords.sort((a, b) => b.length - a.length)
  const patternText = keywords.map(escapeRegex).join('|')
  if (!patternText) return text

  const pattern = new RegExp(`(${patternText})`, 'gi')
  const parts = text.split(pattern)
  if (parts.length === 1) return text

  return parts.map((part, i) => {
    if (!part) return null
    const lower = part.toLowerCase()

    const isIslamMatch = ISLAM_KEYWORDS.some((k) => k.toLowerCase() === lower)
    if (isIslamMatch) {
      return (
        <span key={i} className="keyword-islam">
          {part}
        </span>
      )
    }

    if (includeQuery && lower === q.toLowerCase()) {
      return (
        <span key={i} className="keyword-query">
          {part}
        </span>
      )
    }

    return <span key={i}>{part}</span>
  })
}

function isTextMatchingQuery(item, query) {
  if (!query) return true
  const q = query.trim().toLowerCase()
  if (!q) return true
  if (q.length < 2) return true
  const hay = `${item.title} ${item.description}`.toLowerCase()
  return hay.includes(q)
}

// ================== PARSE RSS ==================
// on ajoute un uid stable-ish pour éviter collisions de key React
function parseRssItems(xmlText, sourceId) {
  const parser = new DOMParser()
  const xml = parser.parseFromString(xmlText, 'text/xml')
  const items = Array.from(xml.querySelectorAll('item'))

  return items
    .map((item, idx) => {
      const title = item.querySelector('title')?.textContent?.trim() || ''

      // description : essayer plusieurs balises possibles, puis strip HTML
      let rawDescription = ''
      const descCandidates = [
        'description',
        'content\\:encoded',
        'encoded',
        'summary',
        'content',
      ]
      for (const cand of descCandidates) {
        try {
          // querySelector with escaped colon works for content:encoded
          const q = item.querySelector(cand)
          if (q?.textContent?.trim()) {
            rawDescription = q.textContent.trim()
            break
          }
          // fallback getElementsByTagName (some parsers treat names differently)
          const els = item.getElementsByTagName(cand)
          if (els?.[0]?.textContent?.trim()) {
            rawDescription = els[0].textContent.trim()
            break
          }
        } catch (e) {
          // ignore and try next
        }
      }
      const description = stripHtml(rawDescription)

      // Recherche robuste de la date : plusieurs balises possibles selon les flux
      let pubDateRaw = ''
      const dateCandidates = ['pubDate', 'pubdate', 'dc:date', 'dc\\:date', 'date', 'updated']
      for (const cand of dateCandidates) {
        try {
          if (cand.includes(':')) {
            const qsel = cand.replace(':', '\\:')
            const q = item.querySelector(qsel)
            if (q?.textContent?.trim()) {
              pubDateRaw = q.textContent.trim()
              break
            }
            const els = item.getElementsByTagName(cand)
            if (els?.[0]?.textContent?.trim()) {
              pubDateRaw = els[0].textContent.trim()
              break
            }
          } else {
            const q = item.querySelector(cand)
            if (q?.textContent?.trim()) {
              pubDateRaw = q.textContent.trim()
              break
            }
            const els = item.getElementsByTagName(cand)
            if (els?.[0]?.textContent?.trim()) {
              pubDateRaw = els[0].textContent.trim()
              break
            }
          }
        } catch (e) {
          // ne pas casser le parsing si une méthode échoue, continuer
        }
      }

      // Certains flux mettent la date dans d'autres champs ou formats ; tentative de normalisation
      let dateMs = 0
      if (pubDateRaw) {
        const raw = pubDateRaw.trim()
        if (/^\d{10,13}$/.test(raw)) {
          const n = Number(raw)
          dateMs = n > 1e12 ? n : n * 1000
        } else {
          const d = new Date(raw)
          if (!Number.isNaN(d.getTime())) {
            dateMs = d.getTime()
          }
        }
      }

      const link = item.querySelector('link')?.textContent?.trim() || ''

      const textForFilter = `${title} ${description}`
      const isIslam = isIslamRelatedText(textForFilter)

      // uid : source + dateMs (si dispo) + index pour garantir unicité
      const uid = `${sourceId}-${dateMs || 'noDate'}-${idx}`

      return {
        uid,
        title,
        description,
        pubDateRaw,
        dateMs,
        link,
        source: sourceId,
        isIslam,
      }
    })
    .filter((item) => item.title)
}

// ================== HELPERS STYLE ==================

function getTickerClass(source, isIslam, extra = '') {
  const classes = ['ticker']

  if (isIslam) {
    classes.push('ticker--islam')
  } else if (source === 'bfmtv') {
    classes.push('ticker--bfm')
  } else if (source === 'franceinfo') {
    classes.push('ticker--franceinfo')
  } else if (source === 'rmc') {
    classes.push('ticker--rmc')
  } else if (source === '20minutes') {
    classes.push('ticker--20minutes')
  } else if (source === 'figaro') {
    classes.push('ticker--figaro')
  } else if (source === 'lemonde') {
    classes.push('ticker--lemonde')
  } else if (source === 'lexpress') {
    classes.push('ticker--lexpress')
  } else if (source === 'valeurs') {
    classes.push('ticker--valeurs')
  } else {
    classes.push('ticker--cnews')
  }

  if (extra) classes.push(extra)
  return classes.join(' ')
}

function Brand({ source, extraClass = '', dateMs }) {
  const classes = ['brand']

  if (source === 'bfmtv') classes.push('brand--bfm')
  else if (source === 'franceinfo') classes.push('brand--franceinfo')
  else if (source === 'afp') classes.push('brand--afp')
  else if (source === 'rmc') classes.push('brand--rmc')
  else if (source === '20minutes') classes.push('brand--20minutes')
  else if (source === 'figaro') classes.push('brand--figaro')
  else if (source === 'lemonde') classes.push('brand--lemonde')
  else if (source === 'valeurs') classes.push('brand--valeurs')
  else classes.push('brand--cnews')


  if (extraClass) classes.push(extraClass)
  const className = classes.join(' ')

  let dateLabel = ''
  if (dateMs) {
    const d = new Date(dateMs)
    if (!Number.isNaN(d.getTime())) {
      dateLabel = d.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    }
  }

     let logo
  if (source === 'bfmtv') {
    logo = (
      <div className="brand-logo">
        <span className="brand-bfm">BFM</span>
        <span className="brand-tv">TV</span>
      </div>
    )
  } else if (source === 'franceinfo') {
    logo = (
      <div className="brand-logo brand-logo--fi">
        <span className="fi-dot" />
        <span className="fi-text">franceinfo</span>
      </div>
    )
  } else if (source === 'rmc') {
    logo = (
      <div className="brand-logo brand-logo--rmc">
        <span className="rmc-text">RMC</span>
      </div>
    )
  } else if (source === '20minutes') {
    logo = (
      <div className="brand-logo brand-logo--20minutes">
        <span className="twenty-number">20</span>
        <span className="twenty-text">MIN</span>
      </div>
    )
  } else if (source === 'figaro') {
    logo = (
      <div className="brand-logo brand-logo--figaro">
        <span className="figaro-text">FIGARO</span>
      </div>
    )
  } else if (source === 'lemonde') {
    logo = (
      <div className="brand-logo brand-logo--lemonde">
        <span className="lemonde-text">Le Monde</span>
      </div>
    )
  } else if (source === 'lexpress') {
    logo = (
      <div className="brand-logo brand-logo--lexpress">
        <span className="lexpress-text-main">L&apos;EXPRESS</span>
      </div>
    )
  } else {
    logo = (
      <div className="brand-logo">
        <span className="brand-c">C</span>
        <span className="brand-news">NEWS</span>
      </div>
    )
  }

  return (
    <div className={className}>
      {logo}
      {dateLabel && <div className="brand-date">{dateLabel}</div>}
    </div>
  )
}

// ================== FILTRAGE SOURCE ==================

function matchesSource(itemSource, filter) {
  if (filter === 'all') return true
  if (!itemSource) return false
  return String(itemSource).trim().toLowerCase() === String(filter).trim().toLowerCase()
}

// ================== COMPOSANT PRINCIPAL ==================

export default function NewsTicker() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [sourceFilter, setSourceFilter] = useState('all')
  const [onlyIslam, setOnlyIslam] = useState(false)

  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef(null)

  // debounce recherche
  useEffect(() => {
    const id = setTimeout(() => {
      setSearchQuery(searchInput.trim())
    }, 250)
    return () => clearTimeout(id)
  }, [searchInput])

  // debug: liste des sources disponibles (utile pour diagnostiquer)
  useEffect(() => {
    if (!items || items.length === 0) return
    const uniq = Array.from(new Set(items.map((it) => it.source || '(empty)')))
    // eslint-disable-next-line no-console
    console.debug('[NewsTicker] sources available:', uniq, 'total items:', items.length)
    // eslint-disable-next-line no-console
    console.debug('[NewsTicker] islam items count:', items.filter((it) => it.isIslam).length)
  }, [items])

  // debug: quand les filtres changent on log les résultats filtrés
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug('[NewsTicker] sourceFilter:', sourceFilter, 'onlyIslam:', onlyIslam, 'searchQuery:', searchQuery)
  }, [sourceFilter, onlyIslam, searchQuery])

  // FETCH + REFRESH
  useEffect(() => {
    let isCancelled = false

    async function loadItems() {
      if (isCancelled) return
      setLoading(true)
      setError('')

      try {
        const arrays = await Promise.all(
          FEEDS.map(async (feed) => {
            const { id, proxyUrl, directUrl } = feed
            const fetchAndParse = async (url) => {
              const res = await fetch(url)
              if (!res.ok) throw new Error(`HTTP ${res.status}`)
              const text = await res.text()
              return parseRssItems(text, id)
            }
            try {
              return await fetchAndParse(proxyUrl)
            } catch (e1) {
              // eslint-disable-next-line no-console
              console.warn(`Proxy KO pour ${id}, on tente direct`, e1)
              try {
                return await fetchAndParse(directUrl)
              } catch (e2) {
                // eslint-disable-next-line no-console
                console.error(`Impossible de charger le flux ${id}`, e2)
                return []
              }
            }
          })
        )

        if (isCancelled) return
        const merged = arrays.flat()
        if (!merged.length) {
          throw new Error('Aucun élément trouvé dans les flux RSS')
        }

        merged.sort((a, b) => (b.dateMs || 0) - (a.dateMs || 0))
        setItems(merged)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        if (!isCancelled) {
          setError('Impossible de charger les flux.')
        }
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }

    loadItems()
    const intervalId = setInterval(loadItems, 60_000)
    return () => {
      isCancelled = true
      clearInterval(intervalId)
    }
  }, [])

  // FILTRES
  const filteredItems = items.filter((item) => {
    const okSource = matchesSource(item.source, sourceFilter)
    const okIslam = !onlyIslam || item.isIslam
    const okSearch = isTextMatchingQuery(item, searchQuery)
    return okSource && okIslam && okSearch
  })

  // debug: log des items filtrés (sources + titres) pour aider à diagnostiquer
  useEffect(() => {
    if (!filteredItems) return
    const listInfo = filteredItems.map((it) => `${it.source}:${it.title.slice(0, 40)}${it.isIslam ? ' [ISLAM]' : ''}`)
    // eslint-disable-next-line no-console
    console.debug('[NewsTicker] filteredItems count:', filteredItems.length, 'examples:', listInfo.slice(0, 10))
  }, [filteredItems])

  const hasItems = filteredItems.length > 0
  const currentItem = hasItems ? filteredItems[0] : null

  return (
    <div className="ticker-wrapper">
      <div className="filters">
        <span className="filter-label">Sources</span>

        <div className="filter-buttons">
          <button
            type="button"
            className={'filter-button' + (sourceFilter === 'all' ? ' filter-button--active' : '')}
            onClick={() => setSourceFilter('all')}
          >
            Tous
          </button>

          {FEEDS.map((feed) => (
            <button
              key={feed.id}
              type="button"
              className={'filter-button' + (sourceFilter === feed.id ? ' filter-button--active' : '')}
              onClick={() => setSourceFilter(feed.id)}
            >
              {feed.label}
            </button>
          ))}
        </div>

        <div className="filter-buttons filter-buttons--right" style={{ alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Rechercher…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid #444',
                background: '#222',
                color: '#eee',
                fontSize: '0.85rem',
                width: 220,
              }}
            />
            {searchInput ? (
              <button
                type="button"
                title="Effacer"
                onClick={() => {
                  setSearchInput('')
                  setSearchQuery('')
                  inputRef.current?.focus()
                }}
                style={{
                  padding: '6px 8px',
                  borderRadius: 8,
                  border: '1px solid #444',
                  background: '#222',
                  color: '#eee',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            ) : null}
          </div>

          <button
            type="button"
            className={'filter-button filter-button--islam' + (onlyIslam ? ' filter-button--active' : '')}
            onClick={() => setOnlyIslam((v) => !v)}
            style={{ marginLeft: 8 }}
          >
            
          </button>
        </div>
      </div>

      {/* {currentItem && (
        <div className={getTickerClass(currentItem.source, currentItem.isIslam)}>
          <Brand source={currentItem.source} dateMs={currentItem.dateMs} />

          <div className="title-area">
            {loading && !error && <span className="status">Chargement des titres…</span>}
            {error && <span className="status status-error">{error}</span>}
            {!loading && !error && (
              <span className="title">{highlightCombined(currentItem.title, searchQuery)}</span>
            )}
          </div>
        </div>
      )} */}

      {/* {!loading && !error && currentItem && currentItem.description && (
        <div className="marquee">
          <div className="marquee__inner">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="marquee__item">
                {highlightCombined(currentItem.description, searchQuery)}
              </span>
            ))}
          </div>
        </div>
      )} */}

      {!loading && !error && !hasItems && (
        <div className="no-results">Aucun résultat pour ces filtres.</div>
      )}

      {!loading && hasItems && (
        <div className="ticker-list">
          {filteredItems.map((item, i) => (
            <div
              key={item.uid || item.link || `${item.source}-${item.dateMs || i}`}
              className="ticker-list-item"
              data-source={item.source}
            >
              <div className={getTickerClass(item.source, item.isIslam, 'ticker--compact')}>
                <Brand source={item.source} extraClass="brand--small" dateMs={item.dateMs} />
                <div className="title-area">
                  <span className="title">{highlightCombined(item.title, searchQuery)}</span>
                </div>
              </div>

              {item.description && (
                <div className="marquee marquee--small">
                  <div className="marquee__inner marquee__inner--small">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <span key={j} className="marquee__item marquee__item--small">
                        {highlightCombined(item.description, searchQuery)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}