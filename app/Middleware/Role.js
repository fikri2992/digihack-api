'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Role {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response, auth }, next, schemes) {
    const user = auth.current.user;

    // convert to json
    const roles = JSON.parse(user.roles);
    let isRole = false;
    for (let i=0; i<schemes.length; i++) {
      const findRole = roles.indexOf(schemes[i]);
      if (findRole >= 0) {
        isRole = true;
      }
    }

    if (!isRole) { // for dummies only
      return response.unauthorized({ message: "You can't access to this request." });
    }

    // call next to advance the request
    await next();
  }
}

module.exports = Role
