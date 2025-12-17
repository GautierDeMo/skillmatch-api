import express from "express";
import { jsonApiResponseMiddleware } from "./middlewares/v1";
import { v1Route } from "./routes/v1";

const port = 8001
const app = express()

// Middleware for requests with a application/json Content-type
app.use(express.json())
// Middleware for requests with a application/x-www-form-urlencoded Content-type
app.use(express.urlencoded({ extended: true }))
// Middleware to attach methods on Response class
app.use(jsonApiResponseMiddleware)

app.use('/v1', v1Route)

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`)
})
