'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserOfferSchema extends Schema {
  up () {
    this.create('user_offers', (table) => {
      table.increments()
      table.integer('interaction_id').unsigned().references('id').inTable('interactions');
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.integer('client_id').unsigned();
      table.text('content').nullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('user_offers')
  }
}

module.exports = UserOfferSchema
