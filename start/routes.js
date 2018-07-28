'use strict'
const web = require('./routes/web');
const Route = use('Route')
Route.group(()=>{
    require('./routes/api/hr-1.0.0');
}).prefix('api/hr/1.0.0');


