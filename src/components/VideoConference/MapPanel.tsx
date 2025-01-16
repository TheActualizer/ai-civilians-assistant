import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ServiceLocation } from './types';
import { supabase } from '@/integrations/supabase/client';

interface MapPanelProps {
  locations: ServiceLocation[];
}

export const MapPanel = ({ locations }: MapPanelProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMap = async () => {
      try {
        const { data: { secret }, error } = await supabase.functions.invoke('get-realtime-token', {
          body: { type: 'mapbox' }
        });

        if (error || !secret) {
          console.error('Failed to get Mapbox token:', error);
          return;
        }

        mapboxgl.accessToken = secret;
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [-74.5, 40],
          zoom: 9,
          pitch: 45
        });

        map.current.addControl(new mapboxgl.NavigationControl());

        // Add location markers
        locations.forEach(location => {
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.width = '15px';
          el.style.height = '15px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = location.status === 'active' ? '#10B981' : '#EF4444';
          el.style.border = '2px solid white';

          new mapboxgl.Marker(el)
            .setLngLat([location.lng, location.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <div class="p-2">
                    <h3 class="font-bold">${location.name}</h3>
                    <p class="text-sm">Latency: ${location.metrics.latency}ms</p>
                    <p class="text-sm">Uptime: ${location.metrics.uptime}%</p>
                  </div>
                `)
            )
            .addTo(map.current);
        });
      } catch (err) {
        console.error('Error initializing map:', err);
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [locations]);

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          Service Distribution Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={mapContainer}
          className="h-[400px] rounded-lg overflow-hidden"
        />
      </CardContent>
    </Card>
  );
};