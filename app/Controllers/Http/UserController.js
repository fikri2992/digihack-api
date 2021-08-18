'use strict';

const UserService = use('App/Services/UserService');
const HelperService = use('App/Services/HelperService');
const Logger = use('Logger');

class UserController {
  async index({ request, response, auth }) {
    const result = await UserService.getAll(request, auth);
    return response.status(result.status).send(result.data);
  }

  async statistic({ request, response, auth }) {
    const result = await UserService.statistic(auth, request);
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

  async setFirstTimeLogin({ response, auth }) {
    const result = await UserService.setFirstTimeLogin(auth);
    return response.status(result.status).send(result.data);
  }

  async createBulk({ request, response, auth }) {
    const result = await UserService.createBulk(request, auth);
    return response.status(result.status).send(result.data);
  }

  async updateBulk({ request, response, auth }) {
    const result = await UserService.updateBulk(request, auth);
    return response.status(result.status).send(result.data);
  }

  async resetSubscription({ response, auth }) {
    const result = await UserService.resetSubscription(auth);
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
		Bulk delete
	 */
	async deleteBulk ({request, response, auth}) {
		const result = await UserService.deleteBulk(request, auth);
		return response.status(result.status).send(result.data);
  }

  /*
		Export Excel
	 */
  async exportExcel({ request, response, auth }) {
    const result = await UserService.exportToExcel(request, response);
    if(result){
      result.download('user-export-'+ new Date().getTime());
    }else {
      return response.status(422).send({message: 'Cant export to excel, please contact support'});
    }
  }

  /*
		Export Docx
	 */
  async exportDocx({ request, response, auth }) {
    const result = await UserService.exportToDocx(request);

    if(result){
      const filename = 'user-export-' + new Date().getTime() + '.docx';
      response.header('Content-Disposition', 'attachment; filename='+filename);
      return response.send(Buffer.from(result, 'base64'));
    }else {
      return response.status(422).send({message: 'Cant export to docx, please contact support'});
    }
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

  /*
		Change Payment Method
	 */
	async changePaymentMethod ({request, response, auth}) {
		const result = await UserService.changePaymentMethod(request, auth);
		return response.status(result.status).send(result.data);
  }

  // generate subscription user
  async generateSubscriptionUser({response, auth}) {
    const result = await UserService.generateSubscriptionUser(auth);
		return response.status(result.status).send(result.data);
  }

  // Create additional storage
  async additional({response, auth, request}) {
    const result = await UserService.additional(auth, request);
		return response.status(result.status).send(result.data);
  }

  // Create and update additional storage
  async additionalUpdate({response, auth, request}) {
    const result = await UserService.additionalUpdate(auth, request);
		return response.status(result.status).send(result.data);
  }

  async ssoFrill({response, auth, request}) {
    const result = await UserService.ssoFrill(auth, request);
		return response.status(result.status).send(result.data);
  }

  async redirectFrill({response, request}) {
    const url = 'https://app.grafi.as/login';

    return response.redirect(url);
  }
}

module.exports = UserController
