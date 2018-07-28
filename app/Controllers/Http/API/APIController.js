'use strict'

class APIController {
    constructor(){
        response = {
            success : true,
            code : null,
            message : '',
            errors : {}
        }
    }
    json( { response } ){
        return  response.json( this.response );
    }
}

module.exports = APIController
