// src/server/index.ts

import express from "express"
import { api } from "./api"
import swaggerUi from 'swagger-ui-express';


const app = express()
app.use(api);

const openApiDocument = api.openApiDoc({ title: "remult-react-todo" });
app.get("/todo/openApi.json", (req, res) => res.json(openApiDocument));
app.use('/todo/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.listen(3002, () => console.log("Server started"))
