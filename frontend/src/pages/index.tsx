import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';

// Map container cannot be server-side rendered because it uses Leaflet
const MapWithNoSSR = dynamic(() => import('../components/Map'), {
  ssr: false,
});

export default function Dashboard() {
  const [globalState, setGlobalState] = useState<any>({});
  const [activeRoute, setActiveRoute] = useState<string[]>([]);
  const [routeDetails, setRouteDetails] = useState<any>(null);

  return (
    <>
      <Head>
        <title>Unified Control Room | Mahakumbh 2028</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="layout-container">
        {/* Sidebar Section */}
        <div className="sidebar-container">
          <Sidebar 
            state={globalState} 
            onRouteCalculated={setActiveRoute}
            routeDetails={routeDetails}
          />
        </div>

        {/* Map Section */}
        <div className="map-container">
          <MapWithNoSSR 
             onStateUpdate={setGlobalState} 
             activeRoute={activeRoute}
             onRouteDetailsUpdate={setRouteDetails}
          />
        </div>
      </main>
    </>
  );
}
