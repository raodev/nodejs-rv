"use trict";
function LoginAppClass( element ){
    var $element = $(element);
    var api = $('body').data('api');
    if( ! $element.length || typeof Vue == 'undefined'){
        return null;
    }
    Vue.use(VueForm);
    var vue = new Vue({
        el : element,
        data : {
            data : {
                email : '',
                password : '',
            },
            formstate : {
                email : {},
                password: {}
            }
        },
        methods : {
            /** handler login form */
            submitLogin  : function(){
                if( this.formstate.$invalid ){
                    return;
                }
                var send_data = JSON.parse( JSON.stringify( this.data ) );
                $.post( api + '/login', send_data )
                    .done(function(res){
                        if( res.success ){
                            console.log(res);
                            localStorage.setItem('author_session', res.data.token);
                            sessionStorage.setItem('me', JSON.stringify( res.data.info ) );
                            window.RaoViecApp.$header.user = res.data.info;
                            console.log( window.RaoViecApp.$header.user );
                        }
                    });
            }

        },
        mounted : function() {
        }
    });

    return vue;
}
window.LoginApp = new LoginAppClass('#app-login');