'use strict'
const User = use('App/Models/User');
class UserController{
    async getList(){
        return await User.fetch();
    }
    putUser({request}){
        return request.post();
    }
    async login ({ auth, request, response, session }) {
        const { email, password } = request.all();
        var errors = {  };
        if( ! email ){
            errors.email = 'email is not provider';
        }
        if( ! password ){
            errors.password = 'password is not provider';
        }
        if( Object.keys( errors ).length > 0 ){
            return response.json({
                success : false,
                message : 'Login fail',
                errors: errors
            });
        }
        var token = null;
        try {
            token = await auth.attempt(email, password);
        } catch (e) {
            if( e.hasOwnProperty('uidField') ){
                return response.json({
                    message : 'Login fail',
                    code : 200,
                    errors : {
                        email : 'Email is not exists'
                    }
                }, 402);
            }
            if( e.hasOwnProperty('passwordField') ){
                return response.json({
                    message : 'Login fail',
                    code : 200,
                    errors : {
                        password : 'password is correct'
                    }
                }, 402);
            }
            // if( e.hasOwnProperty() )
            return response.json({
                message : 'Login fail',
                code : 200,
                errors : e
            }, 402);
        }
        return response.json({
            success : true,
            message : 'success login',
            code : 200,
            token : token
        }, 200);
    }
    async me({ auth, request, response, session }){
        console.log( request );
        const token = auth.getAuthHeader();
        var user = null;
        if( ! token ){
            return response.json({
                success : false,
                message : 'Authorization header not found',
                error : {
                    auth : 'Authorization header not found'
                }
            }, 403)
        }
        try{
            user = await auth.getUser()
        }catch (e) {
            return response.json({
                success : false,
                message: 'authorization fail',
                errors : e
            });
        }

        return response.json({
            success : true,
            message : 'feed auth info successful',
            data : user
        })
    }
}

module.exports = UserController
