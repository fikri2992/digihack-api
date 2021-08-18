'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('email', 254).notNullable().unique();
      table.string('password', 60).notNullable();
      table.string('name', 255).nullable();
      table.string('phone', 20).nullable();
      table.string('timezone', 100).nullable();
      table.string('roles', 254).nullable();
      table.string('language', 10).nullable();
      table.text('payment').nullable();
      table.text('settings').nullable();
      table.text('picture').nullable();
      table.string('customer_id', 100).nullable();
      table.string('promo_code', 100).nullable();
      table.boolean('is_receive_updates').defaultTo(1);
      table.boolean('is_verified').defaultTo(0);
      table.boolean('is_active').defaultTo(0);
      table.datetime('logged_in_at').nullable();
      table.datetime('logged_out_at').nullable();
      table.integer('created_by_id').nullable();
      table.datetime('deleted_at').nullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
