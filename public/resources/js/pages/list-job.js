"use strict";

function PostJobsClass(element) {
    var $element = $(element);
    var api = $('body').data('api');
    if (!$element.length || typeof Vue == 'undefined') {
        return null;
    }
    Vue.use(VueForm);
    var vue = new Vue({
        el: element,
        data: {
            list : {
                data : [],
                pagination : {
                    current_page : 1,
                    last_page : 0,
                    per_page : 10,
                    total: 0
                }
            }
        },
        methods: {
          load : function(){
              var _this = this;
              var send_data = {
                  page : this.list.pagination.current_page
              }
              $.post( api + '/job/list', send_data )
                  .done(function(res){
                      if( res.success ){
                          window.RaoViecApp.$view.mappingResponse( res.data, _this.list );
                         setTimeout(function(){
                             _this.loadImage();
                         }, 1)
                      }
                  });
          },
            loadImage : function(){
              $('img').each(function(){
                  var $img = $(this);
                  var url = $img.data('src');
                    if( url != undefined ){
                        $img.attr('src', url + '?v=' + Date.now() );
                    }


              });
            }
        },
        mounted: function () {
            var _this = this;
            this.load();
        },
        watch: {
            'list.pagination.current_page' : function(){
                this.load();
            }
        }
    });
    return vue;
}

window.PostJob = new PostJobsClass('#app-list-job');