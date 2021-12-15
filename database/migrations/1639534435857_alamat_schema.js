'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlamatSchema extends Schema {
  up () {
    this.create('alamats', (table) => {
      table.increments()
      table.text('detail').nullable();
      table.string('nama_penerima', 50).nullable();
      table.string('no_hp', 20).nullable();
      table.string('kode_pos', 8).nullable();
      table.string('kecamatan', 50).nullable();
      table.string('kota', 50).nullable();
      table.string('rt', 4).nullable();
      table.string('rw', 4).nullable();
      table.string('patokan', 50).nullable();
      table.integer('created_by_id').nullable();
      table.datetime('deleted_at').nullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('alamats')
  }
}

module.exports = AlamatSchema
