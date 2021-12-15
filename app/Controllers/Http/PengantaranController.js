'use strict'
const Helpers = use('Helpers');
const PengantaranService = use('App/Services/PengantaranService');
const Pengantaran = use('App/Models/Pengantaran');
const Response = use('App/Class/Response');
const Logger = use('Logger');
const __ = use('App/Helpers/string-localize');

class PengantaranController {
    async store({ request, response }) {
        const params = request;
        const result = await PengantaranService.create(params);
        return response.status(result.status).send(result.data);
    }
    
}

module.exports = PengantaranController
