import React from 'react'
import PropTypes from 'prop-types'

import AutoCompleteResultsItem from './AutoCompleteResultsItem.jsx'

export default class AutoCompleteResults extends React.Component {
  render () {
    const { results } = this.props
    return (
      <div className='results-container'>
        {
          results.map(
            (item, i) => <AutoCompleteResultsItem {...this.props} index={i} item={item} key={i} />
          )
        }
      </div>
    )
  }
}

AutoCompleteResults.propTypes = {
  results: PropTypes.array
}

AutoCompleteResults.defaultProps = {
  results: []
}
