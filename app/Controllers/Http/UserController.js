'use strict';

const UserService = use('App/Services/UserService');
const HelperService = use('App/Services/HelperService');
const Logger = use('Logger');

class UserController {
  async index({ request, response, auth }) {
    const result = await UserService.getAll(request, auth);
    return response.status(result.status).send(result.data);
  }

  async show({ params, response, auth }) {
    const result = await UserService.getById(params.id, auth);
    return response.status(result.status).send(result.data);
  }

  async store({ auth, request, response }) {
    await HelperService.validate(request, {
      email: 'required|email',
      password: 'required|min:8',
    });

    const params = request.all();

    const result = await UserService.create(auth, params);
    return response.status(result.status).send(result.data);
  }

  async update({ request, response, params, auth }) {
    const result = await UserService.update(request, params.id, auth);
    return response.status(result.status).send(result.data);
  }

	/*
		Delete
	 */
	async destroy ({response, params, auth, request}) {
		const id = params.id;
		const result = await UserService.delete(id, request, auth);
		return response.status(result.status).send(result.data);
	}


  /*
		Force update password
	 */
  async forceUpdatePassword({ request, response, params, auth }) {
    await HelperService.validate(request, {
			password: 'required|min:8'
    })
    const result = await UserService.forceUpdatePassword(request, params.user_id, auth);
    return response.status(result.status).send(result.data);
  }

  
}

module.exports = UserController
