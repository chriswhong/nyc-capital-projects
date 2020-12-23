const fetch = require('node-fetch')
const csv = require('csvtojson')
const path = require('path')
const fs = require('fs')

const communityDistrictIds = require('./src/util/community-district-ids')

const getCapitalProjectsData = async () => {
  const projectsCSV = await fetch('https://api.qri.cloud/get/chriswhong/nyc_capital_project_detail_data/body.csv').then(d => d.text())

  const projectsJSON = await csv({
    colParser:{
      "community_boards_served": "string"
    },
    checkType: true,
  })
  .fromString(projectsCSV)

  const geomCSV = await fetch('https://api.qri.cloud/get/chriswhong/nyc_capital_project_detail_data_geom/body.csv').then(d => d.text())

  const geomJSON = await csv({
    checkType: true,
  })
  .fromString(geomCSV)

  // join the two datasets

  const joined = projectsJSON.map((d) => {
    const { latitude, longitude } = geomJSON.find(({ project_id }) => project_id === d.project_id)

    return {
      ...d,
      latitude,
      longitude
    }
  })

  return joined
}

const writeJson = (projects) => {
  // filter for only the keys we want to search by

  const projectsSearch = projects.map((project) => {
    const {
      project_id,
      project_description,
      managing_agency,
      combined_total,
      scope_summary,
      project_location
    } = project

    return {
      project_id,
      project_description,
      managing_agency,
      combined_total,
      scope_summary,
      project_location
    }
  })

  fs.writeFileSync('./static/data/projects-search.json', JSON.stringify(projectsSearch))
}

const writeFeatureCollection = (projects) => {
  const projectsWithGeometries = projects.filter(d => d.longitude !== '')

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

  fs.writeFileSync('./static/data/projects.geojson', JSON.stringify(projectsFC))
}


exports.createPages = async ({ actions }) => {
  const { createPage } = actions
  const projects = await getCapitalProjectsData()

  writeJson(projects)
  writeFeatureCollection(projects)

  // index page
  createPage({
    path: '/',
    component: path.resolve(`./src/templates/index.js`),
    context: projects
  })

  // community districts page
  createPage({
    path: '/community-districts',
    component: path.resolve(`./src/templates/community-districts.js`),
    context: projects
  })

  // community district pages
  communityDistrictIds.forEach((id) => {
    createPage({
      path: `/community-district/${id}`,
      component: path.resolve(`./src/templates/community-district.js`),
      context: projects
    })
  })

  projects.forEach((project) => {
    const {
      project_id,
    } = project
    createPage({
      path: `/project/${project_id}`,
      component: path.resolve(`./src/templates/project.js`),
      context: project
    })
  })
}
