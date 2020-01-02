const uuidv4 = require('uuid/v4');
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const updateWaitlistStatus = (id, status) => {
  const params = {
    TableName: process.env.WAITLIST_TABLE,
    Key: {
      id
    },
    UpdateExpression: "set #newStatus = :newStatus",
    ExpressionAttributeNames: {
      "#newStatus": "Status"
    },
    ExpressionAttributeValues:{
      ":newStatus": status
    },
    ReturnValues:"UPDATED_NEW"
  };

  return dynamoDB.update(params).promise();
}

const getWaitlistDetail = (id) => {
  const params = {
    TableName: process.env.WAITLIST_TABLE,
    Key: {
      id: id,
    },
  };

  return dynamoDB.get(params).promise();
}

const getAllFromWaitlist = (restaurant) => {
  const params = {
    TableName: process.env.WAITLIST_TABLE,
    IndexName: "Restaurant-CreatedAt-index",
    KeyConditionExpression: "Restaurant = :rest",
    ExpressionAttributeValues: {
        ":rest": restaurant,
    }
  }

  return dynamoDB.query(params).promise();
}

const addToWaitlist = (reqBody) => {
  const { firstName, lastName, phoneNumber, partySize, restaurant } = reqBody;

  const timestamp = new Date().getTime();

  const waitlistedItem = {
    id: uuidv4(),
    CreatedAt: timestamp,
    UpdatedAt: timestamp,
    FirstName: firstName,
    LastName: lastName,
    PhoneNumber: phoneNumber,
    PartySize: partySize,
    Restaurant: restaurant,
    Status: {
      queued: 1,
      called: 0,
      seated: 0,
    }
  };

  const waitlistedInfo = {
    TableName: process.env.WAITLIST_TABLE,
    Item: waitlistedItem
  }

  return dynamoDB.put(waitlistedInfo).promise();
}

module.exports = {
  updateWaitlistStatus,
  getWaitlistDetail,
  getAllFromWaitlist,
  addToWaitlist
};