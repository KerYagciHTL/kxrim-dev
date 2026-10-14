// Tells Bing, Yandex and the other IndexNow engines that the pages changed (not Google).
//
//   npm run indexnow
const KEY = '931531ff131b6192acafae3028f12900'
const urls = ['/', '/en', '/was-ich-baue', '/en/what-i-build'].map((p) => `https://yagci.cc${p}`)

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: 'yagci.cc', key: KEY, keyLocation: `https://yagci.cc/${KEY}.txt`, urlList: urls }),
})
console.log(`IndexNow: ${res.status} ${res.statusText}`)
