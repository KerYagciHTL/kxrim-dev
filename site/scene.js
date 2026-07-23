/* Two quiet milk-glass blobs — the page's only 3D. Phase-shifted so they
   never breathe in sync; they answer mouse and scroll, nothing floats free.
   © 2026 Kerimcan Yagci. All rights reserved. */
import * as THREE from 'three'

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const horizontal = matchMedia('(min-width: 768px)').matches
const canvas = document.getElementById('bg3d')

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75))
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 30)
camera.position.set(0, 0, 7)

const geo = new THREE.IcosahedronGeometry(1.65, 48)
const mat = new THREE.ShaderMaterial({
  transparent: true,
  uniforms: { uT: { value: 0 } },
  vertexShader: `
    uniform float uT;
    varying vec3 vN; varying vec3 vP;
    void main(){
      vec3 p = position;
      float w = sin(p.x*1.9 + uT*.6)*sin(p.y*2.2 + uT*.5)*sin(p.z*1.6 + uT*.7);
      p += normal * w * .22;
      vN = normalMatrix * normal;
      vec4 mv = modelViewMatrix * vec4(p,1.);
      vP = mv.xyz;
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: `
    varying vec3 vN; varying vec3 vP;
    void main(){
      vec3 N = normalize(vN);
      vec3 V = normalize(-vP);
      float lit = clamp(dot(N, normalize(vec3(-.4,.8,.6))), 0., 1.);
      vec3 base = mix(vec3(.90,.91,1.0), vec3(.72,.74,.96), 1.-lit);
      float fres = pow(1.-clamp(dot(N,V),0.,1.), 2.6);
      base = mix(base, vec3(1.), fres*.85);
      gl_FragColor = vec4(base, .5);
    }`,
})
const blob = new THREE.Mesh(geo, mat)
scene.add(blob)

const mat2 = mat.clone()
const blob2 = new THREE.Mesh(geo, mat2)
scene.add(blob2)

const place = () => {
  renderer.setSize(innerWidth, innerHeight)
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  blob.position.set(horizontal ? 3.1 : 1.5, horizontal ? -0.7 : 2.0, 0)
  blob.scale.setScalar(horizontal ? 0.62 : 0.45)
  blob2.position.set(horizontal ? -3.4 : -1.4, horizontal ? 1.7 : -2.4, -0.6)
  blob2.scale.setScalar(horizontal ? 0.42 : 0.32)
}
place()
addEventListener('resize', place)

let mx = 0
let my = 0
addEventListener('pointermove', (e) => {
  mx = e.clientX / innerWidth - 0.5
  my = e.clientY / innerHeight - 0.5
}, { passive: true })

if (reduced) {
  renderer.render(scene, camera) // a still frame
} else {
  const loop = (t) => {
    mat.uniforms.uT.value = t / 1000
    mat2.uniforms.uT.value = t / 1000 + 9.4
    const s = horizontal ? scrollX : scrollY
    blob.rotation.y += (s * 0.0009 + mx * 0.55 - blob.rotation.y) * 0.04
    blob.rotation.x += (my * 0.4 - blob.rotation.x) * 0.04
    blob2.rotation.y += (s * -0.0006 + mx * -0.4 - blob2.rotation.y) * 0.03
    blob2.rotation.x += (my * -0.3 - blob2.rotation.x) * 0.03
    const drift = Math.min(s / innerWidth, 1.2)
    blob.position.x = (horizontal ? 3.1 : 1.5) + drift * 1.1
    blob2.position.x = (horizontal ? -3.4 : -1.4) - drift * 0.9
    renderer.render(scene, camera)
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}
