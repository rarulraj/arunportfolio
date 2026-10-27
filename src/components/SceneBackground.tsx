"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./SceneBackground.module.scss";

type Turbine = {
  group: THREE.Group;
  rotor: THREE.Group;
  spin: number;
};

export function SceneBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x061018, 0.022);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200);
    camera.position.set(0, 4.2, 16);

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

    // Lights
    scene.add(new THREE.AmbientLight(0x7ea8b8, 0.5));
    const key = new THREE.DirectionalLight(0xe8fff6, 1.15);
    key.position.set(8, 14, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xff9b4a, 0.45);
    rim.position.set(-10, 4, -6);
    scene.add(rim);
    const plantGlow = new THREE.PointLight(0x34d399, 2.4, 36);
    plantGlow.position.set(0, 3.5, 2);
    scene.add(plantGlow);
    const towerWarn = new THREE.PointLight(0xff9b4a, 1.2, 18);
    towerWarn.position.set(-7, 5, -4);
    scene.add(towerWarn);

    const steel = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.78,
      roughness: 0.32,
    });
    const steelDark = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.7,
      roughness: 0.4,
    });
    const concrete = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.15,
      roughness: 0.85,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x34d399,
      emissiveIntensity: 0.45,
      metalness: 0.4,
      roughness: 0.35,
    });
    const warnMat = new THREE.MeshStandardMaterial({
      color: 0xff9b4a,
      emissive: 0xff9b4a,
      emissiveIntensity: 0.4,
      metalness: 0.35,
      roughness: 0.4,
    });

    // Ground + industrial pad
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(42, 72),
      new THREE.MeshStandardMaterial({
        color: 0x0a1520,
        metalness: 0.2,
        roughness: 0.92,
        transparent: true,
        opacity: 0.85,
      }),
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const pad = new THREE.Mesh(
      new THREE.BoxGeometry(22, 0.12, 16),
      concrete,
    );
    pad.position.set(0, 0.06, -1);
    scene.add(pad);

    const grid = new THREE.GridHelper(48, 60, 0x1f4d45, 0x102832);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.35;
    scene.add(grid);

    for (let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(6 + i * 3.2, 6.14 + i * 3.2, 96),
        new THREE.MeshBasicMaterial({
          color: 0x34d399,
          transparent: true,
          opacity: 0.05 + i * 0.015,
          side: THREE.DoubleSide,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.02;
      scene.add(ring);
    }

    const world = new THREE.Group();
    scene.add(world);

    // --- Wind turbines ---
    const turbines: Turbine[] = [];
    const makeTurbine = (x: number, z: number, scale: number, spin: number) => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.scale.setScalar(scale);

      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.28, 5.2, 14), steel);
      tower.position.y = 2.6;
      group.add(tower);

      const nacelle = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.38, 0.42), steelDark);
      nacelle.position.set(0.15, 5.25, 0);
      group.add(nacelle);

      const hub = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), accentMat);
      hub.position.set(0.72, 5.25, 0);
      group.add(hub);

      const rotor = new THREE.Group();
      rotor.position.copy(hub.position);
      for (let b = 0; b < 3; b++) {
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 2.8, 0.06),
          new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.25, roughness: 0.4 }),
        );
        blade.position.y = 1.4;
        const pivot = new THREE.Group();
        pivot.rotation.z = (b * Math.PI * 2) / 3;
        pivot.add(blade);
        rotor.add(pivot);
      }
      group.add(rotor);

      const beacon = new THREE.PointLight(0x34d399, 0.9, 5);
      beacon.position.set(0, 5.6, 0);
      group.add(beacon);

      world.add(group);
      turbines.push({ group, rotor, spin });
    };

    makeTurbine(-11, -8, 1.15, 0.04);
    makeTurbine(-7.5, -12, 0.95, 0.032);
    makeTurbine(10.5, -9, 1.2, 0.045);
    makeTurbine(7, -13.5, 0.85, 0.028);
    makeTurbine(13.5, -5.5, 0.75, 0.05);

    // --- Cooling towers ---
    const makeCoolingTower = (x: number, z: number, h: number) => {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(1.1, 1.6, h, 24, 1, true),
        concrete,
      );
      body.position.y = h / 2;
      g.add(body);
      const rimMesh = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.08, 8, 32), steelDark);
      rimMesh.rotation.x = Math.PI / 2;
      rimMesh.position.y = h;
      g.add(rimMesh);
      const plume = new THREE.Mesh(
        new THREE.ConeGeometry(0.7, 1.8, 16, 1, true),
        new THREE.MeshBasicMaterial({
          color: 0x94a3b8,
          transparent: true,
          opacity: 0.18,
          side: THREE.DoubleSide,
        }),
      );
      plume.position.y = h + 1.1;
      g.add(plume);
      world.add(g);
      return plume;
    };
    const plumes = [
      makeCoolingTower(-5.5, -3.5, 4.2),
      makeCoolingTower(-3.2, -4.8, 3.6),
    ];

    // --- Storage tanks ---
    const makeTank = (x: number, z: number, r: number, h: number, warn = false) => {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      const shell = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 24), steelDark);
      shell.position.y = h / 2;
      g.add(shell);
      const roof = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.98, r * 0.98, 0.12, 24), steel);
      roof.position.y = h;
      g.add(roof);
      const light = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        warn ? warnMat : accentMat,
      );
      light.position.set(0, h + 0.25, 0);
      g.add(light);
      world.add(g);
    };
    makeTank(4.8, -2.2, 1.15, 2.2);
    makeTank(7.2, -3.4, 0.95, 1.8, true);
    makeTank(5.6, -4.8, 0.8, 1.5);

    // --- Pipe rack ---
    const pipeRack = new THREE.Group();
    pipeRack.position.set(-1.5, 0, 1.5);
    for (let i = 0; i < 6; i++) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 0.12), steel);
      post.position.set(-4 + i * 1.6, 1.2, 0);
      pipeRack.add(post);
      const cross = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.08), steelDark);
      cross.position.set(-3.2 + i * 1.6, 2.05, 0);
      pipeRack.add(cross);
    }
    const pipeColors = [0x34d399, 0x67e8f9, 0xff9b4a];
    const pipes: THREE.Mesh[] = [];
    for (let p = 0; p < 3; p++) {
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 9.2, 12),
        new THREE.MeshStandardMaterial({
          color: pipeColors[p],
          metalness: 0.65,
          roughness: 0.3,
          emissive: pipeColors[p],
          emissiveIntensity: 0.15,
        }),
      );
      pipe.rotation.z = Math.PI / 2;
      pipe.position.set(0, 1.55 + p * 0.28, 0.35);
      pipeRack.add(pipe);
      pipes.push(pipe);
    }
    world.add(pipeRack);

    // --- Process building ---
    const building = new THREE.Group();
    building.position.set(0.5, 0, -1.2);
    const hall = new THREE.Mesh(new THREE.BoxGeometry(5.5, 2.6, 3.2), concrete);
    hall.position.y = 1.3;
    building.add(hall);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.15, 3.5), steelDark);
    roof.position.y = 2.7;
    building.add(roof);
    for (let i = 0; i < 4; i++) {
      const window = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.55, 0.08),
        new THREE.MeshStandardMaterial({
          color: 0x34d399,
          emissive: 0x34d399,
          emissiveIntensity: 0.7,
          transparent: true,
          opacity: 0.85,
        }),
      );
      window.position.set(-1.8 + i * 1.15, 1.55, 1.62);
      building.add(window);
    }
    const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 3.4, 12), steel);
    stack.position.set(-1.8, 4.2, -0.6);
    building.add(stack);
    const stackCap = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), warnMat);
    stackCap.position.set(-1.8, 5.95, -0.6);
    building.add(stackCap);
    world.add(building);

    // --- Crane ---
    const crane = new THREE.Group();
    crane.position.set(9.5, 0, 2.5);
    const mast = new THREE.Mesh(new THREE.BoxGeometry(0.25, 6.5, 0.25), steel);
    mast.position.y = 3.25;
    crane.add(mast);
    const jib = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.18, 0.18), steelDark);
    jib.position.set(2.2, 6.3, 0);
    crane.add(jib);
    const counter = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.35, 0.35), concrete);
    counter.position.set(-1.8, 6.25, 0);
    crane.add(counter);
    const hookCable = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.4, 6), steel);
    hookCable.position.set(4.8, 5.1, 0);
    crane.add(hookCable);
    const hook = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), warnMat);
    hook.position.set(4.8, 3.85, 0);
    crane.add(hook);
    world.add(crane);

    // --- Scaffold / catwalk ---
    const scaffold = new THREE.Group();
    scaffold.position.set(-8.5, 0, 0.5);
    for (let level = 0; level < 3; level++) {
      const deck = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.08, 1.4), steelDark);
      deck.position.y = 1.2 + level * 1.15;
      scaffold.add(deck);
      for (const sx of [-1.5, 1.5]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.15, 6), steel);
        leg.position.set(sx, 0.6 + level * 1.15, 0.55);
        scaffold.add(leg);
        const leg2 = leg.clone();
        leg2.position.z = -0.55;
        scaffold.add(leg2);
      }
    }
    world.add(scaffold);

    // Streaming signal ribbon through the plant
    const ribbonPoints: THREE.Vector3[] = [];
    for (let i = 0; i < 100; i++) {
      const u = i / 99;
      ribbonPoints.push(
        new THREE.Vector3(
          -10 + u * 20,
          2.2 + Math.sin(u * Math.PI * 4) * 0.85,
          3.5 + Math.cos(u * Math.PI * 2) * 1.4,
        ),
      );
    }
    const ribbon = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(ribbonPoints),
      new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.7 }),
    );
    world.add(ribbon);

    // Floating data nodes above plant
    const nodes: THREE.Mesh[] = [];
    const nodeBase: THREE.Vector3[] = [];
    for (let i = 0; i < 12; i++) {
      const color = i % 3 === 1 ? 0xff9b4a : 0x34d399;
      const mesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.22 + (i % 3) * 0.04, 0),
        new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.55,
          metalness: 0.5,
          roughness: 0.25,
        }),
      );
      const base = new THREE.Vector3(
        -6 + (i % 4) * 4,
        4.5 + (i % 3) * 0.8,
        -2 + Math.floor(i / 4) * 3,
      );
      mesh.position.copy(base);
      nodeBase.push(base);
      world.add(mesh);
      nodes.push(mesh);
    }
    const linkMat = new THREE.LineBasicMaterial({ color: 0x5eead4, transparent: true, opacity: 0.28 });
    for (let i = 0; i < nodes.length - 1; i++) {
      if (i % 2) continue;
      world.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([nodeBase[i].clone(), nodeBase[i + 1].clone()]),
          linkMat,
        ),
      );
    }

    // Particles / dust
    const count = 650;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = Math.random() * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0x99f6e4,
        size: 0.035,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      }),
    );
    scene.add(particles);

    // Scroll state
    const scroll = { current: 0, target: 0 };
    const pointer = { x: 0, y: 0 };
    let raf = 0;
    const clock = new THREE.Clock();
    let running = true;

    const readScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scroll.target = window.scrollY / max;
    };
    readScroll();

    const onScroll = () => readScroll();
    const onResize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) {
        clock.getDelta();
        animate();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    const animate = () => {
      if (!running) return;
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      scroll.current = THREE.MathUtils.lerp(scroll.current, scroll.target, 0.08);
      const s = scroll.current;

      if (!reduced) {
        turbines.forEach((turbine) => {
          turbine.rotor.rotation.z += turbine.spin * (1 + s * 1.8);
        });

        crane.rotation.y = -0.35 + s * 1.1;
        hookCable.scale.y = 1 + Math.sin(t * 1.2 + s * 4) * 0.08;
        hook.position.y = 3.85 - s * 1.4 + Math.sin(t * 1.2) * 0.1;

        plumes.forEach((plume, i) => {
          plume.scale.setScalar(1 + Math.sin(t * 0.8 + i) * 0.12 + s * 0.25);
          plume.position.y = (i === 0 ? 4.2 : 3.6) + 1.1 + s * 0.6;
          (plume.material as THREE.MeshBasicMaterial).opacity = 0.14 + s * 0.12;
        });

        pipes.forEach((pipe, i) => {
          (pipe.material as THREE.MeshStandardMaterial).emissiveIntensity =
            0.12 + Math.sin(t * 2 + i) * 0.08 + s * 0.25;
        });

        nodes.forEach((node, i) => {
          node.rotation.x = t * 0.5 + i;
          node.rotation.y = t * 0.7 + i * 0.3;
          node.position.y = nodeBase[i].y + Math.sin(t * 1.3 + i + s * 6) * 0.2 + s * 0.8;
        });

        const attr = ribbon.geometry.getAttribute("position") as THREE.BufferAttribute;
        for (let i = 0; i < 100; i++) {
          const u = i / 99;
          attr.setY(
            i,
            2.2 + Math.sin(u * Math.PI * 4 + t * 1.6 + s * 8) * 0.85 + Math.sin(u * 14 + t) * 0.12,
          );
        }
        attr.needsUpdate = true;

        particles.rotation.y = t * 0.02 + s * 0.4;
        plantGlow.intensity = 2 + Math.sin(t * 2) * 0.4 + s * 0.8;
        world.rotation.y = s * 0.35;
        world.position.y = -s * 2.2;
        world.position.z = s * 3.5;
      }

      // Camera path driven by scroll — fly through the plant
      const camX = Math.sin(s * Math.PI * 1.2) * 4.5 + pointer.x * 0.7;
      const camY = 3.6 + s * 5.5 + pointer.y * 0.35;
      const camZ = 15 - s * 11;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, camX, 0.06);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, camY, 0.06);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, camZ, 0.06);
      camera.lookAt(
        Math.sin(s * Math.PI) * 1.5,
        2.2 + s * 2.5,
        -2 + s * 2,
      );

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
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
