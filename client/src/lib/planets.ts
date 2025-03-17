import * as THREE from "three";

export const PLANETS = {
  SUN: {
    name: "Sun",
    color: 0xFFAA00,
    size: 2,
    orbitRadius: 10
  },
  MOON: {
    name: "Moon", 
    color: 0xDDDDDD,
    size: 1,
    orbitRadius: 15
  },
  MARS: {
    name: "Mars",
    color: 0xFF4400,
    size: 1,
    orbitRadius: 20
  },
  MERCURY: {
    name: "Mercury",
    color: 0x88AAFF,
    size: 0.8,
    orbitRadius: 25
  },
  JUPITER: {
    name: "Jupiter",
    color: 0xFFAA88,
    size: 3,
    orbitRadius: 30
  },
  VENUS: {
    name: "Venus",
    color: 0xFFFFAA,
    size: 1.2,
    orbitRadius: 35
  },
  SATURN: {
    name: "Saturn",
    color: 0xDDCC88,
    size: 2.5,
    orbitRadius: 40
  }
};

export function createPlanetMesh(planet: typeof PLANETS.SUN) {
  const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    color: planet.color,
    metalness: 0.4,
    roughness: 0.7,
  });
  return new THREE.Mesh(geometry, material);
}
