"use strict";

const AlamatScoring = use('App/Models/AlamatScoring');
const Response = use('App/Class/Response');
const Logger = use('Logger');
const Hash = use('Hash');
const __ = use('App/Helpers/string-localize');
const passwordStrength = require('check-password-strength');


class AlamatScoringService {
  /**
   * Get detail data user
   **/
  async getById(id, auth) {
    const language = auth.current.user.language;
    try {
      const alamatScoring = await AlamatScoring.query()
        .where('id', id)
        .first();

      return new Response({
        data: alamatScoring
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
        alamat_id,
        picture,
        nilai_akses,
        nilai_responsif,
        nilai_keamanan,
        total_sukses,
        kekurangan,
        kelebihan,
        score_total,
      } = body.all();

      // create new Alamat
      const alamat = new AlamatScoring();
      alamat.alamat_id = alamat_id;
      alamat.picture = picture;
      alamat.nilai_akses = nilai_akses;
      alamat.nilai_responsif = nilai_responsif;
      alamat.nilai_keamanan = nilai_keamanan;
      alamat.total_sukses = total_sukses;
      alamat.kekurangan = kekurangan;
      alamat.kelebihan = kelebihan;
      alamat.score_total = score_total;
      await alamat.save();

      // get new data alamat
      const createdAlamat =  await AlamatScoring.query().where('id', alamat.id).first();

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

module.exports = new AlamatScoringService();
