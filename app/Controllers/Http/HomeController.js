'use strict';
const Job = use('App/Models/Job');
var MobileDetect = require('mobile-detect');
const isBot = require('isbot');



class HomeController {
    /**
     * Render home Page
     * @author Then Thach
     * @param view
     * @returns {*}
     */
    async index({view, req}){
        const md = new MobileDetect(req.headers['user-agent']);
        var data = {
            title : 'Danh sách việc làm',
            is_mobile : md.mobile()
        }
        var mobile = md.mobile();
        mobile = mobile ? 'mobile' : 'desktop';
        return view.render(  mobile + '/home', data);
    }
    demo({req}){
        var is_bot = isBot(req.headers['user-agent']);
        return is_bot;
        var agent = useragent.parse(req.headers['user-agent']);
        var ua = agent.toAgent();
        console.log( agent );
        return agent;
        // return request.xhr;
        // var accpet_header =  request.headers('accept').accept;
        // const ajax = (request.xhr || accpet_header.indexOf('json') > -1 );
        return ajax;
    }
}

module.exports = HomeController
