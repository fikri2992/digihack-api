'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MediaSchema extends Schema {
  up () {
    this.create('media', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('Users');
      table.integer('offer_id').nullable();
      table.integer('interaction_id').nullable();
      table.string('name', 255).nullable();
      table.text('description').nullable();
      table.text('url').nullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('media')
  }
}

module.exports = MediaSchema
