var MiradorTextLayer = {

    // TODO: add more locales
    locales: {
        en: {
            translation: {
                'button-tooltip': 'Show Text Layer',
                'text-layer-none': 'None',
                'text-layer-en': 'English',
                'text-layer-fr': 'French',
                'text-layer-fro': 'Original',
                'search-field': 'Search',
                'search-placeholder': 'Search',
                'search-results-none': 'No results found.',
                'search-results-one': 'result found.',
                'search-results-multiple': 'results found.'
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

    searchTemplate: Mirador.Handlebars.compile([
        '<a href="javascript:;" class="mirador-search">',
          '<input type="search" class="mirador-search-field form-control" placeholder="{{t "search-placeholder"}}" title="{{t "search-field"}}">',
          '<span class="fa fa-times-circle fa-sm fa-fw mirador-clear-search"></span>',
          '<ul class="dropdown search-results-list">',
          '</ul>',
        '</a>'
    ].join('')),

    searchResultSummaryTemplate: Mirador.Handlebars.compile([
        '<li class="search-result-summary">',
        '{{#if noResults}}',
          '{{t "search-results-none"}}',
        '{{else}}',
          '{{resultsCount}} ',
          '{{#if oneResult}}',
            '{{t "search-results-one"}}',
          '{{else}}',
            '{{t "search-results-multiple"}}',
          '{{/if}}',
        '{{/if}}',
        '</li>'
    ].join('')),

    searchResultTemplate: Mirador.Handlebars.compile(
        '<li class="mirador-search-result" data-canvasid="{{canvasId}}" data-coordinates="{{coordinates}}" data-language="{{language}}" data-anno-id="{{annotationId}}">{{transcriptionText}} ({{canvasSlug}})</li>'
    ),

    init: function() {
        var self = this;

        i18next.on('initialized', function() {
            for (var locale in self.locales) {
                // add translations from each locale
                var ns = 'translation';
                i18next.addResourceBundle(locale, ns, self.locales[locale][ns], true, true);
            };
        });

        var lunrData, lunrIndex, searchDocs;
        $.ajax({
          url: "/data/search_index.json",
          cache: true,
          method: 'GET',
          success: function(data) {
            lunrData = data;
            lunrIndex = lunr.Index.load(lunrData.index);
            searchDocs = lunrData.docs;
          }
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

            $.Window.prototype.annotationTextPad = jQuery("#viewer").data("annotation-text-pad");
            $.Window.prototype.defaultLayer = jQuery("#viewer").data("default-layer");
            $.Window.prototype.backdropColor = jQuery("#viewer").data("backdrop-color");
            $.Window.prototype.backdropOpacity = jQuery("#viewer").data("backdrop-opacity");

            $.Window.prototype.listenForActions = function() {
                var _this = this;
                listenForActions.apply(this, arguments);

                this.eventEmitter.subscribe('focusUpdated' + this.id, function(event, focusState) {
                    // triggered when toggling viewing states or changing the current canvas
                    // a new OSD will be created, so just de-select the button
                    _this.element.find('.mirador-icon-text-layer').removeClass('selected');
                });

                var timeout;
                this.currentTextLayer = this.defaultLayer;
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
                              fillColor: _this.backdropColor,
                              opacity: _this.backdropOpacity,
                              name: item.name + '_' + resource.language + '_bgrect',
                              visible: resource.language == _this.currentTextLayer
                            });
                            var t = new paper.PointText();
                            t.point = new paper.Point(bounds.x + _this.annotationTextPad, bounds.y + bounds.height - _this.annotationTextPad);
                            t.content = resource.chars;
                            t.fontSize = (bounds.height - 2 * _this.annotationTextPad) + "px";
                            t.name = item.name + '_' + resource.language + '_text';
                            t.visible = (resource.language == _this.currentTextLayer);
                            if (t.bounds.width + _this.annotationTextPad > r.bounds.width) r.bounds.width = t.bounds.width + _this.annotationTextPad * 2.0;
                            item.visible = false;
                            item.data.bgrect = r;
                            item.data.text = t;
                          }
                        }
                      }
                    }
                    paper.view.draw();
                  }, 300);
                });

                this.element.on("click", ".mirador-search-result", function(event) {
                  event.stopPropagation();

                  var canvasid = jQuery(this).attr('data-canvasid'),
                      language = jQuery(this).attr('data-language'),
                      annoId = jQuery(this).attr('data-anno-id'),
                      coordinates = jQuery(this).attr('data-coordinates'),
                      xywh = coordinates && coordinates.split('=')[1].split(',').map(Number),
                      bounds = xywh && {x: xywh[0], y: xywh[1], width: xywh[2], height: xywh[3]};
                  var options = {
                    "canvasID": canvasid,
                    "bounds": bounds
                  };
                  if (_this.viewType !== "ImageView") {
                    _this.toggleImageView(options['canvasID']);
                    _this.getAnnotations();
                  }
                  if (_this.canvasID == canvasid && _this.currentTextLayer != language) {
                    paper.project.getItems({name: new RegExp('_(' + _this.textLayerKeys.join('|') + ')_')}).forEach(function(item) {
                      item.visible = false;
                    });
                    paper.project.getItems({name: new RegExp('_' + language + '_')}).forEach(function(item) {
                      item.visible = true;
                    });
                  }
                  _this.currentTextLayer = language;
                  setTimeout(function() {
                    _this.eventEmitter.publish('SET_CURRENT_CANVAS_ID.' + _this.id, options);
                    setTimeout(function() {
                      _this.clearHighlight();
                      var item = _this.focusModules.ImageView.annotationsLayer.drawTool.annotationsToShapesMap[annoId];
                      if (item && item.length > 0 && item[0].data.bgrect) {
                        item[0].data.bgrect.fillColor = "#FFFFFF";
                      }
                    }, 1000);
                  }, 1000);
                });
            };

            $.Window.prototype.bindEvents = function() {
                var _this = this;
                bindEvents.apply(this, arguments);

                // add button (the compiled template) to the DOM
                this.element.find('.window-manifest-navigation').prepend(self.template());
                this.element.find('.window-manifest-navigation').prepend(self.searchTemplate());

                _this.bindTextLayerNavigation();
                _this.bindSearch();
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

            $.Window.prototype.bindSearch = function() {
              var _this = this;
              this.element.find('.mirador-search-field').on('keyup', function() {
                var query = jQuery(this).val();
                if (query.length > 0) {
                  _this.element.find('.mirador-clear-search').css({opacity: 1});
                  var results = lunrIndex.search(query);
                  _this.element.find('.search-results-list').empty().show();
                  _this.element.find('.search-results-list').append(self.searchResultSummaryTemplate({ resultsCount: results.length, noResults: results.length === 0, oneResult: results.length === 1 }));
                  results.forEach(function(result) {
                    var canvasString = result.ref.split('|')[0];
                    var canvasParts = canvasString.split('#');
                    var canvasSubParts = canvasParts[0].split('/');
                    var doc = searchDocs[result.ref];
                    var context = {
                      canvasId: canvasParts[0],
                      canvasSlug: canvasSubParts[canvasSubParts.length - 1],
                      coordinates: canvasParts[canvasParts.length - 1],
                      language: doc.language,
                      transcriptionText: doc.text,
                      annotationId: doc.id
                    };
                    _this.element.find('.search-results-list').append(self.searchResultTemplate(context));
                  });
                }
                else {
                  _this.element.find('.search-results-list').hide();
                  _this.element.find('.mirador-clear-search').css({opacity: 0});
                }
              });
              this.element.find('.mirador-clear-search').on('click', function() {
                _this.element.find('.mirador-search-field').val('').trigger('keyup');
                _this.clearHighlight();
              });
            };

            $.Window.prototype.clearHighlight = function() {
              var _this = this;
              if (this.focusModules.ImageView) {
                var items = this.focusModules.ImageView.annotationsLayer.drawTool.annotationsToShapesMap;
                for (key in items) {
                  items[key].forEach(function(item) {
                    if (item.data && item.data.bgrect) {
                      item.data.bgrect.fillColor = _this.backdropColor;
                    }
                  });
                }
              }
            }

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
