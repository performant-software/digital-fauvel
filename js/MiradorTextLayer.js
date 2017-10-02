var MiradorTextLayer = {

    // TODO: add more locales
    locales: {
        en: {
            translation: {
                'button-tooltip': 'Show Text Layer'
            }
        }
    },

    template: Mirador.Handlebars.compile([
        '<a href="javascript:;" class="mirador-btn mirador-icon-disable-zoom contained-tooltip" title="{{t "button-tooltip"}}">',
            '<i class="fa fa-align-left fa-lg fa-fw"></i>',
        '</a>'
    ].join('')),

    init: function() {
        var self = this;

        i18next.on('initialized', function() {
            for (var locale in self.locales) {
                // add translations from each locale
                var ns = 'translation';
                i18next.addResourceBundle(locale, ns, self.locales[locale][ns], true, true);
            };
        });

        /*
         * Mirador.Window
         */
        (function($) {

            /* 0. Declare variables for the constructor and any methods that we'll override. */

            var constructor = $.Window,
                prototype = $.Window.prototype,
                bindEvents = $.Window.prototype.bindEvents,
                listenForActions = $.Window.prototype.listenForActions;

            /* 1. Override methods and register (and document!) new ones. */

            $.Window.prototype.listenForActions = function() {
                var _this = this;
                listenForActions.apply(this, arguments);

                this.eventEmitter.subscribe('focusUpdated' + this.id, function(event, focusState) {
                    // triggered when toggling viewing states or changing the current canvas
                    // a new OSD will be created, so just de-select the button
                    _this.element.find('.mirador-icon-disable-zoom').removeClass('selected');
                });
            };

            $.Window.prototype.bindEvents = function() {
                var _this = this;
                bindEvents.apply(this, arguments);

                // add button (the compiled template) to the DOM
                this.element.find('.window-manifest-navigation').prepend(self.template());
                // add click handler for the new button
                this.element.find('.mirador-icon-disable-zoom').on('click', function(event) {
                    _this.showTextLayer(this, !_this.textLayerShown);
                });
            };

            /*
             * Mirador.Window.prototype.showTextLayer
             *
             * Shows and hides the textLayer
             */
            $.Window.prototype.showTextLayer = function() {
                console.log("showed the text layer");
            };

            /* 2. Override the constructor. */

            $.Window = function() {
                return new constructor(jQuery.extend(true, Array.prototype.slice.call(arguments)[0], {
                    textLayerShown: false
                }));
            };
            $.Window.prototype = prototype;
        })(Mirador);

        /*
         * Mirador.BookView
         * Mirador.ImageView
         */
        (function($) {
            ['BookView', 'ImageView'].forEach(function(viewType) {

                /* 0. */

                var constructor = $[viewType],
                    prototype = $[viewType].prototype,
                    listenForActions = $[viewType].prototype.listenForActions;
            
                /* 1. */

                $[viewType].prototype.listenForActions = function() {
                    var _this = this;
                    listenForActions.apply(this, arguments);

                    this.eventEmitter.subscribe('disableOsdZoom.' + this.windowId, function(event) {
                        // 1 is the multiplicative identity
                        _this.osd.zoomPerClick = 1;
                        _this.osd.zoomPerScroll = 1;
                    });
                    this.eventEmitter.subscribe('enableOsdZoom.' + this.windowId, function(event) {
                        // restore the default settings
                        _this.osd.zoomPerClick = _this.defaultWindowZoomPerClick;
                        _this.osd.zoomPerScroll = _this.defaultWindowZoomPerScroll;
                    });
                };

                /* 2. */

                $[viewType] = function() {
                    return new constructor(jQuery.extend(true, Array.prototype.slice.call(arguments)[0], {
                        // TODO: read this from the OSD configuration instead of using this magic number
                        defaultWindowZoomPerClick: 1.2,
                        defaultWindowZoomPerScroll: 1.2
                    }));
                };
                $[viewType].prototype = prototype;
            });
        })(Mirador);
    }
};

$(document).ready(function() {
    MiradorTextLayer.init();
});
