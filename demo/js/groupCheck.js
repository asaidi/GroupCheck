;
(function($, window, document, undefined) {

    // 'use strict';

    var pluginName = 'groupCheck';
    var defaults = {
        triggerClass: 'js-groupCheckAll',
        itemClass: 'js-groupCheckItem',
        activeClass: 'checked',
        onInit: null,
        onComplete: false
    };

    function Plugin(element, options) {
        this.element = element;
        this._name = pluginName;
        this._defaults = $.fn.groupCheck.defaults;
        this.options = $.extend({}, defaults, options);
        
        this.init();
    }

    
    $.extend(Plugin.prototype, {
        init: function() {
            this._buildCache();
            this._bindEvents();
            this._updateLength();
        },

        _buildCache: function() {
            // parent element
            this.$element       = this.element;

            this.$item          = null;
            this.$items         = $(this.$element).find("." + this.options.itemClass);
            this.$trigger       = $(this.$element).find("." + this.options.triggerClass);
            this.itemsLng       = $(this.$items).length;
            this.allChecked     = false;
            this.activeClass    = this.options.activeClass;
        },

        _bindEvents: function() {
            var plugin = this;
            plugin.$items.on('click' + '.' + this._name, function(e) {
                e.stopPropagation();
                plugin.checkItems(this);
            });

            plugin.$trigger.on('click' + '.' + this._name, function(e) {
                e.stopPropagation();
                plugin._toggleAll(this);
            });
        },
        _updateLength: function () {
            var plugin = this;
            this.cLng = $(this.$element).find("."+this.activeClass).not(this.$trigger).length;
            this.allChecked = (this.cLng === this.$items.length);

            return this.allChecked;
        },
        checkItems : function (elem) {
            var plugin = this;
            
            if ( $(elem).hasClass(this.activeClass) ) {
                plugin._uncheck($(elem));
                plugin._uncheck(this.$trigger);
                plugin._updateLength.call(plugin);
                
            } else {
                plugin._check($(elem));
                plugin._updateLength.call(plugin);
                if (this.allChecked) {
                    plugin._check(this.$trigger);
                }
            }
            this.callback();
        },
        _check: function (elem) {
            $(elem).addClass(this.activeClass);
        },
        _uncheck: function (elem) {
            $(elem).removeClass(this.activeClass);
            // this.callback();
        },
        _toggleAll: function (elem) {
            $(elem).toggleClass(this.activeClass);
            if ( $(elem).hasClass(this.activeClass)) {
                this.$items.addClass(this.activeClass);
            } else {
                this.$items.removeClass(this.activeClass);
            }
            this.callback();
        },
        
        callback: function () {
            // Cache onComplete option
            var onComplete = this.options.onComplete;
            
            if (typeof onComplete === 'function') {
                onComplete.call(this.element);
            }
        }
    });

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, 'plugin_' + pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);