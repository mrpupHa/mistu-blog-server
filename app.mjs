import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import postRouter from "./routes/postRouter.mjs";
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Frontend local (Vite)
      "http://localhost:3000", // Frontend local (React แบบอื่น)
      "https://mistu-blog-platform.vercel.app", // Frontend ที่ Deploy แล้ว
      // ✅ ให้เปลี่ยน https://your-frontend.vercel.app เป็น URL จริงของ Frontend ที่ deploy แล้ว
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (req, res) => {
  return res.json({ status: "OK", message: "Server is running" });
});

app.use("/posts", postRouter);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

export default app;
