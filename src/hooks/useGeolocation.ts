import { useState, useEffect, useCallback } from 'react';

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

  const [watchId, setWatchId] = useState<number | null>(null);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation({
        ...HANOI_FALLBACK,
        loading: false,
        error: 'Geolocation not supported',
        isFallback: true,
      });
      return;
    }

    setLocation((prev) => ({ ...prev, loading: true }));

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
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const startWatchingPosition = useCallback(() => {
    if (!navigator.geolocation || watchId !== null) return;

    const id = navigator.geolocation.watchPosition(
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
        console.warn('Geolocation watch error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );

    setWatchId(id);
  }, [watchId]);

  const stopWatchingPosition = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  useEffect(() => {
    getCurrentLocation();

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return {
    ...location,
    refreshLocation: getCurrentLocation,
    startWatching: startWatchingPosition,
    stopWatching: stopWatchingPosition,
    isWatching: watchId !== null,
  };
}
