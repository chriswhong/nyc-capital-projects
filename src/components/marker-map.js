import PropTypes from "prop-types";
import React, { useEffect, useRef } from 'react'
import { graphql, useStaticQuery } from "gatsby";
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import { hasWindow } from '../util/dom'


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
    console.log('in effect')
       let mapCenter = center
       let mapZoom = zoom

       // Token must be set before constructing map
       mapboxgl.accessToken = mapboxToken

       const map = new mapboxgl.Map({
         container: mapNode.current,
         style: `mapbox://styles/mapbox/${style}`,
         center: mapCenter,
         zoom: mapZoom,
         minZoom,
         maxZoom,
       })
       mapRef.current = map
       window.map = map // for easier debugging and querying via console

       map.addControl(new mapboxgl.NavigationControl(), 'top-right')

       map.on('load', () => {
         console.log('map onload')
         // add sources
         Object.entries(sources).forEach(([id, source]) => {
           map.addSource(id, source)
         })

         // add layers
         layers.forEach(layer => {
           map.addLayer(layer)
         })
       })

       // hook up map events here, such as click, mouseenter, mouseleave
       // e.g., map.on('click', (e) => {})
       // when this component is destroyed, remove the map

       return () => {
         map.remove()
       }
  }, [])

  return (
    <div style={{
      height: height,
      width: width
    }}>
      <div className='w-full h-96' ref={mapNode} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
//
// class MarkerMap extends React.Component {
//   componentDidMount() {
//     const { longitude, latitude } = this.props
//     this.map = new mapboxgl.Map({
//       container: this.mapContainer,
//       style: 'mapbox://styles/mapbox/light-v9',
//       center: [longitude, latitude],
//       zoom: 12
//     })
//
//     this.map.on('style.load', () => {
//       // load a circle
//       this.map.addLayer({
//         id: 'marker',
//         type: 'circle',
//         paint: {
//           'circle-color': 'orange',
//           'circle-stroke-color': '#444',
//           'circle-stroke-width': 2
//         },
//         source: {
//           type: 'geojson',
//           data: {
//             type: 'Feature',
//             geometry: {
//               type: 'Point',
//               coordinates: [longitude, latitude]
//             }
//           }
//         }
//       })
//     })
//   }
//
//   render() {
//
//   }
// }

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
}


export default MarkerMap
