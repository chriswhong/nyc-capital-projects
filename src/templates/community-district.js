import PropTypes from "prop-types"
import React from "react"
import DataTable from 'react-data-table-component'
import { navigate } from 'gatsby'
import slugify from 'slugify'

const slugifyOptions = { lower: true }

import Header from "../components/header";
import { formatMoney } from '../util/format'

const dollarWidth = '110px'


function CommunityDistrict({ pageContext: projectsObject, path }) {

  const projects = []
  for (var i in projectsObject) {
    projects.push(projectsObject[i]);
  }

  let districtProjects = projects.filter((project) => project.community_boards_served.includes(path.split('/')[2]))
  districtProjects = districtProjects.map((d) => {
    return {
      ...d,
      commitments: d.combined_total - d.combined_prior_actuals
    }
  })

  const columns = [
    {
      name: 'Project Id',
      selector: 'project_id',
      sortable: true,
      width: '120px'
    },
    {
      name: 'Project Description',
      selector: 'project_description',
      sortable: true,
      grow: 1
    },
    {
      name: 'Managing Agency',
      selector: 'managing_agency',
      sortable: true,
    },
    // {
    //   name: '10-year Plan Category',
    //   selector: 'ten_year_plan_category',
    //   sortable: true,
    // },
    {
      name: 'Original Budget',
      selector: 'original_budget',
      sortable: true,
      format: row => formatMoney(row.original_budget),
      width: dollarWidth
    },
    {
      name: 'Prior Spend',
      selector: 'combined_prior_actuals',
      sortable: true,
      format: row => formatMoney(row.combined_prior_actuals),
      width: dollarWidth
    },
    {
      name: 'Commitments',
      selector: 'combined_total',
      sortable: true,
      format: row => formatMoney(row.combined_total),
      width: dollarWidth
    },
    {
      name: 'Total',
      selector: 'commitments',
      sortable: true,
      format: row => formatMoney(row.commitments),
      width: dollarWidth
    },
  ];

  const handleRowClicked = (row) => {
    const {
      managing_agency,
      managing_agency_id,
      project_id,
      project_description
    } = row
    navigate(`/${managing_agency_id}-${slugify(managing_agency, slugifyOptions)}/project/${project_id}-${slugify(project_description, slugifyOptions)}`)
  }

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900">
      <Header />

      <main className="flex-1 w-full  px-4 py-8 mx-auto md:px-8 md:py-16">
      <DataTable
         title={'Projects'}
         columns={columns}
         data={districtProjects}
         onRowClicked={handleRowClicked}
         pointerOnHover={true}
         highlightOnHover={true}
         striped={true}
       />
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

CommunityDistrict.propTypes = {
  pageContext: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};

export default CommunityDistrict;
