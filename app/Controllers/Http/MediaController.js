'use strict'
const MediaService = use('App/Services/MediaService');
const Helpers = use('Helpers');
const Drive = use('Drive');

class MediaController {
    async index({ request, response, auth }) {
        const result = await MediaService.getAllImageUrl(request, auth);
        return response.status(result.status).send(result.data);
    }

    async upload({ request, response, auth }) {
        const validationOptions = {
            types: ['image'],
            size: '1mb',
        };
        // const result = await MediaService.upload(request, auth);

        const imageFile = request.file('file', validationOptions);
        await imageFile.move(Helpers.publicPath('uploads'), {
            name: 'fikuri.jpg',
            overwrite: true,
        });
        const result = {
            data: {
                name:'fikuri.jpg'
            },
            status: 200
        }
        return response.status(result.status).send(result.data);
    }

    async getImageUrlByUserId ({ request, response, params, auth }) {
        const result = await MediaService.getImageUrlByUserId(params.id, request, auth);
        return response.status(result.status).send(result.data);
    }

    async getImageUrlByInteractionId ({ request, response, params, auth }) {
        const result = await MediaService.getImageUrlByInteractionId(params.id, request, auth);
        return response.status(result.status).send(result.data);
    }

    async getImageUrlByOfferId ({ request, response, params, auth }) {
        const result = await MediaService.getImageUrlByOfferId(params.id, request, auth);
        return response.status(result.status).send(result.data);
    }

    async destroy ({response, params, auth, request}) {
        const id = params.id;
        const result = await MediaService.delete(params.id, request, auth);
        console.log('data:', result.data.data)
        const filePath = result.data.data.url;
        console.log('path:', filePath)
        const isExist = await Drive.exists(Helpers.publicPath('uploads')+'\\'+filePath);

        if (isExist) {
            Drive.delete(Helpers.publicPath('uploads')+'\\'+filePath);
            return response.status(result.status).send(result.data);
        }

        return 'File does not exist';
    }
}

module.exports = MediaController
