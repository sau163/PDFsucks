import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors(
  {
    origin: process.env.CORS_ORIGIN,
    credentials: true
  }
));

app.use(express.json({limit: "16kb"}));
app.use(urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

const apiRoute = express.Router();
apiRoute.get("/", (req, res) => {
  return res.json({
    message: "Allah is alive"
  });
});

app.use("/api/v1", apiRoute);

export { app };
