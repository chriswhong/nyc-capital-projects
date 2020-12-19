const fetch = require('node-fetch')
const csv = require('csvtojson')
const path = require('path')
const slugify = require('slugify')

const slugifyOptions = { lower: true }

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

  console.log(joined)


  return joined
}


exports.createPages = async ({ actions }) => {
  const { createPage } = actions
  const projects = await getCapitalProjectsData()

  // index page
  createPage({
    path: '/',
    component: path.resolve(`./src/templates/index.js`),
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
      managing_agency_id,
      managing_agency,
      project_id,
      project_description

    } = project
    createPage({
      path: `/${managing_agency_id}-${slugify(managing_agency, slugifyOptions)}/project/${project_id}-${slugify(project_description, slugifyOptions)}`,
      component: path.resolve(`./src/templates/project.js`),
      context: project
    })
  })
}
