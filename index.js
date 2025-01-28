import express from "express"
import connectDb from "./config/db.js";
import dotenv from 'dotenv'
import cors from 'cors'

//import the route
import userRoute from './routes/userRoute.js'

//env config
dotenv.config()

//database Connection
connectDb();

const app = express();

app.use(
    cors({
      origin: [
        "http://localhost:3000",
        //@ts-nocheck"https://cyber-frontend-gamma.vercel.app",
      ],
      credentials: true,
    })
  );

//middlewares
app.use(express.json())
app.use(cors());

//routes
app.use('/api/user', userRoute)


app.get("/", (req, res) => {
    res.send("<h1>🚀 Server is Running ...</h1>");
  });


const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})