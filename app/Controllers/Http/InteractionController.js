'use strict';

const InteractionService = use('App/Services/InteractionService');
const Logger = use('Logger');

class InteractionController {
  async index({ request, response, auth }) {
    const result = await InteractionService.getAll(request, auth);
    return response.status(result.status).send(result.data);
  }

  async show({ params, response, auth }) {
    const result = await InteractionService.getById(params.id, auth);
    return response.status(result.status).send(result.data);
  }

  async store({ auth, request, response }) {
    const params = request.all();
    const result = await InteractionService.create(params, auth);
    return response.status(result.status).send(result.data);
  }

  async update({ request, response, params, auth }) {
    const result = await InteractionService.update(request, params.id, auth);
    return response.status(result.status).send(result.data);
  }

  async destroy ({response, params, auth, request}) {
    const id = params.id;
    const result = await InteractionService.delete(id, request, auth);
    return response.status(result.status).send(result.data);
  }

}

module.exports = InteractionController
