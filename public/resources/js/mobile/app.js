"use strict";
String.prototype.strPad = function (len, c) {
    var s = this, c = c || '0';
    while (s.length < len) s = c + s;
    return s;
}
String.prototype.capitalize = function () {
    return this.replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
    });
};

function RaoViecAppClass() {
    var app = {
        $route: null,
        $view: {}
    };
    var $body = $('body');
    var api = $body.data('api');
    var config = {
        max_width: $('.content-wrapper').css('max-width').replace('px', '')
    };
    var head_token = $('meta[name="csrf-token"]').attr('content');
    var auth_token = localStorage.getItem('author_session');
    console.log(auth_token);
    var notify_status = false;
    if (auth_token) {
        $.ajaxSetup({
            headers: {
                'Authorization': 'Bearer ' + auth_token
            }
        });
    }

    var current_path = '';
    var $el_route = $('#route-app');
    if ($el_route.length) {
        app.$header = new Vue({
            el: '#route-app',
            data: {
                user: null
            },
            methods: {
                loadView: function (view_name) {
                    $(".preloading").fadeIn("slow");
                    var link = window.location.protocol + '//' + window.location.hostname + '/' + view_name;
                    window.history.pushState(link, null, link);
                    $.get(api + '/view/' + view_name, function (view) {
                        $('#page-content-loader').html(view);
                        var $page_content = $('#page-content');
                        if ($page_content.length && $page_content.data('title') != undefined) {
                            document.title = $page_content.data('title');
                        }
                        $('.side-nav').each(function () {
                            var $side = $(this);
                            if ($side.hasClass('right-aligned')) {
                                $side.css({
                                    transform: 'translateX(100%)'
                                });
                            } else {
                                $side.css({
                                    transform: 'translateX(-100%)'
                                });
                            }
                            $('#sidenav-overlay').remove();
                            $('.drag-target').remove();
                            $('body').css({
                                width: '',
                                overflow: ''
                            });
                        });
                        app.$view.materializeInit();
                        $(".preloading").fadeOut("slow");
                    }, 'html');
                },
                /** Auth me */
                whoIs: function () {
                    var _this = this;
                    if (sessionStorage.getItem('me')) {
                        $.post(api + '/me')
                            .done(function (res) {
                                if (res.success) {
                                    _this.user = res.data;
                                    _this.$forceUpdate();
                                }
                            })
                            .fail(function (error) {
                                _this.user = null;
                                sessionStorage.removeItem('me');
                                localStorage.removeItem('author_session');
                                _this.$forceUpdate();
                            });
                    }

                },
                /** do logout */
                logout: function () {
                    var _this;
                    $.post(api + '/logout')
                        .done(function (res) {
                            if (res.success) {
                                sessionStorage.removeItem('me');
                                localStorage.removeItem('author_session');
                                _this.user = null;
                            }
                        });
                }
            },
            mounted: function () {
                this.whoIs();
            }
        });
    }
    app.$view.createId = function () {
        var idStrLen = 32;
        var idStr = (Math.floor((Math.random() * 25)) + 10).toString(36) + "_";
        idStr += (new Date()).getTime().toString(36) + "_";
        do {
            idStr += (Math.floor((Math.random() * 35))).toString(36);
        } while (idStr.length < idStrLen);

        return (idStr);
    }
    app.$view.materializeInit = function () {
        // $('select').material_select();
        $('.datepicker').datepicker({
            format: 'mm/dd/yyyy',
            showClearBtn: true,
            i18n: {
                cancel: 'Đóng',
                done: 'Hoàn tất',
                clear: 'Bỏ chọn',
                months: [
                    'Tháng 1',
                    'Tháng 2',
                    'Tháng 3',
                    'Tháng 4',
                    'Tháng 5',
                    'Tháng 6',
                    'Tháng 7',
                    'Tháng 8',
                    'Tháng 9',
                    'Tháng 10',
                    'Tháng 11',
                    'Tháng 12',
                ],
                monthsShort: [
                    'Tháng 1',
                    'Tháng 2',
                    'Tháng 3',
                    'Tháng 4',
                    'Tháng 5',
                    'Tháng 6',
                    'Tháng 7',
                    'Tháng 8',
                    'Tháng 9',
                    'Tháng 10',
                    'Tháng 11',
                    'Tháng 12',
                ],
                weekdays: [
                    'CN',
                    'T2',
                    'T3',
                    'T4',
                    'T5',
                    'T6',
                    'T7',
                ],
                weekdaysShort: [
                    'Chủ nhật',
                    'Thứ hai',
                    'Thứ ba',
                    'Thứ tư',
                    'Thứ năm',
                    'Thứ sáu',
                    'Thứ bảy',
                ],
                weekdaysAbbrev: [
                    'CN',
                    'T2',
                    'T3',
                    'T4',
                    'T5',
                    'T6',
                    'T7',
                ]
            }

        });
        $('select').formSelect();
        $('.tabs').tabs();
        $('.collapsible').collapsible();
    }
    app.$view.init = function () {
        $('.slider').each(function(){
            var $slider = $(this);
            var id = $slider.attr('id');
            if( id == undefined || id == '' ){
                id = app.$view.createId();
                $slider.attr('id', id);
            }
            var height = $slider.data('height');
            if( height == undefined ){
                height = 120;
            }

            $slider.addClass('active').slider({
                height: height
            });
            $('#' +id).css({
                height : height
            });
        });
        /*=================== SIDENAV CATEGORY ===================*/
        $('.button-collapse').each(function () {
            var $btn = $(this);
            var edge = $btn.data('edge');
            if (edge == undefined) {
                edge = 'left';
            }
            var width = $btn.data('width');
            if (width == undefined) {
                width = 250;
            }
            // $btn.sideNav({
            //         menuWidth: width,
            //         edge: edge,
            //         closeOnClick: true,
            //         draggable: true,
            //         onOpen: function(el) {},
            //         onClose: function(el) {},
            //     }
            // );
        });

        /*=================== SIDENAV ACCOUNT ===================*/


        /*=================== FOOTER ===================*/


        var $left_side = $('#nav-mobile-category');
        var $page_load_content = $('#page-content-loader');
        var $header = $('#header');
        var window_width = parseFloat($(window).width());

        var remain = window_width - config.max_width;


        $(".preloading").fadeOut("slow");
        window.addEventListener('popstate', function (event) {
            event.preventDefault();
            var path_name = window.location.pathname.substr(1);
            if (path_name != current_path) {
                current_path = path_name;
                $(".preloading").fadeIn("slow");
                var link = window.location.protocol + '//' + window.location.hostname + '/' + current_path;
                $.get(api + '/view/' + current_path, function (view) {
                    $('#page-content-loader').html(view);
                    var $page_content = $('#page-content');
                    if ($page_content.length && $page_content.data('title') != undefined) {
                        document.title = $page_content.data('title');
                    }
                    $(".preloading").fadeOut("slow");
                }, 'html');
            }
        }, false);
        setTimeout(function () {
            app.$view.materializeInit();
        }, 10);

    }

    app.$view.mappingResource = function (response, resource, callback_item) {
        for (var key in resource) {
            if (response.hasOwnProperty(key)) {
                if (typeof callback_item == 'function') {
                    callback_item(response[key]);
                }
                resource[key] = response[key];
            }
        }
    };
    app.$view.mappingResponse = function (resource, object) {
        if (!object.hasOwnProperty('pagination')) {
            object.pagination = {};
        }
        object.data = resource.hasOwnProperty('data') ? resource.data : [];
        for (var key in object.pagination) {

            if (resource.hasOwnProperty(key)) {
                object.pagination[key] = resource[key];
            }
        }
        var delay = object.hasOwnProperty('delay') && !isNaN(object.delay) ? object.delay : 10;
        setTimeout(function () {
            object.loading = false;
        }, delay);
    };
    return app;
}

function RaoViecComponentClass() {
    if (typeof Vue == 'undefined') {
        return null;
    }
    var vue = Vue;
    vue.component('rSelect', {
        props: {
            value: {
                required: true
            },
            options: {
                type: Array
            },
            placeholder: {
                type: String,
                default: 'Select an option'
            },
            multiple: {
                type: Boolean,
                default: false,
            },
        },
        template: '<select :multiple="multiple"><option disabled>{{ placeholder }}</option><option v-for="item in data" :value="item.id">{{item.text}}</option></select>',
        data: function () {
            return {
                data: [],
                config: {},
                selected: this.value
            }
        },
        methods: {
            convert: function (callback) {
                var _this = this;
                var data = [];
                if (typeof _this.options === 'object') {
                    data = _this.options.map(function (item) {
                        var el = {};
                        el['id'] = item.hasOwnProperty('id') ? item['id'] : (item.hasOwnProperty('_id') ? item['_id'] : '');
                        var text = '';
                        if (item.hasOwnProperty('text')) {
                            text = item['text'];
                        } else if (item.hasOwnProperty('name')) {
                            text = item['name'];
                        } else if (item.hasOwnProperty('code')) {
                            text = item['code'];
                        }
                        el['text'] = String(text).capitalize();
                        return el;

                    });
                }
                _this.data = data;
                if (typeof callback === 'function') {
                    callback();
                }
            },
            init: function () {
                var _this = this;
                setTimeout(function () {
                    $(_this.$el).formSelect('destroy');
                    $(_this.$el).formSelect();
                }, 10);
                $(_this.$el).on('change', function () {
                    _this.$emit('input', $(this).val());
                });

            },
            destroy: function () {

            }
        },
        created: function () {
            this.convert();
        },
        mounted: function () {

            this.init();
        },
        watch: {
            'options': function (newval) {
                var _this = this;
                this.convert(function () {
                    _this.init();
                });
            }
        },
    });
    vue.component('ckeditor', {
        template: '<div class="ckeditor"><textarea :id="id" :value="value"></textarea></div>',
        props: {
            value: {
                type: String
            },
            height: {
                type: String,
                default: '400px',
            },
            toolbar: {
                type: Array,
                default: function () {
                    return [{
                        name: "clipboard",
                        items: ["Undo", "Redo", "Cut", "Copy", "Paste", "PasteText", "PasteFromWord", "Undo", "Redo", "oembed"]
                    }, {
                        name: "styles",
                        items: ["Styles", "Format"]
                    }, {
                        name: "basicstyles",
                        items: ["Bold", "Italic", "Strike", "-", "RemoveFormat"]
                    }, {
                        name: "paragraph",
                        items: ["NumberedList", "BulletedList", "-", "Outdent", "Indent", "-", "Blockquote"]
                    }, {
                        name: "links",
                        items: ["Link", "Unlink", "Gallery"]
                    }, {
                        name: "insert",
                        items: ["Image", "EmbedSemantic", "Table"]
                    }, {
                        name: "tools",
                        items: ["Maximize"]
                    }, {
                        name: "editing",
                        items: ["Scayt"]
                    }]
                }
            },


            language: {
                type: String,
                default: 'vi'
            },
            extraplugins: [{
                type: String,
                default: 'gallery'
            },
                {
                    default: 'imagepaste'
                }


            ],
        },
        data() {
            return {
                id: window.RaoViecApp.$view.createId(),
                editor: {},
            }
        },
        beforeUpdate() {
            var vm = this;
            const ckeditorId = vm.id;
            if (vm.value !== CKEDITOR.instances[ckeditorId].getData()) {
                CKEDITOR.instances[ckeditorId].setData(vm.value);
            }
            ;
        },
        mounted() {
            var vm = this;
            const ckeditorId = vm.id;
            const ckeditorConfig = {
                toolbar: vm.toolbar,
                language: vm.language,
                height: vm.height,
                extraPlugins: vm.extraplugins,
                image_removeLinkByEmptyURL: false,
                removePlugins: "colorbutton,colordialog,copyformatting,font,indentblock,image,justify,liststyle,print,sourcedialog,tableresize",
            };
            CKEDITOR.replace(ckeditorId, ckeditorConfig);
            CKEDITOR.instances[ckeditorId].setData(vm.value);
            CKEDITOR.instances[ckeditorId].on('change', () => {
                let ckeditorData = CKEDITOR.instances[ckeditorId].getData()
                if (ckeditorData !== vm.value) {
                    vm.$emit('input', ckeditorData)
                }
            });
        },
        destroyed() {
            var vm = this;
            const ckeditorId = vm.id;
            if (CKEDITOR.instances[ckeditorId]) {
                CKEDITOR.instances[ckeditorId].destroy();
            }
            ;
        }

    });
    vue.component('pagination', {
        props: ['current', 'total'],
        template: `
    <ul class="pagination " v-if="total > 1">
        <li class="page-item first" :class="{disabled : page == 1}"  @click.stop.prevent="first">
        <a href="#" class="page-link">
            <i class="ti-angle-double-left"></i>
        </a>
        </li>
        <li class="page-item prev" :class="{disabled : page == 1}" @click.stop.prevent="prev">
        <a href="#" class="page-link"><i class="ti-angle-left"></i></a>
        </li>
        <li class="waves-effect"
            v-for="item in total" @click.stop.prevent="setPage(item)"
            v-if="show(item)"
            :class=" { active : item == current} "
        >
        <a href="#" class="page-link">{{item}}</a>
        </li>
        <li class="page-item next" :class="{disabled : page == total}">
        <a href="#" class="page-link" @click.stop.prevent="next"><i class="ti-angle-right"></i></a>
        </li>
        <li class="page-item last" :class="{disabled : page == total}" @click.stop.prevent="last">
        <a href="#" class="page-link"><i class="ti-angle-double-right"></i></a>
        </li>
    </ul>
    `,
        mounted: function () {
            var vm = this;
        },
        data: function () {
            return {
                page: (this.current) ? this.current : 1,
            };
        },
        methods: {
            setPage(index) {
                this.page = index;
                // if (index != this.page) {
                //     this.page = index;
                // }
            },
            show(index) {
                if (this.current <= 3) {
                    if (index <= 5) {
                        return true;
                    } else {
                        return false
                    }
                } else if (this.current > this.total - 3) {
                    if (index > this.total - 5) {
                        return true;
                    } else {
                        return false
                    }
                }
                return Math.abs(index - this.current) < 3;
            },
            prev() {
                if (this.page > 1) {
                    this.page--;
                }
            },
            next() {
                if (this.page < this.total) {
                    this.page++;
                }
            },
            first() {
                this.page = 1;
            },
            last() {
                this.page = this.total;
            }
        },
        watch: {
            'page': function (newval, oldval) {
                if (newval != oldval) {
                    this.$emit('input', newval)
                }
            }
        }
    });
    return vue;
}

window.RaoViecComponent = new RaoViecComponentClass();
window.RaoViecApp = new RaoViecAppClass();
window.RaoViecApp.$view.init();
