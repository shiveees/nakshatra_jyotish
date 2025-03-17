import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PLANETS, createPlanetMesh } from '@/lib/planets';
import { type Location, DEFAULT_LOCATION, calculatePlanetaryPositions } from '@/lib/location';

interface PlanetaryViewProps {
  location?: Location;
}

export function PlanetaryView({ location = DEFAULT_LOCATION }: PlanetaryViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
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
    const chartMaterial = new THREE.LineBasicMaterial({ 
      color: 0x6A9C89,
      transparent: true,
      opacity: 0.3
    });
    const chart = new THREE.Mesh(chartGeometry, chartMaterial);
    scene.add(chart);

    // Create house divisions (12 segments)
    const houseLines = new THREE.Group();
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(
            Math.cos(angle) * 30,
            Math.sin(angle) * 30,
            0
          )
        ]),
        new THREE.LineBasicMaterial({ 
          color: 0x6A9C89,
          transparent: true,
          opacity: 0.5
        })
      );
      houseLines.add(line);
    }
    scene.add(houseLines);

    // Add stars with different sizes and colors
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ 
      size: 0.5,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    const starsVertices = [];
    const starsColors = [];
    const starCount = 3000;

    for (let i = 0; i < starCount; i++) {
      const x = THREE.MathUtils.randFloatSpread(2000);
      const y = THREE.MathUtils.randFloatSpread(2000);
      const z = THREE.MathUtils.randFloatSpread(-1000); // Only behind the chart
      starsVertices.push(x, y, z);

      // Random star colors (white to gold)
      const color = new THREE.Color();
      color.setHSL(0.12, Math.random() * 0.3, 0.75 + Math.random() * 0.25);
      starsColors.push(color.r, color.g, color.b);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starsColors, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Position planets based on location
    const planetMeshes = Object.entries(PLANETS).map(([key, planet], index) => {
      const mesh = createPlanetMesh(planet);
      scene.add(mesh);
      return mesh;
    });

    // Position camera
    camera.position.z = 80;
    camera.lookAt(0, 0, 0);

    // Animation loop
    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.001;

      // Twinkle stars
      const starPositions = starsGeometry.attributes.position.array;
      const colors = starsGeometry.attributes.color.array;
      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        const twinkle = Math.sin(time + starPositions[i3] * 0.01) * 0.3 + 0.7;
        colors[i3] *= twinkle;
        colors[i3 + 1] *= twinkle;
        colors[i3 + 2] *= twinkle;
      }
      starsGeometry.attributes.color.needsUpdate = true;

      // Update planet positions based on current time and location
      const planetPositions = calculatePlanetaryPositions(location);
      planetMeshes.forEach((mesh, index) => {
        const { angle = 0 } = planetPositions[index] || {};
        const radius = 20 + (index * 2); // Stagger planets in different houses

        mesh.position.x = Math.cos(angle * Math.PI / 180) * radius;
        mesh.position.y = Math.sin(angle * Math.PI / 180) * radius;
        mesh.rotation.y += 0.01;
      });

      // Subtle chart movement
      chart.rotation.z += 0.0005;
      houseLines.rotation.z += 0.0005;

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
  }, [location]);

  return <div ref={containerRef} className="absolute inset-0 -z-10" />;
}