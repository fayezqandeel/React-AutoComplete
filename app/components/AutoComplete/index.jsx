import React from 'react'
import PropTypes from 'prop-types'

import AutoCompleteResults from './AutoCompleteResults.jsx'
import { getWebSocket } from '../../WebSocket.jsx'

import './style.less'

class AutoComplete extends React.Component {
  constructor (props) {
    // Pass props to parent class
    super(props)
    // Set initial state
    this.state = {
      activeIndex: 0,
      query: '',
      results: [],
      showSuggestions: true
    }
    // cache results
    this.cache = {}
  }

  componentDidMount () {
    // prepare dummy data in case we have incorrect data from realtime
    const dummyRealtimeData = {
      query: 'python',
      items: [
        {
          title: 'this is realtime data for python'
        }
      ]
    }
    // add listener to ws to receive
    getWebSocket()
    .addEventListener('message', (event) => {
      // parse event data to json object and if not valid or empty then dummy data will be on work.
      let data
      try {
        data = JSON.parse(event.data) || dummyRealtimeData
      } catch (e) {
        data = dummyRealtimeData
      }
      // in case we have this query already in cache then update its results
      // and if not then do nothing becuase http request will return the new data
      if (this.cache && this.cache[data.query]) {
        this.cache[data.query] = this.cache[data.query].concat(data.items)
      }
    })
  }

  handleChange (e) {
    const query = e.target.value
    const { apiURL } = this.props
    // update input value
    this.setState({ query, showSuggestions: true })

    if (query === '') {
      // in case the query is empty then do nothing and make the results list empty
      this.setState({ results: [] })
      return
    }

    if (this.cache && this.cache[query]) {
      // in case this query on cache then return it
      this.setState({ results: this.cache[query] })
    } else {
      // in case the query not cached then add it to cache
      // using fetch instead of using lib from npm
      fetch (apiURL.replace('{query}', query || 'python'))
      .then((response) => response.json())
      .then((results) => {
        this.cache[query] = results
        // update state with latest results
        this.setState({ results })
      })
      .catch((error) => console.error('Request failed', error))
    }
  }

  handleKeyDown (event) {
    const activeIndex = this.state.activeIndex
    if (event.keyCode === 38 && activeIndex > 0) {
      // when user press arrow up
      this.setState({ activeIndex: activeIndex - 1 })
    } else if (event.keyCode === 40 && activeIndex < this.state.results.length - 1) {
      // when user press arrow down
      this.setState({ activeIndex: activeIndex + 1 })
    } else if (event.keyCode === 13) {
      // when user press enter get active item
      const item = this.state.results[activeIndex]
      // update input text with selected item & pass item to onSelect event
      this.onSelect(item)
    }
  }

  onSelect (item) {
    // update input text with selected item
    this.setState({ query: item.title, showSuggestions: false })
    // pass item to onSelect event
    this.props.onSelect(item)
  }

  render () {
    const { activeIndex, query, results, showSuggestions } = this.state
    const { numberOfResults } = this.props
    return (
      <div className='input-container' {...this.props}>
        <input
          onChange={(e) => this.handleChange(e)}
          onKeyDown={(e) => this.handleKeyDown(e)}
          placeholder='Type python!'
          ref='query'
          value={query}
        />
        {
          showSuggestions &&
          <AutoCompleteResults
            activeIndex={activeIndex}
            onSelect={(e) => this.onSelect(e)}
            results={results.slice(0, numberOfResults)}
          />
        }
      </div>
    )
  }
}

AutoComplete.propTypes = {
  apiURL: PropTypes.string,
  numberOfResults: PropTypes.number,
  onSelect: PropTypes.func
}

AutoComplete.defaultProps = {
  apiURL: 'https://api.stackexchange.com/2.2/search/advanced?q={query}&pagesize=15&site=stackoverflow&filter=!9YdnSIN18',
  numberOfResults: 10,
  onSelect: () => {}
}

export default AutoComplete
