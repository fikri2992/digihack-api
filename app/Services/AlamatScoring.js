"use strict";

const Alamat = use('App/Models/Alamat');
const Response = use('App/Class/Response');
const Logger = use('Logger');
const Hash = use('Hash');
const __ = use('App/Helpers/string-localize');
const passwordStrength = require('check-password-strength');


class AlamatService {
  /**
   * Get detail data user
   **/
  async getById(id, auth) {
    const language = auth.current.user.language;
    try {
      const alamat = await Alamat.query()
        .where('id', id)
        .first();

      return new Response({
        data: alamat
      });
    } catch (e) {
      Logger.transport('file').error('alamatService.getById: ', e);
      return new Response({
        message: __('Cant get alamat detail, please contact support', language)
      }, 422);
    }
  }
  

  /**
   * Function create alamat_scoring
  **/
  async create(body, auth) {
    const user = auth.current.user;
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
        message: 'Cant create Offer, please contact support'
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
