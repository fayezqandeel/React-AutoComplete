let socket

export const initWebSocket = () => {
  // init websocket connection with demo server
  socket = new WebSocket('wss://echo.websocket.org')
  // listen to connection
  socket.addEventListener('open', function (event) {
    // send hello message to demo server to trigger &
    // update just the cached queries as new queries will get fresh data from server
    setTimeout(() => { socket.send('Hello Server!') }, 3000)
  })
  return socket
}

export const getWebSocket = () => {
  return socket
}
