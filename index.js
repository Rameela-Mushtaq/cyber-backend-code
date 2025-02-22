import express from "express"
import connectDb from "./config/db.js";
import dotenv from 'dotenv'
import cors from 'cors'

//import the route
import userRoute from './routes/userRoute.js'
import resourceRoute from './routes/resourceRoute.js'
import categoryRoute from './routes/categoryRoute.js'


//env config
dotenv.config()

//database Connection
connectDb();

const app = express();
//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true })); 

app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://cyber-frontend-gamma.vercel.app",
      ],
      credentials: true,
    })
  );


//routes
app.use('/api/user', userRoute)
app.use('/api/resource', resourceRoute)
app.use('/api/category', categoryRoute)


app.get("/", (req, res) => {
    res.send("<h1>🚀 Server is Running ...</h1>");
  });


const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})