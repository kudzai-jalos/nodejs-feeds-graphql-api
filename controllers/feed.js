exports.getPosts = (req, res, next) => {
  res.status(200).json({
    title: "First post",
    content: "This is the first post.",
  });
};

exports.createPost = (req, res, next) => {
  const { title, content } = req.body;
  console.log(title)
  // Store in database
  // res.status()
  res.status(201).json({
    message: "Post created successfully",
    post: { id: new Date().toISOString(), title, content },
  });
};
