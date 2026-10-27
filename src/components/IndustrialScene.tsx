"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./IndustrialScene.module.scss";

type Turbine = {
  group: THREE.Group;
  rotor: THREE.Group;
  spin: number;
  status: "ok" | "warn" | "fault";
};

export function IndustrialScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 640;
    const height = mount.clientHeight || 520;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x071018, 0.035);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200);
    camera.position.set(0.2, 3.4, 11.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0x8fb8c9, 0.55));
    const key = new THREE.DirectionalLight(0xd7fff0, 1.35);
    key.position.set(6, 10, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xff9b4a, 0.55);
    rim.position.set(-8, 3, -4);
    scene.add(rim);
    const glow = new THREE.PointLight(0x34d399, 2.2, 24);
    glow.position.set(0, 2.5, 2);
    scene.add(glow);

    // Ground grid plane
    const groundGeo = new THREE.CircleGeometry(18, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0b1622,
      metalness: 0.35,
      roughness: 0.85,
      transparent: true,
      opacity: 0.92,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    scene.add(ground);

    const grid = new THREE.GridHelper(22, 36, 0x1f4d45, 0x123038);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.45;
    scene.add(grid);

    // Terrain rings
    for (let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(3.2 + i * 2.1, 3.35 + i * 2.1, 96),
        new THREE.MeshBasicMaterial({
          color: 0x34d399,
          transparent: true,
          opacity: 0.08 + i * 0.02,
          side: THREE.DoubleSide,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.01;
      scene.add(ring);
    }

    const statusColor = {
      ok: 0x34d399,
      warn: 0xfbbf24,
      fault: 0xf87171,
    } as const;

    const makeTurbine = (x: number, z: number, status: Turbine["status"], spin: number): Turbine => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      const tower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.16, 2.6, 12),
        new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.7, roughness: 0.28 }),
      );
      tower.position.y = 1.3;
      group.add(tower);

      const nacelle = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.22, 0.28),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.6, roughness: 0.3 }),
      );
      nacelle.position.set(0.08, 2.65, 0);
      group.add(nacelle);

      const hub = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 16),
        new THREE.MeshStandardMaterial({
          color: statusColor[status],
          emissive: statusColor[status],
          emissiveIntensity: 0.55,
          metalness: 0.4,
          roughness: 0.35,
        }),
      );
      hub.position.set(0.38, 2.65, 0);
      group.add(hub);

      const rotor = new THREE.Group();
      rotor.position.copy(hub.position);
      for (let b = 0; b < 3; b++) {
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 1.55, 0.04),
          new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            metalness: 0.2,
            roughness: 0.4,
          }),
        );
        blade.position.y = 0.78;
        const pivot = new THREE.Group();
        pivot.rotation.z = (b * Math.PI * 2) / 3;
        pivot.add(blade);
        rotor.add(pivot);
      }
      group.add(rotor);

      // Status beacon
      const beacon = new THREE.PointLight(statusColor[status], 1.4, 4.5);
      beacon.position.set(0, 2.9, 0);
      group.add(beacon);

      // Label plate
      const plate = new THREE.Mesh(
        new THREE.PlaneGeometry(0.9, 0.22),
        new THREE.MeshBasicMaterial({
          color: 0x0f172a,
          transparent: true,
          opacity: 0.75,
        }),
      );
      plate.position.set(0, 0.35, 0.55);
      group.add(plate);

      scene.add(group);
      return { group, rotor, spin, status };
    };

    const turbines: Turbine[] = [
      makeTurbine(-3.4, -1.2, "ok", 0.045),
      makeTurbine(-1.2, 1.6, "warn", 0.03),
      makeTurbine(1.1, -0.4, "ok", 0.05),
      makeTurbine(3.2, 1.8, "fault", 0.01),
      makeTurbine(4.6, -1.8, "ok", 0.04),
      makeTurbine(-4.8, 1.4, "ok", 0.042),
      makeTurbine(0.2, 3.2, "warn", 0.028),
    ];

    // Floating data nodes + links (asset graph)
    const nodes: THREE.Mesh[] = [];
    const nodePositions = [
      new THREE.Vector3(-2.2, 4.2, -1),
      new THREE.Vector3(0.4, 5.1, 0.4),
      new THREE.Vector3(2.6, 4.4, -0.6),
      new THREE.Vector3(-0.8, 3.6, 1.8),
      new THREE.Vector3(1.6, 3.8, 2.1),
    ];
    nodePositions.forEach((pos, i) => {
      const mesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.18 + (i % 2) * 0.05, 0),
        new THREE.MeshStandardMaterial({
          color: i === 1 ? 0xff9b4a : 0x34d399,
          emissive: i === 1 ? 0xff9b4a : 0x34d399,
          emissiveIntensity: 0.5,
          metalness: 0.5,
          roughness: 0.25,
        }),
      );
      mesh.position.copy(pos);
      scene.add(mesh);
      nodes.push(mesh);
    });

    const linkMat = new THREE.LineBasicMaterial({
      color: 0x5eead4,
      transparent: true,
      opacity: 0.35,
    });
    for (let i = 0; i < nodePositions.length - 1; i++) {
      const geo = new THREE.BufferGeometry().setFromPoints([
        nodePositions[i],
        nodePositions[i + 1],
      ]);
      scene.add(new THREE.Line(geo, linkMat));
    }
    // Connect graph to a turbine hub
    scene.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          nodePositions[3],
          new THREE.Vector3(1.1, 2.65, -0.4),
        ]),
        linkMat,
      ),
    );

    // Time-series ribbon
    const ribbonPoints: THREE.Vector3[] = [];
    for (let i = 0; i < 80; i++) {
      const t = i / 79;
      ribbonPoints.push(
        new THREE.Vector3(
          -5 + t * 10,
          1.2 + Math.sin(t * Math.PI * 4) * 0.55 + Math.sin(t * 17) * 0.12,
          -3.2 + Math.cos(t * Math.PI * 2) * 0.4,
        ),
      );
    }
    const ribbon = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(ribbonPoints),
      new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.85 }),
    );
    scene.add(ribbon);

    // Particles
    const count = 420;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = Math.random() * 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0x99f6e4,
        size: 0.035,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      }),
    );
    scene.add(particles);

    // HUD frame corners (sprite-like planes)
    const frameMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.55,
    });
    const mkCorner = (x: number, y: number, sx: number, sy: number) => {
      const h = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.035), frameMat);
      const v = new THREE.Mesh(new THREE.PlaneGeometry(0.035, 0.55), frameMat);
      h.position.set(x + sx * 0.2, y, 5.2);
      v.position.set(x, y + sy * 0.2, 5.2);
      scene.add(h, v);
    };
    mkCorner(-4.6, 3.3, 1, -1);
    mkCorner(4.6, 3.3, -1, -1);
    mkCorner(-4.6, -2.4, 1, 1);
    mkCorner(4.6, -2.4, -1, 1);

    let raf = 0;
    const clock = new THREE.Clock();

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    const pointer = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    mount.addEventListener("pointermove", onMove);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!reduced) {
        turbines.forEach((turbine) => {
          turbine.rotor.rotation.z += turbine.spin;
          turbine.group.position.y = Math.sin(t * 1.2 + turbine.group.position.x) * 0.03;
        });

        nodes.forEach((node, i) => {
          node.rotation.x = t * 0.6 + i;
          node.rotation.y = t * 0.8 + i * 0.4;
          node.position.y = nodePositions[i].y + Math.sin(t * 1.5 + i) * 0.12;
        });

        particles.rotation.y = t * 0.03;
        ribbon.rotation.y = Math.sin(t * 0.2) * 0.05;

        // Update ribbon wave
        const attr = ribbon.geometry.getAttribute("position") as THREE.BufferAttribute;
        for (let i = 0; i < 80; i++) {
          const u = i / 79;
          attr.setY(
            i,
            1.2 + Math.sin(u * Math.PI * 4 + t * 1.8) * 0.55 + Math.sin(u * 17 + t) * 0.12,
          );
        }
        attr.needsUpdate = true;

        glow.intensity = 1.7 + Math.sin(t * 2.2) * 0.5;
      }

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 1.2, 0.04);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 3.4 + pointer.y * 0.5, 0.04);
      camera.lookAt(0, 1.8, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("pointermove", onMove);
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
    <div className={styles.wrap} aria-hidden>
      <div ref={mountRef} className={styles.canvas} />
      <div className={styles.hud}>
        <span>IDMP · LIVE</span>
        <span>7 ASSETS</span>
        <span>AGENT READY</span>
      </div>
      <div className={styles.caption}>
        Industrial AI scene · turbines · asset graph · streaming signal
      </div>
    </div>
  );
}
