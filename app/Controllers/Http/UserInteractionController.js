'use strict';

const UserInteractionService = use('App/Services/UserInteractionService');
const Logger = use('Logger');

class UserInteractionController {
  async index({ request, response, auth }) {
    const result = await UserInteractionService.getAll(request, auth);
    return response.status(result.status).send(result.data);
  }

  async show({ params, response, auth }) {
    const result = await UserInteractionService.getById(params.id, auth);
    return response.status(result.status).send(result.data);
  }

  async getByInteractionId({ request, response, params, auth }) {
    const result = await UserInteractionService.getByInteractionId(params.id, request, auth);
    return response.status(result.status).send(result.data);
  }

  async store({ auth, request, response }) {
    const result = await UserInteractionService.create(request, auth);
    return response.status(result.status).send(result.data);
  }

  async update({ request, response, params, auth }) {
    const result = await UserInteractionService.update(params.id, request, auth);
    return response.status(result.status).send(result.data);
  }

  async destroy ({response, params, auth, request}) {
    const id = params.id;
    const result = await UserInteractionService.delete(params.id, request, auth);
    return response.status(result.status).send(result.data);
  }

}

module.exports = UserInteractionController
