'use strict'
const Helpers = use('Helpers');
const AlamatService = use('App/Services/AlamatService');

class AlamatController {
    async store({ request, response }) {
        const params = request;
        const result = await AlamatService.create(params);
        return response.status(result.status).send(result.data);
    }
    async show({ params, response }) {
        const result = await AlamatService.getById(params.id);
        return response.status(result.status).send(result.data);
    }
    async upload({ request, response }) {
        const validationOptions = {
            types: ['image'],
            size: '1mb',
        };
        const imageFile = request.file('file', validationOptions);
        await imageFile.move(Helpers.publicPath('uploads'), {
            name: request.input('file_name'),
            overwrite: true,
        });
        const result = {
            data: {
                name:request.input('file_name')
            },
            status: 200
        }
        return response.status(result.status).send(result.data);
    }
}

module.exports = AlamatController
