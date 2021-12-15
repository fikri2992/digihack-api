'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PengantaranSchema extends Schema {
  up () {
    this.create('pengantarans', (table) => {
      table.increments()
      table.integer('alamat_id').unsigned().references('id').inTable('alamats');
      table.integer('is_sukses').nullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('pengantarans')
  }
}

module.exports = PengantaranSchema
