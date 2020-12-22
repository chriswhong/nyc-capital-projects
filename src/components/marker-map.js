import PropTypes from "prop-types";
import React, { useEffect, useRef } from 'react'
import { graphql, useStaticQuery, navigate } from "gatsby";
import mapboxgl from 'mapbox-gl'
import slugify from 'slugify'

const slugifyOptions = { lower: true }

import 'mapbox-gl/dist/mapbox-gl.css'

import { hasWindow } from '../util/dom'
import { getCenterAndZoom } from './util'
import { formatMoney } from '../util/format'




mapboxgl.accessToken =  'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A'


const MarkerMap = ({
  width = 'auto',
  height = '100%',
  zoom = 0,
  center = [0, 0],
  style = 'light-v9',
  sources = {},
  layers = [],
  minZoom = 0,
  maxZoom = 24,
  bounds = [],
  padding = 0.1
}) => {

const { site } = useStaticQuery(graphql`
  query SiteMapboxTokenQuery {
    site {
      siteMetadata {
        mapboxToken
      }
    }
  }
`);

const { mapboxToken } = site.siteMetadata

if (!mapboxToken) {
  console.error(
    'ERROR: Mapbox token is required in gatsby-config.js siteMetadata'
  )
}
  // if there is no window, we cannot render this component
  if (!hasWindow) {
    return null
  }

  // this ref holds the map DOM node so that we can pass it into Mapbox GL
  const mapNode = useRef(null)

  // this ref holds the map object once we have instantiated it, so that we
  // can use it in other hooks
  const mapRef = useRef(null)


  useEffect(() => {
    setTimeout(() => {
      console.log('foofd')
      console.dir(mapNode.current.offsetHeight)
      let mapCenter = center
      let mapZoom = zoom

      // If bounds are available, use these to establish center and zoom when map first loads
     if (bounds && bounds.length === 4) {
       const { center: boundsCenter, zoom: boundsZoom } = getCenterAndZoom(
         mapNode.current,
         bounds,
         padding
       )
       mapCenter = boundsCenter
       mapZoom = boundsZoom
     }

      // Token must be set before constructing map
      mapboxgl.accessToken = mapboxToken

      const map = new mapboxgl.Map({
       container: mapNode.current,
       style: `mapbox://styles/mapbox/${style}`,
       center: mapCenter,
       zoom: mapZoom,
       minZoom,
       maxZoom,
       hash: true
      })

      mapRef.current = map
      window.map = map // for easier debugging and querying via console

      map.resize()
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')

      map.on('load', () => {
       console.log('map onload')
       // add sources
       Object.entries(sources).forEach(([id, source]) => {
         map.addSource(id, source)
       })

       // add layers
       layers.forEach(layer => {
         map.addLayer(layer, 'waterway-label')
       })
      })

      // hook up map events here, such as click, mouseenter, mouseleave
      // e.g., map.on('click', (e) => {})
      // when this component is destroyed, remove the map

      // Create a popup, but don't add it to the map yet.
      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      map.on('mouseenter', 'capital-projects', function (e) {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = 'pointer';
      const feature = e.features[0]
      const {
        project_description,
        combined_total,
        managing_agency
      } = feature.properties
      var coordinates = feature.geometry.coordinates.slice();
      var description = `
      <div class='uppercase text-xs text-gray-400 mt-3 mb-1'>
        ${managing_agency}
      </div>
      <div class='text-base font-medium leading-tight mb-3'>
        ${project_description}
      </div>
      <div class='text-3xl text-center font-bold '>${formatMoney(combined_total)}</div>
      <div class='text-xs text-center text-gray-400 mb-3'>prior actual + planned spending</div>
      `;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(coordinates).setHTML(description).addTo(map);
      });

      map.on('mouseleave', 'capital-projects', function () {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });

      map.on('click', 'capital-projects', function (e) {
        const feature = e.features[0]
        const {
          project_id,
          project_description,
          managing_agency_id,
          managing_agency
        } = feature.properties
        navigate(`/${managing_agency_id}-${slugify(managing_agency, slugifyOptions)}/project/${project_id}-${slugify(project_description, slugifyOptions)}`)
      })

      return () => {
       map.remove()
      }
    }, 250)

  }, [])

  return (
    <div className='absolute' style={{
      height: height,
      width: width
    }}>
      <div className='w-full h-96' ref={mapNode} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

MarkerMap.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  style: PropTypes.string,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  padding: PropTypes.number,
  sources: PropTypes.object,
  layers: PropTypes.arrayOf(PropTypes.object),
  bounds: PropTypes.arrayOf(PropTypes.number),
}


export default MarkerMap
