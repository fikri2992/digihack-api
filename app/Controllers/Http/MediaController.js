'use strict'
const Helpers = use('Helpers');
const Env = use('Env');
class MediaController {
    async upload({ request, response, auth }) {
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
                name: Env.get('APP_URL') + '/uploads/' +request.input('file_name')
            },
            status: 200
        }
        return response.status(result.status).send(result.data);
    }
}

module.exports = MediaController
