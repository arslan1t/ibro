'use client'

import { useRef, useMemo, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MotionValue } from 'framer-motion'
import * as THREE from 'three'

/* ─── GLSL ──────────────────────────────────────────────────────── */

const vertexShader = /* glsl */`
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */`
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uScroll;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;

  float seam(float val, float thickness) {
    return 1.0 - smoothstep(0.0, thickness, abs(val));
  }

  float basketballPattern(vec2 uv) {
    const float PI = 3.14159265359;
    float phi   = uv.x * 2.0 * PI;
    float theta = uv.y * PI;

    /* Four characteristic basketball seams */
    float s1 = seam(cos(theta), 0.042);
    float s2 = seam(sin(phi + PI * 0.5) * sin(theta), 0.042);
    float s3 = seam(sin(phi) * sin(theta), 0.042);
    float s4 = seam(cos(phi) * sin(theta), 0.042);

    return max(max(s1, s2), max(s3, s4));
  }

  void main() {
    vec3 normal  = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    /* Fresnel — glass edge brightening */
    float fresnelDot = clamp(dot(normal, viewDir), 0.0, 1.0);
    float fresnel     = pow(1.0 - fresnelDot, 3.6);

    /* Chrome-glass base */
    vec3 chromeDark  = vec3(0.02, 0.04, 0.10);
    vec3 chromeLight = vec3(0.80, 0.92, 1.00);
    vec3 baseColor   = mix(chromeDark, chromeLight, fresnel);
    baseColor        = mix(baseColor, vec3(0.08, 0.20, 0.55), 0.22);

    /* Neon-lime seam veins */
    float seamVal  = basketballPattern(vUv);
    float pulse    = 0.55 + 0.45 * sin(uTime * 1.8);
    vec3  seamGlow = vec3(0.80, 1.00, 0.00) * seamVal * pulse * 2.2;

    /* Specular highlight — follows mouse */
    vec3  lightDir = normalize(vec3(1.5, 2.0, 2.2) + vec3(uMouse.x, uMouse.y, 0.0) * 0.6);
    float spec     = pow(max(0.0, dot(reflect(-lightDir, normal), viewDir)), 52.0);
    vec3  specular = vec3(1.0, 1.0, 0.95) * spec;

    /* Cyan rim light */
    vec3 rim = vec3(0.0, 0.75, 1.0) * pow(fresnel, 2.2) * 0.55;

    /* Assemble */
    vec3 finalColor  = baseColor + seamGlow + specular + rim;
    /* Chromatic aberration tint at silhouette */
    finalColor.r    += fresnel * 0.09;
    finalColor.b    += fresnel * 0.18;

    float alpha = 0.86 + fresnel * 0.14;

    gl_FragColor = vec4(finalColor, alpha);
  }
`

/* ─── Basketball mesh ───────────────────────────────────────────── */

interface BasketballProps {
  scrollProgress: MotionValue<number>
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}

function Basketball({ scrollProgress, mouseX, mouseY }: BasketballProps) {
  const meshRef  = useRef<THREE.Mesh>(null)
  const glowRef  = useRef<THREE.Mesh>(null)
  const { size } = useThree()

  const uniforms = useMemo(() => ({
    uTime:   { value: 0 },
    uMouse:  { value: new THREE.Vector2(0, 0) },
    uScroll: { value: 0 },
  }), [])

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
  }), [uniforms])

  useFrame((state) => {
    const t      = state.clock.getElapsedTime()
    const scroll = scrollProgress.get()
    const mx     = mouseX.get()
    const my     = mouseY.get()

    uniforms.uTime.value   = t
    uniforms.uMouse.value.set(mx, my)
    uniforms.uScroll.value = scroll

    if (!meshRef.current || !glowRef.current) return

    /* Scale: 1.55 → 0.26 over first 18% of page scroll */
    const t0    = Math.min(scroll / 0.18, 1.0)
    const ease  = t0 < 0.5 ? 2 * t0 * t0 : -1 + (4 - 2 * t0) * t0  // ease-in-out quad
    const scale = 1.55 - ease * (1.55 - 0.26)
    meshRef.current.scale.setScalar(scale)
    glowRef.current.scale.setScalar(scale * 1.14)

    /* Drift: center → top-right corner */
    const aspect  = size.width / size.height
    const targetX = aspect * 2.35
    const targetY = 2.35
    meshRef.current.position.x = ease * targetX
    meshRef.current.position.y = ease * -targetY
    glowRef.current.position.copy(meshRef.current.position)

    /* Idle rotation */
    meshRef.current.rotation.y  = t * 0.22
    meshRef.current.rotation.x  = Math.sin(t * 0.14) * 0.14

    /* Mouse tilt only while visible in hero */
    if (scroll < 0.06) {
      meshRef.current.rotation.y += mx * 0.45
      meshRef.current.rotation.x += my * 0.28
    }

    /* Glow opacity: fades slightly as ball shrinks */
    const glowMat = glowRef.current.material as THREE.MeshBasicMaterial
    glowMat.opacity = (1.0 - ease * 0.55) * 0.055
  })

  return (
    <>
      <mesh ref={meshRef} material={material}>
        <sphereGeometry args={[1, 80, 80]} />
      </mesh>

      {/* Outer atmospheric glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#CCFF00"
          transparent
          opacity={0.055}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}

/* ─── Camera adaptive to viewport ──────────────────────────────── */

function ResponsiveCamera() {
  const { size, camera } = useThree()
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    if (size.width < 768) {
      cam.fov = 70
    } else {
      cam.fov = 58
    }
    cam.updateProjectionMatrix()
  }, [size, camera])
  return null
}

/* ─── Public export ─────────────────────────────────────────────── */

export interface ThreeSceneProps {
  scrollProgress: MotionValue<number>
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}

export default function ThreeScene({ scrollProgress, mouseX, mouseY }: ThreeSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 58 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 40,   /* above all sections (z-10), below nav (z-50) */
        pointerEvents: 'none',
      }}
    >
      <ResponsiveCamera />
      <ambientLight intensity={0.08} />
      <pointLight position={[4, 5, 5]}  intensity={2.0} color="#F0F7FF" />
      <pointLight position={[-4, -3, 2]} intensity={1.0} color="#CCFF00" />
      <pointLight position={[0, -5, -2]} intensity={0.4} color="#0055FF" />
      <Basketball
        scrollProgress={scrollProgress}
        mouseX={mouseX}
        mouseY={mouseY}
      />
    </Canvas>
  )
}
