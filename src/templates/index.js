import PropTypes from "prop-types"
import React from "react"
import numeral from 'numeral'
import { bbox } from '@turf/turf'

import Map from "../components/marker-map";
import Header from "../components/header"

function Projects({ pageContext: projectsObject }) {

  // convert projects from number-keyed object to array of objects
  const projects = []
  for (var i in projectsObject) {
    projects.push(projectsObject[i]);
  }

  // make a geojson FeatureCollection
  const projectsWithGeometries = projects.filter(d => d.longitude !== '')
  console.log(projectsWithGeometries)

  const projectsFC = {
    type: 'FeatureCollection',
    features: projectsWithGeometries.map((d) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [ d.longitude, d.latitude ]
        },
        properties: {
          ...d
        }
      }
    })
  }

  const bounds = bbox(projectsFC);

  const sources = {
    'capital-projects': {
      type: 'geojson',
      data: projectsFC,
    },
  }

  const layers = [
    {
      id: 'capital-projects',
      source: 'capital-projects',
      type: 'circle',
      paint: {
        'circle-color': 'orange',
        'circle-stroke-color': '#444',
        'circle-opacity': 0.7,
        'circle-stroke-width': {
          stops: [[8, 1], [11, 1.5], [16, 2]]
        },
        'circle-radius': {
          stops: [[8, 1], [11, 5], [16, 10]]
        }
      }
    }
  ]

  const center = [ 0, 0 ]

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900">
      <Header />
      <main className="flex-1 w-full relative">
        <div className="absolute bottom-10 left-5 z-10 bg-gray-200 p-6 max-w-xs">
          <div className="font-semibold text-lg mb-3">Geocoded Capital Projects</div>
          <div className="text-sm mb-3">This map is showing the locations of {numeral(projectsFC.features.length).format('0,0')} New York City Capital Projects geocoded by community volunteers. This effort is ongoing as we attempt to assign a location to every capital project in this dataset.</div>
          <div className="text-sm mb-3">The full dataset includes about 5,000 projects, about 4,000 of which are mappable to a discrete location.</div>
          <div className="text-sm font-semibold mb-3">Click any project for details.</div>
          <hr/>
          <div className="text-xs mb-3"><a className='underline text-blue-600 hover:text-blue-800 visited:text-purple-600' href = 'https://medium.com/qri-io/mapping-billions-in-nyc-capital-spending-97a23af250c2'>Blog Post: &quot;Mapping Billions in NYC Capital Spending&quot;</a></div>
          <div className="text-xs mb-3"><a className='underline text-blue-600 hover:text-blue-800 visited:text-purple-600' href = 'https://qri.cloud/chriswhong/nyc_capital_project_detail_data_geom'>Get the Dataset on qri.cloud</a></div>
        </div>

        <Map
          height='100%'
          width='100%'
          sources={sources}
          layers={layers}
          center={center}
          zoom={13}
          bounds={bounds}
          padding={0.03}
        />
      </main>
    </div>
  );
}

Projects.propTypes = {
  pageContext: PropTypes.object.isRequired,
};


export default Projects;
