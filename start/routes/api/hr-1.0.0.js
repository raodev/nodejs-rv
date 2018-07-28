/**
 * HR API
 * @author Then Thach
 * @version 1.0.0
 */
"use strict";
const Route = use('Route');
Route.get('user/list', 'API/UserController.getList');
Route.put('user', 'API/UserController.putUser')

/* Job */
Route.get('job/list', 'API/JobController.getList');
/** end job */
Route.post('auth/login', 'API/UserController.login');
Route.any('auth/me', 'API/UserController.me')
module.exports = Route;