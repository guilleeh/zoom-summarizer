const AWS = require("aws-sdk");

s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const uploadFile = async (file) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: file.name,
    Body: file.data,
  };

  try {
    const stored = await s3.upload(params).promise();
    return stored;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

module.exports = {
  uploadFile,
};
