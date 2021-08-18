'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OfferSchema extends Schema {
  up () {
    this.create('offers', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.integer('client_id').unsigned();
      table.integer('interaction_id').unsigned().references('id').inTable('interactions');
      table.string('name', 255).nullable();
      table.string('slug', 255).nullable();
      table.text('description').nullable();
      table.string('type', 100).nullable();
      table.text('content').nullable();
      table.string('status', 100).nullable();
      table.boolean('is_published').defaultTo(false);
      table.integer('price').nullable();
      table.integer('created_by').unsigned().nullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('offers')
  }
}

module.exports = OfferSchema
