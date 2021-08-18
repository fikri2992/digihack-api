'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class InteractionSchema extends Schema {
  up () {
    this.create('interactions', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.string('name', 255).nullable();
      table.string('slug', 255).nullable();
      table.text('description').nullable();
      table.string('type', 100).nullable();
      table.text('content').nullable();
      table.string('status', 100).nullable();
      table.boolean('is_published').defaultTo(false);
      table.integer('created_by').unsigned();
      table.timestamps()
    })
  }

  down () {
    this.drop('interactions')
  }
}

module.exports = InteractionSchema
