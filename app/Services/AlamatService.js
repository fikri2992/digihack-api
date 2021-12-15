"use strict";

const Alamat = use('App/Models/Alamat');
const AlamatScoring = use('App/Models/AlamatScoring');
const Database = use('Database');

const Response = use('App/Class/Response');
const Logger = use('Logger');
const __ = use('App/Helpers/string-localize');

class AlamatService {
  /**
   * Get detail data user
   **/
  async getById(id) {
    try {
      const alamats = await Database
        .from('alamat_scorings')
        .where('alamat_id', id)
        .orderBy('id', 'asc')
        .limit(10)
      console.log(alamats)
      return new Response({
        data: alamats
      });
    } catch (e) {
      Logger.transport('file').error('alamatService.getById: ', e);
      return new Response({
        message: __('Cant get alamat detail, please contact support', 'id')
      }, 422);
    }
  }


    /**
     * Function create alamat
    **/
    async create(body) {
      try {
        const { 
          detail,
          nama_penerima,
          no_hp,
          kode_pos,
          kecamatan,
          kota,
          rt,
          rw,
          patokan,
        } = body.all();
  
        // create new Alamat
        const alamat = new Alamat();
        alamat.detail = detail;
        alamat.nama_penerima = nama_penerima;
        alamat.no_hp = no_hp;
        alamat.kode_pos = kode_pos;
        alamat.kecamatan = kecamatan;
        alamat.kota = kota;
        alamat.rt = rt;
        alamat.rw = rw;
        alamat.patokan = patokan;
        await alamat.save();
  
        // get new data alamat
        const createdAlamat =  await Alamat.query().where('id', alamat.id).first();
  
        return new Response({
          message: 'New Alamat has been created',
          data: createdAlamat
        });
      } catch (e) {
        Logger.transport('file').error('AlamatService.create: ', e);
        return new Response({
          message: 'Cant create Alamat, please contact support'
        }, 422);
      }
    }
  
    /*
      Delete Offer
    */
    async delete(id, auth) {
      try {
        await Offer.query().where('id', id).delete();
        return new Response({ message: __('Offer has been deleted') })
      } catch (e) {
        Logger.transport('file').error('OfferService.delete: ', e)
        return new Response({ message: __('Cant delete message, please contact support') }, 422)
      }
    }
    
}

module.exports = new AlamatService();
