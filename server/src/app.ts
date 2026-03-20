import express from "express";
import cors from "cors";
import path from "path";

const app = express();

const clientPath = path.join(__dirname, "../../client/dist/");

app.use(cors());
app.use(express.json());
app.use(express.static(clientPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

export default app;
