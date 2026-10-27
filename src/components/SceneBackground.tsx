"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./SceneBackground.module.scss";

export function SceneBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x071018, 0.028);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 120);
    camera.position.set(0, 2.8, 10);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x8fb8c9, 0.45));
    const key = new THREE.DirectionalLight(0xd7fff0, 0.9);
    key.position.set(5, 8, 4);
    scene.add(key);
    const accent = new THREE.PointLight(0x34d399, 1.6, 40);
    accent.position.set(0, 3, 2);
    scene.add(accent);
    const warm = new THREE.PointLight(0xff9b4a, 0.55, 28);
    warm.position.set(-6, 2, -2);
    scene.add(warm);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(28, 64),
      new THREE.MeshStandardMaterial({
        color: 0x0b1622,
        metalness: 0.25,
        roughness: 0.9,
        transparent: true,
        opacity: 0.55,
      }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    scene.add(ground);

    const grid = new THREE.GridHelper(36, 48, 0x1f4d45, 0x123038);
    const gridMat = grid.material as THREE.Material;
    gridMat.transparent = true;
    gridMat.opacity = 0.28;
    scene.add(grid);

    for (let i = 0; i < 5; i++) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(4 + i * 2.4, 4.12 + i * 2.4, 96),
        new THREE.MeshBasicMaterial({
          color: 0x34d399,
          transparent: true,
          opacity: 0.04 + i * 0.012,
          side: THREE.DoubleSide,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.01;
      scene.add(ring);
    }

    type Floater = { mesh: THREE.Mesh; speed: number; baseY: number; phase: number };
    const floaters: Floater[] = [];
    const floaterPositions = [
      [-5.2, 3.2, -4],
      [-2.4, 4.6, -1.5],
      [0.2, 5.4, -3.2],
      [2.8, 3.8, -0.8],
      [5.1, 4.9, -2.6],
      [-3.6, 2.4, 1.2],
      [1.6, 2.8, 2.4],
      [4.2, 2.2, 0.6],
      [-0.8, 3.5, -5.5],
      [3.4, 5.8, -4.8],
    ] as const;

    floaterPositions.forEach((pos, i) => {
      const geo =
        i % 3 === 0
          ? new THREE.OctahedronGeometry(0.16 + (i % 2) * 0.05, 0)
          : i % 3 === 1
            ? new THREE.IcosahedronGeometry(0.14, 0)
            : new THREE.TetrahedronGeometry(0.18, 0);
      const color = i % 4 === 1 ? 0xff9b4a : 0x34d399;
      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.35,
          metalness: 0.55,
          roughness: 0.28,
          transparent: true,
          opacity: 0.72,
        }),
      );
      mesh.position.set(pos[0], pos[1], pos[2]);
      scene.add(mesh);
      floaters.push({
        mesh,
        speed: 0.35 + (i % 5) * 0.08,
        baseY: pos[1],
        phase: i * 0.7,
      });
    });

    const linkMat = new THREE.LineBasicMaterial({
      color: 0x5eead4,
      transparent: true,
      opacity: 0.22,
    });
    for (let i = 0; i < floaters.length - 1; i++) {
      if (i % 2 === 1) continue;
      const a = floaters[i].mesh.position;
      const b = floaters[i + 1].mesh.position;
      scene.add(
        new THREE.Line(new THREE.BufferGeometry().setFromPoints([a.clone(), b.clone()]), linkMat),
      );
    }

    const ribbonPoints: THREE.Vector3[] = [];
    for (let i = 0; i < 90; i++) {
      const t = i / 89;
      ribbonPoints.push(
        new THREE.Vector3(
          -8 + t * 16,
          1.4 + Math.sin(t * Math.PI * 3) * 0.7,
          -6 + Math.cos(t * Math.PI * 2) * 1.2,
        ),
      );
    }
    const ribbon = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(ribbonPoints),
      new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.45 }),
    );
    scene.add(ribbon);

    const count = 520;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0x99f6e4,
        size: 0.028,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      }),
    );
    scene.add(particles);

    let raf = 0;
    const clock = new THREE.Clock();
    let running = true;

    const onResize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    const pointer = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) {
        clock.getDelta();
        animate();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const animate = () => {
      if (!running) return;
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!reduced) {
        floaters.forEach((f) => {
          f.mesh.rotation.x = t * f.speed * 0.4 + f.phase;
          f.mesh.rotation.y = t * f.speed * 0.55 + f.phase;
          f.mesh.position.y = f.baseY + Math.sin(t * f.speed + f.phase) * 0.22;
        });

        const attr = ribbon.geometry.getAttribute("position") as THREE.BufferAttribute;
        for (let i = 0; i < 90; i++) {
          const u = i / 89;
          attr.setY(i, 1.4 + Math.sin(u * Math.PI * 3 + t * 1.4) * 0.7 + Math.sin(u * 11 + t) * 0.12);
        }
        attr.needsUpdate = true;

        particles.rotation.y = t * 0.018;
        accent.intensity = 1.3 + Math.sin(t * 1.8) * 0.35;
      }

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.9, 0.03);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 2.8 + pointer.y * 0.35, 0.03);
      camera.lookAt(0, 2.2, -2);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
          obj.geometry?.dispose?.();
          const mat = obj.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat?.dispose?.();
        }
      });
    };
  }, []);

  return (
    <div className={styles.root} aria-hidden>
      <div ref={mountRef} className={styles.canvas} />
      <div className={styles.veil} />
    </div>
  );
}
