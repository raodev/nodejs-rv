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
            step : 1,
            max_step : 5,
            formstate: {},
            data: {
                title: '',
                description: '',
                content : '',
                industry_ids: [],
                job_title_ids : [],
                job_level_ids: [],
                job_type_ids: [],
                experience_id : 'none',
                gender_id : 'none',
                salary_method_id : 'month',
                country_id : '',
                city_id : '',
                contact_name : '',
                contact_email : '',
                contact_phone : '',
                address: '',
                log : '',
                lat : '',
                salary_from : 0,
                salary_to : 0,

            },
            resources: {
                cities: [],
                countries: [],
                industries: [],
                job_types: [],
                job_levels: [],
                city_id : '',
                job_titles : '',
                salary_methods : [],
                genders : [],
                experiences: []

            },
            industry_keyword : ''
        },
        methods: {
            setStep : function( step ){
                this.step = step;
            },
            toggleActiveProperty( item, model, mutiple, max, target ){
                if( !this.data.hasOwnProperty(model) ){ return; }
                mutiple = typeof mutiple == 'undefined' ? true : mutiple;
                if( mutiple ){

                    if( typeof max != "undefined" && !isNaN(max)){
                        if( item.active ){
                            var index = this.data[model].indexOf( item._id );
                            if( index != -1 ){
                                this.data[model].splice(index, 1);
                            }
                            item.active = false;
                        }else{
                            if( this.data[model].length < max ){
                                this.data[model].push( item._id );
                                item.active = true;
                            }
                        }
                    }else{
                        item.active = !item.active;
                        if( item.active ){
                            this.data[model].push( item._id );
                        }else{
                            var index = this.data[model].indexOf( item._id );
                            if( index != -1 ){
                                this.data[model].splice(index, 1);
                            }
                        }
                    }
                }else{
                    item.active = !item.active;
                    if( typeof target == 'object' ){
                        target.forEach(function(i){
                           if( i._id !== item._id ){
                               i.active = false;
                           }
                        });
                    }
                    this.data[model] = item.active ? item._id : null;
                }
                this.$forceUpdate();
            },
            sendSubmitJob: function(){
                var send_data = JSON.parse( JSON.stringify( this.data) );
                $.post( api + '/job/add', send_data )
                    .done(function(res){
                        console.log( res );
                    });
            }
        },
        mounted: function () {
            var _this = this;
            $.post(api + '/resources', {'action': 'post-job'})
                .done(function (res) {
                    if (res.success) {
                        window.RaoViecApp.$view.mappingResource(res.data, _this.resources, function(resource_item){
                            if( typeof resource_item == 'object' ){
                                try{
                                    resource_item.forEach(function(item){
                                        item.active = false;
                                    });
                                }catch(e){}
                            }
                        });
                        _this.$forceUpdate();
                    }
                });
        }
    });
    return vue;
}

window.PostJob = new PostJobsClass('#app-post-job');