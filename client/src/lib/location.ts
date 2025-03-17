import { useState, useEffect } from 'react';

export interface Location {
  latitude: number;
  longitude: number;
  name: string;
}

export const DEFAULT_LOCATION: Location = {
  latitude: 28.6139,
  longitude: 77.2090,
  name: "New Delhi"
};

export async function getCoordinates(placeName: string): Promise<Location> {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(placeName)}&key=${import.meta.env.VITE_GEOCODING_API_KEY}`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        latitude: result.geometry.lat,
        longitude: result.geometry.lng,
        name: placeName
      };
    }
    return DEFAULT_LOCATION;
  } catch (error) {
    console.error('Geocoding error:', error);
    return DEFAULT_LOCATION;
  }
}

export function calculatePlanetaryPositions(location: Location, date: Date = new Date()) {
  // Calculate planetary positions based on location and time
  // This is a simplified version - in a real app, you'd use an astronomy library
  const hour = date.getHours();
  const positions = [];
  
  for (let i = 0; i < 9; i++) {
    const angle = ((hour + i) * 30 + location.longitude) % 360;
    const house = Math.floor(angle / 30) + 1;
    positions.push({ house, angle });
  }
  
  return positions;
}
