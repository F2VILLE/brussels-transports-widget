const API_URL = `${window.location.protocol + "//" + (window.location.host.includes(":") ? window.location.host.split(":").shift() : window.location.host)}:3000`
console.log(API_URL)

const button = document.querySelector("#checkBtn")
const distanceInput = document.querySelector("#distance")
const resultsDiv = document.querySelector("#results")

let distance = 100;



distanceInput.onchange = () => {
    distance = distanceInput.value
}


button.onclick = async () => {

    button.setAttribute("disabled", "")
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords
                console.log(`${API_URL}/lines?lat=${latitude}&lon=${longitude}&distance=${distance}`)
                const req = await fetch(`${API_URL}/lines?lat=${latitude}&lon=${longitude}&distance=${distance}`)
                const data = await req.json()
                console.log(data)
            } catch (error) {
                console.log(`${error}`)
                resultsDiv.innerHTML = `<p>Error : </p><code><pre>${`${error}`}</code></pre>`
            }

            button.removeAttribute("disabled")
        })
    } else {
        resultsDiv.innerHTML = "Geolocation is not supported by this browser.";
        button.removeAttribute("disabled")
    }


}