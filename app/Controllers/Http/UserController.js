'use strict';
const User = use("App/Models/User");
const APIController = use('App/Http/API/APIController');

class UserController extends APIController{
    index({view}){
        return view.render('user');
    }
    async demo(){
        return await User.fetch();
    }
    async addUser(){
        var user = new User
        user.email = 'thachthen@gmail.com';
        user.password = '123456789';
        user.first_name = 'Then';
        user.last_name = 'Thach';
        return await user.save();
    }
}

module.exports = UserController
