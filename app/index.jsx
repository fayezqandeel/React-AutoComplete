import React from 'react'
import ReactDOM from 'react-dom'

import { initWebSocket } from './WebSocket.jsx'
import AutoComplete from './components/AutoComplete/index.jsx'

// start websocket connection
initWebSocket()

// trigger event when item selected from auto complete
function onSelect (item) {
  console.log(item.title)
}

ReactDOM.render(
  <AutoComplete
    apiURL='https://jsonplaceholder.typicode.com/posts'
    numberOfResults={15}
    onSelect={onSelect}
  />,
  document.getElementById('root')
)
