'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, Sparkles, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { buildCurves, N, stationPosition, STATION_GAP } from '@/lib/path';
import { chapters, accentHex } from '@/lib/content';
import { scroll, setState, useStore } from '@/lib/store';
import { Planet, Blob, Constellation, Road, Panels, Orbit, Knot, Blocks, Lattice, Portal } from './Stations';

const pointer = { x: 0, y: 0 };

function CameraRig() {
  const { cam, look } = useMemo(buildCurves, []);
  const reduce = useStore((s) => s.reduceMotion);
  const entered = useStore((s) => s.entered);
  const narrow = useThree((s) => s.size.width < 768);
  const t = useRef(0);
  const intro = useRef(1);
  const par = useRef({ x: 0, y: 0 });
  const p = useMemo(() => new THREE.Vector3(), []);
  const l = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const on = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, []);

  useFrame((state, dt) => {
    const target = THREE.MathUtils.clamp(scroll.progress / (N - 1), 0, 1);
    t.current = reduce ? target : THREE.MathUtils.damp(t.current, target, 3.2, dt);
    intro.current = entered ? THREE.MathUtils.damp(intro.current, 0, reduce ? 50 : 1.1, dt) : 1;
    cam.getPoint(t.current, p);
    look.getPoint(Math.min(1, t.current + 0.004), l);
    par.current.x = THREE.MathUtils.damp(par.current.x, reduce ? 0 : pointer.x, 2.5, dt);
    par.current.y = THREE.MathUtils.damp(par.current.y, reduce ? 0 : pointer.y, 2.5, dt);
    state.camera.position.set(
      p.x + par.current.x * 0.45,
      p.y + par.current.y * 0.3 + intro.current * 1.5,
      p.z + intro.current * 14,
    );
    if (narrow) l.y += 0.55;
    state.camera.lookAt(l);
  });
  return null;
}

/** Mounts its children only while the camera is near this station (keeps draw calls low). */
function Station({ i, children }: { i: number; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null!);
  const narrow = useThree((s) => s.size.width < 768);
  const pos = stationPosition(i, narrow);
  useFrame((state) => {
    const d = Math.abs(state.camera.position.z - pos[2]);
    ref.current.visible = d < STATION_GAP * 1.38;
  });
  return (
    <group ref={ref} position={pos} scale={narrow ? 0.62 : 1}>
      {children}
    </group>
  );
}

function Scene({ quality }: { quality: 'high' | 'low' }) {
  const reduce = useStore((s) => s.reduceMotion);
  const narrow = useThree((s) => s.size.width < 768);
  const speed = reduce ? 0 : 1;
  const a = (i: number) => accentHex[chapters[i].accent];
  return (
    <>
      <color attach="background" args={['#07060f']} />
      <fog attach="fog" args={['#07060f', 8, 25]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 6]} intensity={1.4} />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={2.2} position={[0, 5, -4]} scale={[10, 2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer intensity={1.6} color="#7c5cff" position={[-6, 0, 0]} scale={[2, 10, 1]} rotation-y={Math.PI / 2} />
        <Lightformer intensity={1.6} color="#22d3ee" position={[6, 0, 0]} scale={[2, 10, 1]} rotation-y={-Math.PI / 2} />
      </Environment>
      <Stars radius={90} depth={70} count={quality === 'high' ? 5000 : 1800} factor={4} fade speed={0.6 * speed} />
      <Sparkles
        count={quality === 'high' ? 260 : 90}
        scale={[22, 12, N * STATION_GAP]}
        position={[0, 0, -((N - 1) * STATION_GAP) / 2]}
        size={2.2}
        speed={0.25 * speed}
        opacity={0.5}
        color="#c4b5fd"
      />
      <CameraRig />

      <Station i={0}><Planet speed={speed} /></Station>
      <Station i={1}><Blob color={a(1)} speed={speed} /></Station>
      <Station i={2}><Constellation color={a(2)} speed={speed} /></Station>
      <Road color={a(3)} narrow={narrow} />
      <Station i={4}>{!narrow && <Panels color={a(4)} speed={speed} />}</Station>
      <Station i={5}><Orbit color={a(5)} speed={speed} /></Station>
      <Station i={6}><group position={narrow ? [0, 0.4, 0] : [4.6, 1.7, -2]} scale={0.55}><Knot color={a(6)} speed={speed} /></group></Station>
      <Station i={7}><Blocks color={a(7)} speed={speed} /></Station>
      <Station i={8}><Lattice color={a(8)} speed={speed} /></Station>
      <Station i={9}><Portal speed={speed} /></Station>

      {quality === 'high' && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur luminanceThreshold={0.55} luminanceSmoothing={0.2} intensity={0.85} />
          <Noise opacity={0.035} />
          <Vignette eskil={false} offset={0.2} darkness={0.75} />
        </EffectComposer>
      )}
    </>
  );
}

function detectQuality(): 'high' | 'low' {
  const cores = navigator.hardwareConcurrency || 4;
  const mobile = window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(pointer: coarse)').matches;
  return cores <= 4 || mobile ? 'low' : 'high';
}

export default function World() {
  const pref = useStore((s) => s.quality);
  const [auto, setAuto] = useState<'high' | 'low'>('high');
  useEffect(() => setAuto(detectQuality()), []);
  const quality = pref === 'auto' ? auto : pref;
  return (
    <div className="world" aria-hidden="true">
      <Canvas
        dpr={quality === 'high' ? [1, 1.75] : [1, 1.25]}
        gl={{ antialias: quality === 'high', powerPreference: 'high-performance' }}
        camera={{ fov: 50, near: 0.1, far: 220, position: [0, 0, 20] }}
        onCreated={() => setState({ ready: true })}
      >
        <Suspense fallback={null}>
          <Scene quality={quality} />
        </Suspense>
      </Canvas>
    </div>
  );
}
