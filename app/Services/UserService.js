"use strict";

const User = use('App/Models/User');
const Response = use('App/Class/Response');
const Logger = use('Logger');
const Database = use('Database');
const Hash = use('Hash');
const __ = use('App/Helpers/string-localize');
const passwordStrength = require('check-password-strength');


class UserService {
  /**
   * Get all data user
   **/
  async getAll(body, auth) {
    const language = auth.current.user.language;
    try {
      const {
        page,
        limit,
        role,
        is_verified,
        order_by,
        sort_by,
        keyword
      } = body.all();

      let users = User.query();
      if (role) users = users.where('roles', 'like', '%' + role + '%');
      if (is_verified) users = users.where('is_verified', is_verified);

      if (keyword) {
        users = users.where(function () {
            this.where('email', 'like', '%' + keyword + '%')
            this.orWhere('name', 'like', '%' + keyword + '%')
          })
        }

      if (order_by && sort_by) {
        users = users.orderBy(order_by, sort_by);
      } else {
        users = users.orderBy('created_at', 'asc');
      }

      users = await users.paginate(page, limit);

      return new Response(users);
    } catch (e) {
      Logger.transport('file').error('UserService.getAll: ', e);
      return new Response({
        message: __('Cant get data user, please contact support', language)
      }, 422);
    }
  }

  /**
   * Get detail data user
   **/
  async getById(id, auth) {
    const language = auth.current.user.language;
    try {
      const user = await User.query()
        .where('id', id)
        .first();

      return new Response({
        data: user
      });
    } catch (e) {
      Logger.transport('file').error('UserService.getById: ', e);
      return new Response({
        message: __('Cant get detail user, please contact support', language)
      }, 422);
    }
  }

  /**
   * Force update password
   **/
  async forceUpdatePassword(body, id, auth) {
    const language = auth.current.user.language;
    try {
      const password = body.input('password');

      const weakPassword = passwordStrength(password).value;
      if (weakPassword === 'Weak') return new Response({message: __('Your password is weak, please use a combination of letters and numbers', language)}, 422);

      const user = await User.query().where('id', id).first();
      if (!user) return new Response({message: __('User not found', language)}, 404);

      user.password = await Hash.make(password);
      await user.save();

      return new Response({message: __('User password has been updated', language)});
    } catch (e) {
      Logger.transport('file').error('UserService.forceUpdatePassword: ', e)
      return new Response({
        message: __('Cant force update user password, please contact support', language)
      }, 422)
    }
  }
  
}

module.exports = new UserService();
