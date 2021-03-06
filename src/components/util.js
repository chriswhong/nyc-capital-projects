import geoViewport from '@mapbox/geo-viewport'

/**
 * Calculate the appropriate center and zoom to fit the bounds, given padding.
 * @param {Element} - map DOM node used to calculate height and width in screen pixels of map
 * @param {Array(number)} bounds - [xmin, ymin, xmax, ymax]
 * @param {float} padding - proportion of calculated zoom level to zoom out by, to pad the bounds
 */
export const getCenterAndZoom = (mapNode, bounds, padding = 0) => {
  const { offsetWidth, offsetHeight, clientWidth, clientHeight } = mapNode
  console.dir(mapNode)
  console.log(offsetWidth, offsetHeight, clientWidth, clientHeight)
  const viewport = geoViewport.viewport(
    bounds,
    [offsetWidth, offsetHeight],
    undefined,
    undefined,
    undefined,
    true
  )

  console.log('foo', viewport)

  // Zoom out slightly to pad around bounds

  const zoom = Math.max(viewport.zoom - 1, 0) * (1 - padding)

  return { center: viewport.center, zoom }
}
