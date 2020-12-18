import PropTypes from "prop-types"
import React from "react"
import DataTable from 'react-data-table-component'
import { navigate } from 'gatsby'
import _ from 'lodash'
import numeral from 'numeral'

import Header from "../components/header"

import communityDistrictIds from '../util/community-district-ids'

const boroughLookup = (boroughCode) => {
  switch(boroughCode) {
    case '1':
      return 'Manhattan'
    case '2':
      return 'Bronx'
    case '3':
      return 'Brooklyn'
    case '4':
      return 'Queens'
    case '5':
      return 'Staten Island'
  }
}

const BoroughCommunityDistrictTable = ({ data, borough }) => {
  const boroughData = data.filter((d) => d.id[0] === borough)
    .map((d) => {
      return {
        id: d.id,
        projectCount: d.projects.length,
        total_combined_total: d.total_combined_total
      }
    })

  const boroughDisplayName = boroughLookup(borough)

  // in this table we want to show community district id, count of projects, and total amount

  const columns = [
    {
      name: 'Community District',
      selector: 'id',
      sortable: true,
      format: row => parseInt(row.id.substr(1,2)),
      right: true
    },
    {
      name: 'Projects',
      selector: 'projectCount',
      sortable: true,
      right: true
    },
    {
      name: 'Total Dollar Amount',
      selector: 'total_combined_total',
      sortable: true,
      format: row => numeral(row.total_combined_total * 1000).format('($ 0.00 a)'),
      right: true
    },
  ];

  const handleRowClicked = (row) => {
    navigate(`/community-district/${row.id}`)
  }

  return (
    <div className='mb-10'>
      <DataTable
         title={boroughDisplayName}
         columns={columns}
         data={boroughData}
         onRowClicked={handleRowClicked}
         pointerOnHover={true}
         highlightOnHover={true}
         striped={true}
       />
    </div>
  )
}


function Projects({ pageContext: projectsObject }) {

  const projects = []
  for (var i in projectsObject) {
    projects.push(projectsObject[i]);
  }

  console.log('allprojects', projects)


  const districtTotals = communityDistrictIds.map((id) => {
    // filter
    const districtProjects = projects.filter((project) => project.community_boards_served.includes(id))
    console.log(districtProjects)

    return {
      id,
      total_combined_total: _.sumBy(districtProjects, (project) => project.combined_total),
      projects: districtProjects
    }
  })

  console.log(districtTotals)

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900">
      <Header />

      <main className="flex-1 w-full max-w-4xl px-4 py-8 mx-auto md:px-8 md:py-16">
        <BoroughCommunityDistrictTable data={districtTotals} borough={'1'} />
        <BoroughCommunityDistrictTable data={districtTotals} borough={'2'} />
        <BoroughCommunityDistrictTable data={districtTotals} borough={'3'} />
        <BoroughCommunityDistrictTable data={districtTotals} borough={'4'} />
        <BoroughCommunityDistrictTable data={districtTotals} borough={'5'} />
      </main>

      <footer className="bg-blue-700">
        <nav className="flex justify-between max-w-4xl p-4 mx-auto text-sm md:p-8">
          <p className="text-white">
            Created by{` `}
            <a
              className="font-bold no-underline"
              href="https://bryant.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              Taylor Bryant
            </a>
          </p>

          <p>
            <a
              className="font-bold text-white no-underline"
              href="https://github.com/taylorbryant/gatsby-starter-tailwind"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
        </nav>
      </footer>
    </div>
  );
}

Projects.propTypes = {
  pageContext: PropTypes.object.isRequired,
};

BoroughCommunityDistrictTable.propTypes = {
  data: PropTypes.array.isRequired,
  borough: PropTypes.string.isRequired,
};

export default Projects;
