'use strict'
const Helpers = use('Helpers');
const AlamatScoring = use('App/Services/AlamatScoring');

class AlamatScoringController {
    async store({ request, response }) {
        const params = request;
        const result = await AlamatScoring.create(params);
        return response.status(result.status).send(result.data);
    }
}

module.exports = AlamatScoringController
