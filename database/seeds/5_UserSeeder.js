'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use("App/Models/User");

class UserSeeder {
  async run () {
    // Client
    const user2 = new User();
    user2.email = "client@mail.com";
    user2.password = "asdfasdf";
    user2.phone = '62857232323';
    user2.roles = JSON.stringify(['client']);
    user2.is_verified = true;
    user2.is_active = true;
    user2.language = 'en';
    user2.name = 'Bruce Banner';
    user2.settings = JSON.stringify({});
    await user2.save();

    // user
    const user3 = new User();
    user3.email = "user@mail.com";
    user3.password = "asdfasdf";
    user3.phone = '62857232324';
    user3.roles = JSON.stringify(['user']);
    user3.is_verified = true;
    user3.is_active = true;
    user3.language = 'en';
    user3.name = 'Hawk Eyes';
    user3.settings = JSON.stringify({});
    await user3.save();
    // super admin

    const user1 = new User();
    user1.email = "superadmin@mail.com";
    user1.password = "asdfasdf";
    user1.phone = '62857212121';
    user1.roles = JSON.stringify(['super_admin']);
    user1.is_verified = true;
    user1.is_active = true;
    user1.language = 'en';
    user1.name = 'Tony Stark';
    user1.settings = JSON.stringify({});
    await user1.save();
  }
}

module.exports = UserSeeder
