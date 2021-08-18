'use strict'
const Response = use('App/Class/Response');
const User = use('App/Models/User');
const Token = use('App/Models/Token');
const Logger = use('Logger');
const Hash = use('Hash');
const randomstring = use('randomstring');
const Database = use('Database');
const __ = use('App/Helpers/string-localize');
const isUndefined = require("is-undefined");
const passwordStrength = require('check-password-strength');
const Encryption = use("Encryption");
const moment = require('moment')
const userSettings = { };

class AuthService {
  /*
    Login
  */
  async login(body, auth) {
    const {email, password, lang} = body.all();
    try {
      const user = await User.query().where('email', email).first();
      if (user) {
        if (user.is_verified == 1) {
          const isPasswordConfirmed = await Hash.verify(password, user.password);
          // generate token
          const token = await auth.generate(user);

          user.logged_in_at = moment().format('YYYY-MM-DD HH:mm:ss');
          await user.save();

          const isDefaultPassword = await Hash.verify('fikurinugraha', user.password);
          token.is_set_password = isDefaultPassword;

          // send email active package 
          if (user.promo_code && user.is_first_time_login) {
            await this.sendEmailActivePackage(user);
          }

          return new Response({ data: token });
        } else {
          return new Response({ message: __('A link to activate your account has been emailed to the address provided', lang) }, 422);
        }
      }
      return new Response({ message: __('Login failed, Invalid email or password', lang) }, 422);
    } catch (e) {
      Logger.transport('file').error('AuthService.login: ', e);
      return new Response({ message: __('Login failed, Invalid email or password', lang) }, 422);
    }
  }

  /**
   * Update profile user
   */
  async update(body, auth) {
    let lang = auth.current.user.language;
    try {

      const {
        email,
        payment,
        settings,
        timezone,
        language,
        name,
        phone,
        promo_code,
        is_receive_updates,
        is_spectator,
        picture
      } = body.all();
      let roles = body.input('roles');

      const user = auth.current.user; // get user data from auth session

      // if user want to change email
      if (email) {
        // check email from database
        const checkEmail = await User.query().where('email', email).whereNot('id', user.id).first()
        // if email has been used send error message
        if (checkEmail) return new Response({
          message: __('Email has been used', lang)
        }, 422)

        user.email = email;
      }

      if (roles) {
        roles = roles.replace(/\s+/g, '');
        user.roles = roles;
      }
      if (phone) user.phone = phone;
      if (name) user.name = name;
      if (payment) user.payment = payment;
      if (settings) {
        const newSetting = JSON.parse(settings);
        const oldSetting = JSON.parse(user.settings);
        newSetting.subscription = oldSetting.subscription;
        user.settings = JSON.stringify(newSetting);
      }
      if (timezone) user.timezone = timezone;
      if (promo_code) user.promo_code = promo_code;
      user.picture = picture ? picture.split('.com')[1] : null;
      if (!isUndefined(is_receive_updates)) user.is_receive_updates = is_receive_updates;
      if (!isUndefined(is_spectator)) user.is_spectator = is_spectator;
      if (language) {
        lang = language;
        user.language = language;
      }
      await user.save();

      // get new data user after updated
      const updatedUser = await User.query().where('id', user.id).with('createdBy').first();

      return new Response({
        message: __('Profile has been updated', lang),
        data: updatedUser
      })

    } catch (e) {
      Logger.transport('file').error('AuthService.update: ', e);
      return new Response({ message: __('Failed to update profile, please contact support', lang) }, 422);
    }
  }

  /**
   * This function allows user for register to website
   */
  async userRegister(body) {
    const lang = body.input('lang') ? body.input('lang') : 'en';
    const { name, email, password, phone, role } = body.all();

    // check weakness password
    const weakPassword = passwordStrength(password).value;
    if (weakPassword === 'Weak') return new Response({message: __('Your password is weak, please use a combination of letters and numbers', lang)}, 422);

    let user = await User.query().where('email', email).first();
    
    if (user && !user.deleted_at) return new Response({message: __('Email has been used', lang)}, 422);
    
    const trx = await Database.beginTransaction();
    try {
      if (!user) {
        user = new User();
        user.email = email;
        user.name = name;
        if (phone) user.phone = phone;
        user.password = password;
        user.is_verified = true;
        user.is_active = true;
        user.roles = JSON.stringify([role]);
        user.language = 'id';
        user.promo_code = '';
        user.is_receive_updates = 0;
        user.settings = JSON.stringify(userSettings);
        await user.save(trx);
        
        
      } else {
        
        user.email = email;
        user.name = name;
        if (phone) user.phone = phone;
        user.password = await Hash.make(password);
        user.is_verified = false;
        user.is_active = true;
        user.deleted_at = null;
        user.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
        user.promo_code = promo_code;
        user.is_receive_updates = is_receive_updates;
        user.roles = JSON.stringify(["client"]);
        user.settings = JSON.stringify(settings);
        await user.save(trx);

      }

      // create new token
      const tokens = new Token();
      tokens.token = randomstring.generate(20); // generate random token
      tokens.type = 'verify_account_email';
      tokens.user_id = user.id;
      await tokens.save(trx);

      await trx.commit();
      
      let message = 'New User Created';

      return new Response({ message: message });
    } catch (e) {
      await trx.rollback();
      Logger.transport('file').error('AuthService.userRegister: ', e);
      return new Response({ message: __('Failed to register your account, please contact support', lang) }, 422);
    }
  }

  /**
   * this function allows for change password
   */
  async changePassword(auth, body) {
    const lang = auth.current.user ? auth.current.user.language : 'en';
    try {
      const {old_password, new_password, confirm_password} = body.all();

      // Check weakness password
      const weakNewPassword = passwordStrength(new_password).value;
      const weakConfirmPassword = passwordStrength(confirm_password).value;
      if (weakNewPassword === 'Weak' || weakConfirmPassword === 'Weak') {
        return new Response({message: __('Your password is weak, please use a combination of letters and numbers', lang)}, 422);
      }

      // get current user
      const user = auth.current.user;

      const isDefaultPassword = await Hash.verify('fikurinugraha', user.password);

      if (!isDefaultPassword) {
        if (!old_password) return new Response({message: __('Please insert old password', lang)}, 422);
          // compare the old password with new password
          const checkPassword = await Hash.verify(old_password, user.password);

          // if not same betwen new password and old password send error message
          if (!checkPassword) return new Response({message: __('Old password is wrong', lang)}, 422);
      }

      // compare new password and confirmation password, if not same send error message
      if (new_password !== confirm_password) return new Response({message: __('New password and confirmation password not same', lang)}, 422);

      user.password = await Hash.make(new_password); // save new password to database with hash
      await user.save();

      return new Response({message: __('Change password has been successfully', lang)});
    } catch (e) {
      Logger.transport('file').error('AuthService.changePassword: ', e);
      return new Response({ message: __('Failed to change your password, please contact support', lang) }, 422);
    }
  }

}

module.exports = new AuthService()
