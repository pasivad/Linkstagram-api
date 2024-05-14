const multer = require('multer');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dlulwmnyq',
  api_key: '699374649318597',
  api_secret: 'ph2N9icvf-jEfJkl-Aa9Czx6BYs',
});

const memoryStorage = multer.memoryStorage();

const upload = multer({
  storage: memoryStorage,
});

const uploadToCloudinary = async (fileString, format) => {
  try {
    const { uploader } = cloudinary;

    const res = await uploader.upload(`data:image/${format};base64,${fileString}`);

    return res;
  } catch (error) {
    throw new ErrorHandler(500, error);
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
};
