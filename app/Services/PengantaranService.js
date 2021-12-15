"use strict";

const Pengantaran = use('App/Models/Pengantaran');
const Response = use('App/Class/Response');
const Logger = use('Logger');
const __ = use('App/Helpers/string-localize');

class PengantaranService {
  /**
   * Get detail data user
   **/
  async getById(id) {
    try {
      const Pengantaran = await Pengantaran.query()
        .where('id', id)
        .first();

      return new Response({
        data: Pengantaran
      });
    } catch (e) {
      Logger.transport('file').error('PengantaranService.getById: ', e);
      return new Response({
        message: __('Cant get Pengantaran detail, please contact support', 'id')
      }, 422);
    }
  }

    /**
     * Function create Pengantaran
    **/
    async create(body) {
      try {
        const { 
          alamat_id,
        } = body.all();
  
        // create new Pengantaran
        const pengantaran = new Pengantaran();
        pengantaran.alamat_id = alamat_id;
        pengantaran.is_sukses = 1;
        await pengantaran.save();
  
        // get new data Pengantaran
        const createdPengantaran =  await Pengantaran.query().where('id', pengantaran.id).first();
  
        return new Response({
          message: 'New Pengantaran has been created',
          data: createdPengantaran
        });
      } catch (e) {
        Logger.transport('file').error('PengantaranService.create: ', e);
        return new Response({
          message: 'Cant create Pengantaran, please contact support'
        }, 422);
      }
    }
  
    /*
      Delete Pengantaran
    */
    async delete(id, auth) {
      try {
        await Pengantaran.query().where('id', id).delete();
        return new Response({ message: __('Pengantaran has been deleted') })
      } catch (e) {
        Logger.transport('file').error('PengantaranService.delete: ', e)
        return new Response({ message: __('Cant delete message, please contact support') }, 422)
      }
    }
    
}

module.exports = new PengantaranService();
