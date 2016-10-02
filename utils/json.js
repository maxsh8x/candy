"use strict";

const getResponse = (dbObject, fields) => {
  const rawObject = dbObject.toObject();
  let filteredObject = {};
  Object.keys(rawObject).forEach(field => {
    if (fields.indexOf(field) !== -1) {
      filteredObject[field] = rawObject[field];
    }
  });
  return filteredObject;
};

module.exports = {getResponse};
