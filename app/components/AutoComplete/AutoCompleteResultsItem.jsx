import React from 'react'
import PropTypes from 'prop-types'

export default class AutoCompleteResultsItem extends React.Component {
  render () {
    const { activeIndex, index, item } = this.props
    return (
      <div
        className={
          activeIndex === index ? 'item-container selected' : 'item-container'
        }
        onClick={() => this.props.onSelect(item)}
      >
        {item.title}
      </div>
    )
  }
}

AutoCompleteResultsItem.propTypes = {
  item: PropTypes.object
}

AutoCompleteResultsItem.defaultProps = {
  item: {}
}
