'use strict'
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Interaction extends Model {
    static boot () {
        super.boot()
    
        this.addTrait('@provider:Lucid/Slugify', {
          fields: { slug: 'name' },
          strategy: 'dbIncrement',
          disableUpdates: true
        });
    
        // this.addTrait('@provider:Lucid/SoftDeletes');
      }
  
}

module.exports = Interaction
