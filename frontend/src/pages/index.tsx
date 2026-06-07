import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import { Menu, X } from 'lucide-react';

// Map container cannot be server-side rendered because it uses Leaflet
const MapWithNoSSR = dynamic(() => import('../components/Map'), {
  ssr: false,
});

export default function Dashboard() {
  const [globalState, setGlobalState] = useState<any>({});
  const [activeRoute, setActiveRoute] = useState<string[]>([]);
  const [routeDetails, setRouteDetails] = useState<any>(null);
  
  // Sidebar state (Open by default on PC, closed on mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Auto close sidebar on small screens initially
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Unified Control Room | Mahakumbh 2028</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>
      <main className="layout-container">
        
        {/* Floating Toggle Button */}
        <button 
          className="toggle-button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ left: isSidebarOpen ? '370px' : '20px' }}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Map Section (Background) */}
        <div className="map-container">
          <MapWithNoSSR 
             onStateUpdate={setGlobalState} 
             activeRoute={activeRoute}
             onRouteDetailsUpdate={setRouteDetails}
          />
        </div>

        {/* Sidebar Section (Overlay) */}
        <div className={`sidebar-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Sidebar 
            state={globalState} 
            onRouteCalculated={(path) => {
               setActiveRoute(path);
               if (window.innerWidth < 768) setIsSidebarOpen(false); // Auto-close on mobile after routing
            }}
            routeDetails={routeDetails}
          />
        </div>

      </main>
    </>
  );
}
