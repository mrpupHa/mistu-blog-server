import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectionPool from "./utils/db.mjs";
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

app.get("/profiles", (req, res) => {
  return res.json({
    data: {
      name: "john",
      age: 20,
    },
  });
});

app.get("/posts", async (req, res) => {
  try {
    const result = await connectionPool.query("SELECT * FROM posts ");
    return res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server could not create post because database connection",
    });
  }
});

app.post("/posts", async (req, res) => {
  const newPost = req.body;
  try {
    const query = `insert into posts (title, image, category_id, description, content, status_id)
    values ($1, $2, $3, $4, $5, $6)`;
    const values = [
      newPost.title,
      newPost.image,
      newPost.category_id,
      newPost.description,
      newPost.content,
      newPost.status_id,
    ];
    await connectionPool.query(query, values);
    return res.status(201).json({ message: "Created post sucessfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Server could not create post because database connection",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
