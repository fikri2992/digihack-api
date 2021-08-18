'use strict';
const Response = use('App/Class/Response');
const Logger = use('Logger');
const Database = use('Database');
const isUndefined = require("is-undefined");
const Broadcast = use('App/Models/Broadcast');
const __ = use('App/Helpers/string-localize');
const kue = use('Kue');

class BroadcastService {
  /*
		Get All
	 */
  async getAll(body, auth) {
    const lang = auth.current.user.language;
    try {
      const {
        page,
        limit,
        order_by,
        sort_by,
        type,
        keyword
      } = body.all();

      let broadcasts = Broadcast.query().where('user_id', auth.current.user.id);

      if (type) broadcasts = broadcasts.where('type', type);
      if (keyword) broadcasts = broadcasts.where('content', 'like', '%' + keyword + '%')

      if (order_by && sort_by) {
        broadcasts = broadcasts.orderBy(order_by, sort_by);
      } else {
        broadcasts = broadcasts.orderBy('created_at', 'desc');
      }

      broadcasts = await broadcasts.paginate(page, limit);

      return new Response(broadcasts)
    } catch (e) {
      Logger.transport('file').error('BroadcastService.getAll: ', e);
      return new Response({ message: __('Cant get messages, please contact support', lang) }, 422);
    }
  }

  /*
		Create
	 */
  async create(body, auth) {
    const lang = auth.current.user.language;
    const  {
      content,
      title,
      file,
      type,
      ids,
    } = body.all();
    
    const trx = await Database.beginTransaction();
    try {
      const tmpIds = JSON.parse(ids);
      if (type === 'user' && tmpIds.length === 0) return new Response({message: __('Please select user', lang)}, 422);
      const broadcast = new Broadcast();
      broadcast.user_id = auth.current.user.id;
      broadcast.content = content;
      broadcast.title = title;
      broadcast.file = file;
      broadcast.type = type;
      broadcast.ids = ids;
      await broadcast.save(trx);
      await trx.commit();

      const data = await Broadcast.query()
        .where('id', broadcast.id)
        .first();

      kue.dispatch('Broadcast-grafias-job', data, 'high', 2, true);

      return new Response({ message: __('Message has been send', lang), data: data });
    } catch (e) {
      await trx.rollback();
      Logger.transport('file').error('BroadcastService.create: ', e);
      return new Response({ message: __('Cant send message, please contact support', lang) }, 422);
    }
  }

  /*
		Update
	 */
  async update(body, id, auth) {
    const lang = auth.current.user.language;

    const  {
      content,
      type,
      title,
      file,
      ids,
    } = body.all();

    const broadcast = await Broadcast.query().where('id', id).where('user_id', auth.current.user.id).first();
    if (!broadcast) return new Response({message: __('Message not found', lang)}, 404);

    const trx = await Database.beginTransaction()
    try {
      if (!isUndefined(title)) broadcast.title = title;
      if (!isUndefined(content)) broadcast.content = content;
      if (!isUndefined(file)) broadcast.file = file;
      if (type) broadcast.type = type;
      if (!isUndefined(ids)) broadcast.ids = ids;

      await broadcast.save(trx);
      await trx.commit();

      const data = await Broadcast.query()
        .where('id', id)
        .first();
      return new Response({ message: __('Message has been updated', lang), data: data });
    } catch (e) {
      await trx.rollback();
      Logger.transport('file').error('BroadcastService.update: ', e);
      return new Response({ message: __('Cant update message, please contact support', lang) }, 422);
    }
  }

  /*
		Get Details by id
	 */
  async findById(id, auth) {
    const lang = auth.current.user.language;
    try {
      const broadcast = await Broadcast.query()
        .where('id', id)
        .where('user_id', auth.current.user.id)
        .first()

      return new Response({ data: broadcast })
    } catch (e) {
      Logger.transport('file').error('BroadcastService.findById: ', e)
      return new Response({ message: __('Cant find the message, please contact support', lang) }, 422)
    }
  }

  /*
		Delete
	 */
  async delete(id, auth) {
    const lang = auth.current.user.language;
    try {
      await Broadcast.query().where('id', id).delete();
      return new Response({ message: __('Message has been deleted', lang) })
    } catch (e) {
      Logger.transport('file').error('BroadcastService.delete: ', e)
      return new Response({ message: __('Cant delete message, please contact support', lang) }, 422)
    }
  }

  /*
    Bulk delete
   */
  async deleteBulk(body, auth) {
    const lang = auth.current.user.language;
    try {
      let ids = body.input('ids');
      ids = JSON.parse(ids);
      await Broadcast.query().whereIn('id', ids).delete();
      return new Response({ message: ids.length + ' ' + __('Message has been deleted', lang) })
    } catch (e) {
      Logger.transport('file').error('BroadcastService.deleteBulk: ', e)
      return new Response({ message: __('Cant bulk delete message, please contact support', lang) }, 422)
    }
  }

  /**
   * Send Broadcast
   */
  async sendBroadcast(id, body, auth) {
    const lang = auth.current.user.language;
    try {
      const data = await Broadcast.query()
        .where('id', id)
        .where('user_id', auth.current.user.id)
        .first();
        
      await data.save;

      kue.dispatch('Broadcast-grafias-job', data, 'high', 2, true);
      return new Response({ message: __('Message has been send', lang) });
    } catch (e) {
      Logger.transport('file').error('BroadcastService.sendBroadcast: ', e)
      return new Response({ message: __('Cant send message, please contact support', lang) }, 422)
    }
  }
}

module.exports = new BroadcastService()
