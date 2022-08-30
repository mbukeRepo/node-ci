const AWS = require('aws-sdk');
const keys = require("../config/keys");
const util = require("util");
const uuid = require("uuid/v1");
const requireLogin = require("../middlewares/requireLogin");

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
  region: "ap-south-1"
});


// myUserId/name-of-file.jpg
// myUserId will be a folder
module.exports = app => {
  app.get("/api/upload", requireLogin, async(req, res, next) => {
     const key = `${req.user.id}/${uuid()}.jpeg`;
     s3.getSignedUrl(
	"putObject", 
	{Bucket: keys.bucket, ContentType: "image/jpeg", Key:key }, 
        (err, url) => res.send({key, url})
     );
  });
}
