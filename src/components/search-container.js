import React, { Component } from "react"
import Axios from "axios"
import * as JsSearch from 'js-search'
import { Link } from 'gatsby'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import { formatMoney } from '../util/format'

class Search extends Component {
  state = {
    projectList: [],
    search: [],
    searchResults: [],
    isLoading: true,
    isError: false,
    searchQuery: "",
  }
  /**
   * React lifecycle method to fetch the data
   */
  async componentDidMount() {
    Axios.get("/data/projects-search.json")
      .then(result => {
        this.setState({ projectList: result.data })
        this.rebuildIndex()
      })
      .catch(err => {
        this.setState({ isError: true })
        console.log("====================================")
        console.log(`Something bad happened while fetching the data\n${err}`)
        console.log("====================================")
      })
  }
  /**
   * rebuilds the overall index based on the options
   */
  rebuildIndex = () => {
    const { projectList } = this.state
    const dataToSearch = new JsSearch.Search("project_id")
    /**
     *  defines a indexing strategy for the data
     * more about it in here https://github.com/bvaughn/js-search#configuring-the-index-strategy
     */
    dataToSearch.indexStrategy = new JsSearch.PrefixIndexStrategy()
    /**
     * defines the sanitizer for the search
     * to prevent some of the words from being excluded
     *
     */
    dataToSearch.sanitizer = new JsSearch.LowerCaseSanitizer()
    /**
     * defines the search index
     * read more in here https://github.com/bvaughn/js-search#configuring-the-search-index
     */
    dataToSearch.searchIndex = new JsSearch.TfIdfSearchIndex("project_id")
    dataToSearch.addIndex("project_description") // sets the index attribute for the data
    dataToSearch.addIndex("scope_summary") // sets the index attribute for the data
    dataToSearch.addIndex("project_location") // sets the index attribute for the data

    dataToSearch.addDocuments(projectList) // adds the data to be searched
    this.setState({ search: dataToSearch, isLoading: false })
  }
  /**
   * handles the input change and perform a search with js-search
   * in which the results will be added to the state
   */
  searchData = e => {
    const { search } = this.state
    const queryResult = search.search(e.target.value)
    this.setState({ searchQuery: e.target.value, searchResults: queryResult })
  }
  handleSubmit = e => {
    e.preventDefault()
  }
  render() {
    const { searchResults, searchQuery } = this.state
    const queryResults = searchResults
    return (
      <div className='inline-block'>
        <div style={{ margin: "0 auto" }}>
          <form onSubmit={this.handleSubmit}>
            <div className="shadow flex">
                <input
                  id="Search"
                  value={searchQuery}
                  onChange={this.searchData}
                  className="w-full border-none p-2"
                  type="text"
                  placeholder="Search for projects..."
                />
                <button className="bg-white w-auto flex justify-end items-center text-blue-500 p-2 hover:text-blue-400">
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div>
          </form>
          <div className={`absolute z-10 bg-white max-w-sm p-2 border-solid ${queryResults.length ? '' : 'hidden'}`}>
            <div className='text-sm font-bold mb-2'>{queryResults.length} projects</div>

            {queryResults.slice(0,15).map(item => {
              const {
                project_id,
                project_description,
                managing_agency,
                combined_total
              } = item

              return (
                <Link key={project_id} to={`/project/${project_id}`}>
                  <div className='hover:bg-gray-300'>
                    <div className='p-1'>
                      <div className='text-xs text-gray-600'>{project_id} • {managing_agency}</div>
                      <div className='text-sm '>{project_description} • {formatMoney(combined_total)}</div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}
export default Search
