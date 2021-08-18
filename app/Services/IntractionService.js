"use strict";

const Interaction = use('App/Models/Interaction');
const Response = use('App/Class/Response');
const Logger = use('Logger');
const Hash = use('Hash');
const __ = use('App/Helpers/string-localize');
const passwordStrength = require('check-password-strength');


class InteractionService {
  /**
   * Get all data Interaction
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

      let interaction = Interaction.query();

      if (keyword) {
        interaction = interaction.where(function () {
            this.orWhere('name', 'like', '%' + keyword + '%')
          })
        }

      if (order_by && sort_by) {
        interaction = interaction.orderBy(order_by, sort_by);
      } else {
        interaction = interaction.orderBy('created_at', 'asc');
      }

      interaction = await interaction.paginate(page, limit);

      return new Response(interaction);
    } catch (e) {
      Logger.transport('file').error('Interactionervice.getAll: ', e);
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
      const Interaction = await Interaction.query()
        .where('id', id)
        .first();

      return new Response({
        data: Interaction
      });
    } catch (e) {
      Logger.transport('file').error('InteractionService.getById: ', e);
      return new Response({
        message: __('Cant get detail Interaction, please contact support', language)
      }, 422);
    }
  }
    /**
   * Function get detail data interaction base on slug
  **/
    async getBySlug(slug) {
      try {
        // get data interaction from table categories base on slug
        const interaction = await Interaction.query().where('slug', slug).first();

        // if interaction is not exist, then send error message
        if (!interaction) return new Response({
          message: 'interaction not found'
        }, 422);

        return new Response({
          data: interaction
        });
      } catch (e) {
        Logger.transport('file').error('interactionService.getBySlug: ', e);
        return new Response({
          message: 'Cant get detail interaction, please contact support'
        }, 422);
      }
    }
  
    /**
     * Function create interaction
    **/
    async create(body, auth) {
      const user = auth.current.user;

      try {
        const { 
          user_id, 
          name, 
          description, 
          type, 
          content, 
          status,
          is_published,
          created_by } = body.all();
  
        // create new interaction
        const interaction = new Interaction();
        interaction.user_id = user_id;
        interaction.name = name;
        interaction.description = description;
        interaction.type = type;
        interaction.status = status;
        interaction.content = content;
        interaction.is_published = is_published;
        interaction.created_by = created_by;
        await interaction.save();
  
        // get new data interaction
        const createdInteraction =  await Interaction.query().where('id', interaction.id).first();
  
        return new Response({
          message: 'New Interaction has been created',
          data: createdInteraction
        });
      } catch (e) {
        Logger.transport('file').error('InteractionService.create: ', e);
        return new Response({
          message: 'Cant create Interaction, please contact support'
        }, 422);
      }
    }
  
    /**
     * Function create interaction
    **/
    async update(id, body, auth) {
      const user = auth.current.user;
      try {
        const {
          user_id, 
          name, 
          description, 
          type, 
          content, 
          status,
          is_published,
          created_by
        } = body.all();

        const interaction = await Interaction.find(id); // get data interaction base on id

        // if interaction not exist, then send error message
        if (!interaction) return new Response({
          message: 'interaction not found'
        }, 422);

        // check new value, if value not null/empty change value from database with new value
        if (user_id)  interaction.user_id = user_id; 
        if (name)  interaction.name = name; 
        if (description)  interaction.description = description; 
        if (type)  interaction.type = type; 
        if (content)  interaction.content = content; 
        if (status)  interaction.status = status; 
        if (is_published)  interaction.is_published = is_published; 
        if (created_by)  interaction.created_by = created_by; 
        
        await interaction.save();

        // get new data interaction base on id after updated successfully
        const updatedinteraction =  await interaction.query().where('id', interaction.id).first();

        return new Response({
          message: 'New interaction has been updated',
          data: updatedinteraction
        });
      } catch (e) {
        Logger.transport('file').error('interactionService.create: ', e);
        return new Response({
          message: 'Cant create interaction, please contact support'
        }, 422);
      }
    }

    /*
      Delete Interaction
    */
    async delete(id, auth) {
      const lang = auth.current.user.language;
      try {
        await Interaction.query().where('id', id).delete();
        return new Response({ message: __('Interaction has been deleted', lang) })
      } catch (e) {
        Logger.transport('file').error('interactionService.delete: ', e)
        return new Response({ message: __('Cant delete message, please contact support', lang) }, 422)
      }
    }
    
}

module.exports = new InteractionService();
