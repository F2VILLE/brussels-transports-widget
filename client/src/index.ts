import express from "express"
import "dotenv/config"

const app = express()
const port = process.env.PORT || 8080

const apiURL = process.env.API_URL ?
    process.env.API_URL :
    '`${window.location.protocol + "//" + (window.location.host.includes(":") ? window.location.host.split(":").shift() : window.location.host)}:3000`'

app.get("/api_url.js", (req, res) => {
    res.send(`const API_URL = "${apiURL}`)
})

app.use("/", express.static("./public"))

app.listen(port, () => console.log(`Listening on port ${port}`))