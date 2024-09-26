import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authMiddleware from "./middleware/authMiddleware";

/* ROUTES IMPORTS*/
import dashboardRoutes from "./routes/dashboardRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import productRoutes from "./routes/productRoutes";
import supplierRoutes from "./routes/supplierRoutes";
import userRoutes from "./routes/userRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import loginRoutes from "./routes/loginRoutes";
/*CONFIGURATIONS*/
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); //accept cross origin request
app.use(morgan("common"));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/*ROUTES*/
app.use("/", loginRoutes); // http://localhost:8000/login
app.use("/dashboard", dashboardRoutes); // http://localhost:8000/dashboard
app.use("/analytics", analyticsRoutes); // http://localhost:8000/dashboard
app.use("/products", productRoutes); // http://localhost:8000/products
app.use("/suppliers", supplierRoutes); // http://localhost:8000/products
app.use("/users", userRoutes); // http://localhost:8000/users
app.use("/expenses", expenseRoutes); // http://localhost:8000/expenses

/*SERVER*/
const port = Number(process.env.PORT) || 3002;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});

// curl http://localhost:8000/dashboard
