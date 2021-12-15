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
    async create(body) {
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
        const alamatScoring = new AlamatScoring();
        alamatScoring.alamat_id = alamat_id;
        alamatScoring.picture = picture;
        alamatScoring.nilai_akses = nilai_akses;
        alamatScoring.nilai_responsif = nilai_responsif;
        alamatScoring.nilai_keamanan = nilai_keamanan;
        alamatScoring.total_sukses = total_sukses;
        alamatScoring.kekurangan = kekurangan;
        alamatScoring.kelebihan = kelebihan;
        // let totalKekurangan = 0;
        // let totalKelebihan = 0;
        // if (kelebihan) totalKelebihan = kelebihan.reduce((partial_sum, a) => parseInt(partial_sum) + parseInt(a), 0);
        // if (kekurangan) totalKekurangan = kekurangan.reduce((partial_sum, a) => parseInt(partial_sum) + parseInt(a), 0);
        // const nilaiTotal = nilai_akses+ nilai_responsif+ nilai_keamanan + (kekurangan*-1) + kelebihan
        alamatScoring.score_total = score_total;
        await alamatScoring.save();

        // get new data alamatScoring
        const createdAlamat =  await AlamatScoring.query().where('id', alamatScoring.id).first();

        return new Response({
          message: 'New Alamat has been created',
          data: createdAlamat
        });
      } catch (e) {
        Logger.transport('file').error('AlamatService.create: ', e);
        return new Response({
          message: 'Cant create AlamatScoring, please contact support'
        }, 422);
      }
    }
    /*
      Delete alamat scoring
    */
    async delete(id) {
      try {
        await AlamatScoring.query().where('id', id).delete();
        return new Response({ message: __('AlamatScoring has been deleted') })
      } catch (e) {
        Logger.transport('file').error('AlamatScoringService.delete: ', e)
        return new Response({ message: __('Cant delete message, please contact support') }, 422)
      }
    }
    
}

module.exports = new AlamatScoringService();
