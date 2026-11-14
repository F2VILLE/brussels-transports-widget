// const API_URL = `${window.location.protocol + "//" + (window.location.host.includes(":") ? window.location.host.split(":").shift() : window.location.host)}:3000`
console.log(API_URL)

const button = document.querySelector("#checkBtn")
const distanceInput = document.querySelector("#distance")
const resultsDiv = document.querySelector("#results")
const rigged = document.querySelector("#fake")

let distance = 100;


resultsDiv.innerHTML = `API_URL: ${API_URL}`

distanceInput.onchange = () => {
    distance = distanceInput.value
}


button.onclick = async () => {

    button.setAttribute("disabled", "")
    resultsDiv.innerHTML = "Loading . . ."
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            console.log(`rigged : ${rigged.value}`)
            if (rigged.value)
                position = {
                    coords: {
                        latitude: 50.803625026773375,
                        longitude: 4.414184823242479
                    }
                }
            resultsDiv.innerHTML = `Position : ${JSON.stringify(position)}`
            try {
                const { latitude, longitude } = position.coords
                console.log(`${API_URL}/lines?lat=${latitude}&lon=${longitude}&distance=${distance}`)
                const req = await fetch(`${API_URL}/lines?lat=${latitude}&lon=${longitude}&distance=${distance}`)
                const data = await req.json()
                console.log(data)
                const lines = data["lines"]
                console.log(lines)
                const ctn = document.createElement("ul")
                for (const k of Object.keys(lines)) {
                    console.log(k)
                    const stop = document.createElement("li")
                    const stopName = document.createElement("h3")
                    stopName.innerText = k
                    stop.appendChild(stopName)

                    const stopLinesCtn = document.createElement("ul")
                    for (const stopLine of lines[k]) {
                        console.log(stopLine["line"])
                        const stopLineLi = document.createElement("li")
                        console.log("Time: " + stopLine["minutes"])
                        stopLineLi.innerText = `${stopLine["line"]} ${stopLine["destination"]["fr"]} - ${stopLine["minutes"]} min`
                        stopLinesCtn.appendChild(stopLineLi)
                    }
                    stop.appendChild(stopLinesCtn)
                    ctn.appendChild(stop)
                }
                console.log(`${ctn.innerHTML}`)
                // resultsDiv.innerHTML = ""
                resultsDiv.appendChild(ctn)
                // resultsDiv.innerHTML = `<code><pre>${JSON.stringify(data, null, 3)}</code></pre>`
            } catch (error) {
                console.log(`${error}`)
                resultsDiv.innerHTML = `<p>Error : </p><code><pre>${`${error}`}</code></pre>`
            }

            button.removeAttribute("disabled")
        }, (error) => {

            resultsDiv.innerHTML = `<p>Error : </p><code><pre>${`${error.message}`}</code></pre>`
            button.removeAttribute("disabled")
        })
    } else {
        resultsDiv.innerHTML = "Geolocation is not supported by this browser.";
        button.removeAttribute("disabled")
    }


}