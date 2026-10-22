"use client";

import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Radians per second the knot turns on its Y axis. */
const SPIN = 0.22;

/**
 * The single hero object: a glass torus knot that turns slowly on its own.
 * Sits inside the drei `Float` wrapper so it hovers rather than floats.
 */
function LiquidKnot({ reduced }: { reduced: boolean }) {
  const knot = useRef<Mesh>(null);
  const viewport = useThree((state) => state.viewport);

  useFrame((_, delta) => {
    const mesh = knot.current;
    if (!mesh || reduced) return;
    mesh.rotation.y += delta * SPIN;
    mesh.rotation.x += delta * SPIN * 0.2;
  });

  // Keep the knot inside the frame on narrow viewports.
  const scale = Math.min(1, viewport.width / 3.4, viewport.height / 3.4);

  return (
    <Float
      enabled={!reduced}
      speed={0.9}
      rotationIntensity={0.4}
      floatIntensity={1.1}
      floatingRange={[-0.3, 0.3]}
    >
      <mesh ref={knot} scale={scale} rotation={[0.4, 0, 0]}>
        <torusKnotGeometry args={[1, 0.32, 220, 32]} />
        <MeshTransmissionMaterial
          thickness={1}
          roughness={0.2}
          transmission={1}
          ior={1.5}
          chromaticAberration={0.06}
          anisotropicBlur={0.25}
          distortion={0.12}
          distortionScale={0.3}
          temporalDistortion={0.08}
          samples={6}
          resolution={512}
          color="#f5f5f7"
          attenuationColor="#c7d2fe"
          attenuationDistance={2.5}
        />
      </mesh>
    </Float>
  );
}

/**
 * Procedural 3D hero backdrop. Renders a single frosted-glass torus knot lit
 * by the "city" HDR environment, mounted behind the hero copy.
 *
 * Loaded with `ssr: false` from the hero so neither WebGL nor the HDR fetch
 * ever runs on the server.
 */
export function HeroCanvas() {
  const reduced = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5], fov: 42 }}
      style={{ pointerEvents: "none" }}
    >
      {/* The HDR is a network fetch — keep it off the critical path so the
          knot renders immediately with the lights below. */}
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <pointLight position={[-4, -2, 3]} intensity={12} color="#c7d2fe" />

      <LiquidKnot reduced={reduced} />
    </Canvas>
  );
}
