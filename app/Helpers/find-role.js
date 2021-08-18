'use strict'

const Antl = use('Antl')

module.exports = (user, role) => {
  try {
    const roles = JSON.parse(user.roles);
    const findRole = roles.indexOf(role);
    if (findRole < 0) {
      return false;
    } else {
      return true;
    }
  } catch(error) {
    return false;
  }
}