import express from "express";
import connectionPool from "../utils/db.mjs";
import { validateCreatePostData } from "../middlewares/post.validation.mjs";

const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
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

postRouter.get("/:postId", async (req, res) => {
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

postRouter.post("/", [validateCreatePostData], async (req, res) => {
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

postRouter.put("/:postId", [validateCreatePostData], async (req, res) => {
  const getPostId = req.params.postId;
  const { title, image, category_id, description, content, status_id } =
    req.body;

  try {
    const checkPost = await connectionPool.query(
      `select * from posts where id = $1`,
      [getPostId],
    );
    if (checkPost.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Server could not find a requested post to update" });
    }

    const query = `update posts set title = $1, image = $2, category_id = $3, description = $4, content = $5, status_id = $6 where id = $7`;
    const values = [
      title,
      image,
      category_id,
      description,
      content,
      status_id,
      getPostId,
    ];
    await connectionPool.query(query, values);

    return res.status(200).json({ message: "Updated post successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Server could not update post because database connection",
    });
  }
});

postRouter.delete("/:postId", async (req, res) => {
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

export default postRouter;
