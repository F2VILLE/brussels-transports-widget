import express from "express"
import "dotenv/config"
import applyRoutes from "./routes"

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({extended: true}))
app.use(express.json())

applyRoutes(app)

app.listen(port, () => console.log(`Listening on port ${port}`))