'use strict'
const MediaService = use('App/Services/MediaService');
const Helpers = use('Helpers');
const Drive = use('Drive');

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
                name:request.input('file_name')
            },
            status: 200
        }
        return response.status(result.status).send(result.data);
    }
}

module.exports = MediaController
