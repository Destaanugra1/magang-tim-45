/* eslint-disable react/no-unknown-property */
"use client";

import * as THREE from "three";
import { useRef, memo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, MeshTransmissionMaterial, Environment } from "@react-three/drei";
import { easing } from "maath";

interface LensProps {
  scale?: number;
  ior?: number;
  thickness?: number;
  chromaticAberration?: number;
  anisotropy?: number;
  [key: string]: unknown;
}

interface FluidGlassProps {
  lensProps?: LensProps;
}

const LensMesh = memo(function LensMesh({ lensProps = {} }: { lensProps?: LensProps }) {
  const ref = useRef<THREE.Mesh>(null!);
  const { nodes } = useGLTF("/assets/3d/lens.glb");
  const { viewport } = useThree();

  useFrame((state, delta) => {
    const { camera, pointer } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    easing.damp3(
      ref.current.position,
      [(pointer.x * v.width) / 2, (pointer.y * v.height) / 2, 15],
      0.15,
      delta
    );
    ref.current.rotation.z += delta * 0.08;
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = lensProps;

  return (
    <>
      <Environment preset="city" />
      <mesh
        ref={ref}
        scale={scale ?? 0.22}
        rotation-x={Math.PI / 2}
        geometry={(nodes["Cylinder"] as THREE.Mesh)?.geometry}
      >
        <MeshTransmissionMaterial
          transmission={1}
          roughness={0.05}
          ior={ior ?? 1.5}
          thickness={thickness ?? 3}
          chromaticAberration={chromaticAberration ?? 0.25}
          anisotropy={anisotropy ?? 0.5}
          temporalDistortion={0.08}
          distortion={0.2}
          distortionScale={0.5}
          {...(typeof extraMat === "object" && extraMat !== null ? extraMat : {})}
        />
      </mesh>
    </>
  );
});

export function FluidGlass({ lensProps = {} }: FluidGlassProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 15 }}
      gl={{ alpha: true }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <LensMesh lensProps={lensProps} />
    </Canvas>
  );
}

useGLTF.preload("/assets/3d/lens.glb");
