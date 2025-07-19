import "dotenv/config";
import cors from "cors";
import express from "express";
import ProductController from "./controllers/product.controller";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "",
    methods: ["GET", "POST", "OPTIONS"],
  })
);

app.use(express.json());

app.get("/products", ProductController.list);
app.get("/products/:id", ProductController.getById);
app.post("/products/add", ProductController.add);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
