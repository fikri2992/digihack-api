'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserInteractionSchema extends Schema {
  up () {
    this.create('user_interactions', (table) => {
      table.increments()
      table.integer('interaction_id').unsigned().references('id').inTable('interactions');
      table.string('phone', 20).nullable();
      table.string('content').text().nullable();
      table.integer('price').nullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('user_interactions')
  }
}

module.exports = UserInteractionSchema
