const Keygrip = require("keygrip");
module.exports = (user) => {
  const Buffer = require('safe-buffer').Buffer;
  const sessionObject = {passport: {user: user._id}};
  const session = Buffer.from(
			JSON.stringify(sessionObject)
		).toString('base64');
  const keygrip = new Keygrip(["helloworld"]);
  const sig = keygrip.sign('session=' + session);
  return {
    session,
    sig
  };
};
