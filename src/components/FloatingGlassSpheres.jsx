"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const logos = [
  { key: "instagram", label: "IG", color: "#E4405F" },
  { key: "facebook", label: "f", color: "#1877F2" },
  { key: "x", label: "X", color: "#111827" },
  { key: "youtube", label: "▶", color: "#FF0000" },
  { key: "linkedin", label: "in", color: "#0A66C2" },
  { key: "instagram-alt", label: "IG", color: "#F77737" },
  { key: "youtube-alt", label: "▶", color: "#FF4E45" },
  { key: "linkedin-alt", label: "in", color: "#2563EB" },
];

function hasWebGLSupport() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

function createLogoTexture(THREE, logo) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(128, 128, 86, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(128, 128, 90, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = logo.color;
  ctx.font = `700 ${logo.label.length > 1 ? "104px" : "120px"} Inter, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(logo.label, 128, 134);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function getPalette() {
  const computed = getComputedStyle(document.documentElement);
  const background = computed.getPropertyValue("--background").trim() || "#fdfbff";
  const lavender = computed.getPropertyValue("--lavender").trim() || "#e8e0ff";
  const blue = computed.getPropertyValue("--blue").trim() || "#dceeff";
  const pink = computed.getPropertyValue("--pink").trim() || "#ffeaf5";
  return { background, accents: [lavender, blue, pink] };
}

function FloatingGlassSpheresFallback() {
  return (
    <div className="glass-spheres-fallback" aria-hidden="true">
      <span className="glass-fallback-blob blob-a" />
      <span className="glass-fallback-blob blob-b" />
      <span className="glass-fallback-blob blob-c" />
    </div>
  );
}

export default function FloatingGlassSpheres() {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const [webglReady, setWebglReady] = useState(null);

  const quality = useMemo(() => {
    if (typeof window === "undefined") {
      return { mobile: false, lowPower: false, count: 6 };
    }
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const weakCpu = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const weakMemory = typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 4;
    const lowPower = reducedMotion || weakCpu || weakMemory;
    const count = mobile ? (lowPower ? 3 : 5) : lowPower ? 5 : 7;
    return { mobile, lowPower, count };
  }, []);

  useEffect(() => {
    setWebglReady(hasWebGLSupport());
  }, []);

  useEffect(() => {
    if (!containerRef.current || !webglReady) {
      return;
    }

    let cleanup = () => {};

    (async () => {
      const THREE = await import(/* webpackIgnore: true */ "https://esm.sh/three@0.179.1");
      if (!containerRef.current) return;

      const container = containerRef.current;
      const { lowPower, count, mobile } = quality;
      const palette = getPalette();

      const scene = new THREE.Scene();
      scene.background = null;

      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 16);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !lowPower });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.2 : 1.7));
      renderer.shadowMap.enabled = !lowPower;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.domElement.className = "glass-spheres-canvas";
      container.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight(0xffffff, 0.75);
      scene.add(ambient);

      const keyLight = new THREE.DirectionalLight(0xffffff, lowPower ? 0.5 : 0.8);
      keyLight.position.set(6, 8, 10);
      keyLight.castShadow = !lowPower;
      scene.add(keyLight);

      const fill = new THREE.PointLight(new THREE.Color(palette.background), 0.7, 40);
      fill.position.set(-8, -2, 12);
      scene.add(fill);

      const geometry = new THREE.IcosahedronGeometry(mobile ? 0.85 : 1.05, lowPower ? 2 : 3);
      const nodes = [];

      for (let i = 0; i < count; i += 1) {
        const accent = palette.accents[i % palette.accents.length];
        const material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(accent),
          metalness: 0.03,
          roughness: 0.15,
          transmission: 0.95,
          thickness: 1.35,
          clearcoat: 0.95,
          clearcoatRoughness: 0.18,
          ior: 1.12,
          opacity: 0.88,
          transparent: true,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = !lowPower;
        mesh.receiveShadow = !lowPower;

        const spreadX = mobile ? 6 : 9;
        const spreadY = mobile ? 4 : 6;
        const base = new THREE.Vector3(
          THREE.MathUtils.randFloatSpread(spreadX),
          THREE.MathUtils.randFloatSpread(spreadY),
          THREE.MathUtils.randFloat(-1.2, 1.8),
        );

        mesh.position.copy(base);
        const radius = THREE.MathUtils.randFloat(0.28, 0.85);
        mesh.scale.setScalar(radius);

        const logo = logos[i % logos.length];
        const texture = createLogoTexture(THREE, logo);
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
          }),
        );
        sprite.scale.setScalar(radius * 1.3);
        mesh.add(sprite);

        scene.add(mesh);
        nodes.push({
          mesh,
          sprite,
          base,
          speed: THREE.MathUtils.randFloat(0.2, 0.42),
          offset: Math.random() * Math.PI * 2,
        });
      }

      const pointer = new THREE.Vector2(0, 0);
      const target = new THREE.Vector2(0, 0);

      const onPointerMove = (event) => {
        target.x = (event.clientX / window.innerWidth - 0.5) * 2;
        target.y = (event.clientY / window.innerHeight - 0.5) * -2;
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });

      const resize = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };

      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      const clock = new THREE.Clock();
      const animationIntensity = lowPower ? 0.35 : 1;

      const animateScene = () => {
        const t = clock.getElapsedTime();
        pointer.lerp(target, 0.04);

        nodes.forEach((node, index) => {
          node.mesh.position.x = node.base.x + Math.sin(t * node.speed + node.offset) * 0.55 * animationIntensity;
          node.mesh.position.y = node.base.y + Math.cos(t * node.speed * 0.8 + node.offset) * 0.38 * animationIntensity;
          node.mesh.rotation.x += 0.002 + (index % 3) * 0.0008;
          node.mesh.rotation.y += 0.003 + (index % 2) * 0.001;
          node.sprite.material.rotation = Math.sin(t * 0.3 + index) * 0.1;
        });

        camera.position.x = pointer.x * 0.28;
        camera.position.y = pointer.y * 0.2;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
        rafRef.current = window.requestAnimationFrame(animateScene);
      };

      animateScene();

      cleanup = () => {
        if (rafRef.current) {
          window.cancelAnimationFrame(rafRef.current);
        }
        window.removeEventListener("pointermove", onPointerMove);
        resizeObserver.disconnect();
        nodes.forEach((node) => {
          node.mesh.material.dispose();
          node.sprite.material.map?.dispose();
          node.sprite.material.dispose();
          scene.remove(node.mesh);
        });
        geometry.dispose();
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    })();

    return () => cleanup();
  }, [quality, webglReady]);

  if (webglReady === false) {
    return <FloatingGlassSpheresFallback />;
  }

  return <div className="floating-glass-spheres" ref={containerRef} aria-hidden="true" />;
}
