// const API_URL = `${window.location.protocol + "//" + (window.location.host.includes(":") ? window.location.host.split(":").shift() : window.location.host)}:3000`
console.log(API_URL)

const button = document.querySelector("#checkBtn")
const distanceInput = document.querySelector("#distance")
const resultsDiv = document.querySelector("#results")

let distance = 100;

alert("TEST")

resultsDiv.innerHTML = `API_URL: ${API_URL}`

distanceInput.onchange = () => {
    distance = distanceInput.value
}


button.onclick = async () => {

    button.setAttribute("disabled", "")
    resultsDiv.innerHTML = "Loading . . ."
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            resultsDiv.innerHTML = `Position : ${JSON.stringify(position)}`
            try {
                const { latitude, longitude } = position.coords
                console.log(`${API_URL}/lines?lat=${latitude}&lon=${longitude}&distance=${distance}`)
                const req = await fetch(`${API_URL}/lines?lat=${latitude}&lon=${longitude}&distance=${distance}`)
                resultsDiv.innerHTML = `Fetched api`
                const data = await req.json()
                console.log(data)
                resultsDiv.innerHTML = `<code><pre>${JSON.stringify(data, null, 3)}</code></pre>`
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