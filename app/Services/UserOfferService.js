"use strict";

const UserOffer = use('App/Models/UserOffer');
const Response = use('App/Class/Response');
const Logger = use('Logger');
const Hash = use('Hash');
const __ = use('App/Helpers/string-localize');
const passwordStrength = require('check-password-strength');


class UserOfferService {
  /**
   * Get all User Offer data
   **/
  async getAll(body, auth) { //view all
    const language = auth.current.user.language;
    try {
      const {
        page,
        limit,
        order_by,
        sort_by
      } = body.all();

      let userOffer = UserOffer.query();

      if (order_by && sort_by) {
        userOffer = userOffer.orderBy(order_by, sort_by);
      } else {
        userOffer = userOffer.orderBy('created_at', 'asc');
      }

      userOffer = await userOffer.paginate(page, limit);

      return new Response(userOffer);
    } catch (e) {
      Logger.transport('file').error('UserOfferService.getAll: ', e);
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
      const userOffer = await UserOffer.query()
        .where('id', id)
        .first();

      return new Response({
        data: userOffer
      });
    } catch (e) {
      Logger.transport('file').error('UserOfferService.getById: ', e);
      return new Response({
        message: __('Cant get user offer detail, please contact support', language)
      }, 422);
    }
  }

  /**
   * Get detail user offer data by offer id
   **/
   async getByOfferId(id, body, auth) {
    const language = auth.current.user.language;
    try {
      const {
        page,
        limit,
        order_by,
        sort_by
      } = body.all();

      let userOffer = UserOffer.query();

      userOffer = userOffer.where('offer_id', id);

      if (order_by && sort_by) {
        userOffer = userOffer.orderBy(order_by, sort_by);
      } else {
        userOffer = userOffer.orderBy('created_at', 'asc');
      }

      userOffer = await userOffer.paginate(page, limit);

      return new Response(userOffer);
    } catch (e) {
      Logger.transport('file').error('UserOfferService.getByOfferId: ', e);
      return new Response({
        message: __('Cant get user offer detail, please contact support', language)
      }, 422);
    }
  }

  /**
   * Get detail user offer data by user id
   **/
     async getByUserId(id, body, auth) {
      const language = auth.current.user.language;
      try {
        const {
          page,
          limit,
          order_by,
          sort_by
        } = body.all();
  
        let userOffer = UserOffer.query();
  
        userOffer = userOffer.where('user_id', id);
  
        if (order_by && sort_by) {
          userOffer = userOffer.orderBy(order_by, sort_by);
        } else {
          userOffer = userOffer.orderBy('created_at', 'asc');
        }
  
        userOffer = await userOffer.paginate(page, limit);
  
        return new Response(userOffer);
      } catch (e) {
        Logger.transport('file').error('UserOfferService.getByUserId: ', e);
        return new Response({
          message: __('Cant get user offer detail, please contact support', language)
        }, 422);
      }
    }

  /**
  * Get detail user offer data by client id
  **/
  async getByClientId(id, body, auth) {
    const language = auth.current.user.language;
      try {
        const {
          page,
          limit,
          order_by,
          sort_by
        } = body.all();
    
        let userOffer = UserOffer.query();
    
        userOffer = userOffer.where('client_id', id);
    
        if (order_by && sort_by) {
          userOffer = userOffer.orderBy(order_by, sort_by);
        } else {
           userOffer = userOffer.orderBy('created_at', 'asc');
        }
    
        userOffer = await userOffer.paginate(page, limit);
    
        return new Response(userOffer);
      } catch (e) {
        Logger.transport('file').error('UserOfferService.getByClientId: ', e);
        return new Response({
          message: __('Cant get user offer detail, please contact support', language)
        }, 422);
      }
    }
    /**
     * Function create user offer
    **/
    async create(body, auth) {
      const user = auth.current.user;

      try {
        const { 
          offer_id, 
          user_id, 
          client_id, 
          content } = body.all();
  
        // create new user offer
        const userOffer = new UserOffer();
        userOffer.offer_id = offer_id;
        userOffer.user_id = user_id;
        userOffer.client_id = client_id;
        userOffer.content = content;
        await userOffer.save();
  
        // get new data user offer
        const createdOffer =  await UserOffer.query().where('id', userOffer.id).first();
  
        return new Response({
          message: 'New User Offer has been created',
          data: createdOffer
        });
      } catch (e) {
        Logger.transport('file').error('UserOfferService.create: ', e);
        return new Response({
          message: 'Cant create user offer, please contact support'
        }, 422);
      }
    }
  
    /**
     * Function update user offer
    **/
    async update(id, body, auth) {
      const user = auth.current.user;
      try {
        const {
          offer_id, 
          user_id, 
          client_id, 
          content } = body.all();

        const userOffer = await UserOffer.find(id); // get data offer base on id

        // if offer not exist, then send error message
        if (!userOffer) return new Response({
          message: 'user offer not found'
        }, 422);

        // check new value, if value not null/empty change value from database with new value
        if (offer_id)  userOffer.offer_id = offer_id; 
        if (user_id)  userOffer.user_id = user_id; 
        if (client_id)  userOffer.client_id = client_id; 
        if (content)  userOffer.content = content; 
        
        await userOffer.save();

        // get new data offer base on id after updated successfully
        const updatedOffer =  await UserOffer.query().where('id', userOffer.id).first();

        return new Response({
          message: 'New User offer has been updated',
          data: updatedOffer
        });
      } catch (e) {
        Logger.transport('file').error('UserOfferService.create: ', e);
        return new Response({
          message: 'Cant update user offer, please contact support'
        }, 422);
      }
    }

    /*
      Delete User Offer
    */
    async delete(id, auth) {
      try {
        await UserOffer.query().where('id', id).delete();
        return new Response({ message: __('User Offer has been deleted') })
      } catch (e) {
        Logger.transport('file').error('UserOfferService.delete: ', e)
        return new Response({ message: __('Cant delete message, please contact support') }, 422)
      }
    }
    
}

module.exports = new UserOfferService();
