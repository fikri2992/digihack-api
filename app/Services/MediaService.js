"use strict";

const Media = use('App/Models/media');
const Response = use('App/Class/Response');
const Logger = use('Logger');
const Helpers = use('Helpers');
const Hash = use('Hash');
const __ = use('App/Helpers/string-localize');
const passwordStrength = require('check-password-strength');


class MediaService {
  /**
   * Get all media URL data
   **/
   async getAllImageUrl(body, auth) { //view all
    const language = auth.current.user.language;
    try {
      const {
        page,
        limit,
        order_by,
        sort_by
      } = body.all();

      let media = Media.query();

      if (order_by && sort_by) {
        media = media.orderBy(order_by, sort_by);
      } else {
        media = media.orderBy('created_at', 'asc');
      }

      media = await media.paginate(page, limit);

      return new Response(media);
    } catch (e) {
      Logger.transport('file').error('MediaService.getAllImageURL: ', e);
      return new Response({
        message: __('Cant image url(s), please contact support', language)
      }, 422);
    }
  }

  async upload (body, auth) {
    const language = auth.current.user.language;
    try {
      const { 
        user_id,
        interaction_id,
        offer_id,
        name,
        description,
        filetype
      } = body.all();
      console.log(user_id, filetype)
      let unix = Math.round(+new Date()/1000);
      const mediaNameFormat = unix+"-"+user_id+"."+filetype; 

      // create new media
      const media = new Media();
      media.user_id = user_id;
      media.interaction_id = interaction_id;
      media.offer_id = offer_id;
      media.name = name;
      media.description = description;
      media.url = mediaNameFormat;
      console.log(mediaNameFormat)
      await media.save();

      // get new media
      const createdMedia =  await Media.query().where('id', media.id).first();

      return new Response({
        message: 'File Uploaded',
        fileName: mediaNameFormat,
        data: createdMedia
      });
    } catch (e) {
      Logger.transport('file').error('MediaService.create: ', e);
      return new Response({
        message: 'Cant upload image, please contact support'
      }, 422);
    }
 }

  /**
   * Get media by user id
   **/
   async getImageUrlByUserId(id, body, auth) {
    const language = auth.current.user.language;
    try {
      const {
        page,
        limit,
        order_by,
        sort_by
      } = body.all();

      let media = Media.query();

      media = media.where('user_id', id);

      if (order_by && sort_by) {
        media = media.orderBy(order_by, sort_by);
      } else {
        media = media.orderBy('created_at', 'asc');
      }

      media = await media.paginate(page, limit);

      return new Response(media);
    } catch (e) {
      Logger.transport('file').error('MediaService.getImageUrlByUserId: ', e);
      return new Response({
        message: __('Cant image url(s), please contact support', language)
      }, 422);
    }
  }

  /**
   * Get media by interaction id
   **/
   async getImageUrlByInteractionId(id, body, auth) {
    const language = auth.current.user.language;
    try {
      const {
        page,
        limit,
        order_by,
        sort_by
      } = body.all();

      let media = Media.query();

      media = media.where('interaction_id', id);

      if (order_by && sort_by) {
        media = media.orderBy(order_by, sort_by);
      } else {
        media = media.orderBy('created_at', 'asc');
      }

      media = await media.paginate(page, limit);

      return new Response(media);
    } catch (e) {
      Logger.transport('file').error('MediaService.getImageUrlByInteractionId: ', e);
      return new Response({
        message: __('Cant image url(s), please contact support', language)
      }, 422);
    }
  }

  /**
   * Get media by offer id
   **/
   async getImageUrlByOfferId(id, body, auth) {
    const language = auth.current.user.language;
    try {
      const {
        page,
        limit,
        order_by,
        sort_by
      } = body.all();

      let media = Media.query();

      media = media.where('offer_id', id);

      if (order_by && sort_by) {
        media = media.orderBy(order_by, sort_by);
      } else {
        media = media.orderBy('created_at', 'asc');
      }

      media = await media.paginate(page, limit);

      return new Response(media);
    } catch (e) {
      Logger.transport('file').error('MediaService.getImageUrlByOfferId: ', e);
      return new Response({
        message: __('Cant image url(s), please contact support', language)
      }, 422);
    }
  }

  /*
      Delete Image
    */
    async delete(id, auth) {
      try {
        const media = await Media.query()
        .select('url')
        .where('id', id)
        .first();

        const url = media.toJSON();

        await Media.query().where('id', id).delete();
        return new Response({
          data: url,
          message: __('Media has been deleted') 
        })
      } catch (e) {
        Logger.transport('file').error('MediaService.delete: ', e)
        return new Response({ message: __('Cant delete media, please contact support') }, 422)
      }
    }
    
}

module.exports = new MediaService();
