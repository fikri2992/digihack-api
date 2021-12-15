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
      // console.log(alamats)
      let sumNilaiAkses = 0;
      let avgNilaiAkses = 0;
      let sumNilaiRespon = 0;
      let avgNilaiRespon = 0;
      let sumNilaiKeamanan = 0;
      let avgNilaiKeamanan = 0;
      let kekurangans = []
      let kelebihans = []
      let totalSukses = 0;
      let pictures = []
      for (let index = 0; index < alamats.length; index++) {
        const element = alamats[index];
        sumNilaiAkses += element.nilai_akses;
        sumNilaiRespon += element.nilai_responsif;
        sumNilaiKeamanan += element.nilai_keamanan;
        kekurangans.push(element.kekurangan)
        kelebihans.push(element.kelebihan)
        pictures.push(element.picture)
      }
      avgNilaiAkses = sumNilaiAkses /alamats.length
      avgNilaiRespon = sumNilaiRespon /alamats.length
      avgNilaiKeamanan = sumNilaiKeamanan /alamats.length
      totalSukses = Math.max.apply(Math, alamats.map(function(o) { return o.total_sukses; }))
      kekurangans = kekurangans.filter((v,i) => kekurangans.indexOf(v) == i)
      kekurangans = JSON.parse(kekurangans);
      kelebihans = kelebihans.filter((v,i) => kelebihans.indexOf(v) == i)
      kelebihans = JSON.parse(kelebihans);
      
      const data = {
        pictures,
        avg_nilai_akses: avgNilaiAkses,
        avg_nilai_responsif: avgNilaiRespon,
        avg_nilai_keamanan: avgNilaiKeamanan,
        max_total_sukses: totalSukses,
        kekurangans,
        kelebihans,
       }
      return new Response({
        data: data
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
