// We import the CSS which is extracted to its own file by esbuild.
// Remove this line if you add a your own CSS build pipeline (e.g postcss).
import "../css/app.css"

// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"
import fetchToCurl from 'fetch-to-curl';

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", info => topbar.show())
window.addEventListener("phx:page-loading-stop", info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#example-button").addEventListener('click', async (e) => {
    document.querySelector("#example-response").innerText = "Waiting"
    
    let url = window.location.href.split("?")[0].replace(/\/+$/g, '') + "/api"

    const method = document.querySelector("#method").value
    const status = document.querySelector("#status").value
    const body = document.querySelector("#body").value
    const timeout = document.querySelector("#timeout").value
    const request_params = { status, body, timeout }

    let options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      }
    }

    if (method == "get") {
      const query = new URLSearchParams(request_params)

      url += "?" + query
    } else {
      const filtered_entries = Object.entries(request_params).filter(([_, value]) => {
        return value != ''
      })
      const filtered_request_params = Object.fromEntries(filtered_entries)

      options.body = JSON.stringify(filtered_request_params)
    }

    const curl = fetchToCurl(url, options)

    document.querySelector("#example-curl").innerText = curl

    const response = await fetch(url, options)

    const response_body = await response.json()
    
    document.querySelector("#example-response").innerText = JSON.stringify(response_body)
  })
})
