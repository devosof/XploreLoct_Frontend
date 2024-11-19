// import React from 'react';
// import { MapPin } from 'lucide-react';



// export default function EventMap({ location }) {
//   if (location.google_maps_link) {
//     // Extract place ID or coordinates from the Google Maps URL
//     const url = new URL(location.google_maps_link);
//     let embedUrl;
    
//     if (url.searchParams.has('place_id')) {
//       const placeId = url.searchParams.get('place_id');
//       embedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=place_id:${placeId}`;
//     } else {
//       // If no place ID, use the location name or coordinates
//       embedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(location.name || `${location.latitude},${location.longitude}`)}`;
//     }

//     return (
//       <iframe
//         src={embedUrl}
//         className="w-full h-[300px] rounded-lg border-0"
//         loading="lazy"
//         referrerPolicy="no-referrer-when-downgrade"
//         allowFullScreen
//       />
//     );
//   }

//   if (location.latitude && location.longitude) {
//     return (
//       <div className="relative w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
//         <div className="text-center">
//           <MapPin className="w-8 h-8 text-green-800 mx-auto mb-2" />
//           <p className="text-sm text-gray-600">
//             Latitude: {location.latitude}
//             <br />
//             Longitude: {location.longitude}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
//       <p className="text-gray-500">No map available</p>
//     </div>
//   );
// }


// USING LEAFLET JS

// import React, { useEffect } from 'react';
// import { MapPin } from 'lucide-react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// export default function EventMap({ location }) {
//   useEffect(() => {
//     if (location.latitude && location.longitude) {
//       // Create map only if container exists
//       const container = document.getElementById('map');
      
//       // Initialize the map
//       const map = L.map('map').setView([location.latitude, location.longitude], 13);
      
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© OpenStreetMap contributors'
//       }).addTo(map);

//       L.marker([location.latitude, location.longitude]).addTo(map);

//       // Cleanup function
//       return () => {
//         map.remove();
//       };
//     }
//   }, [location.latitude, location.longitude]); // More specific dependencies

//   if (location.latitude && location.longitude) {
//     return (
//       <div id="map" className="w-full h-[300px] rounded-lg" />
//     );
//   }

//   return (
//     <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
//       <p className="text-gray-500">No map available</p>
//     </div>
//   );
// https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap
// }


// USING KEYLESS GOOGLE MAPS API
import React, { useEffect } from 'react';

export default function EventMap({ location }) {
  useEffect(() => {
    if (location.latitude && location.longitude) {
      // Convert to numbers and validate
      const lat = parseFloat(location.latitude);
      const lng = parseFloat(location.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      window.initMap = function() {
        const mapDiv = document.getElementById('map');
        if (!mapDiv) return;

        const map = new google.maps.Map(mapDiv, {
          center: { lat, lng },
          zoom: 15
        });

        // Add a marker
        new google.maps.Marker({
          position: { lat, lng },
          map: map
        });
      };

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/somanchiu/Keyless-Google-Maps-API@v6.8/mapsJavaScriptAPI.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        delete window.initMap;
      };
    }
  }, [location.latitude, location.longitude]);

  return (
    <div 
      id="map" 
      className="w-full h-[300px] rounded-lg bg-gray-100"
    />
  );
}