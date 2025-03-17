import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PLANETS, createPlanetMesh } from '@/lib/planets';

export function PlanetaryView() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add point light
    const pointLight = new THREE.PointLight(0xffffff, 2);
    scene.add(pointLight);

    // Create chart layout
    const chartGeometry = new THREE.PlaneGeometry(60, 60);
    const chartMaterial = new THREE.LineBasicMaterial({ color: 0x6b46c1, transparent: true, opacity: 0.3 });
    const chart = new THREE.Mesh(chartGeometry, chartMaterial);
    scene.add(chart);

    // Create house divisions (12 segments)
    const houseLines = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      // Vertical lines
      const vLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-30 + i * 20, -30, 0),
          new THREE.Vector3(-30 + i * 20, 30, 0)
        ]),
        new THREE.LineBasicMaterial({ color: 0x6b46c1 })
      );
      houseLines.add(vLine);

      // Horizontal lines
      const hLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-30, -30 + i * 20, 0),
          new THREE.Vector3(30, -30 + i * 20, 0)
        ]),
        new THREE.LineBasicMaterial({ color: 0x6b46c1 })
      );
      houseLines.add(hLine);
    }
    scene.add(houseLines);

    // Position planets in houses
    const planetMeshes = Object.values(PLANETS).map((planet, index) => {
      const mesh = createPlanetMesh(planet);

      // Calculate house position (1-12)
      const housePosition = index % 12;
      const row = Math.floor(housePosition / 3);
      const col = housePosition % 3;

      // Position within house
      mesh.position.x = -20 + col * 20;
      mesh.position.y = 20 - row * 20;
      mesh.position.z = 2; // Slightly in front of the chart

      scene.add(mesh);
      return mesh;
    });

    // Position camera
    camera.position.z = 80;
    camera.lookAt(0, 0, 0);

    // Add stars in background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    const starsVertices = [];

    for (let i = 0; i < 2000; i++) {
      const x = THREE.MathUtils.randFloatSpread(2000);
      const y = THREE.MathUtils.randFloatSpread(2000);
      const z = THREE.MathUtils.randFloatSpread(-1000); // Only behind the chart
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Rotate planets on their own axis
      planetMeshes.forEach(mesh => {
        mesh.rotation.y += 0.01;
      });

      // Subtle chart movement
      chart.rotation.z += 0.001;
      houseLines.rotation.z += 0.001;

      renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    function handleResize() {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 -z-10" />;
}