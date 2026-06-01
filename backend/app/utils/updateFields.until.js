function updateFields(target, payload, allowedFields) {
  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      target[key] = payload[key];
    }
  }
}

module.exports = updateFields;
