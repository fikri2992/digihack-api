'use strict';

const OfferService = use('App/Services/OfferService');
const Logger = use('Logger');

class OfferController {
  async index({ request, response, auth }) {
    const result = await OfferService.getAll(request, auth);
    return response.status(result.status).send(result.data);
  }

  async show({ params, response, auth }) {
    const result = await OfferService.getById(params.id, auth);
    return response.status(result.status).send(result.data);
  }

  async store({ auth, request, response }) {
    const params = request.all();
    const result = await OfferService.create(params, auth);
    return response.status(result.status).send(result.data);
  }

  async update({ request, response, params, auth }) {
    const result = await OfferService.update(request, params.id, auth);
    return response.status(result.status).send(result.data);
  }

  async destroy ({response, params, auth, request}) {
    const id = params.id;
    const result = await OfferService.delete(id, request, auth);
    return response.status(result.status).send(result.data);
  }

}

module.exports = OfferController
