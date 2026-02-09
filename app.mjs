import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectionPool from "./utils/db.mjs";
import { validateCreatePostData } from "./middlewares/post.validation.mjs";
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
    const result = await connectionPool.query(
      `select posts.*, categories.name as category from posts left join categories on posts.category_id = categories.id`,
    );
    return res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server could not create post because database connection",
    });
  }
});

app.get("/posts/:postId", async (req, res) => {
  const getPostId = req.params.postId;
  try {
    const result = await connectionPool.query(
      `select posts.*, categories.name as category from posts left join categories on posts.category_id = categories.id where posts.id = $1`,
      [getPostId],
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Server could not find a requested post" });
    }
    return res.status(200).json({
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
});

app.post("/posts", [validateCreatePostData], async (req, res) => {
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

app.put("/posts/:postId", [validateCreatePostData], async (req, res) => {
  const getPostId = req.params.postId;
  const { title, image, category_id, description, content, status_id } =
    req.body;
  const upDatedContent = { ...req.body };
  if (
    !title ||
    !image ||
    !category_id ||
    !description ||
    !content ||
    !status_id
  ) {
    return res
      .status(404)
      .json({ message: "Server could not find a requested post to update" });
  }
  try {
    const result = await connectionPool.query(`update`);
  } catch (error) {
    return res.status(500).json({
      message: "Server could not update post because database connection",
    });
  }
});

app.delete("/posts/:postId", async (req, res) => {
  const getPostId = req.params.postId;

  try {
    const checkPost = await connectionPool.query(
      `select * from posts where id =$`,
      [getPostId],
    );
    if (checkPost.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Server could not find a requested post" });
    }
    const result = await connectionPool.query(
      `delete from posts where id =$1`,
      [getPostId],
    );
    return res.status(200).json({ message: "Deleted post sucessfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Server could not delete post because database connection",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

export default app;
