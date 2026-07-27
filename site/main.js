/* Kerimcan Yagci · yagci.cc · interaction layer
   © 2026 Kerimcan Yagci. All rights reserved. */

const fine = matchMedia('(pointer:fine)').matches
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const horizontal = matchMedia('(min-width: 768px)').matches

// name reveal right after load (no curtain)
addEventListener('load', () => requestAnimationFrame(() => document.body.classList.add('ready')))
if (reduced) document.body.classList.add('ready')

// Lenis: horizontal on desktop (wheel scrolls sideways), vertical on mobile
let lenis = null
if (!reduced && window.Lenis) {
  lenis = new Lenis(
    horizontal
      ? { orientation: 'horizontal', gestureOrientation: 'both', duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 2.5) }
      : { duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 2.5) },
  )
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf) }
  requestAnimationFrame(raf)
}

// Vienna clock
const clock = document.getElementById('clock')
const tick = () => {
  clock.textContent = 'Ansfelden · ' + new Date().toLocaleTimeString('de-AT', { timeZone: 'Europe/Vienna' })
}
tick()
setInterval(tick, 1000)

// progress bar + dock + dynamic tab title + aurora parallax
const bar = document.getElementById('bar')
const dockBtns = [...document.querySelectorAll('.dock button')]
const blobsCss = [...document.querySelectorAll('.blob-css')]
const SECTION_NAMES = ['Start', 'Projects', 'Client work', 'Record', 'Contact']
const update = () => {
  const max = horizontal
    ? document.documentElement.scrollWidth - innerWidth
    : document.documentElement.scrollHeight - innerHeight
  const pos = horizontal ? scrollX : scrollY
  const p = max > 0 ? pos / max : 0
  bar.style.width = p * 100 + '%'
  const idx = Math.round(p * 4)
  dockBtns.forEach((b, i) => b.classList.toggle('on', i === idx))
  document.title = idx === 0
    ? 'Kerimcan Yagci · Software Developer'
    : `Kerimcan Yagci · 0${idx + 1} · ${SECTION_NAMES[idx]}`
  if (horizontal && !reduced) {
    blobsCss[0].style.transform = `translateX(${pos * -0.06}px)`
    blobsCss[1].style.transform = `translateX(${pos * -0.12}px)`
    blobsCss[2].style.transform = `translateX(${pos * -0.03}px)`
  }
}
addEventListener('scroll', update, { passive: true })
update()

// dock clicks + arrow keys
const goTo = (i) => {
  if (horizontal) {
    const target = i * innerWidth
    lenis ? lenis.scrollTo(target) : scrollTo({ left: target, behavior: 'smooth' })
  } else {
    const el = document.querySelectorAll('.panel')[i]
    if (el) lenis ? lenis.scrollTo(el) : el.scrollIntoView({ behavior: 'smooth' })
  }
}
dockBtns.forEach((b) => b.addEventListener('click', () => goTo(+b.dataset.i)))

const keyhint = document.getElementById('keyhint')
let hintDone = false
if (horizontal && fine) {
  setTimeout(() => !hintDone && keyhint.classList.add('show'), 1800)
  setTimeout(() => keyhint.classList.remove('show'), 9000)
}
addEventListener('keydown', (e) => {
  if (!horizontal) return
  const cur = Math.round(scrollX / innerWidth)
  if (e.key === 'ArrowRight') { goTo(Math.min(4, cur + 1)); hintDone = true; keyhint.classList.remove('show') }
  if (e.key === 'ArrowLeft') { goTo(Math.max(0, cur - 1)); hintDone = true; keyhint.classList.remove('show') }
})

// fades
const io = new IntersectionObserver(
  (es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
  }),
  { threshold: 0.2 },
)
document.querySelectorAll('.fade').forEach((el) => io.observe(el))

// hero mouse parallax: name and badge drift apart
if (fine && !reduced) {
  const giant = document.querySelector('.giant')
  const badge = document.querySelector('.badge')
  addEventListener('pointermove', (e) => {
    const nx = e.clientX / innerWidth - 0.5
    const ny = e.clientY / innerHeight - 0.5
    giant.style.translate = `${nx * -10}px ${ny * -6}px`
    badge.style.translate = `${nx * 16}px ${ny * 12}px`
  }, { passive: true })
}

// glass card tilt + specular highlight
if (fine && !reduced) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      card.style.setProperty('--mx', x * 100 + '%')
      card.style.setProperty('--my', y * 100 + '%')
      card.style.transform = `perspective(800px) rotateY(${(x - 0.5) * 7}deg) rotateX(${(0.5 - y) * 7}deg)`
    })
    card.addEventListener('pointerleave', () => {
      card.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)'
      card.style.transform = ''
      setTimeout(() => (card.style.transition = ''), 600)
    })
  })
}

// copy e-mail
const copyBtn = document.getElementById('copy')
const copyTxt = document.getElementById('copyTxt')
copyBtn.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('k.yagci@students.htl-leonding.ac.at') } catch { /* clipboard blocked */ }
  copyBtn.classList.add('done')
  copyTxt.textContent = 'Copied ✓'
  setTimeout(() => { copyBtn.classList.remove('done'); copyTxt.textContent = 'Copy e-mail' }, 1800)
})

// magnetic button
const magnet = document.getElementById('magnet')
if (fine && !reduced) {
  addEventListener('pointermove', (e) => {
    const r = magnet.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    if (Math.hypot(dx, dy) < 170) {
      magnet.style.transition = 'transform .2s ease-out'
      magnet.style.transform = `translate(${dx * 0.35}px,${dy * 0.35}px)`
    } else {
      magnet.style.transition = 'transform .6s cubic-bezier(.2,.9,.3,1.4)'
      magnet.style.transform = ''
    }
  }, { passive: true })
}
