export const validateCreatePostData = (req, res, next) => {
  const { title, image, category_id, description, content, status_id } =
    req.body;
  if (!title || typeof title !== "string") {
    return res
      .status(400)
      .json({ message: "Title is required and must be a string" });
  }
  if (!image || typeof image !== "string") {
    return res
      .status(400)
      .json({ message: "Image is required and must be a string" });
  }

  if (!category_id || typeof category_id !== "number") {
    return res
      .status(400)
      .json({ message: "Category ID is required and must be a number" });
  }

  if (!description || typeof description !== "string") {
    return res
      .status(400)
      .json({ message: "Description is required and must be a string" });
  }

  if (!content || typeof content !== "string") {
    return res
      .status(400)
      .json({ message: "Content is required and must be a string" });
  }

  if (!status_id || typeof status_id !== "number") {
    return res
      .status(400)
      .json({ message: "Status ID is required and must be a number" });
  }

  next();
};
