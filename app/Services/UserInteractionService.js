"use strict";

const UserInteraction = use('App/Models/UserInteraction');
const Response = use('App/Class/Response');
const Logger = use('Logger');
const Hash = use('Hash');
const __ = use('App/Helpers/string-localize');
const passwordStrength = require('check-password-strength');
const axios = require('axios');
const crypto = require('crypto')
const socket  = require('../../start/socket');
class UserInteractionService {
  /**
   * Get all User Interaction data
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

      let userInteraction = UserInteraction.query();

      if (order_by && sort_by) {
        userInteraction = userInteraction.orderBy(order_by, sort_by);
      } else {
        userInteraction = userInteraction.orderBy('created_at', 'asc');
      }

      userInteraction = await userInteraction.paginate(page, limit);

      return new Response(userInteraction);
    } catch (e) {
      Logger.transport('file').error('UserInteractionService.getAll: ', e);
      return new Response({
        message: __('Cant get data user, please contact support', language)
      }, 422);
    }
  }

  /**
   * Get detail data user interaction
   **/
  async getById(id, auth) {
    const language = auth.current.user.language;
    try {
      const userInteraction = await UserInteraction.query()
        .where('id', id)
        .first();

      return new Response({
        data: userInteraction
      });
    } catch (e) {
      Logger.transport('file').error('UserInteractionService.getById: ', e);
      return new Response({
        message: __('Cant get user interaction detail, please contact support', language)
      }, 422);
    }
  }

  /**
   * Get detail user interaction data by interaction id
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

      let userInteraction = UserInteraction.query();

      userInteraction = userInteraction.where('interaction_id', id);

      if (order_by && sort_by) {
        userInteraction = userInteraction.orderBy(order_by, sort_by);
      } else {
        userInteraction = userInteraction.orderBy('created_at', 'asc');
      }

      userInteraction = await userInteraction.paginate(page, limit);

      return new Response(userInteraction);
    } catch (e) {
      Logger.transport('file').error('UserInteractionService.getByInteractionId: ', e);
      return new Response({
        message: __('Cant get user interaction detail, please contact support', language)
      }, 422);
    }
  }

  /**
   * Get user interaction count by interaction id
   **/
   async countByInteractionId(id, auth) {
    const language = auth.current.user.language;
    try {
      const userInteraction = await UserInteraction.query()
        .where('interaction_id', id)
        .count('* as total_interactions');

      return new Response({
        data: userInteraction
      });
    } catch (e) {
      Logger.transport('file').error('UserInteractionService.getById: ', e);
      return new Response({
        message: __('Cant get interaction count, please contact support', language)
      }, 422);
    }
  }

    /**
     * Function create user interaction
    **/
    async create(body, auth) {
      const user = auth.current.user;

      try {
        const { 
          interaction_id, 
          phone, 
          answer, 
          content,
          price } = body.all();
        
        // create new user interaction
        const userInteraction = new UserInteraction();
        userInteraction.interaction_id = interaction_id;
        userInteraction.phone = phone;
        userInteraction.answer = answer;
        userInteraction.content = content;
        userInteraction.price = price;
        await userInteraction.save();
  
        // get new data user interaction
        const createdInteraction =  await UserInteraction.query().where('id', userInteraction.id).first();

        const roomId = `room_interaction_${interaction_id}`;
        await socket.to(roomId).emit('create', createdInteraction);

        return new Response({
          message: 'New User Interaction has been created',
          data: createdInteraction
        });
      } catch (e) {
        Logger.transport('file').error('UserInteractionService.create: ', e);
        return new Response({
          message: 'Cant create user interaction, please contact support'
        }, 422);
      }
    }
  
    /**
     * Function update user interaction
    **/
    async update(id, body, auth) {
      const user = auth.current.user;
      try {
        const {
          interaction_id, 
          phone, 
          answer, 
          content,
          price } = body.all();

        const userInteraction = await UserInteraction.find(id); // get data user interaction base on id

        // if user interaction not exist, then send error message
        if (!userInteraction) return new Response({
          message: 'user interaction not found'
        }, 422);

        // check new value, if value not null/empty change value from database with new value
        if (interaction_id)  userInteraction.interaction_id = interaction_id; 
        if (phone)  userInteraction.phone = phone; 
        if (answer)  userInteraction.answer = answer; 
        if (content)  userInteraction.content = content; 
        if (price)  userInteraction.price = price; 
        
        await userInteraction.save();

        // get new data user interaction base on id after updated successfully
        const updatedInteraction =  await UserInteraction.query().where('id', userInteraction.id).first();

        return new Response({
          message: 'New User interaction has been updated',
          data: updatedInteraction
        });
      } catch (e) {
        Logger.transport('file').error('UserInteractionService.create: ', e);
        return new Response({
          message: 'Cant update user interaction, please contact support'
        }, 422);
      }
    }

    /*
      Delete User Interaction
    */
    async delete(id, auth) {
      try {
        await UserInteraction.query().where('id', id).delete();
        return new Response({ message: __('User interaction has been deleted') })
      } catch (e) {
        Logger.transport('file').error('UserInteractionService.delete: ', e)
        return new Response({ 
          
          message: __('Cant delete message, please contact support') }, 422)
      }
    }
    async smsWebHook() {
      try {
        console.log('berhasil ga yah')
      } catch (e) {
      }
    }
    /*
      create sms api
    */
    async sendSms(body) {
      try {
        const {
          id,
          phone,
          message
        } = body.all();
        var dt = new Date();
        dt.setMinutes(dt.getMinutes())
        const url ='https://api.digitalcore.telkomsel.com/v1/send-sms'
        // const hashDigest = sha256("mrmnthfehaujzndupfd59e3z" + "11gP2" + Math.round((new Date(dt)).getTime()/1000));
        // const hmacDigest = Base64.stringify(hashDigest);
        const signatureKey = crypto.createHash('sha256').update("mrmnthfehaujzndupfd59e3z" + "11gP2" + Math.floor(Date.now() / 1000)).digest('hex');
        const data = {
            "transaction": {
              "transaction_id": "C51541561515415415154154151",
              "callback_domain": "yourcompanydomain.com"
            },
            "sms": {
              "sender_id": "DIGIHACK",
              "recipient": "6285320666651",
              "sms_text": message
            }
        };
        
        axios.post(url, {data}, {
          
         }
        ).then(response => {
          // console.log(response)
        })
        axios({
          method: "post",
          url: url,
          data: data,
          headers: {
            'api_key': 'mrmnthfehaujzndupfd59e3z',
            'x-signature': signatureKey,
            'Content-Type': 'application/json',
          },
        }).then(function (response) {
            //handle success
            console.log(response);
          })
          .catch(function (response) {
            //handle error
            console.log(response);
          });
        return new Response({  status: 200, data:signatureKey, message: __('User interaction has been deleted') })

      } catch (e) {
        return new Response({ 
          status: 422,
          data: e,
          message: __('User interaction has been deleted') })
      }
    }
}

module.exports = new UserInteractionService();
