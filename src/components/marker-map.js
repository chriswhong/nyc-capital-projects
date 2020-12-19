import PropTypes from "prop-types";
import React from "react";
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken =  'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A'

class MarkerMap extends React.Component {
  componentDidMount() {
    const { longitude, latitude } = this.props
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v9',
      center: [longitude, latitude],
      zoom: 12
    })

    this.map.on('style.load', () => {
      // load a circle
      this.map.addLayer({
        id: 'marker',
        type: 'circle',
        paint: {
          'circle-color': 'orange',
          'circle-stroke-color': '#444',
          'circle-stroke-width': 2
        },
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            }
          }
        }
      })
    })
  }

  render() {
    return (
      <div className='w-full h-96' ref={el => this.mapContainer = el} />
    )
  }
}

MarkerMap.propTypes = {
  longitude: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
};


export default MarkerMap
