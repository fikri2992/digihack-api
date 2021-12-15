'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlamatScoringSchema extends Schema {
  up () {
    this.create('alamat_scorings', (table) => {
      table.increments()
      table.integer('alamat_id').unsigned().references('id').inTable('alamats');
      table.text('picture').nullable();
      table.integer('nilai_akses').nullable();
      table.integer('nilai_responsif').nullable();
      table.integer('nilai_keamanan').nullable();
      table.integer('total_sukses').nullable();
      table.text('kekurangan').nullable();
      table.text('kelebihan').nullable();
      table.integer('score_total').nullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('alamat_scorings')
  }
}

module.exports = AlamatScoringSchema
