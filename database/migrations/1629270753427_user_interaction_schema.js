'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserInteractionSchema extends Schema {
  up () {
    this.create('user_interactions', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('user_interactions')
  }
}

module.exports = UserInteractionSchema
