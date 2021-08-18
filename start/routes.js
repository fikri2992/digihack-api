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
	return { greeting: 'Welcome to digihackaction' }
})

Route.group(() => {
    Route.post('login', 'AuthController.login');
    Route.post('register', 'AuthController.register');
}).prefix('auth'); // auth/login


Route.resource('interactions', 'InteractionController').apiOnly().middleware(['auth']);
Route.resource('offers', 'OfferController').apiOnly().middleware(['auth']);

Route.get('users','userController.index').middleware(['auth'])
Route.post('logout', 'AuthController.logout');