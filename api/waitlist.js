'use strict';
const waitlistDBHelpers = require('controllers/waitlist-controller');

const errorResponse = (msg) =>{
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: msg,
    },
    null,
    2)
  }
} 

const successResponse = (msg, data) =>{
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: msg,
      data: data,
    },
    null,
    2)
  }
}

module.exports.put = async event => {
  try {
    const id = event.pathParameters.id;
    const status = JSON.parse(event.body).status;
    const updatedWaitlistEntry = await waitlistDBHelpers.updateWaitlistStatus(id, status);
    return successResponse('Retrieved from database!', updatedWaitlistEntry);
  } catch (error) {
    return errorResponse('Failed to get detailed information from the database!');
  }
}

module.exports.get = async event => {
  try {
    const id = event.pathParameters.id;
    const waitlistDetailData = await waitlistDBHelpers.getWaitlistDetail(id);
    return successResponse('Retrieved from database!', waitlistDetailData);
  } catch (error) {
    return errorResponse('Failed to get detailed information from the database!');
  }
}

module.exports.getAll = async event => {
  try {
    const allWaitlistData = await waitlistDBHelpers.getAllFromWaitlist('Tasty Garden');
    return successResponse('Retrieved from database!', allWaitlistData);
  } catch (error) {
    return errorResponse('Failed to get from the database!');
  }
}

module.exports.add = async event => {
  const reqBody = JSON.parse(event.body);
  const { firstName, lastName, phoneNumber, partySize, restaurant } = reqBody;

  //Type checks
  if (typeof firstName !== 'string' || typeof lastName !== 'string' || typeof phoneNumber !== 'string' || typeof partySize !== 'number' || typeof restaurant !== 'string') {
    return errorResponse('Failed to add to the waitlist because of data input errors!');
  }

  try {
    const waitlistInfo = await waitlistDBHelpers.addToWaitlist(reqBody);
    return successResponse('Added to the waitlist!', waitlistInfo);
  } catch (error) {
    return errorResponse('Failed to add to the waitlist because of database error!');
  }
};

