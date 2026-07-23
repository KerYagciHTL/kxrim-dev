import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

/* The site's three motion voices. Registered once, used by name everywhere.
   Mirrors of the CSS custom properties in tokens.css. */
CustomEase.create('kx-settle', '0.23,1.04,0.32,0.99') // heavy object coming to rest
CustomEase.create('kx-drift', '0.34,0.04,0.14,1') // secondary elements following
CustomEase.create('kx-mask', '0.83,0,0.17,0.99') // hard reveals, panel wipes
