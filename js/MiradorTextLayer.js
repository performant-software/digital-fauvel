var MiradorTextLayer = {

    // TODO: add more locales
    locales: {
        en: {
            translation: {
                'button-tooltip': 'Show Text Layer',
                'text-layer-none': 'None',
                'text-layer-en': 'English',
                'text-layer-fr': 'French',
                'text-layer-fro': 'Original'
            }
        }
    },

    template: Mirador.Handlebars.compile([
        '<a href="javascript:;" class="mirador-btn mirador-icon-text-layer" title="{{t "button-tooltip"}}">',
            '<i class="fa fa-align-left fa-lg fa-fw"></i>',
            '<i class="fa fa-caret-down"></i>',
            '<ul class="dropdown text-layer-list">',
              '<li class="text-layer-none"><i class="fa fa-ban fa-lg fa-fw"></i> {{t "text-layer-none"}}</li>',
              '<li class="text-layer-en"><i class="fa fa-font fa-lg fa-fw"></i> {{t "text-layer-en"}}</li>',
              '<li class="text-layer-fr"><i class="fa fa-font fa-lg fa-fw"></i> {{t "text-layer-fr"}}</li>',
              '<li class="text-layer-fro"><i class="fa fa-font fa-lg fa-fw"></i> {{t "text-layer-fro"}}</li>',
            '</ul>',
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

            $.Window.prototype.textLayerKeys = [
              'en',
              'fr',
              'fro'
            ];

            $.Window.prototype.listenForActions = function() {
                var _this = this;
                listenForActions.apply(this, arguments);

                this.eventEmitter.subscribe('focusUpdated' + this.id, function(event, focusState) {
                    // triggered when toggling viewing states or changing the current canvas
                    // a new OSD will be created, so just de-select the button
                    _this.element.find('.mirador-icon-text-layer').removeClass('selected');
                });

                var annotationTextPad = 20,
                  defaultLayer = 'en',
                  backdropColor = '#E6D9B7',
                  backdropOpacity = 0.7;
                var timeout;
                this.currentTextLayer = defaultLayer;
                this.eventEmitter.subscribe('annotationsRendered.' + _this.id, function() {
                  if (timeout) clearTimeout(timeout);
                  timeout = setTimeout(function() {
                    var items = _this.focusModules.ImageView.annotationsLayer.drawTool.annotationsToShapesMap;
                    if (items) {
                      for (key in items) {
                        var item = items[key][0];
                        if (item.data && item.data.annotation && item.data.annotation.resource) {
                          var resource = item.data.annotation.resource;
                          var bounds = item.bounds;
                          if (resource.length > 0) resource = resource[0];
                          if (resource.chars && bounds) {
                            var r = new paper.Path.Rectangle({
                              point: [bounds.x, bounds.y],
                              size: [bounds.width, bounds.height],
                              fillColor: backdropColor,
                              opacity: backdropOpacity,
                              name: item.name + '_' + resource.language + '_bgrect',
                              visible: resource.language == _this.currentTextLayer
                            });
                            var t = new paper.PointText();
                            t.point = new paper.Point(bounds.x + annotationTextPad, bounds.y + bounds.height - annotationTextPad);
                            t.content = resource.chars;
                            t.fontSize = (bounds.height - 2 * annotationTextPad) + "px";
                            t.name = item.name + '_' + resource.language + '_text';
                            t.visible = (resource.language == _this.currentTextLayer);
                            if (t.bounds.width + annotationTextPad > r.bounds.width) r.bounds.width = t.bounds.width + annotationTextPad * 2.0;
                            item.visible = false;
                          }
                        }
                      }
                    }
                    paper.view.draw();
                  }, 300);
                });
            };

            $.Window.prototype.bindEvents = function() {
                var _this = this;
                bindEvents.apply(this, arguments);

                // add button (the compiled template) to the DOM
                this.element.find('.window-manifest-navigation').prepend(self.template());

                _this.bindTextLayerNavigation();
            };

            $.Window.prototype.bindTextLayerNavigation = function() {
                var _this = this;

                this.element.find('.mirador-icon-text-layer').on('mouseenter',
                  function() {
                    _this.element.find('.text-layer-list').stop().slideFadeToggle(300);
                  }).on('mouseleave',
                  function() {
                    _this.element.find('.text-layer-list').stop().slideFadeToggle(300);
                  });

                this.element.find('.text-layer-none').on('click', function() {
                  var view = _this.focusModules.ImageView;
                  if (view.hud.annoState.current === 'none') {
                    view.hud.annoState.startup(this);
                  }
                  if (view.hud.annoState.current !== 'off') {
                    view.forceShowControls = false;
                    view.hud.annoState.displayOff(this);
                    view.annotationState = 'off';
                  }
                  _this.currentTextLayer = 'none';
                });

                _this.textLayerKeys.forEach(function(layerType) {
                  _this.bindTextLayerClick(layerType);
                });
            };

            $.Window.prototype.bindTextLayerClick = function(layerType) {
              var _this = this;
              this.element.find('.text-layer-' + layerType).on('click', function() {
                var view = _this.focusModules.ImageView;
                if (view.hud.annoState.current === 'none') {
                  view.hud.annoState.startup(this);
                }
                if (view.hud.annoState.current === 'off') {
                  view.hud.annoState.displayOn(this);
                  view.annotationState = 'on';
                }
                paper.project.getItems({name: new RegExp('_(' + _this.textLayerKeys.join('|') + ')_')}).forEach(function(item) {
                  item.visible = false;
                });
                paper.project.getItems({name: new RegExp('_' + layerType + '_')}).forEach(function(item) {
                  item.visible = true;
                });
                _this.currentTextLayer = layerType;
              });
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
