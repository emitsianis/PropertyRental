'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import { fromAddress, setDefaults } from 'react-geocode';
import Spinner from '@/components/Spinner';
import { Map, Marker } from 'react-map-gl';
import Image from 'next/image';
import Pin from '@/assets/images/pin.svg';

const PropertyMap = ({ property }) => {
  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 0, longitude: 0, zoom: 12, width: '100%', height: '500px',
  });

  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY, language: 'en', region: 'us',
  });

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const res = await fromAddress(`${property.location.street}, ${property.location.city}, ${property.location.state}, ${property.location.zipcode}`);
        if (!res?.results?.length) {
          setGeocodeError(true);
          return;
        }
        const { lat, lng } = res.results[0]?.geometry?.location;

        setLat(lat);
        setLng(lng);
        setViewport({ ...viewport, latitude: lat, longitude: lng });
      } catch (error) {
        console.log(error);
        setGeocodeError(true);
      } finally {
        setLoading(false);
      }

    };

    fetchCoords();
  }, []);

  if (loading) return <Spinner loading={loading} />;

  if (geocodeError) {
    return <div className="text-xl">Could not load location</div>;
  }

  return !loading && (<Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapLib={import('mapbox-gl')}
      initialViewState={{
        latitude: lat, longitude: lng, zoom: 15,
      }}
      style={{ width: '100%', height: 500 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <Marker longitude={lng} latitude={lat} anchor="bottom">
        <Image src={Pin} alt="pin" width={40} height={40} />
      </Marker>
    </Map>);
};

export default PropertyMap;
