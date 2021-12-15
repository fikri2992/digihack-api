'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
	return { greeting: 'Welcome to sicepat pahlawan hackathon' }
})

Route.group(() => {
    Route.post('login', 'AuthController.login');
    Route.post('register', 'AuthController.register');
}).prefix('auth'); // auth/login

Route.post('alamat/create', 'AlamatController.store');
Route.post('pengantaran/create/', 'PengantaranController.store');

Route.get('alamat/:id', 'AlamatController.show');

Route.post('logout', 'AuthController.logout');

Route.post('upload', 'MediaController.upload');