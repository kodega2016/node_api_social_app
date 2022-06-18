const asyncHandler = require("../middleware/asyncHandler");
const Post = require("../models/post");
const ErrorResponse = require("../utils/ErrorResponse");

exports.index = async (req, res, next) => {
  const results = await Post.find()
    .populate("user", "name _id")
    .sort("-createdAt")
    .exec();
  res.status(200).json({
    success: true,
    message: "Posts fetched successfully",
    data: results,
  });
};

exports.show = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate("user", "name _id");
  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: post,
    message: "Post fetched successfully",
  });
});

exports.save = asyncHandler(async (req, res, next) => {
  const { title, body } = req.body;

  let file;
  if (req.files.file) {
    file = await uploadFile(req.files.file, next);
  }

  const post = await Post.create({
    title,
    body,
    user: req.user.id,
    photo: file,
  });

  res.status(200).json({
    success: true,
    message: "Post saved successfully",
    data: post,
  });
});

exports.update = asyncHandler(async (req, res) => {
  const { title, body } = req.body;

  let post = await Post.findById(req.params.id);

  //check if the user is the owner of the post
  if (post.user.toString() !== req.user.id) {
    return next(new ErrorResponse("Not authorized to update this post", 401));
  }

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id ${req.params.id}`, 404)
    );
  }

  let file;
  if (req.files.file) {
    file = await uploadFile(req.files.file, next);
  }

  post = await Post.findByIdAndUpdate(req.params.id, {
    title,
    body,
    photo: file || post.photo,
  });

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    data: post,
  });
});

exports.destroy = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id ${req.params.id}`, 404)
    );
  }

  //check if the user is the owner of the post
  if (post.user.toString() !== req.user.id) {
    return next(new ErrorResponse("Not authorized to delete this post", 401));
  }

  await post.delete();

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
    data: null,
  });
});

const uploadFile = async (file, next) => {
  //check if req has file
  if (!file) {
    return next(new ErrorResponse("Please upload a file", 400));
  }

  //check if file is an image
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    return next(new ErrorResponse("Please upload a valid image", 400));
  }

  //check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //create custom file name
  const customFileName = `${new Date().toISOString()}-${file.name}`;
  //move file to public/uploads
  try {
    await file.mv(`public/uploads/${customFileName}`);
    return customFileName;
  } catch (err) {
    return next(new ErrorResponse("Problem with file upload", 500));
  }
};
