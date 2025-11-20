import { useState, useEffect } from 'react';

const HANOI_FALLBACK = {
  lat: 21.0278,
  lng: 105.8342,
};

interface LocationState {
  lat: number;
  lng: number;
  loading: boolean;
  error: string | null;
  isFallback: boolean;
}

export function useGeolocation() {
  const [location, setLocation] = useState<LocationState>({
    lat: HANOI_FALLBACK.lat,
    lng: HANOI_FALLBACK.lng,
    loading: true,
    error: null,
    isFallback: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        ...HANOI_FALLBACK,
        loading: false,
        error: 'Geolocation not supported',
        isFallback: true,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          loading: false,
          error: null,
          isFallback: false,
        });
      },
      (error) => {
        console.warn('Geolocation error, using Hanoi fallback:', error);
        setLocation({
          ...HANOI_FALLBACK,
          loading: false,
          error: error.message,
          isFallback: true,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  return location;
}
