/**
 * The site's one hand-written shader pair. A tall machined form whose surface
 * is displaced by 3D simplex noise — turbulent at the top of the page,
 * settling to near-stillness as the visitor scrolls. Displacement is radial
 * (position-based, not normal-based) so box edges never crack, and lighting
 * is computed flat per-facet in the fragment shader from screen-space
 * derivatives — the faceted, milled look is the point.
 *
 * Simplex noise: Ashima Arts / Stefan Gustavson (MIT), webgl-noise.
 */

export const monolithVertex = /* glsl */ `
  uniform float uTime;
  uniform float uChaos;

  varying vec3 vWorldPos;
  varying float vDisp;

  // --- simplex noise (Ashima Arts, MIT) ---
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
  // --- end simplex noise ---

  void main() {
    vec3 pos = position;

    // two octaves, drifting slowly on time
    float n = snoise(pos * 0.9 + vec3(0.0, uTime * 0.06, 0.0));
    n += 0.45 * snoise(pos * 2.6 + vec3(uTime * 0.045));

    // radial displacement: continuous across box edges, so no seams
    vec3 dir = normalize(vec3(pos.x, pos.y * 0.25, pos.z));
    float amp = uChaos * 0.34;
    vec3 displaced = pos + dir * n * amp;

    vDisp = n * uChaos;
    vec4 world = modelMatrix * vec4(displaced, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

export const monolithFragment = /* glsl */ `
  uniform vec3 uBone;
  uniform vec3 uInk;
  uniform vec3 uSignal;
  uniform vec3 uCameraPos;

  varying vec3 vWorldPos;
  varying float vDisp;

  void main() {
    // flat facet normal from screen-space derivatives
    vec3 N = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
    vec3 V = normalize(uCameraPos - vWorldPos);
    if (dot(N, V) < 0.0) N = -N;

    // key light: cool bone from upper left; fill: faint from the right
    vec3 L1 = normalize(vec3(-0.55, 0.8, 0.45));
    vec3 L2 = normalize(vec3(0.7, -0.1, 0.3));
    float d1 = max(dot(N, L1), 0.0);
    float d2 = max(dot(N, L2), 0.0);

    vec3 base = mix(uInk * 1.55, uBone, d1 * 0.44 + d2 * 0.08);

    // fresnel rim keeps the silhouette legible against the ink
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    base += uBone * fres * 0.22;

    // displacement peaks catch the accent — sparks of signal on turbulence
    float peak = smoothstep(0.45, 0.95, abs(vDisp));
    base = mix(base, uSignal, peak * 0.55);

    gl_FragColor = vec4(base, 1.0);
  }
`
