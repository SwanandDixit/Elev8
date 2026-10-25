// Location & Geo utility for Elev8
// Calculates distances between workers and job locations using the Haversine formula

export interface Coordinates {
  lat: number;
  lng: number;
}

// Representative coordinates for major Indian metro areas and localities
export const CITY_COORDINATES: Record<string, Coordinates> = {
  // Mumbai & MMR
  mumbai: { lat: 19.0760, lng: 72.8777 },
  'andheri, mumbai': { lat: 19.1197, lng: 72.8464 },
  'bandra, mumbai': { lat: 19.0596, lng: 72.8295 },
  'dadar, mumbai': { lat: 19.0178, lng: 72.8478 },
  'thane, mumbai': { lat: 19.2183, lng: 72.9781 },
  'navi mumbai': { lat: 19.0330, lng: 73.0297 },
  'borivali, mumbai': { lat: 19.2307, lng: 72.8567 },
  
  // Pune
  pune: { lat: 18.5204, lng: 73.8567 },
  'hinjewadi, pune': { lat: 18.5913, lng: 73.7389 },
  'kothrud, pune': { lat: 18.5074, lng: 73.8077 },
  'viman nagar, pune': { lat: 18.5679, lng: 73.9143 },
  'hadapsar, pune': { lat: 18.5089, lng: 73.9259 },

  // Delhi NCR
  delhi: { lat: 28.6139, lng: 77.2090 },
  'connaught place, delhi': { lat: 28.6315, lng: 77.2167 },
  'noida, delhi ncr': { lat: 28.5355, lng: 77.3910 },
  'gurgaon, delhi ncr': { lat: 28.4595, lng: 77.0266 },
  'dwarka, delhi': { lat: 28.5921, lng: 77.0460 },

  // Bangalore
  bangalore: { lat: 12.9716, lng: 77.5946 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  'koramangala, bangalore': { lat: 12.9352, lng: 77.6245 },
  'indiranagar, bangalore': { lat: 12.9784, lng: 77.6408 },
  'whitefield, bangalore': { lat: 12.9698, lng: 77.7500 },
  'hsr layout, bangalore': { lat: 12.9121, lng: 77.6446 },

  // Hyderabad
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  'hitec city, hyderabad': { lat: 17.4474, lng: 78.3762 },
  'banjara hills, hyderabad': { lat: 17.4156, lng: 78.4357 },

  // Chennai
  chennai: { lat: 13.0827, lng: 80.2707 },
  't. nagar, chennai': { lat: 13.0418, lng: 80.2341 },
  'adyar, chennai': { lat: 13.0012, lng: 80.2565 },

  // Kolkata
  kolkata: { lat: 22.5726, lng: 88.3639 },
  'salt lake, kolkata': { lat: 22.5867, lng: 88.4178 },

  // Ahmedabad
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
};

/**
 * Calculates straight-line distance in kilometers between two GPS coordinates using the Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal place
}

/**
 * Looks up approximate coordinates for a city or locality string
 */
export function getCoordinatesForLocation(locationString: string): Coordinates | null {
  if (!locationString) return null;
  const normalized = locationString.toLowerCase().trim();

  // Exact match
  if (CITY_COORDINATES[normalized]) {
    return CITY_COORDINATES[normalized];
  }

  // Partial match check
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }

  // Check city name tokens
  const tokens = normalized.split(/[\s,]+/);
  for (const token of tokens) {
    if (token.length > 3 && CITY_COORDINATES[token]) {
      return CITY_COORDINATES[token];
    }
  }

  return null;
}

/**
 * Request worker's current GPS location from browser
 */
export function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  });
}

/**
 * Formats distance into a human-friendly badge string
 */
export function formatDistance(distanceKm?: number): string {
  if (distanceKm === undefined || distanceKm === null) return '';
  if (distanceKm < 1) return '< 1 km away';
  return `${distanceKm} km away`;
}
