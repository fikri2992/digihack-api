"use strict";

const Offer = use('App/Models/Offer');
const Response = use('App/Class/Response');
const Logger = use('Logger');
const Hash = use('Hash');
const __ = use('App/Helpers/string-localize');
const passwordStrength = require('check-password-strength');


class OfferService {
  /**
   * Get all data Offer
   **/
  async getAll(body, auth) { //view all
    const language = auth.current.user.language;
    try {
      const {
        page,
        limit,
        order_by,
        sort_by,
        keyword
      } = body.all();

      let offer = Offer.query();

      if (keyword) {
        offer = offer.where(function () {
            this.orWhere('name', 'like', '%' + keyword + '%')
          })
        }

      if (order_by && sort_by) {
        offer = offer.orderBy(order_by, sort_by);
      } else {
        offer = offer.orderBy('created_at', 'asc');
      }

      offer = await offer.paginate(page, limit);

      return new Response(offer);
    } catch (e) {
      Logger.transport('file').error('OfferService.getAll: ', e);
      return new Response({
        message: __('Cant get data user, please contact support', language)
      }, 422);
    }
  }

  /**
   * Get detail data user
   **/
  async getById(id, auth) {
    const language = auth.current.user.language;
    try {
      const offer = await Offer.query()
        .where('id', id)
        .first();

      return new Response({
        data: offer
      });
    } catch (e) {
      Logger.transport('file').error('OfferService.getById: ', e);
      return new Response({
        message: __('Cant get offer detail, please contact support', language)
      }, 422);
    }
  }

  /**
   * Get offer detail by interaction ID
   **/
   async getByInteractionId(id, body, auth) {
    const language = auth.current.user.language;
    try {
      const {
        page,
        limit,
        order_by,
        sort_by
      } = body.all();

      let offer = Offer.query();

      offer = offer.where('interaction_id', id);

      if (order_by && sort_by) {
        offer = offer.orderBy(order_by, sort_by);
      } else {
        offer = offer.orderBy('created_at', 'asc');
      }

      offer = await offer.paginate(page, limit);

      return new Response(offer);
    } catch (e) {
      Logger.transport('file').error('OfferService.getByInteractionId: ', e);
      return new Response({
        message: __('Cant get offer detail, please contact support', language)
      }, 422);
    }
  }

    /**
   * Function get detail data offer base on slug
  **/
    async getBySlug(slug) {
      try {
        // get data offer from table categories base on slug
        const offer = await Offer.query().where('slug', slug).first();

        // if offer is not exist, then send error message
        if (!offer) return new Response({
          message: 'offer not found'
        }, 422);

        return new Response({
          data: offer
        });
      } catch (e) {
        Logger.transport('file').error('OfferService.getBySlug: ', e);
        return new Response({
          message: 'Cant get detail offer, please contact support'
        }, 422);
      }
    }
  
    /**
     * Function create offer
    **/
    async create(body, auth) {
      const user = auth.current.user;

      try {
        const { 
          user_id, 
          interaction_id, 
          name, 
          description, 
          type, 
          content, 
          status,
          is_published,
          created_by } = body.all();
  
        // create new offer
        const offer = new Offer();
        offer.user_id = user_id;
        offer.interaction_id = interaction_id;
        offer.name = name;
        offer.description = description;
        offer.type = type;
        offer.status = status;
        offer.content = content;
        offer.is_published = is_published;
        offer.created_by = created_by;
        await offer.save();
  
        // get new data offer
        const createdOffer =  await Offer.query().where('id', offer.id).first();
  
        return new Response({
          message: 'New Offer has been created',
          data: createdOffer
        });
      } catch (e) {
        Logger.transport('file').error('OfferService.create: ', e);
        return new Response({
          message: 'Cant create Offer, please contact support'
        }, 422);
      }
    }
  
    /**
     * Function create offer
    **/
    async update(id, body, auth) {
      const user = auth.current.user;
      try {
        const {
          user_id,
          interaction_id, 
          name, 
          description, 
          type, 
          content, 
          status,
          is_published,
          created_by
        } = body.all();

        const offer = await Offer.find(id); // get data offer base on id

        // if offer not exist, then send error message
        if (!offer) return new Response({
          message: 'offer not found'
        }, 422);

        // check new value, if value not null/empty change value from database with new value
        if (user_id)  offer.user_id = user_id; 
        if (interaction_id)  offer.interaction_id = interaction_id; 
        if (name)  offer.name = name; 
        if (description)  offer.description = description; 
        if (type)  offer.type = type; 
        if (content)  offer.content = content; 
        if (status)  offer.status = status; 
        if (is_published)  offer.is_published = is_published; 
        if (created_by)  offer.created_by = created_by; 
        
        await offer.save();

        // get new data offer base on id after updated successfully
        const updatedOffer =  await Offer.query().where('id', offer.id).first();

        return new Response({
          message: 'New offer has been updated',
          data: updatedOffer
        });
      } catch (e) {
        Logger.transport('file').error('OfferService.create: ', e);
        return new Response({
          message: 'Cant create offer, please contact support'
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

module.exports = new OfferService();
