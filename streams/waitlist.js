var AWS = require("aws-sdk");
AWS.config.region = "us-west-2";
var sns = new AWS.SNS();

const errorResponse = msg => {
  return {
    statusCode: 500,
    body: JSON.stringify(
      {
        message: msg
      },
      null,
      2
    ),
    headers: { "Access-Control-Allow-Origin": "*" }
  };
};

const successResponse = (msg, data) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: msg,
        data: data
      },
      null,
      2
    ),
    headers: { "Access-Control-Allow-Origin": "*" }
  };
};

module.exports.process = (event, context, callback) => {
  event.Records.forEach(record => {
    if (record.eventName == "INSERT") {
      let phoneNum = String(record.dynamodb.NewImage.PhoneNumber.S);
      const restaurant = record.dynamodb.NewImage.Restaurant.S;
      const partySize = record.dynamodb.NewImage.PartySize.N;

      if (phoneNum.slice(0, 2) !== "+1") {
        phoneNum = "+1" + phoneNum;
      }

      const params = {
        Message:
          "Your party of " +
          partySize +
          " has been added to the waitlist at " +
          restaurant,
        MessageStructure: "string",
        PhoneNumber: phoneNum
      };

      sns.publish(params, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(
            "Results from sending message: ",
            JSON.stringify(data, null, 2)
          );
          context.succeed("Done!");
        }
      });
    }
  });
  callback(null, "done");
};
