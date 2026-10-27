'use client';
import { useFrame } from '@react-three/fiber';
import { Float, Line, MeshDistortMaterial, RoundedBox, Sparkles } from '@react-three/drei';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { buildCurves, N } from '@/lib/path';
import { experience } from '@/lib/content';
import { scroll } from '@/lib/store';

type P = { color?: string; speed: number };

/* ─────────────── 00 · Hero — shader planet with ring and moons ─────────────── */
const planetVert = /* glsl */ `
  varying vec3 vN; varying vec3 vPos; varying vec3 vView;
  void main(){
    vN = normalize(normalMatrix * normal);
    vPos = position;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }`;
const planetFrag = /* glsl */ `
  uniform float uTime; uniform vec3 uA; uniform vec3 uB; uniform vec3 uC;
  varying vec3 vN; varying vec3 vPos; varying vec3 vView;
  void main(){
    float w = sin(vPos.x * 2.1 + uTime * 0.25) * 0.6;
    float bands = sin(vPos.y * 3.2 + w + uTime * 0.15) * 0.5 + 0.5;
    float fine = sin(vPos.y * 11.0 + vPos.z * 2.5 + uTime * 0.35) * 0.5 + 0.5;
    vec3 col = mix(uA, uB, bands);
    col = mix(col, uC, fine * 0.18);
    vec3 n = normalize(vN);
    vec3 L = normalize(vec3(-0.55, 0.7, 0.75));
    float diff = max(dot(n, L), 0.0) * 0.85 + 0.15;
    float fres = pow(1.0 - max(dot(n, normalize(vView)), 0.0), 2.6);
    col = col * diff + fres * vec3(0.45, 0.8, 1.0) * 1.8;
    gl_FragColor = vec4(col, 1.0);
  }`;

export function Planet({ speed }: P) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: planetVert,
        fragmentShader: planetFrag,
        uniforms: {
          uTime: { value: 0 },
          uA: { value: new THREE.Color('#2a1a8a') },
          uB: { value: new THREE.Color('#8f78ff') },
          uC: { value: new THREE.Color('#e9e3ff') },
        },
      }),
    [],
  );
  const body = useRef<THREE.Mesh>(null!);
  const moons = useRef<THREE.Group>(null!);
  useFrame((s, dt) => {
    mat.uniforms.uTime.value += dt * speed;
    body.current.rotation.y += dt * 0.12 * speed;
    moons.current.rotation.z += dt * 0.35 * speed;
  });
  return (
    <Float speed={1.4 * speed} rotationIntensity={0.25} floatIntensity={0.6}>
      <group rotation={[0.25, 0, -0.32]}>
        <mesh ref={body} material={mat}>
          <sphereGeometry args={[1.55, 96, 96]} />
        </mesh>
        <group rotation={[1.18, 0.15, 0]}>
          <mesh>
            <torusGeometry args={[2.55, 0.055, 16, 200]} />
            <meshBasicMaterial color="#b9a7ff" toneMapped={false} />
          </mesh>
          <mesh>
            <torusGeometry args={[2.85, 0.012, 8, 200]} />
            <meshBasicMaterial color="#22d3ee" toneMapped={false} transparent opacity={0.7} />
          </mesh>
          <group ref={moons}>
            <mesh position={[2.55, 0, 0]}>
              <sphereGeometry args={[0.16, 32, 32]} />
              <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={1.2} />
            </mesh>
            <mesh position={[-2.55, 0, 0]}>
              <sphereGeometry args={[0.1, 32, 32]} />
              <meshStandardMaterial color="#f9a8d4" emissive="#f472b6" emissiveIntensity={1.2} />
            </mesh>
          </group>
        </group>
      </group>
    </Float>
  );
}

/* ─────────────── 01 · About — liquid orb ─────────────── */
export function Blob({ color = '#22d3ee', speed }: P) {
  return (
    <Float speed={1.6 * speed} floatIntensity={0.8}>
      <mesh>
        <sphereGeometry args={[1.45, 128, 128]} />
        <MeshDistortMaterial color={color} distort={0.42} speed={1.6 * speed} roughness={0.08} metalness={0.15} envMapIntensity={1.4} />
      </mesh>
    </Float>
  );
}

/* ─────────────── 02 · Skills — constellation sphere ─────────────── */
export function Constellation({ color = '#34d399', speed }: P) {
  const g = useRef<THREE.Group>(null!);
  const { nodes, lines } = useMemo(() => {
    const n = 72, R = 1.8;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < n; i++) {
      const y = 1 - (2 * i) / (n - 1), r = Math.sqrt(1 - y * y), th = i * 2.39996;
      pts.push(new THREE.Vector3(Math.cos(th) * r * R, y * R, Math.sin(th) * r * R));
    }
    const seg: number[] = [];
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++)
        if (pts[i].distanceTo(pts[j]) < 0.5 * R) seg.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
    return { nodes: pts, lines: geo };
  }, []);
  const inst = useRef<THREE.InstancedMesh>(null!);
  useLayoutEffect(() => {
    const m = new THREE.Object3D();
    nodes.forEach((p, i) => {
      m.position.copy(p);
      m.scale.setScalar(i % 7 === 0 ? 1.8 : 1);
      m.updateMatrix();
      inst.current.setMatrixAt(i, m.matrix);
    });
    inst.current.instanceMatrix.needsUpdate = true;
  }, [nodes]);
  useFrame((_, dt) => {
    g.current.rotation.y += dt * 0.12 * speed;
    g.current.rotation.x = Math.sin(performance.now() * 0.0002) * 0.2;
  });
  return (
    <group ref={g}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={color} transparent opacity={0.35} />
      </lineSegments>
      <instancedMesh ref={inst} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#d1fae5" toneMapped={false} />
      </instancedMesh>
      <mesh>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshBasicMaterial color="#ecfdf5" toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

/* ─────────────── 03 · Experience — the road between stations 3 and 4 ─────────────── */
export function Road({ color = '#f472b6', narrow }: { color?: string; narrow: boolean }) {
  const { center, left, right, stops } = useMemo(() => {
    const { cam } = buildCurves();
    const from = 3 / (N - 1), to = 4 / (N - 1);
    const center: THREE.Vector3[] = [], left: THREE.Vector3[] = [], right: THREE.Vector3[] = [];
    for (let i = 0; i <= 80; i++) {
      const p = cam.getPoint(from + ((to - from) * i) / 80);
      center.push(new THREE.Vector3(p.x, -1.7, p.z - 1));
      left.push(new THREE.Vector3(p.x - 1.9, -1.7, p.z - 1));
      right.push(new THREE.Vector3(p.x + 1.9, -1.7, p.z - 1));
    }
    const stops = experience.map((_, k) => {
      const p = cam.getPoint(from + ((to - from) * (k + 0.75)) / experience.length);
      return new THREE.Vector3(p.x + (k % 2 ? 1 : -1) * 1.5, -1.75, p.z - 2.2);
    });
    return { center, left, right, stops };
  }, []);
  const glows = useRef<THREE.Mesh[]>([]);
  useFrame(() => {
    const local = scroll.local.get('experience') ?? 0;
    const active = Math.min(experience.length - 1, Math.floor(local * experience.length));
    glows.current.forEach((m, k) => {
      if (!m) return;
      const target = k === active ? 1.8 : 1;
      m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x, target, 0.1));
    });
  });
  return (
    <group visible={!narrow || true}>
      <Line points={left} color={color} lineWidth={1.4} transparent opacity={0.55} />
      <Line points={right} color={color} lineWidth={1.4} transparent opacity={0.55} />
      <Line points={center} color="#fbcfe8" lineWidth={2} dashed dashSize={0.5} gapSize={0.55} transparent opacity={0.65} />
      {stops.map((p, k) => (
        <group key={k} position={p}>
          <mesh ref={(m) => { if (m) glows.current[k] = m; }}>
            <sphereGeometry args={[0.06, 24, 24]} />
            <meshBasicMaterial color="#fbcfe8" toneMapped={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshBasicMaterial color={color} transparent opacity={0.18} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ─────────────── 04 · Projects — ring of floating screens ─────────────── */
export function Panels({ color = '#7c5cff', speed }: P) {
  const g = useRef<THREE.Group>(null!);
  const count = 10;
  useFrame((_, dt) => { g.current.rotation.y += dt * 0.08 * speed; });
  return (
    <group ref={g} rotation={[0.18, 0, 0]} position={[0, 0.4, -1]} scale={0.6}>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        return (
          <group key={i} position={[Math.cos(a) * 4.6, Math.sin(i * 1.7) * 0.6, Math.sin(a) * 4.6]} rotation={[0, -a + Math.PI / 2, 0]}>
            <RoundedBox args={[1.9, 1.15, 0.04]} radius={0.06} smoothness={3}>
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.18} transparent opacity={0.2} side={THREE.DoubleSide} />
            </RoundedBox>
            <mesh position={[-0.45, 0.32, 0.03]}>
              <planeGeometry args={[0.7, 0.08]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
            </mesh>
            <mesh position={[0.2, -0.15, 0.03]}>
              <planeGeometry args={[1.3, 0.45]} />
              <meshBasicMaterial color="#c4b5fd" transparent opacity={0.18} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ─────────────── 05 · Clients — orbit ring and pulsing core ─────────────── */
export function Orbit({ color = '#22d3ee', speed }: P) {
  const core = useRef<THREE.Mesh>(null!);
  const g = useRef<THREE.Group>(null!);
  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    core.current.scale.setScalar(1 + Math.sin(t * 1.6 * speed) * 0.04);
    g.current.rotation.z += dt * 0.05 * speed;
  });
  return (
    <group rotation={[1.25, 0, 0]} position={[0, -1.1, -1.5]} scale={0.8}>
      <group ref={g}>
        <mesh>
          <torusGeometry args={[4.4, 0.025, 8, 240]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
        <mesh>
          <torusGeometry args={[3.6, 0.01, 8, 200]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.6} toneMapped={false} />
        </mesh>
      </group>
      <mesh ref={core} rotation={[-1.25, 0, 0]}>
        <sphereGeometry args={[0.85, 64, 64]} />
        <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.55} roughness={0.15} clearcoat={1} />
      </mesh>
    </group>
  );
}

/* ─────────────── 06 · Voices — torus knot ─────────────── */
export function Knot({ color = '#f472b6', speed }: P) {
  const m = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { m.current.rotation.x += dt * 0.2 * speed; m.current.rotation.y += dt * 0.3 * speed; });
  return (
    <Float speed={1.2 * speed}>
      <mesh ref={m}>
        <torusKnotGeometry args={[1, 0.32, 256, 32]} />
        <meshPhysicalMaterial color={color} roughness={0.12} metalness={0.25} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
    </Float>
  );
}

/* ─────────────── 07 · Learning — instanced credential blocks rising in a wave ─────────────── */
export function Blocks({ color = '#facc15', speed }: P) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const n = 7;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colors = useMemo(() => {
    const c = new THREE.Color();
    const arr = new Float32Array(n * n * 3);
    for (let i = 0; i < n * n; i++) {
      (i * 7) % 11 === 0 ? c.set('#a78bfa') : c.set(color).offsetHSL(0, 0, (i % 3) * 0.04);
      c.toArray(arr, i * 3);
    }
    return arr;
  }, [color]);
  useLayoutEffect(() => {
    ref.current.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
  }, [colors]);
  useFrame((s) => {
    const t = s.clock.elapsedTime * speed;
    let k = 0;
    for (let x = 0; x < n; x++)
      for (let z = 0; z < n; z++) {
        const h = 0.5 + 0.9 * (Math.sin(x * 0.8 + z * 0.6 + t * 1.2) * 0.5 + 0.5);
        dummy.position.set((x - (n - 1) / 2) * 0.42, h / 2 - 0.8, (z - (n - 1) / 2) * 0.42);
        dummy.scale.set(1, h / 0.36, 1);
        dummy.updateMatrix();
        ref.current.setMatrixAt(k++, dummy.matrix);
      }
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <group rotation={[0.55, Math.PI / 4, 0]} scale={0.72}>
      <instancedMesh ref={ref} args={[undefined, undefined, n * n]}>
        <boxGeometry args={[0.36, 0.36, 0.36]} />
        <meshStandardMaterial roughness={0.35} metalness={0.2} />
      </instancedMesh>
    </group>
  );
}

/* ─────────────── 08 · Writing — wireframe lattice with orbiting notes ─────────────── */
export function Lattice({ color = '#34d399', speed }: P) {
  const g = useRef<THREE.Group>(null!);
  const o = useRef<THREE.Group>(null!);
  useFrame((_, dt) => { g.current.rotation.y += dt * 0.15 * speed; g.current.rotation.x += dt * 0.05 * speed; o.current.rotation.y -= dt * 0.4 * speed; });
  return (
    <Float speed={1.2 * speed}>
      <group ref={g}>
        <mesh>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.55} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.7, 0]} />
          <meshPhysicalMaterial color={color} roughness={0.2} clearcoat={1} emissive={color} emissiveIntensity={0.25} />
        </mesh>
      </group>
      <group ref={o}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[Math.cos((i / 3) * Math.PI * 2) * 2.3, (i - 1) * 0.5, Math.sin((i / 3) * Math.PI * 2) * 2.3]}>
            <boxGeometry args={[0.42, 0.55, 0.03]} />
            <meshStandardMaterial color="#ecfdf5" emissive={color} emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

/* ─────────────── 09 · Contact — swirling portal ─────────────── */
const swirlFrag = /* glsl */ `
  uniform float uTime; varying vec2 vUv;
  void main(){
    vec2 p = vUv - 0.5; float r = length(p) * 2.0; float a = atan(p.y, p.x);
    float s = sin(a * 5.0 + r * 12.0 - uTime * 1.6) * 0.5 + 0.5;
    vec3 c1 = vec3(0.17, 0.10, 0.42), c2 = vec3(0.49, 0.36, 1.0), c3 = vec3(0.13, 0.83, 0.93);
    vec3 col = mix(c1, c2, s); col = mix(col, c3, smoothstep(0.6, 1.0, s) * (1.0 - r));
    col += (1.0 - smoothstep(0.0, 0.35, r)) * 0.9;
    float alpha = 1.0 - smoothstep(0.92, 1.0, r);
    gl_FragColor = vec4(col, alpha);
  }`;
const swirlVert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;

export function Portal({ speed }: P) {
  const mat = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: swirlVert, fragmentShader: swirlFrag, uniforms: { uTime: { value: 0 } }, transparent: true }),
    [],
  );
  const ring = useRef<THREE.Group>(null!);
  useFrame((_, dt) => { mat.uniforms.uTime.value += dt * speed; ring.current.rotation.z += dt * 0.2 * speed; });
  return (
    <Float speed={1 * speed} floatIntensity={0.4}>
      <group scale={0.72}>
      <mesh material={mat}>
        <circleGeometry args={[1.7, 96]} />
      </mesh>
      <group ref={ring}>
        <mesh>
          <torusGeometry args={[1.75, 0.09, 24, 160]} />
          <meshBasicMaterial color="#a78bfa" toneMapped={false} />
        </mesh>
        <mesh rotation={[1.2, 0.3, 0]}>
          <torusGeometry args={[2.5, 0.015, 8, 160]} />
          <meshBasicMaterial color="#22d3ee" toneMapped={false} />
        </mesh>
        <mesh rotation={[1.4, -0.5, 0]}>
          <torusGeometry args={[2.7, 0.01, 8, 160]} />
          <meshBasicMaterial color="#f472b6" transparent opacity={0.7} toneMapped={false} />
        </mesh>
      </group>
      <Sparkles count={50} scale={6} size={3} speed={0.4 * speed} color="#ffffff" />
      </group>
    </Float>
  );
}
