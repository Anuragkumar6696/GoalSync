const AuditLog = require('../models/AuditLog');

const logAction = async (user, action, resource, resourceId, oldValue, newValue) => {
  try {
    await AuditLog.create({
      user,
      action,
      resource,
      resourceId,
      oldValue,
      newValue,
    });
  } catch (err) {
    console.error('Audit Log Error:', err);
  }
};

module.exports = { logAction };
