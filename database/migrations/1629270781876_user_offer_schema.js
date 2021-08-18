'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserOfferSchema extends Schema {
  up () {
    this.create('user_offers', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('user_offers')
  }
}

module.exports = UserOfferSchema
