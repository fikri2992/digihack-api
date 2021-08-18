'use strict';

const UserOfferService = use('App/Services/UserOfferService');
const Logger = use('Logger');

class UserOfferController {
  async index({ request, response, auth }) {
    const result = await UserOfferService.getAll(request, auth);
    return response.status(result.status).send(result.data);
  }

  async show({ params, response, auth }) {
    const result = await UserOfferService.getById(params.id, auth);
    return response.status(result.status).send(result.data);
  }

  async getByOfferId({ request, response, params, auth }) {
    const result = await UserOfferService.getByOfferId(params.id, request, auth);
    return response.status(result.status).send(result.data);
  }

  async getByUserId({ request, response, params, auth }) {
    const result = await UserOfferService.getByUserId(params.id, request, auth);
    return response.status(result.status).send(result.data);
  }

  async getByClientId({ request, response, params, auth }) {
    const result = await UserOfferService.getByClientId(params.id, request, auth);
    return response.status(result.status).send(result.data);
  }

  async store({ auth, request, response }) {
    const result = await UserOfferService.create(request, auth);
    return response.status(result.status).send(result.data);
  }

  async update({ request, response, params, auth }) {
    const result = await UserOfferService.update(params.id, request, auth);
    return response.status(result.status).send(result.data);
  }

  async destroy ({response, params, auth, request}) {
    const id = params.id;
    const result = await UserOfferService.delete(params.id, request, auth);
    return response.status(result.status).send(result.data);
  }

}

module.exports = UserOfferController
