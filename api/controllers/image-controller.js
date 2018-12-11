const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDIFY_NAME,
  api_key: process.env.CLOUDIFY_API_KEY,
  api_secret: process.env.CLOUDIFY_API_SECRET,
});

const ImageController = {};

ImageController.uploadImage = async (req, res) => {
  const { path } = Object.values(Object.values(req.files)[0])[0];
  cloudinary.uploader.upload(path).then(image => res.json([image]));
};

module.exports = ImageController;
