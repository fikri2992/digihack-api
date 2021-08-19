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
    Route.get('profile', 'AuthController.findById').middleware(['auth']);
}).prefix('auth'); // auth/login


Route.get('interactions/:id', 'InteractionController.show');
Route.resource('interactions', 'InteractionController').apiOnly().middleware(['auth']);

Route.resource('offers', 'OfferController').apiOnly().middleware(['auth']);
Route.group(() => {
    Route.get('getByInteractionId/:id', 'OfferController.getByInteractionId');
}).prefix('offers').middleware(['auth']);

Route.get('users','userController.index').middleware(['auth'])
Route.post('logout', 'AuthController.logout');

Route.post('sendSms','UserInteractionController.sendSms')

Route.resource('useroffers', 'UserOfferController').apiOnly().middleware(['auth']);
Route.group(() => {
    Route.get('getByOfferId/:id', 'UserOfferController.getByOfferId');
    Route.get('getByUserId/:id', 'UserOfferController.getByUserId');
    Route.get('getByClientId/:id', 'UserOfferController.getByClientId');
    Route.get('countByOfferId/:id', 'UserOfferController.countByOfferId');
}).prefix('useroffers').middleware(['auth']);

Route.post('userinteractions', 'UserInteractionController.store');

Route.resource('userinteractions', 'UserInteractionController').apiOnly().middleware(['auth']);

Route.get('userinteractions/getByInteractionId/:id', 'UserInteractionController.getByInteractionId');


Route.group(() => {
    Route.get('countByInteractionId/:id', 'UserInteractionController.countByInteractionId');
}).prefix('userinteractions').middleware(['auth']);

Route.resource('media', 'MediaController').apiOnly().middleware(['auth']);


Route.group(() => {
    Route.post('upload', 'MediaController.upload');
    Route.get('getImageUrlByUserId/:id', 'MediaController.getImageUrlByUserId');
    Route.get('getImageUrlByInteractionId/:id', 'MediaController.getImageUrlByInteractionId');
    Route.get('getImageUrlByOfferId/:id', 'MediaController.getImageUrlByOfferId');
}).prefix('media').middleware(['auth']);
// Route.post('logout', 'AuthController.logout');