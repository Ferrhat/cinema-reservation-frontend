import axios from 'axios';
import { parse } from 'csv-parse/sync';

export interface City {
  name: string;
  latitude: number;
  longitude: number;
}

export async function loadCities(): Promise<City[]> {
  try {
    const response = await axios.get('/HU.csv');
    const csvData = response.data;
    const cities = parse(csvData, {
      columns: true,
      skip_empty_lines: true
    }).map((row: { city: string, latitude: string, longitude: string }) => ({
      name: row.city,
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude)
    }));
    return cities;
  } catch (error) {
    console.error('Error loading CSV:', error);
    return [];
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function findNearestCity(lat: number, lon: number, cities: City[]): Promise<City | null> {
  let nearest: City | null = null;
  let minDistance = Infinity;

  for (const city of cities) {
    const distance = calculateDistance(lat, lon, city.latitude, city.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  }

  return nearest;
}
