import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { countries } from '../../data/countries';

const CountryMap: React.FC = () => {
  const navigate = useNavigate();

  const getCountryVerdict = (name: string): string => {
    const country = countries.find(c => c.name === name);
    return country?.verdict || 'unknown';
  };

  const getVerdictColor = (verdict: string): string => {
    switch (verdict) {
      case 'green':
        return '#22c55e'; // success-500
      case 'yellow':
        return '#f59e0b'; // warning-500
      case 'red':
        return '#ef4444'; // error-500
      default:
        return '#a3a3a3'; // neutral-400
    }
  };

  const getCountryId = (name: string): string | undefined => {
    const country = countries.find(c => c.name === name);
    return country?.id;
  };

  const onEachFeature = (feature: any, layer: any) => {
    const countryName = feature.properties.name;
    const countryId = getCountryId(countryName);
    
    if (countryId) {
      layer.bindTooltip(countryName, {
        permanent: false,
        direction: 'center',
        className: 'bg-white dark:bg-neutral-800 dark:text-white px-2 py-1 rounded shadow-md border-0'
      });
      
      layer.on({
        click: () => navigate(`/destinations/${countryId}`),
        mouseover: (e: any) => {
          const layer = e.target;
          layer.setStyle({
            fillOpacity: 0.7,
            weight: 2
          });
        },
        mouseout: (e: any) => {
          const layer = e.target;
          layer.setStyle({
            fillOpacity: 0.5,
            weight: 1
          });
        }
      });
    }
  };

  const style = (feature: any) => {
    const verdict = getCountryVerdict(feature.properties.name);
    const isSmallCountry = ['Luxembourg', 'Malta', 'Liechtenstein'].includes(feature.properties.name);
    
    return {
      fillColor: getVerdictColor(verdict),
      weight: isSmallCountry ? 2 : 1,
      opacity: 1,
      color: isSmallCountry ? '#ffffff' : 'white',
      fillOpacity: isSmallCountry ? 0.8 : 0.5,
      zIndex: isSmallCountry ? 1000 : 1
    };
  };

  const euCountries = {
    type: "FeatureCollection",
    features: [
      // Large countries first (lower z-index)
      {
        type: "Feature",
        properties: { name: "Germany" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [6.4, 54.0],
            [8.5, 54.8],
            [11.0, 54.8],
            [12.5, 54.5],
            [14.0, 53.9],
            [14.6, 53.2],
            [14.6, 51.0],
            [15.0, 49.0],
            [13.8, 48.7],
            [12.5, 47.7],
            [10.2, 47.5],
            [7.6, 47.6],
            [7.6, 49.0],
            [6.2, 49.6],
            [5.0, 49.5],
            [4.2, 50.0],
            [3.5, 50.8],
            [5.8, 52.5],
            [6.4, 54.0]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "France" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [-4.8, 48.5],
            [-4.6, 48.9],
            [-3.5, 48.8],
            [-1.8, 49.7],
            [0.2, 50.0],
            [1.5, 51.0],
            [2.5, 51.1],
            [3.5, 50.8],
            [4.2, 50.0],
            [5.0, 49.5],
            [6.2, 49.6],
            [7.6, 49.0],
            [7.6, 47.6],
            [7.4, 46.5],
            [6.8, 45.9],
            [7.5, 44.1],
            [7.4, 43.7],
            [6.5, 43.1],
            [4.9, 43.4],
            [3.2, 42.4],
            [0.0, 42.8],
            [-2.0, 43.4],
            [-4.5, 43.4],
            [-4.8, 48.5]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Spain" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [-9.0, 41.8],
            [-8.1, 43.8],
            [-6.8, 43.7],
            [-4.5, 43.4],
            [-2.0, 43.4],
            [0.0, 42.8],
            [3.2, 42.4],
            [3.3, 41.9],
            [0.7, 40.5],
            [0.5, 38.5],
            [-0.5, 37.5],
            [-2.2, 36.8],
            [-5.6, 36.0],
            [-7.4, 37.2],
            [-7.1, 39.8],
            [-7.0, 41.2],
            [-7.5, 41.9],
            [-8.1, 41.9],
            [-9.0, 41.8]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Italy" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [7.5, 44.1],
            [9.2, 44.8],
            [10.2, 44.5],
            [12.4, 44.9],
            [13.7, 45.6],
            [13.8, 44.8],
            [12.5, 41.9],
            [13.8, 40.9],
            [15.0, 41.3],
            [16.5, 41.8],
            [17.5, 40.9],
            [18.4, 40.2],
            [18.3, 39.8],
            [15.6, 38.3],
            [13.8, 37.6],
            [12.4, 37.8],
            [12.5, 38.2],
            [11.1, 42.3],
            [10.0, 43.8],
            [8.3, 44.4],
            [7.5, 44.1]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Poland" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [14.6, 53.2],
            [16.9, 54.4],
            [19.7, 54.4],
            [22.8, 54.4],
            [23.5, 54.1],
            [23.5, 52.3],
            [23.2, 50.9],
            [22.7, 49.5],
            [19.4, 49.4],
            [18.8, 49.5],
            [15.0, 49.0],
            [14.6, 51.0],
            [14.6, 53.2]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Portugal" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [-9.5, 36.8],
            [-9.2, 38.5],
            [-8.9, 40.2],
            [-9.0, 41.8],
            [-8.1, 41.9],
            [-7.5, 41.9],
            [-7.0, 41.2],
            [-7.1, 39.8],
            [-7.4, 37.2],
            [-7.8, 37.0],
            [-8.8, 37.0],
            [-9.5, 36.8]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Netherlands" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [3.4, 51.4],
            [4.2, 51.4],
            [5.9, 51.8],
            [6.8, 51.9],
            [7.0, 52.4],
            [6.7, 53.4],
            [5.8, 53.6],
            [4.8, 53.4],
            [3.3, 53.2],
            [3.4, 51.4]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Ireland" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [-10.5, 51.4],
            [-9.9, 51.6],
            [-9.3, 51.6],
            [-6.4, 52.0],
            [-6.0, 52.8],
            [-6.2, 53.5],
            [-6.0, 54.0],
            [-7.0, 55.2],
            [-8.2, 54.8],
            [-10.0, 54.6],
            [-10.2, 53.2],
            [-10.5, 51.4]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Czech Republic" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [12.4, 50.2],
            [14.8, 50.8],
            [16.8, 50.4],
            [17.7, 49.5],
            [18.8, 49.5],
            [15.0, 49.0],
            [13.8, 48.7],
            [12.5, 48.5],
            [12.4, 50.2]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Slovakia" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [16.8, 50.4],
            [18.8, 49.5],
            [19.4, 49.4],
            [20.6, 49.2],
            [22.0, 48.5],
            [22.1, 47.9],
            [18.8, 47.8],
            [17.7, 47.9],
            [17.7, 49.5],
            [16.8, 50.4]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Austria" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [9.5, 47.1],
            [12.4, 48.2],
            [13.8, 48.7],
            [15.0, 49.0],
            [16.9, 48.6],
            [17.1, 47.7],
            [16.7, 47.0],
            [14.8, 46.4],
            [13.6, 46.5],
            [12.3, 46.7],
            [10.5, 46.8],
            [9.5, 47.1]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Denmark" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [8.0, 54.8],
            [8.7, 55.9],
            [10.0, 57.3],
            [10.6, 57.7],
            [12.7, 56.0],
            [12.4, 54.8],
            [11.0, 54.8],
            [8.0, 54.8]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Sweden" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [11.8, 58.0],
            [12.7, 56.0],
            [14.3, 55.8],
            [16.5, 56.2],
            [18.3, 57.3],
            [19.0, 59.4],
            [17.8, 61.5],
            [17.3, 63.7],
            [15.8, 66.1],
            [14.5, 68.2],
            [11.8, 69.1],
            [12.0, 64.5],
            [11.8, 58.0]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Finland" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [20.5, 59.8],
            [31.5, 62.0],
            [31.0, 70.0],
            [23.0, 70.1],
            [20.0, 69.0],
            [19.0, 68.0],
            [20.0, 66.0],
            [21.0, 63.0],
            [20.5, 59.8]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Croatia" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [13.5, 42.4],
            [19.4, 42.4],
            [19.4, 46.5],
            [13.5, 46.5],
            [13.5, 42.4]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Greece" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [19.3, 34.8],
            [28.2, 34.8],
            [28.2, 41.7],
            [19.3, 41.7],
            [19.3, 34.8]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Hungary" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [16.1, 45.7],
            [22.9, 45.8],
            [22.9, 48.6],
            [16.1, 48.6],
            [16.1, 45.7]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Romania" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [20.2, 43.6],
            [29.7, 43.6],
            [29.7, 48.3],
            [20.2, 48.3],
            [20.2, 43.6]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Bulgaria" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [22.4, 41.2],
            [28.6, 41.2],
            [28.6, 44.2],
            [22.4, 44.2],
            [22.4, 41.2]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Estonia" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [21.8, 57.5],
            [28.2, 57.8],
            [28.2, 59.7],
            [24.3, 59.7],
            [21.8, 58.4],
            [21.8, 57.5]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Latvia" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [20.9, 55.7],
            [28.2, 56.0],
            [28.2, 57.8],
            [21.8, 57.5],
            [20.9, 56.8],
            [20.9, 55.7]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Lithuania" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [20.9, 53.9],
            [26.8, 54.2],
            [26.8, 56.4],
            [20.9, 55.7],
            [20.9, 53.9]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Slovenia" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [13.4, 45.4],
            [16.6, 45.4],
            [16.6, 46.9],
            [13.4, 46.9],
            [13.4, 45.4]
          ]]
        }
      },
      // Belgium - positioned between France, Netherlands, Germany
      {
        type: "Feature",
        properties: { name: "Belgium" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [2.5, 49.5],
            [6.4, 49.5],
            [6.4, 51.5],
            [2.5, 51.5],
            [2.5, 49.5]
          ]]
        }
      },
      // Cyprus - in the Mediterranean
      {
        type: "Feature",
        properties: { name: "Cyprus" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [32.2, 34.6],
            [34.6, 34.6],
            [34.6, 35.7],
            [32.2, 35.7],
            [32.2, 34.6]
          ]]
        }
      },
      // Small countries last (higher z-index) - these will render on top
      {
        type: "Feature",
        properties: { name: "Luxembourg" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [5.73, 49.44],
            [6.53, 49.44],
            [6.53, 50.18],
            [5.73, 50.18],
            [5.73, 49.44]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Liechtenstein" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [9.47, 47.05],
            [9.64, 47.05],
            [9.64, 47.27],
            [9.47, 47.27],
            [9.47, 47.05]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Malta" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [14.18, 35.78],
            [14.58, 35.78],
            [14.58, 36.08],
            [14.18, 36.08],
            [14.18, 35.78]
          ]]
        }
      }
    ]
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-4 md:p-6">
      <MapContainer
        center={[50, 15]}
        zoom={3.5}
        scrollWheelZoom={false}
        style={{ height: "500px", width: "100%", borderRadius: "0.5rem" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="dark:opacity-80 dark:contrast-100 dark:invert"
        />
        <GeoJSON
          data={euCountries}
          style={style}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
      
      <div className="flex justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-success-500 mr-2"></div>
          <span className="text-sm text-neutral-700 dark:text-neutral-300">Easy</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-warning-500 mr-2"></div>
          <span className="text-sm text-neutral-700 dark:text-neutral-300">Possible but regulated</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-error-500 mr-2"></div>
          <span className="text-sm text-neutral-700 dark:text-neutral-300">Basically impossible</span>
        </div>
      </div>
    </div>
  );
};

export default CountryMap;