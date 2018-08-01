const Route = use('Route');
Route.get('/', 'HomeController.index');
Route.get('/detail', 'HomeController.jobDetail');
Route.get('demo', 'HomeController.demo');