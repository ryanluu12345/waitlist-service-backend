var AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });
var sns = new AWS.SNS();

const notifyUserToBeSeated = (phoneNumber, firstName) => {
  if (phoneNumber.slice(0, 2) !== "+1") {
    phoneNumber = "+1" + phoneNumber;
  }

  const params = {
    Message: firstName + ", please check in with the host to be seated!",
    MessageStructure: "string",
    PhoneNumber: phoneNumber
  };
  return sns.publish(params).promise();
};

module.exports = {
  notifyUserToBeSeated
};
