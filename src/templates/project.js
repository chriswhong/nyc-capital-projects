import PropTypes from "prop-types";
import React from "react";


import Header from "../components/header";
import MarkerMap from "../components/marker-map";


import { formatMoney } from '../util/format'



const KeyValueTableRow = ({ theKey, value }) => (
  <tr>
    <td className='text-right pr-3'><span className='text-xs text-gray-600 font-semibold'>{theKey}</span></td>
    <td>{value}</td>
  </tr>
)



function Project({ pageContext }) {
  const {
    project_description,
    borough,
    managing_agency,
    ten_year_plan_category,
    budget_lines,
    project_id,
    community_boards_served,
    explanation_for_delay,
    project_location,
    scope_summary,
    original_budget,
    combined_prior_actuals,
    combined_total,
    longitude,
    latitude
  } = pageContext


  const sources = {
    'current-project': {
      type: 'geojson',
      data: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
    },
  }

  const layers = [
    {
      id: '1',
      source: 'current-project',
      type: 'circle',
      paint: {
        'circle-color': 'orange',
        'circle-stroke-color': '#444',
        'circle-stroke-width': 2
      }
    }
  ]

  const center = [ longitude, latitude ]

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900">
      <Header />
      <div className="flex flex-wrap overflow-hidden container w-screen mx-auto px-4 py-5">
        <div className="w-2/3 overflow-hidden md:my-2 md:px-2 md:w-2/3">
          <div className="text-xs text-gray-600 uppercase font-semibold">NYC Capital Project</div>
          <div className="text-3xl font-semibold mb-3">{project_description}</div>
          <div className="grid gap-3 grid-cols-3 mb-4">
            <div className='rounded border p-3'>
              <div className="text-xs text-gray-600 uppercase font-semibold mb-2">Original Budget</div>
              <div className='text-3xl font-semibold'>{formatMoney(original_budget)}</div>
            </div>
            <div className='rounded border p-3'>
              <div className="text-xs text-gray-600 uppercase font-semibold mb-2">Prior Spending</div>
              <div className='text-3xl font-semibold'>{formatMoney(combined_prior_actuals)}</div>
            </div>
            <div className='rounded border p-3'>
              <div className="text-xs text-gray-600 uppercase font-semibold mb-2">Planned Spending (FY21-25)</div>
              <div className='text-3xl font-semibold'>{formatMoney(combined_total - combined_prior_actuals)}</div>
            </div>
          </div>

          <table className="table-auto">
            <tbody>
              <KeyValueTableRow theKey='Project ID' value={project_id} />
              <KeyValueTableRow theKey='Borough' value={borough} />
              <KeyValueTableRow theKey='Managed By' value={managing_agency} />
              <KeyValueTableRow theKey='10-year Plan Category' value={ten_year_plan_category} />
              <KeyValueTableRow theKey='Budget Lines' value={budget_lines} />
              <KeyValueTableRow theKey='Community Districts Served' value={community_boards_served} />
              <KeyValueTableRow theKey='Project Location' value={project_location} />
              <KeyValueTableRow theKey='Scope Summary' value={scope_summary} />
              <KeyValueTableRow theKey='Explanation for Delay' value={explanation_for_delay} />
            </tbody>
          </table>
        </div>
        <div className="w-1/3 overflow-hidden md:my-2 md:px-2 md:w-1/3">
          {
            longitude && latitude && (
              <MarkerMap
                height='300px'
                width='300px'
                sources={sources}
                layers={layers}
                center={center}
                zoom={13}
              />
            )
          }
        </div>

      </div>


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

KeyValueTableRow.propTypes = {
  theKey: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}

Project.propTypes = {
  pageContext: PropTypes.object.isRequired,
};

export default Project;
