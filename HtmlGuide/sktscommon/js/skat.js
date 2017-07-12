/* ========================================================================
 * Bootstrap: transition.js v3.3.1
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.1
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.1'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.5
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.5'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.1
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.1'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var delta = direction == 'prev' ? -1 : 1
    var activeIndex = this.getItemIndex(active)
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.1
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $(this.options.trigger).filter('[href="#' + element.id + '"], [data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.1'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true,
    trigger: '[data-toggle="collapse"]'
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.find('> .panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $.extend({}, $this.data(), { trigger: this })

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.1
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.1'

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.divider):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--                        // up
    if (e.which == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="menu"]', Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.1
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options        = options
    this.$body          = $(document.body)
    this.$element       = $(element)
    this.$backdrop      =
    this.isShown        = null
    this.scrollbarWidth = 0

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.1'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      if (that.options.backdrop) that.adjustBackdrop()
      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .prependTo(this.$element)
        .on('click.dismiss.bs.modal', $.proxy(function (e) {
          if (e.target !== e.currentTarget) return
          this.options.backdrop == 'static'
            ? this.$element[0].focus.call(this.$element[0])
            : this.hide.call(this)
        }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    if (this.options.backdrop) this.adjustBackdrop()
    this.adjustDialog()
  }

  Modal.prototype.adjustBackdrop = function () {
    this.$backdrop
      .css('height', 0)
      .css('height', this.$element[0].scrollHeight)
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', '')
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.1
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.1'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (self && self.$tip && self.$tip.is(':visible')) {
      self.hoverState = 'in'
      return
    }

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var $container   = this.options.container ? $(this.options.container) : this.$element.parent()
        var containerDim = this.getPosition($container)

        placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < containerDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > containerDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < containerDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isHorizontal) {
    this.arrow()
      .css(isHorizontal ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isHorizontal ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    return (this.$tip = this.$tip || $(this.options.template))
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this    = $(this)
      var data     = $this.data('bs.tooltip')
      var options  = typeof option == 'object' && option
      var selector = options && options.selector

      if (!data && option == 'destroy') return
      if (selector) {
        if (!data) $this.data('bs.tooltip', (data = {}))
        if (!data[selector]) data[selector] = new Tooltip(this, options)
      } else {
        if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      }
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.1
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.1'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this    = $(this)
      var data     = $this.data('bs.popover')
      var options  = typeof option == 'object' && option
      var selector = options && options.selector

      if (!data && option == 'destroy') return
      if (selector) {
        if (!data) $this.data('bs.popover', (data = {}))
        if (!data[selector]) data[selector] = new Popover(this, options)
      } else {
        if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      }
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.1
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var process  = $.proxy(this.process, this)

    this.$body          = $('body')
    this.$scrollElement = $(element).is('body') ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', process)
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.1'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = 'offset'
    var offsetBase   = 0

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.offsets = []
    this.targets = []
    this.scrollHeight = this.getScrollHeight()

    var self     = this

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.1
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.3.1'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.1
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      =
    this.unpin        =
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.1'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && colliderTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = $('body').height()

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

/*jshint strict:false */
/*jshint smarttabs:true*/
/*jshint expr:true */
var xsdMatrix = {
    "types": {
        "decimal": [
			"enumeration",
			"fractionDigits",
			"maxExclusive",
			"maxInclusive",
			"minExclusive",
			"minInclusive",
			"minLength",
			"pattern",
			"totalDigits",
			"whiteSpace"
        ],
        "dkDate": [
			"enumeration",
			"maxDate",
            "minDate",
			"minLength",
			"pattern",
			"whiteSpace"
        ],
        "dkDecimal": [
			"enumeration",
            "fractionDigits",
            "maxExclusive",
            "maxInclusive",
            "minExclusive",
            "minInclusive",
            "minLength",
            "pattern",
            "totalDigits",
            "whiteSpace"
        ],
        "dkInteger": [
			"enumeration",
			"maxExclusive",
			"maxInclusive",
            "maxLength",
			"minExclusive",
			"minInclusive",
			"minLength",
			"pattern",
			"totalDigits",
			"whiteSpace"
        ],
        "dkPercent": [
			"enumeration",
			"fractionDigits",
			"maxExclusive",
			"maxInclusive",
			"minExclusive",
			"minInclusive",
            "minLength",
			"pattern",
			"totalDigits",
			"whiteSpace"
        ],
        "integer": [
			"enumeration",
            "maxExclusive",
            "maxInclusive",
            "maxLength",
            "minExclusive",
            "minInclusive",
            "minLength",
            "pattern",
            "totalDigits",
            "whiteSpace"
        ],
        "string": [
			"enumeration",
			"length",
			"maxLength",
			"minLength",
			"pattern",
			"whiteSpace"
        ]
    }
};
var facet = {
    fractionDigits: function ($fieldElem, facetValue) {
        var fieldValue = $.trim(helper.convertToNumber($fieldElem.val()));
        return (fieldValue !== "" && helper.countDecimals(Number(fieldValue)) > Number(facetValue)) ? false : true;
    },
    length: function ($fieldElem, facetValue) {
        var fieldValue = $.trim($fieldElem.val());
        return (fieldValue !== "" && fieldValue.toString().length !== Number(facetValue)) ? false : true;
    },
    maxDate: function ($fieldElem, facetValue) {
        var fieldValue = $.trim($fieldElem.val());
        var fieldDateValue = helper.convertToDate(fieldValue);
        var maxDateValue = helper.convertToDate(facetValue);
        if (!isNaN(Date.parse(fieldDateValue)) && !isNaN(Date.parse(maxDateValue))) {
                return (fieldDateValue > maxDateValue) ? false : true;
        }
        else {
            return true;
        }
    },
    maxExclusive: function ($fieldElem, facetValue) {
        var fieldValue = $.trim(helper.convertToNumber($fieldElem.val()));
        return (fieldValue !== "" && Number(fieldValue) >= Number(facetValue)) ? false : true;
    },
    maxInclusive: function ($fieldElem, facetValue) {
        var fieldValue = $.trim(helper.convertToNumber($fieldElem.val()));
        return (fieldValue !== "" && Number(fieldValue) > Number(facetValue)) ? false : true;
    },
    maxLength: function ($fieldElem, facetValue) {
        var fieldValue = $.trim($fieldElem.val());
        return (fieldValue !== "" && fieldValue.toString().length > Number(facetValue)) ? false : true;
    },
    minDate: function ($fieldElem, facetValue) {
        var fieldValue = $.trim($fieldElem.val());
        var fieldDateValue = helper.convertToDate(fieldValue);
        var minDateValue = helper.convertToDate(facetValue);
        if (!isNaN(Date.parse(fieldDateValue)) && !isNaN(Date.parse(minDateValue))) {
                return (fieldDateValue < minDateValue) ? false : true;
        }
        else {
            return true;
        }
    },
    minExclusive: function ($fieldElem, facetValue) {
        var fieldValue = $.trim(helper.convertToNumber($fieldElem.val()));
        return (fieldValue !== "" && Number(fieldValue) <= Number(facetValue)) ? false : true;
    },
    minInclusive: function ($fieldElem, facetValue) {
        var fieldValue = $.trim(helper.convertToNumber($fieldElem.val()));
        return (fieldValue !== "" && Number(fieldValue) < Number(facetValue)) ? false : true;
    },
    minLength: function ($fieldElem, facetValue) {
        var fieldValue = $.trim($fieldElem.val());
        //some dk XSD types return NaN. 
        //Reset this when checking minimum length as it is only the relative length of the string that is important
        if (fieldValue.toString() === "NaN") fieldValue = "";
        return (fieldValue !== "" && fieldValue.toString().length < Number(facetValue)) ? false : true;
    },
    pattern: function ($fieldElem, facetValue) {
        var fieldValue = $.trim($fieldElem.val());
        try {
            var regexp = eval(facetValue);
            return (fieldValue !== "" && !regexp.test(fieldValue)) ? false : true;
        }
        catch (err) {
            console.log(err);
            return true;
        }
    },
    totalDigits: function ($fieldElem, facetValue) {
        var fieldValue = $fieldElem.val(),
            trimmedValue = $.trim(fieldValue);
        if (trimmedValue !== "") fieldValue = helper.convertToNumber(fieldValue);
        return (trimmedValue !== "" && fieldValue.toString().length !== Number(facetValue)) ? false : true;
    },
    whiteSpace: function ($fieldElem, facetValue) {
        var fieldValue = $.trim($fieldElem.val());
        switch (facetValue) {
            case "collapse":
                var regexp = /\s/g;			//No whitespaces
                //If there is a field value AND it is a decimal number
                return (fieldValue !== "" && regexp.test(fieldValue)) ? false : true;
            case "preserve":
                return true;
            case "replace":
                return true;
        }
    }
};
var xsd = {
    checkField: function ($fieldElem) {
        var dataType = $fieldElem.attr("data-show-type"),		//The data type to test
			facetTypes = [],									//The facets types to test
			facetValues = [];									//The values to validate the facets against
        //If the field's parents are not hidden AND 
        //the field is not readonly AND 
        //the field is not disabled
        if ($fieldElem.parents(".hidden").length < 1 && !$fieldElem.attr("readonly") && !$fieldElem.attr("disabled")) {
            //If there is a facet type attribute, split into array
            if ($fieldElem.attr("data-show-facets") !== undefined) facetTypes = $fieldElem.attr("data-show-facets").split("!!");
            //If there is a facet value attribute, split into array
            if ($fieldElem.attr("data-show-facet-values") !== undefined) facetValues = $fieldElem.attr("data-show-facet-values").split("!!");
            //Loop through the XSD types
            $.each(xsdMatrix.types, function (xsdType, xsdFacets) {
                //If the dataType is the same as a defined XSD type
                if (dataType === xsdType) {
                    //Concat the xsd function to call
                    var XSDfncName = "IS" + xsdType;
                    //Call the function and show/hide the error (the error msg shown/hidden is ALWAYS the first one). 
                    (xsd[XSDfncName]($fieldElem)) ? validation.hideError($fieldElem, 0) : validation.showError($fieldElem, 0);
                    //Loop through the facets
                    for (var i = 0; i < facetTypes.length; i++) {
                        //If the facet type is allowed in the xsd
                        if (jQuery.inArray(facetTypes[i], xsdFacets) !== -1) {
                            //Concat the xsd function to call
                            var FACETfncName = facetTypes[i];

                            //Call the function and show/hide the appropriate error (the first error is reserved for the XSD type error)
                            (facet[FACETfncName]($fieldElem, facetValues[i])) ? validation.hideError($fieldElem, i + 1) : validation.showError($fieldElem, i + 1);
                        }
                    }
                }
            });
        }
    },
    ISdecimal: function (fieldValue) {
        var regexp = /^[\-+]?[0-9]\d*(\.\d+)?$/;			//Allow only decimal number
        //If there is a field value AND it is a decimal number
        return (fieldValue !== "" && !regexp.test(fieldValue)) ? false : true;
    },
    ISdkDate: function ($fieldElem) {
        var fieldValue = $.trim($fieldElem.val());
        if (fieldValue !== "") {
            var strippedValue = fieldValue.replace(/\D/g, ''),          //Only digits (used for validation and formatting)
				formattedFieldValue = fieldValue,                       //The field value as deault
				containsIllegalChars = /[a-z%,]/i.test(fieldValue),     //Check for lettera, comma and procent
				fixedYear = $("#sktsCurrentYear").val(),				//The fixed year (hidden field)
				hasFixedYear = $fieldElem.hasClass("js-fixed-year") && fixedYear !== "";	//Check that the date field is using the fixed year and that the fixed year is defined
            if (hasFixedYear) {
                //Add the fixed year to the date for validation
                if (strippedValue.length <= 4) {
                    strippedValue = strippedValue.substr(0, 4) + fixedYear;
                }
                //If the year type does NOT match the fixedYear, return false
                if (strippedValue.substr(4, 4) !== fixedYear) return false;
            }
            /*
            if (strippedValue.length === 6) {
                //Add the prefix "20" to the year for validation purposes
                strippedValue = strippedValue.substr(0, 4) + 20 + strippedValue.substr(4, 2);
            }
            */
            //If the stripped value is not a valid date OR the field contains illegal chars
            if (!validation.checkDkDate(strippedValue) || containsIllegalChars) {
                return false;
            }
            else {
                //Format the date
                formattedFieldValue = strippedValue.substr(0, 2) + "-" + strippedValue.substr(2, 2) + "-" + strippedValue.substr(4, 4);
                //Write the reconstructed value to the field
                $fieldElem.val(formattedFieldValue);
                //Show or hide any previous values displayed below the field
                validation.processField($fieldElem);
                return true;
            }
        }
        else {
            return true;
        }
    },
    ISdkDecimal: function ($fieldElem) {
        var fieldValue = $.trim($fieldElem.val());
        //If there is a field value AND it is a decimal number
        return (!validation.checkDkDecimal(fieldValue)) ? false : true;
    },
    ISdkInteger: function ($fieldElem) {
        var fieldValue = $.trim($fieldElem.val());
        //If there is a field value AND it is a number and has no decimal points
        return (!validation.checkDkInteger(fieldValue)) ? false : true;
    },
    ISdkPercent: function ($fieldElem) {
        var fieldValue = $.trim($fieldElem.val());
        //If there is a field value AND it is decimal
        return (fieldValue !== "" && !xsd.ISdkDecimal($fieldElem)) ? false : true;
    },
    ISinteger: function ($fieldElem) {
        var fieldValue = $.trim($fieldElem.val()),
			fieldNumberValue = helper.testInteger(fieldValue),	//Convert to valid javascript number
			decimalPoints = helper.countDecimals(fieldNumberValue);
        //If there is a field value AND it is a number and has no decimal points
        return (fieldValue !== ""  && fieldValue !== "-" && fieldValue !== "+" && (isNaN(fieldNumberValue) || decimalPoints > 0)) ? false : true;
    },
    ISstring: function ($fieldElem) {
        var fieldValue = $.trim($fieldElem.val());
        //If there is a field value AND it is a string
        return (fieldValue !== "" && (typeof fieldValue !== 'string')) ? false : true;
    }
};

var appTexts = {
    bottomButton: 'Vis opgørelsen fra ',
    fieldInfo: 'Tallet medregnes, når du trykker "beregn"',
    warningOwnBusiness: 'Når du har virksomhedsbeløb indkomst skal du fremover selvangive for at få en årsopgørelse. \n\nDet skal du gøre senest d. 1. juli.',
    warningPdf: 'Du skal være opmærksom på, at din browser kan gemme en kopi af det pdf-dokument, du åbner.\n\nHvis andre har adgang til denne computer, anbefaler vi derfor, at du sletter browserens midlertidige filer, når du er færdig med at bruge TastSelv. Du kan få hjælp til dette, efter du er logget af TastSelv.',
    loadingTextSR: 'Siden hentes',	//Only for screen readers (if there is no loadingText)
    loadingText: ''
};
var appVars = {
    is_firefox: navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
    is_mobile: navigator.userAgent.toLowerCase().indexOf('mobile') > -1,
    is_tablet: navigator.userAgent.toLowerCase().indexOf('tablet') > -1,
    wrappedPage: $(".skts-wrap").length > 0,
    cookieDomain: '', //TODO - skal rettes til ".skat.dk"
    expandedHiddenFieldPrefix: 'expandedStatusFor_' //TODO - Set the correct name for the fields that save the expanded section status (as expected on the server)
};
var cookieName = 'cookie4u',
	cookieNo = 'ok4u=no',
	cookieYes = 'ok4u=yes',
	cookieDomain = appVars.cookieDomain,
	cookiePath = '/',
	cookieList = { cookiesToDelete: [{ name: 'cookie4u', path: '/', domain: appVars.cookieDomain }, { name: 'WT_FPC', path: '/', domain: '.' }] };
var cookieWarning = {
    init: function () {
        var currentCookieSetting = readCookie(cookieName);
        if ($('html').is('.ie8')) {
            var head = document.getElementsByTagName('head')[0],
				style = document.createElement('style');
            style.type = 'text/css';
            style.styleSheet.cssText = ':before,:after{content:none !important';
            head.appendChild(style);
            setTimeout(function () {
                head.removeChild(style);
            }, 0);
        }
        if (currentCookieSetting !== cookieYes && currentCookieSetting !== cookieNo) {
            $('.skts-cookieouter').show();
            writeCookie(cookieName, cookieYes, 365, cookieDomain, cookiePath);
        }
    }
};
var helper = {
    addCheckForChangesByClassName: function (klassenavn) {
        if (document.getElementsByClassName) {
            var elements = document.getElementsByClassName(klassenavn);
            for (var i = 0; i < elements.length; i++) {
                helper.addOnClick(elements[i]);
            }
        }
    },
    addOnClick: function (elem) {
        elem.onclick = (function () {
            // Gemmer den oprindelige funktions pointer i en variabel så denne kan blive kaldt.
            var origOnClick = elem.onclick;
            // Returner den nye onclick funktion som udfører checkForlade side, efterfulgt af den gamle onclick
            return function () {
                // Hvis vi skal forlade siden, returnerer vi false, for så bliver der ikke udført mere.
                if (!validation.showConfirm(appTexts.warningPdf)) {
                    return false;
                }
                // Hvis der var en gammel onclick, bliver den udført
                if (origOnClick !== null) {
                    return origOnClick();
                }
            };
        })();
    },
    countDecimals: function (value) {
        if (Math.floor(value) === value || isNaN(value)) return 0;
        return value.toString().split(".")[1].length || 0;
    },
    convertToDate: function (value) {
        var dsplit = value.split("-"),
            d=new Date(dsplit[2],dsplit[1]-1,dsplit[0]);
        return d;
    },
    convertToNumber: function (value) {
        //Remove any thousand seperator and convert the comma to a decimal point
        var convertedFromDanish = value.replace(/\./g, '').replace(/,/g, '.');
        //Check if the converted number is valid
        if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(convertedFromDanish))
            return Number(convertedFromDanish);
        return NaN;
    },
    closeModal: function() {
        //An open modal window
        var $modalOpen = $(".modal.in");
        //If the modal window is open then hide it
        if($modalOpen.length > 0) $modalOpen.modal('hide');
    },
    findElement: function(elementSelector) {
        var $idSelector = $("[id="+elementSelector+"]"),
            $nameSelector = $("[name="+elementSelector+"]");
        //If the selector is an id, return as object
        if ($idSelector.length) return $idSelector;
        //If the selector is a name, return as object
        if ($nameSelector.length) return $nameSelector;
        //If the selector is neither a name or id, return undefined
        if ($idSelector.length === 0 && $nameSelector.length === 0) return undefined;
    },
    focusField: function (formField, noScroll) {
        var $formField = $(formField);
        if ($formField.length) {
            if ($formField.prop("type").indexOf("select") !== -1) {
                //If the select box is using the chosen plugin
                if ($formField.hasClass("chosen-select")) {
                    //Bugfix to prevent autoselect of the first option
                    setTimeout(function () {
                        //Set focus in the chosen select 
                        $formField.trigger("chosen:open");
                    }, 500);
                }
                else {
                    //Set focus in the normal select
                    $formField.focus();
                }
            }
            else {
                $formField.focus();
            }
            if (!noScroll) {
                //Scrolls to the element minus 35 (so the label is shown)
                window.scrollTo(0, $formField.offset().top - 35);
            }
        }
    },
    formatNumberWithSeparator: function (nStr) {
        return nStr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    formatNumber: function (fieldValue, formatPattern) {
        return $.formatNumber(fieldValue, {format:formatPattern, locale:"dk"});
    },
    getKeyCode: function (str) {
        return str.charCodeAt(str.length - 1);
    },
    isDanishType: function ($fieldElem) {
        if ($fieldElem.is('[data-show-type]')) return ($fieldElem.attr('data-show-type').match('^dk')) ? true : false;
    },
    preventDefault: function (e) {
        e.preventDefault();
    },
    preventFocus: function () {
        $(this).blur();
    },
    showPreviousHeaders: function (elem) {
        var mainHeader = elem.prevAll(".row").has("h5").first(),
			subHeader = elem.prevAll(".row").has("h6").first();
        mainHeader.removeClass("hidden");
        if (subHeader.index() > mainHeader.index()) {
            subHeader.removeClass("hidden");
        }
    },
    testInteger: function (value) {
        if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value))
            return Number(value);
        return NaN;
    }
};
var page = {
    init: function () {
        //Bind all the page load actions
        this.bindUIActions();
        //Set the state of the expanded sections (if present) and show fields that contain values or errors
        if ($(".skts-expanded").length > 0) page.setExpanded();
        //Show list items that do not meet the validation.isCleanField requirements 
        validation.showHiddenItems();
        //Make the truncate fields accessible
        /* DEPRECATED START (only used in mobile moms) */
        $(".skts-truncate").each(function () {
            $(this).attr("tabindex", -1);
        });
        /* DEPRECATED END */
        /* DEPRECATED START (not in use) */
        //If the global menu is present, append to the first ul in the top menu
        if ($(".skts-global-nav").length > 0 && $(".navbar-collapse ul").length > 0) $(".skts-global-nav").clone().addClass("hidden-md").addClass("hidden-lg").removeClass("visible-md-block").removeClass("visible-lg-block").insertAfter($(".navbar-collapse ul")[0]);
        //Show or hide the messsages if NOT hidden
        $(".skts-process-form-section:not(.skts-override-hidden) input[type='text'], .skts-process-form-section:not(.skts-override-hidden) input[type='tel'], .skts-process-form-section:not(.skts-override-hidden) input[type='password'], .skts-process-form-section:not(.skts-override-hidden) select, .skts-process-form-section:not(.skts-override-hidden) input[type='radio'], .skts-process-form-section:not(.skts-override-hidden) input[type='checkbox']").each(function () {
            validation.processField($(this));
        });
        /* DEPRECATED START */
        //NB - this function is to be rmoved when the new methodology for show/hide of radio buttons is implemented
        //This is in a timeout to allow other functions (eg calender) to be set before disable
        setTimeout(function () {
            //Pass the selected radio button if present
            if ($(".js-option-show-hide").length > 0) {
                toggle.radioShowHide($(".js-option-show-hide:checked"));
            }
        }, 0);
        /* DEPRECATED END */
        //Show/hide hidden items if there is in sections with when attribute "data-show-group-id" is the same as "data-show-group-for"
        toggle.setFormShowSpecific();
        //Set focus on the first element that has the ".js.set-focus" class (if there is no alert box)
        //if ($(".js-set-focus").length > 0 && $(".alert").length < 1) {
        //Set focus on the first element that has the ".js.set-focus" class 
        if ($(".js-set-focus").length > 0) {
            helper.focusField($(".js-set-focus").eq(0));
        }
        /* DEPRECATED START */
        //If the page is not using the css footer push solution
        if (!appVars.wrappedPage) {
            //This func will add space above the footer - and move it to the bottom 
            //- so that it will not appear in the middle, in case of a short document
            page.moveFooterBottom();
        }
         /* DEPRECATED END */
        //Create the Modal nav if present
        var $modalNav = $(".js-create-nav-modal");
        if ($modalNav.length > 0) {
            $modalNav.each(function() {
                page.createModalNav($(this));
            });
        }
    },
    bindUIActions: function () {
        $(document).on("blur", "input[data-show-type*= 'dkInteger']",  function () {
            page.formatDkInt(this);
        });        
        //Autoformat the number with thousand separator and 2 decimal points (blur)
        $(document).on("blur", "input[data-show-type*= 'dkDecimal']", function () {
            var $fieldElem = $(this),
                fieldValue = $.trim($fieldElem.val()),
                fieldNumberValue = helper.convertToNumber(fieldValue);
            if (fieldValue !== "" && validation.checkDkDecimal(fieldValue)) {
                $fieldElem.val(helper.formatNumber(fieldNumberValue, "#,##0.00"));
                validation.processField($fieldElem);
            }
        });
        //Disable autocomplete on all forms
        if ($("form").length > 0) {
            $("form").attr("autocomplete", "off");
        }
        /* DEPRECATED START */
        //Remove the truncate when a link inside a truncate element is in focus
        $(document).on("focus", ".skts-truncate a",  function () {
            $(this).parent().removeClass("skts-truncate");
        });
        //Remove the truncate when clicked
        $(document).on("click", ".skts-truncate", function (e) {
            e.preventDefault();
            $(this).removeClass("skts-truncate");
        });
        /* DEPRECATED END */
        //Set the page print functionality
        $(document).on("click", ".js-print", function (e) {
            e.preventDefault();
            window.print();
        });
        //Set the pdf warning for all links/buttons with the .js-pdf-warning class
        helper.addCheckForChangesByClassName("js-pdf-warning");
        //Disable the link if the "disabled" class is added to a list item in a nav section
        $(document).on("click", ".nav li.disabled a", function (e) {
            e.preventDefault();
            return false;
        });
        //Set the close window action on all links/buttons with the .js-close-window class
        $(document).on("click", ".js-close-window", function (e) {
            e.preventDefault();
            window.close();
        });       
        /* DEPRECATED START */
        //NB - this function is to be rmoved when the new mehodology for show/hide of radio buttons is implemented
        //Set radio show-hide fields to disable any input fields in the next hidden section when not checked
        $(document).on("click", ".js-option-show-hide", function (e) {
            e.preventDefault();
            toggle.radioShowHide($(this));
        });
        /* DEPRECATED END */
        //Set the form submit for non form elements (no validation)
        $(document).on("click", ".js-form-submit",  function (e) {
            e.preventDefault();
            page.submitForm(this);
            return true;
        });
        //Set the form submit validation for non form elements
        $(document).on("click", ".js-form-submit-validate", function (e) {
            var $modal = $(".modal.in"); //open modal
            if (validation.checkAllFields(this)) {
               page.submitForm(this);
               return true;
            }
            //If there no errors in the open modal
            if ($(".skts-error-text", $modal).length < 1) {
                //Close the modal
                helper.closeModal();
            }
            e.preventDefault();
            return false;
        });
        //Validate the form and prevent submit if errors
        $(document).on("click", ".js-form-validate", function (e) {
            var $modal = $(".modal.in"); //open modal
            if (validation.checkAllFields(this)) {
               return true;
            }
            //If there no errors in the open modal
            if ($(".skts-error-text", $modal).length < 1) { 
                //Close the modal
                helper.closeModal();
            }
            e.preventDefault();
            return false;
        });
        //Validate the form but do NOT submit
        $(document).on("click", ".js-form-no-submit-validate", function (e) {
            var $modal = $(".modal.in"); //open modal
            e.preventDefault();
            if (validation.checkAllFields(this)) {
                return true;
            }
            //If there no errors in the open modal
            if ($(".skts-error-text", $modal).length < 1) {
                //Close the modal
                helper.closeModal();
            }
            return false;
        });
        //Make an element follow the link defined in the data-href attribute
        $(document).on("click", "[data-href]",  function(e) {
            e.preventDefault();
            window.location.href = $(this).attr("data-href");
        });
        //Find the element based on a the data-focus-element attribute and set the focus
        $(document).on("click", "[data-focus-element]",  function(e) {
            e.preventDefault();
            var $elem = $(this),
                isModal = $elem.attr("data-toggle"),
                focusID = $elem.attr("data-focus-element");
            //If the link opens a modal
            if (typeof isModal !== typeof undefined && isModal !== false) {
                //Timeout allows for a modal fade
                setTimeout(function () {
                    helper.focusField(helper.findElement(focusID));
                }, 800);
            }
            else {
                helper.focusField(helper.findElement(focusID));
            }
        });  
        //Reset the search select fields
        $(document).on("click", ".js-reset-trigger", function() {
           page.resetSearch();
        });
        //Sets the buttons id to a hidden field value for serverside use when calling a modal
        //THIS IS USED BY CSC ONLY
        $(document).on("click", ".js-contribution-erase",  function() {
            page.setModalValues(this);
        });
    },
    //Clear the values of fields in the sections with the class ".js-clear-on-submit" 
    clearValuesIfHidden: function () {
        $(".js-clear-on-submit input, .js-clear-on-submit select, .js-clear-on-submit textarea").each(function(){
            var $formField = $(this);
            //If no parents are hidden AND no parents contain the class ".js-stop-clear"
            if ($formField.parents(".hidden").length > 0 && $formField.parents(".js-stop-clear").length === 0) {
                $formField.val("").removeAttr("checked");
            }   
        });        
    },
    //Creates a modal for navigation (small screens)
    createModalNav: function($linkSettings) {
        var modalHTML = '',                                                         //THe modal HTML
            dataTarget = $linkSettings.attr("data-target").replace(/#/g, ''),       //The id of the modal window, with the hashtag removed (set by the data-target on the menu button)
            $clonedMenuLinks = $($linkSettings.attr("data-nav-link-selector")).clone(), //The html for the links to be used (set by the data-nav-link-selector on the menu button)
            menuLinksHTML = "";
        //Remove the classes on the cloned ul elements
        $("ul", $clonedMenuLinks).removeClass();
        menuLinksHTML = $clonedMenuLinks.html();

        modalHTML = '<div class="modal fade skts-nav-modal" id="'+dataTarget+'" tabindex="-1" role="dialog" aria-labelledby="'+dataTarget+'Description">';
        modalHTML += '<div class="modal-dialog" role="document">';
        modalHTML += '<div class="modal-nav-content">';
        modalHTML += '<div class="modal-nav-body">';
         modalHTML += '<div class="row" data-dismiss="modal" aria-label="Luk menuen">';
          modalHTML += '<div class="col-xs-3">';

        modalHTML += '<button type="button" class="skts-menu-button skts-menu-button--close">';
        modalHTML += '<span class="sr-only">Toggle navigation</span><span class="skts-icon-bar"></span><span class="skts-icon-bar"></span><span class="skts-icon-bar"></span>';
        modalHTML += '</button>';
         modalHTML += '</div>';
         modalHTML += '</div>';
        modalHTML += '<div class="modal-header">';
        modalHTML += '<button type="button" class="close" data-dismiss="modal" aria-label="Luk"><span aria-hidden="true"></span></button>';
        modalHTML += '</div>';
        modalHTML += menuLinksHTML;
        modalHTML += '</div>';
        modalHTML += '</div>';
        modalHTML += '</div>';
        modalHTML += '</div>';
        modalHTML += '<div class="hidden" id="'+dataTarget+'Description">Dette er navigation til mobile enheder</div>';
        //Append the modal to the body
        $("body").append(modalHTML);
    },
    disable: function () {
        //Set all the form elements to readOnly (so the page is still submitted)
        //Disable all the links and submit buttons
        $("textarea").prop("readonly", true);
        $("input").prop("readonly", true);
        $("select").on("focus", helper.preventFocus);
        $('a').on("click", helper.preventDefault);
    },
    enable: function () {
        //Reset all the form elements to not be readOnly
        //Enable all the links and submit buttons
        $("textarea").prop("readonly", false);
        $("input").prop("readonly", false);
        $("select").off("focus", helper.preventFocus);
        $('a').off("click", helper.preventDefault);
        $("button").prop("disabled", false);
        $("input[type='submit']").prop("disabled", false);
        $("input[type='button']").prop("disabled", false);
    },
    formatDkInt: function(fieldElem) { 
        var $fieldElem = $(fieldElem),
            fieldValue = $.trim($fieldElem.val());
            
        //If the field is not empty
        if (fieldValue !== "") {
            //If the field value is a valid integer
            if (validation.checkDkInteger(fieldValue)) {
                var regexp = /^-?(?:\d+|\d{1,3}(?:\.\d{3})+)$/,        //Correctly placed/no thousand seperators
                fieldNumberValue = helper.convertToNumber(fieldValue); 
                //If the integer has correctly placed/no thousand seperators
                if (regexp.test(fieldValue)) {

                    //Format the number and write it to the input field
                    $fieldElem.val(helper.formatNumber(fieldNumberValue, "#,##0"));
                    //Hide the type error
                    validation.hideError($fieldElem, 0);
                }
                else {
                    //Show the type error
                    validation.showError($fieldElem, 0);
                }
                //Show the input msgs where apporpriate
                validation.processField($fieldElem);
            }
            else {
                //Show the type error
                validation.showError($fieldElem, 0);
            }   
        }
    },
    hideLoader: function () {
        $(".skts-loading").remove();
        page.enable();
    },
    moveFooterBottom:function () {
        var $footer = $("footer");
        if ($footer.length > 0) {
            $footer.css({"top":"0px"}); /* resetting css-top-property so that we can meassure properly   */
            var windowHeight        = $(window).height(),
                footerHeight        = $footer.outerHeight(),
                footer_pxFromTop    = $footer.offset().top,
                footerAboveFold     = (footer_pxFromTop + footerHeight) < windowHeight, /* is footer fully above the fold? ...  */
                pushDown_px         = windowHeight - footer_pxFromTop - footerHeight;
            if (footerAboveFold) $footer.css({"top":pushDown_px + "px"}); /* ... then push it down  */
        }
    },
    //Reset all the search fields
    resetSearch: function() {
        $(".js-reset").each(function(index, elem){
            var $elem = $(elem),
                elemType = $elem.prop("type");
            switch (elemType) {
                case "select-one":
                case "select-multiple": 
                    $("option", $elem).prop("selected", function(){
                        return this.defaultSelected;
                    });
                break;
                case "checkbox":
                case "radio": 
                    $($elem).removeAttr("checked");
                break;
                case "text": 
                    $($elem).val("");
                break;
            }
            if ($elem.hasClass("chosen-select")) {
                $elem.val([]).trigger("chosen:updated");
            }
            //Reset the default value if there is a "data-default-val" attribute
            if ($elem.attr("data-default-val")){
                page.setElementValue($elem, $elem.attr("data-default-val"));
            }
        });
    },
    //Set a value for a for field
    setElementValue: function(elem, value) {
        var $elem = $(elem),
            elemType = $elem.prop("type");
        switch (elemType) {
            case "select-one":
                $("option[value="+value+"]", $elem).attr("selected", true);
                $elem.trigger("chosen:updated");
                break;
            case "select-multiple": 
                var valueArray = value.split("!!");
                for (var i = 0; i < valueArray.length; i++) {
                    $("option[value="+valueArray[i]+"]", $elem).attr("selected", true);
                }
                $elem.trigger("chosen:updated");
                break;
            case "checkbox":
            case "radio":
                $($elem).prop("checked", true);
                break;
            case "text": 
                $($elem).val(value);
                break;
        }
    },
    //Toggle the hidden items.
    setExpanded: function () {
        $(".skts-expanded").each(function () {
            toggle.hiddenItems($(this));
        });
    },
    submitForm: function(buttonElem) {
         //Get the data-skat-form-id attribute from the button
        var $buttonElem = $(buttonElem),
            altForm = $buttonElem.attr("data-skat-form-id");        
        //Allow any confirm modal windows
        setTimeout(function () {
            //If there is no modal window OR the submit is from a modal (confirm box)
            if (!$("body").hasClass("modal-open") || $buttonElem.closest(".modal").length > 0 ) {
                //Close the modal
                helper.closeModal();
                //Show the loadder
                page.showLoader(appTexts.loadingText);
            }
        }, 0);
        page.clearValuesIfHidden();
        //If there is an alternative form
        if ($("#" + altForm).length > 0) {
            //Submit the alternative form based on the id set in data-skat-form-id
            $("#" + altForm).submit();
        }
        else {
            //Submit the parent form
            $buttonElem.closest("form").submit();
        }
    },
    //USED BY CSC ONLY
    setModalValues: function (sectionElem) {
        var $sectionElem = $(sectionElem),
            modalTitle = $sectionElem.attr("data-contribution-title"),
            modalBody = $sectionElem.attr("data-contribution-body"),
            sectionToErase = $sectionElem.attr("data-contribution-section-id");
        $(".js-modal-title").html(modalTitle);
        $(".js-modal-body").html(modalBody);
        $("#eraseSectionId").val(sectionToErase);
    },
    //Show the page loader with custon msg and disable the links and form elements
    showLoader: function (msgTxt) {
        //The box below the spinnter icon (for screen readers only)
        var msgBox = "<span role='alert' class='sr-only'>" + appTexts.loadingTextSR + "</span>";
        //If there is a msgTxt, show the box below the spinner
        if (msgTxt !== "") msgBox = "<span role='alert'>" + msgTxt + "</span>";
        //The spinner and the box
        var loaderHTML = "<div class='skts-loading'><div class='skts-spinner'><br/></div>" + msgBox + "</div>";
        $("body").append(loaderHTML);
        page.disable();
    }
};
var tableNav = {
    init: function () {
        //Make the table navigational with the arrow keys
        //The td cells MUST have tabindex="0" (or any positive integer)
        var $tableKeyboardNav = $(".js-table-keyboard-nav");
        if ($tableKeyboardNav.length) {
            $("td", $tableKeyboardNav).attr("tabindex", 0);
            $tableKeyboardNav.enableCellNavigation();
        }
    }
};
var toggle = {
    init: function () {
        this.bindUIActions();
    },
    bindUIActions: function () {
        //Toggle the expanded section/items
        $(document).on("click", ".skts-collapse", function (e) {
            e.preventDefault();
            var $this = $(this);
            toggle.expanded($this);
            toggle.hiddenItems($this);
        });
        //Toggle hidden elements in a section
        $(document).on("click", ".skts-toggle-section", function (e) {
            e.preventDefault();
            toggle.section($(this));
        });
        //Show the specific hidden section in the corresponding group
        //Radio and checkbox triggers on change
        $(document).on("change", "input[type='radio'][data-show-for], input[type='checkbox'][data-show-for]", function () {
            toggle.formShowSpecific($(this));
        });
        //Show the specific hidden section in the corresponding group
        //Text field triggers on keyup
        $(document).on("keyup", "input[type='text'][data-show-for], input[type='tel'][data-show-for]", function () {
            toggle.formShowSpecific($(this));
        });
        //Show the specific hidden section in the corresponding group
        //Option in a select box triggers on change
        $(document).on("change", ".js-toggle-specific", function () {
            toggle.formShowSpecific($("option:selected", this));
        });
    },
    //Toggles the skts-expanded class
    expanded: function ($container) {
        $container.toggleClass("skts-expanded");
        /* NOT USED IN BOOTSKAT AT THIS TIME
        var sectionIsExpanded = $container.hasClass("skts-expanded"),				//The expanded status (saved to the hidden field)
			secID = $container.attr("id"),											//Id of the section (add/remove the class "skts-expanded" on the server to this element)
			$hiddenField = $("#" + appVars.expandedHiddenFieldPrefix + secID + "");	//The hidden field created below
        
        //If the hidden field exists, change the value to the current expanded status
        if ($hiddenField.length > 0) {
            $hiddenField.val(sectionIsExpanded);
        }
        //Otherwise create the hidden field (if there is a section ID)
        else if (secID !== undefined) {
            $("<input/>", {
                "type": "hidden",
                "id": appVars.expandedHiddenFieldPrefix + secID,
                "name": appVars.expandedHiddenFieldPrefix + secID,
                "value": true
            })
			.appendTo($container.closest("form"));
        }
        */
    },
    //Toggles the hidden section/items
    //Force shows any items that contain a non clean field (as defined in validation.isCleanField)
    hiddenItems: function ($this) {
        var sectionIsExpanded = $this.hasClass("skts-expanded"),				//The expanded status
			$hiddenSection = $this.next(),										//The next sibling (which might be hidden - used for simple show/hide sections)
			$hiddenElems = $this.next().children(".skts-process-form-section"), //The children of the next sibling (if they have the ".skts-process-form-section" class)
			noChildren = $hiddenElems.length < 1;								//If there are no hidden children
        if (sectionIsExpanded) {
            $("a", $this).attr("aria-expanded", "true");
            $("button", $this).attr("aria-expanded", "true");
            if (noChildren) {
                //Show the entire block
                $hiddenSection.removeClass("hidden");
            }
            else {
                //Loop through all the children and show the rows
                $hiddenElems.each(function () {
                    $(this).removeClass("hidden");
                });
            }
        }
        else {
            $("a", $this).attr("aria-expanded", "false");
            $("button", $this).attr("aria-expanded", "false");
            if (noChildren) {
                //Hide the entire block
                $hiddenSection.addClass("hidden");
            }
            else {
                //Loop through all the children and hide the rows (based on the validation principals in validation.isCleanField()
                $hiddenElems.each(function () {
                    var $section = $(this),
						$inputField = $("input, select, textarea", $section);
                    //Check the input/select/textarea fields AND the section.
                    //The section is checked in case there are no input/select/textarea children fields (read only)
                    if (validation.isCleanField($inputField) && validation.isCleanField($section)) {
                        $section.addClass("hidden");
                    }
                    else {
                        //Show the immediate headers if a field is not clean
                        helper.showPreviousHeaders($section);
                    }
                });
            }
        }
    },
    /* DEPRECATED START */
    //NB - this function is to be rmoved when the new mehodology for show/hide of radio buttons is implemented
    //Show/hide the hidden input/selects in the following ".hidden" section
    radioShowHide: function ($selectedRadio) {
        //If there is a radio button selected
        if ($selectedRadio.length > 0) {
            //Find the radio buttons group name
            var selectedGroupName = $selectedRadio.prop("name");
            //Loop through all the radio buttons with the SAME group name as the selected radio button
            $("input[name = '" + selectedGroupName + "']").each(function () {
                //Remove the "hidden" class and add the "skts-option-show-hide--deprecated" class...
                //This is done to allow validation to check if parent items are not hidden...
                //Previously the hidden class was overrruled in the css
                $(this).siblings(".hidden").removeClass("hidden").addClass("skts-option-show-hide--deprecated");
               //Hide all the sections 
                $(".skts-process-form-section", $(this).siblings(".skts-option-show-hide--deprecated")).addClass("hidden");
            });
           //Show the sections if the radio is selected
            $(".skts-process-form-section", $selectedRadio.siblings(".skts-option-show-hide--deprecated")).removeClass("hidden"); 
        }
    },
    /* DEPRECATED END */
    //Hide all "data-show-id" sections where  the data-show-group-id = selectedGroupId 
    //Show the corresponding section(s) defined in the selectedSectionId
    formShowSpecific: function (triggerElem) {
        var selectedGroupId = $(triggerElem).attr("data-show-group-for"), 
            $selectedGroup = $("[data-show-group-id *= " + selectedGroupId +"]");
        //Set the timeout to allow inputs to be checked
        setTimeout(function () {
            //Hide all in the group
            $selectedGroup.addClass("hidden js-clear-on-submit");
            //Loop through the group that corresponds to the data-show-group-for on the checked inputs
            $("[data-show-group-for = "+ selectedGroupId +"]").each(function(){
                var $activeFormElem = $(this),
                    $activeSections = $("[data-show-id *= " + $activeFormElem.attr("data-show-for") + "]");
                if(($activeFormElem.attr("type") === 'text' && $.trim($activeFormElem.val()) !=="") || $activeFormElem.is(":checked")) {
                    //Show the specific sections in the group
                    $($activeSections, $activeFormElem).removeClass("hidden js-clear-on-submit");
                }
            }); 
        }, 0);
    },
    section: function ($fncCaller) {
        //Set the "selected" class for the function caller
        $fncCaller.toggleClass("selected");
        //For each hidden element that should be toggled,
        //contained in the section defined on the funtion caller
        $(".skts-toggle-hidden", $fncCaller.attr("data-section-selector")).each(function () {
            $(this).toggleClass("hidden");
        });
    },
    setFormShowSpecific: function () {
        $("[data-show-group-for]").each(function () {
            var $triggerElem = $(this);
            toggle.formShowSpecific($triggerElem);
        });
    }
};
var validation = {
    init: function () {
        this.bindUIActions();
    },
    bindUIActions: function () {
        //Set the validation to keyup for text and passwords fields if there is no data-validation event attribute 
        $(document).on("keyup", ".skts-process-form-section input[type='text']:not([data-validation-event]), .skts-process-form-section input[type='tel']:not([data-validation-event]), .skts-process-form-section input[type='password']:not([data-validation-event]), .skts-process-form-section textarea:not([data-validation-event])", function (e) {
           validation.setValidation($(this));
        });
        //Set the validation to keyup for text and passwords fields if the data-validation event attribute is set to keyup
        $(document).on("keyup", ".skts-process-form-section input[type='text'][data-validation-event='keyup'], .skts-process-form-section input[type='tel'][data-validation-event='keyup'], .skts-process-form-section input[type='password'][data-validation-event='keyup'], .skts-process-form-section textarea[data-validation-event='keyup']", function (e) {
          validation.setValidation($(this));
        });
        //Set the validation to blur for text and passwords fields if the data-validation event attribute is set to blur
        $(document).on("blur", ".skts-process-form-section input[type='text'][data-validation-event='blur'], .skts-process-form-section input[type='tel'][data-validation-event='blur'], .skts-process-form-section input[type='password'][data-validation-event='blur'], .skts-process-form-section textarea[data-validation-event='blur']", function (e) {
            validation.setValidation($(this));
        });
        //Set the validation to change for select box options, checkboxes and radio buttons 
        $(document).on("change", ".js-option-required, .skts-process-form-section select, .skts-process-form-section input[type='radio'], .skts-process-form-section input[type='checkbox']", function (e) {
           validation.setValidation($(this));
        });
        $(document).on("click", ".js-alert-own-business",  function (e) {
            e.preventDefault();
            window.alert(appTexts.warningOwnBusiness);
        });
    },
    //Check if any fields with validation contain errors
    //Force show the error list items
    //Set focus on the first occurring error field
    //Return true or false (allows the form to be submitted or not)
    checkAllFields: function (buttonElem) {
        var formClean = true,                                       //The form is without error to start
            $focusField = null,                                     //No field in focus to start
            altForm = $(buttonElem).attr("data-skat-form-id"),      //Check if there is another form to check
            $formToValidate = $("form");                            //Default to the first form on the page
        //If there is an alternative form
        if ($("#" + altForm).length > 0) {
            //Set the alternative form based on the id set in data-skat-form-id on the element clicked
            $formToValidate  = $("#" + altForm);
        }
        else {
            //Set to the form that contains the element clicked
            $formToValidate  =  $(buttonElem).closest("form");
        }
        //Loop through all the relevant fields in the form and check for errors
        $("input[data-show-type], select[data-show-type], textarea[data-show-type], input[data-compare], .skts-required-val, .js-option-required", $formToValidate).each(function () {
            var $this = $(this);
            //If the field's parents are not hidden AND 
            //the field is not readonly AND 
            //the field is not disabled
            if ($this.parents(".hidden").length < 1 && !$this.attr("readonly") && !$this.attr("disabled")) {
                //Validate the reqiuired fields (sets the .has-error/.skts-has-option-error class if error is found)
                if ($this.hasClass("skts-required-val") || $this.hasClass("js-option-required")) {
                    validation.checkRequired($this);
                }
                if ($this.attr("data-compare")) {
                    //Compare fields (sets the .has-error class if error is found)
                    validation.compareValue($this);
                }
                if ($this.attr("data-show-type")) {
                    xsd.checkField($this);
                }
                //If the section has the .has-error/.skts-has-option-error class
                var hasClientError = $this.closest(".skts-process-form-section").hasClass("has-error") || $this.closest(".skts-process-options").hasClass("skts-has-option-error");
                //If error
                if (hasClientError) {
                    //Stops the form submit
                    formClean = false;
                    //Stores the focus item for the first error field if not a radion button (due to conflict with bootstrap "btn-group")
                    if ($focusField === null) $focusField = $this;
                }
            }
        });
        if (!formClean) {
            //Show any fields that may be hidden
            validation.showHiddenItems();
            //Set the focus if a field with an error has been found
            if ($focusField !== null) helper.focusField($focusField);
        }
        //Prevent/allow the form to submit
        return formClean;
    },
    checkDkDate: function (str) {
        var reg = /^(?:(?:(?:0[1-9]|1\d|2[0-8])(?:0[1-9]|1[0-2])|(?:29|30)(?:0[13-9]|1[0-2])|31(?:0[13578]|1[02]))[1-9]\d{3}|2902(?:[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00))$/g;
        return reg.test(str);
    },
    checkDkDecimal: function (fieldValue) {
        var fieldNumberValue = helper.convertToNumber(fieldValue);  //Convert to valid javascript number
        if (fieldValue !== "" && fieldValue !== "-"  && fieldValue !== "+" && isNaN(fieldNumberValue)) {
            return false;
        }
        else {
            return true;
        }
    },
    checkDkInteger: function (fieldValue) {
        var hasComma = fieldValue.indexOf(",") > -1;
        if (!hasComma) {
            var fieldNumberValue = helper.convertToNumber(fieldValue);  //Convert to valid javascript number
            if (fieldValue !== "" && fieldValue !== "-" && fieldValue !== "+" && (isNaN(fieldNumberValue))) {
                return false;
            }
            else {
                return true;
            }
        }
    },
    checkRequired: function ($fieldElem) {
        var fieldType = $fieldElem.prop("type"),								//Set the field type
			errorIndex = $fieldElem.nextAll(".skts-error-text").length - 1,		//The last error test should always reference the required error
			fieldValue = $.trim($fieldElem.val()),
			radioGroupName = $fieldElem.attr("name"),							//Find the radio group  name
			$selectedRadio = $("input[name = '" + radioGroupName + "']:checked");	//Find the selected radio button
        //Select boxes must have an empty value as the first option for this to work
        //Checkboxes amd radios are checked separately as they always return a value of true or 1 with val()

        //If not a checkbox OR not a radio AND value is blank 
        //OR if is a checkbox AND the checkbox is not checked 
        //OR if is a radio AND  no radios are selected
        if (
			((fieldType !== "checkbox" || fieldType !== "radio") && fieldValue === "")||
            (fieldType === "checkbox" && !$fieldElem.is(":checked"))||
            (fieldType === "radio" && $selectedRadio.length === 0)
		) {
            validation.showError($fieldElem, errorIndex);
        }
        else {
            validation.hideError($fieldElem, errorIndex);
        }
    },
    compareValue: function ($fieldElem) {
        var fieldValue = $.trim($fieldElem.val()),
			comparisonValue = $($fieldElem.attr("data-compare")).val(),
			errorIndex = $fieldElem.attr("data-compare-error-index");
        (fieldValue !== comparisonValue) ? validation.showError($fieldElem, errorIndex) : validation.hideError($fieldElem, errorIndex);
    },
    //Hide the validation errors
    hideError: function ($formField, errorFieldIndex) {
        //If input is radio
        if ($formField.prop("type") === "radio") {
            //Set the formField to all the radio buttons so the error is removed throughout
            $formField = $("input[name ='" + $formField.prop("name") + "']");
        }
        
        $formField.each(function () {
            var $this = $(this),
				errorText = $this.nextAll(".skts-error-text")[errorFieldIndex];
            //Hide the error text
            $(errorText).removeClass("show");
            //If there are no other error texts visible
            if ($this.nextAll(".skts-error-text.show").length === 0) {
                $this.attr("aria-invalid", false);
                //Remove the overall field error classes
                if ($(".skts-process-form-section").length > 0) {
                    var $fieldConatainer =  $this.closest(".skts-process-form-section");
                    $fieldConatainer.removeClass("has-error");
                    $fieldConatainer.attr("aria-atomic", false);
                }
                if ($(".skts-process-options").length > 0) {
                    var $optionContainer = $formField.closest(".skts-process-options");
                    $optionContainer.attr("aria-atomic", false);
                    $optionContainer.removeClass("skts-has-option-error");
                    $optionContainer.nextAll(".skts-option-error-text").removeClass("show");
                }
            }
        });
    },
    isCleanField: function ($formField) {
        var $closestSection = $formField.closest(".skts-process-form-section"),
			fieldType = $formField.prop("type");
        //The field is NOT clean if:
        //The field's container HAS a client error (either .has-error OR .skts-has-option-error) OR
        //The field's container HAS a server error OR
        //The input type IS text, AND HAS a value AND the field's container DOESN'T have the skts-override-hidden class OR
        //The select box HAS a selected option (that is NOT the first option) AND the field's container DOESN'T have the skts-override-hidden class OR
        //A radio or checkbox IS checked AND the field's container DOESN'T have the skts-override-hidden class OR
        //The field IS showing the "msg/saved" value beneath
        if (
			$closestSection.hasClass("has-error") ||
			$closestSection.hasClass("skts-has-option-error") ||
			$closestSection.hasClass("skts-has-error-server") ||
			((fieldType === "text") && ($.trim($formField.val()) !== "" && !$closestSection.hasClass("skts-override-hidden"))) ||
			(fieldType === "select-one" && ($formField[0].selectedIndex > 0 && !$closestSection.hasClass("skts-override-hidden"))) ||
			(((fieldType === "checkbox" || fieldType === "radio")) && ($formField.is(":checked") && !$closestSection.hasClass("skts-override-hidden"))) ||
			$(".skts-input-msg", $closestSection).hasClass("show")
		) {
            return false;
        }
        else {
            return true;
        }
    },
    //Show the saved/suggested/info value based on the changes made to a form field
    processField: function ($formField) {
        var currentValue = $.trim($formField.val()),						//The typed value
			$inputMsg = $formField.nextAll(".skts-input-msg:last"),			//The last input msg sibling element (".skts-input-msg")
			$otherMsg = $formField.nextAll(".skts-input-msg:not(:last)"),	//If there is another msg (autoforskud) it is shown autonmatically
			savedValue = $(".skts-input-msg-value", $inputMsg).text(),		//The text to compare from the last Saved value sibling
			fieldType = $formField.prop("type");
        //If there is no value in the input field, use the placeholder value
        if (currentValue === "") currentValue = $formField.attr("placeholder");
        //Show the other msg
        $otherMsg.addClass("show");
        //Select the value to compare based on the fieldType
        switch (fieldType) {
            case "select-one":
                currentValue = $formField.find(":selected").text();
                break;
            case "checkbox":
                //Use the current "checked" status 
                currentValue = $formField.prop("checked").toString();
                break;
            case "radio":
                //Use the label text beside the radio button
                var radioGroupName = $formField.attr("name"),							    //Find the radio group  name
                    $selectedRadio = $("input[name = '" + radioGroupName + "']:checked");	//Find the selected radio button
                //Use the label text beside the radio button
                currentValue = $selectedRadio.next("label").text();
                //If the radio buttons are in a group
                if ($selectedRadio.closest(".skts-btn-radio").length !== 0) {
                    //Sets the inputMsg to after the entire radio button group
                    $inputMsg = $selectedRadio.closest("[data-toggle='buttons']").nextAll(".skts-input-msg:last");
                    //Resets the saved value to use the value of the new inputMsg
                    savedValue = $(".skts-input-msg-value", $inputMsg).text();
                }
                break;
        }
        //If the field value is not the same as the saved value
        if (currentValue !== savedValue) {
            //Show the relevant text
            $inputMsg.addClass("show");
        }
        else {
            //Hide the relevant text
            $inputMsg.removeClass("show");
        }
    },
    nonFacetValidations: function ($fieldElem) {
        //If the field needs to be validated
        if ($fieldElem.attr("data-show-type")) {
            xsd.checkField($fieldElem);
        }
        //If the field is required
        if ($fieldElem.hasClass("skts-required-val") || $fieldElem.hasClass("js-option-required")) {
            validation.checkRequired($fieldElem);
        }
        //If the field is needs to be compared
        if ($fieldElem.attr("data-compare")) {
            validation.compareValue($fieldElem);
        }
    },
    setValidation: function($formElem) {
        //Show or hide the messages and validate
        validation.processField($formElem);
        validation.nonFacetValidations($formElem);
    },
    //Confirm box 
    showConfirm: function (msgText) {
        if (window.confirm(msgText)) {
            return true;
        }
    },
    //Show the validation errors
    showError: function ($formField, errorFieldIndex) {
        //The field error text
        var fieldError = $formField.nextAll(".skts-error-text")[errorFieldIndex],
			fieldType = $formField.prop("type");
        $formField.attr("aria-invalid", true);
        $(fieldError).addClass("show");
        if ($(".skts-process-form-section").length > 0) {
            var $fieldConatainer =  $formField.closest(".skts-process-form-section");
            $fieldConatainer.addClass("has-error");
            $fieldConatainer.attr("aria-atomic", true);
        }
        if ($(".skts-process-options").length > 0 && fieldType === "radio") {
            var $optionContainer = $formField.closest(".skts-process-options");
            $optionContainer.attr("aria-atomic", true);
            $optionContainer.addClass("skts-has-option-error");
            $optionContainer.nextAll(".skts-option-error-text").addClass("show");
        }
    },
    //Show the items that do not pass the validation rules defined in validation.isCleanField
    showHiddenItems: function () {
        $(".skts-process-form-section").each(function () {
            var $this = $(this);
            //Check the fields in the section are valid 
            //OR the section itself is valid (in case of read only items)
            if (!validation.isCleanField($("input, select, textarea", $this)) || !validation.isCleanField($this)) {
                $this.removeClass("hidden");
                helper.showPreviousHeaders($this);
            }
        });
    }
};
var skts = {
    api: {
        formValidated: function(e) {
            helper.closeModal();
            if (validation.checkAllFields(this)) {
                return true;
            }
            return false;
        }
    }
};
$(document).ready(function () {
    page.init();
    tableNav.init();
    toggle.init();
    validation.init();
    cookieWarning.init();
});

//If the page is not using the css footer push solution
if (!appVars.wrappedPage) {
    /* in case of resizing  */
    $(window).resize(
        page.moveFooterBottom
    ); 
}


/*==============================================
    Cookieløsning
==============================================*/
var cookieName = 'cookie4u';
var cookiePath = '/';
var cookieDomain = ''; // Angiv domænet cookie4u skal oprettes på
var cookieNo = 'ok4u=no';
var cookieYes = 'ok4u=yes';
var lastReply = ''; // No reply

// Liste over cookies der ønskes slettet ved nej tak til cookies. WT_FPC er en cookie webtrends opretter. Eks:{ name: "eksempelCookie", path: "/", domain: ".eksempel.domain.dk" }
var cookieList = {
    cookiesToDelete: [{ name: "cookie4u", path: "/", domain: ".skat.dk" }, { name: 'WT_FPC', path: '/', domain: '.skat.dk' }]
};

function writeCookie(cname, cvalue, days, domain, path) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }

    var domainText;
    if (domain === "") {
        domainText = ""; // IE har problemer når domain er tom.
    }
    else {
        domainText = "; domain=" + domain;
    }
    document.cookie = cname + "=" + cvalue + expires + "; path=" + path + domainText;
}

function cookieReply(setting, msg) {
    'use strict';
    if (msg !== '') {
        alert(msg);
    } else {
        $('.skts-cookieouter').hide();
    }
    if (lastReply !== setting) {
        if (setting === cookieNo) {
            clearAllCookies();
        }
        writeCookie(cookieName, setting, 365, cookieDomain, cookiePath);
        lastReply = setting;
    }
}

function readCookie(name) {
    'use strict';
    var nameEQ = name + "=", ca, i, c;
    ca = document.cookie.split(';');
    for (i = 0; i < ca.length; i += 1) {
        c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

function changeLanguage() {
    if (document.getElementById("skts-cookie-lang").innerHTML.indexOf('English') !== -1) {
        $('#skts-cookie-lang').attr({
            "lang": "da"
        });
        document.getElementById("skts-cookie-lang").innerHTML = '<span class="skts-tooltip"> Cookie besked på dansk</span> Dansk';
        $('#skts-fontface-link').attr({
            "lang": "en"
        });
        document.getElementById("skts-fontface-link").innerHTML = '<span class="skts-tooltip"> Close cookie information</span>';
        $('#skts-cookie-text').attr({
            "lang": "en"
        });
        document.getElementById("skts-cookie-text").innerHTML = 'We use cookies at skat.dk, for example to gather statistics and improve our information campaigns. By continuing to use our website or by closing this box, you are agreeing to our use of cookies. <a href="#" class="skts-tooltip-holder" onclick=javascript:cookieReply("ok4u=no","");> Click here to reject cookies<span class="skts-tooltip"> Close cookie information</span></a>. <a href="#" onclick=javascript:openCookieDialog("http://skat.dk/SKAT.aspx?oId=1617453&layout=353121&lang=US","AboutCookies");return\u00A0false; class="skts-tooltip-holder">Read more about cookies at skat.dk<span class="skts-tooltip"> Open link in new window</span></a>.';
    } else {
        $('#skts-cookie-lang').attr({
            "lang": "en"
        });
        document.getElementById("skts-cookie-lang").innerHTML = '<span class="skts-tooltip"> Cookie language in English</span> English';
        $('#skts-fontface-link').attr({
            "lang": "da"
        });
        document.getElementById("skts-fontface-link").innerHTML = '<span class="skts-tooltip"> Luk cookie besked</span>';
        $('#skts-cookie-text').attr({
            "lang": "da"
        });
        document.getElementById("skts-cookie-text").innerHTML = 'På skat.dk bruger vi cookies til at samle statistik og til at forbedre vores informationskampagner. Vi begynder, når du klikker dig videre eller lukker denne boks. Du kan sige <a href="#" class="skts-tooltip-holder" onclick=javascript:cookieReply("ok4u=no","");>nej tak til cookies her<span class="skts-tooltip"> Luk cookie besked</span></a>. Læs mere om <a href="#" onclick=javascript:openCookieDialog("http://skat.dk/SKAT.aspx?oId=1617453&layout=353121","OmCookies");return\u00A0false; class="skts-tooltip-holder">cookies på skat.dk<span class="skts-tooltip"> Åbner nyt vindue</span></a>.';
    }
}

function clearAllCookies() {
    for (var i = 0; i < cookieList.cookiesToDelete.length; i++) {
        var cookie = cookieList.cookiesToDelete[i].name;
        var domain = cookieList.cookiesToDelete[i].domain;
        var path = cookieList.cookiesToDelete[i].path;
        deleteCookie(cookie, domain, path);
    }
}

function deleteCookie(name, domain, path) {
    expireCookie(name, "", 0, domain, path);
    expireCookie(name, "", 0, "." + getDomain(), path);
    expireCookie(name, "", 0, "", path);
    expireCookie(name, "", 0, "." + location.host, path);
}

function expireCookie(name, value, expiredays, domain, path) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = name + "=" + value + ";expires=" + exdate.toUTCString() + ";domain=" + domain + ";path=" + path;
}

function getDomain() {
    var domain = "";
    var parts = document.location.host.split(".");
    domain = parts[parts.length - 2] + "." + parts[parts.length - 1];
    return domain.toLowerCase();
}

/* Åben sekundære vinduer i popup */
function openCookieDialog(url, winName) {
    url = url || 'https://www.skat.dk/SKAT.aspx?oId=1617453&layout=353121';
    winName = winName || 'Om Cookies';
    var win_left = (screen.width / 2) - (975 / 2);
    var win_top = (screen.height / 2) - (700 / 2);
    var options = "width=975,height=700,Left=" + win_left + ",Top=" + win_top + ",resizable=yes,status=yes,menubar=no,toolbar=no,help=no,scrollbars=yes";

    var rc = window.open(url, winName, options);
}
/*jshint smarttabs:true*/
// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
(function () {
    var Environment = {};
    Environment.isMac = navigator.platform.toLowerCase().indexOf('mac') > -1;
    Environment.isChrome = navigator.userAgent.indexOf('Chrome') > -1;
    Environment.isSafari = navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Chrome') == -1;
    Environment.isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
    Environment.isIE = navigator.userAgent.indexOf('Trident') > -1;
    Environment.isiOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false);
    Environment.isAndroid = (navigator.userAgent.indexOf('android') > -1);
    var bodyClass;
    if (Environment.isiOS)
    {
        $('body').addClass('ios');
    }
    else if (Environment.isAndroid)
    {
        $('body').addClass('android');
    }
    else
    {
        if (Environment.isMac) $('body').addClass('osx');
        else $('body').addClass('win');
        var bodyClass;
        if (Environment.isChrome) bodyClass = 'chrome';
        else if (Environment.isFirefox) bodyClass = 'firefox';
        else if (Environment.isSafari) bodyClass = 'safari';
        else if (Environment.isIE) bodyClass = 'ie';
        $('body').addClass(bodyClass);
    }
    return Environment;
}());
/*
 * Enable keyboard navigation on a table 
 */
(function ($) {
    $.fn.enableCellNavigation = function () {
        var keyboard = { arrowLeft: 37, arrowUp: 38, arrowRight: 39, arrowDown: 40, enter: 13 };
        // select all on focus
        this.find('td').keydown(function (e) {
            // shortcut for key other than keyboard keys
            if ($.inArray(e.which, [keyboard.arrowLeft, keyboard.arrowUp, keyboard.arrowRight, keyboard.arrowDown, keyboard.enter]) < 0) { return; }
            var td = $(this);
            var moveTo = null;
            switch (e.which) {
                case keyboard.arrowLeft:
                    moveTo = td.prevAll("td").not(".hidden").first();
                    break;
                case keyboard.arrowRight:
                    moveTo = td.nextAll("td").not(".hidden").first();
                    break;
                case keyboard.arrowUp:
                case keyboard.arrowDown:
                    var tr = td.closest('tr');
                    var pos = td[0].cellIndex;

                    var moveToRow = null;
                    if (e.which == keyboard.arrowDown) {
                        moveToRow = tr.next('tr');
                    }
                    else if (e.which == keyboard.arrowUp) {
                        moveToRow = tr.prev('tr');
                    }
                    if (moveToRow.length) {
                        moveTo = $(moveToRow[0].cells[pos]);
                    }
                    break;
                case keyboard.enter:
                    td.click();
                    break;
            }
            if (moveTo && moveTo.length) {
                moveTo.focus();
            }
        });
    };
})(jQuery);


/**
 * @license jahashtable, a JavaScript implementation of a hash table. It creates a single constructor function called
 * Hashtable in the global scope.
 *
 * http://www.timdown.co.uk/jshashtable/
 * Copyright %%build:year%% Tim Down.
 * Version: %%build:version%%
 * Build date: %%build:date%%
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Hashtable = (function(UNDEFINED) {
    var FUNCTION = "function", STRING = "string", UNDEF = "undefined";

    // Require Array.prototype.splice, Object.prototype.hasOwnProperty and encodeURIComponent. In environments not
    // having these (e.g. IE <= 5), we bail out now and leave Hashtable null.
    if (typeof encodeURIComponent == UNDEF ||
            Array.prototype.splice === UNDEFINED ||
            Object.prototype.hasOwnProperty === UNDEFINED) {
        return null;
    }

    function toStr(obj) {
        return (typeof obj == STRING) ? obj : "" + obj;
    }

    function hashObject(obj) {
        var hashCode;
        if (typeof obj == STRING) {
            return obj;
        } else if (typeof obj.hashCode == FUNCTION) {
            // Check the hashCode method really has returned a string
            hashCode = obj.hashCode();
            return (typeof hashCode == STRING) ? hashCode : hashObject(hashCode);
        } else {
            return toStr(obj);
        }
    }
    
    function merge(o1, o2) {
        for (var i in o2) {
            if (o2.hasOwnProperty(i)) {
                o1[i] = o2[i];
            }
        }
    }

    function equals_fixedValueHasEquals(fixedValue, variableValue) {
        return fixedValue.equals(variableValue);
    }

    function equals_fixedValueNoEquals(fixedValue, variableValue) {
        return (typeof variableValue.equals == FUNCTION) ?
            variableValue.equals(fixedValue) : (fixedValue === variableValue);
    }

    function createKeyValCheck(kvStr) {
        return function(kv) {
            if (kv === null) {
                throw new Error("null is not a valid " + kvStr);
            } else if (kv === UNDEFINED) {
                throw new Error(kvStr + " must not be undefined");
            }
        };
    }

    var checkKey = createKeyValCheck("key"), checkValue = createKeyValCheck("value");

    /*----------------------------------------------------------------------------------------------------------------*/

    function Bucket(hash, firstKey, firstValue, equalityFunction) {
        this[0] = hash;
        this.entries = [];
        this.addEntry(firstKey, firstValue);

        if (equalityFunction !== null) {
            this.getEqualityFunction = function() {
                return equalityFunction;
            };
        }
    }

    var EXISTENCE = 0, ENTRY = 1, ENTRY_INDEX_AND_VALUE = 2;

    function createBucketSearcher(mode) {
        return function(key) {
            var i = this.entries.length, entry, equals = this.getEqualityFunction(key);
            while (i--) {
                entry = this.entries[i];
                if ( equals(key, entry[0]) ) {
                    switch (mode) {
                        case EXISTENCE:
                            return true;
                        case ENTRY:
                            return entry;
                        case ENTRY_INDEX_AND_VALUE:
                            return [ i, entry[1] ];
                    }
                }
            }
            return false;
        };
    }

    function createBucketLister(entryProperty) {
        return function(aggregatedArr) {
            var startIndex = aggregatedArr.length;
            for (var i = 0, entries = this.entries, len = entries.length; i < len; ++i) {
                aggregatedArr[startIndex + i] = entries[i][entryProperty];
            }
        };
    }

    Bucket.prototype = {
        getEqualityFunction: function(searchValue) {
            return (typeof searchValue.equals == FUNCTION) ? equals_fixedValueHasEquals : equals_fixedValueNoEquals;
        },

        getEntryForKey: createBucketSearcher(ENTRY),

        getEntryAndIndexForKey: createBucketSearcher(ENTRY_INDEX_AND_VALUE),

        removeEntryForKey: function(key) {
            var result = this.getEntryAndIndexForKey(key);
            if (result) {
                this.entries.splice(result[0], 1);
                return result[1];
            }
            return null;
        },

        addEntry: function(key, value) {
            this.entries.push( [key, value] );
        },

        keys: createBucketLister(0),

        values: createBucketLister(1),

        getEntries: function(destEntries) {
            var startIndex = destEntries.length;
            for (var i = 0, entries = this.entries, len = entries.length; i < len; ++i) {
                // Clone the entry stored in the bucket before adding to array
                destEntries[startIndex + i] = entries[i].slice(0);
            }
        },

        containsKey: createBucketSearcher(EXISTENCE),

        containsValue: function(value) {
            var entries = this.entries, i = entries.length;
            while (i--) {
                if ( value === entries[i][1] ) {
                    return true;
                }
            }
            return false;
        }
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    // Supporting functions for searching hashtable buckets

    function searchBuckets(buckets, hash) {
        var i = buckets.length, bucket;
        while (i--) {
            bucket = buckets[i];
            if (hash === bucket[0]) {
                return i;
            }
        }
        return null;
    }

    function getBucketForHash(bucketsByHash, hash) {
        var bucket = bucketsByHash[hash];

        // Check that this is a genuine bucket and not something inherited from the bucketsByHash's prototype
        return ( bucket && (bucket instanceof Bucket) ) ? bucket : null;
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    function Hashtable() {
        var buckets = [];
        var bucketsByHash = {};
        var properties = {
            replaceDuplicateKey: true,
            hashCode: hashObject,
            equals: null
        };

        var arg0 = arguments[0], arg1 = arguments[1];
        if (arg1 !== UNDEFINED) {
            properties.hashCode = arg0;
            properties.equals = arg1;
        } else if (arg0 !== UNDEFINED) {
            merge(properties, arg0);
        }

        var hashCode = properties.hashCode, equals = properties.equals;

        this.properties = properties;

        this.put = function(key, value) {
            checkKey(key);
            checkValue(value);
            var hash = hashCode(key), bucket, bucketEntry, oldValue = null;

            // Check if a bucket exists for the bucket key
            bucket = getBucketForHash(bucketsByHash, hash);
            if (bucket) {
                // Check this bucket to see if it already contains this key
                bucketEntry = bucket.getEntryForKey(key);
                if (bucketEntry) {
                    // This bucket entry is the current mapping of key to value, so replace the old value.
                    // Also, we optionally replace the key so that the latest key is stored.
                    if (properties.replaceDuplicateKey) {
                        bucketEntry[0] = key;
                    }
                    oldValue = bucketEntry[1];
                    bucketEntry[1] = value;
                } else {
                    // The bucket does not contain an entry for this key, so add one
                    bucket.addEntry(key, value);
                }
            } else {
                // No bucket exists for the key, so create one and put our key/value mapping in
                bucket = new Bucket(hash, key, value, equals);
                buckets.push(bucket);
                bucketsByHash[hash] = bucket;
            }
            return oldValue;
        };

        this.get = function(key) {
            checkKey(key);

            var hash = hashCode(key);

            // Check if a bucket exists for the bucket key
            var bucket = getBucketForHash(bucketsByHash, hash);
            if (bucket) {
                // Check this bucket to see if it contains this key
                var bucketEntry = bucket.getEntryForKey(key);
                if (bucketEntry) {
                    // This bucket entry is the current mapping of key to value, so return the value.
                    return bucketEntry[1];
                }
            }
            return null;
        };

        this.containsKey = function(key) {
            checkKey(key);
            var bucketKey = hashCode(key);

            // Check if a bucket exists for the bucket key
            var bucket = getBucketForHash(bucketsByHash, bucketKey);

            return bucket ? bucket.containsKey(key) : false;
        };

        this.containsValue = function(value) {
            checkValue(value);
            var i = buckets.length;
            while (i--) {
                if (buckets[i].containsValue(value)) {
                    return true;
                }
            }
            return false;
        };

        this.clear = function() {
            buckets.length = 0;
            bucketsByHash = {};
        };

        this.isEmpty = function() {
            return !buckets.length;
        };

        var createBucketAggregator = function(bucketFuncName) {
            return function() {
                var aggregated = [], i = buckets.length;
                while (i--) {
                    buckets[i][bucketFuncName](aggregated);
                }
                return aggregated;
            };
        };

        this.keys = createBucketAggregator("keys");
        this.values = createBucketAggregator("values");
        this.entries = createBucketAggregator("getEntries");

        this.remove = function(key) {
            checkKey(key);

            var hash = hashCode(key), bucketIndex, oldValue = null;

            // Check if a bucket exists for the bucket key
            var bucket = getBucketForHash(bucketsByHash, hash);

            if (bucket) {
                // Remove entry from this bucket for this key
                oldValue = bucket.removeEntryForKey(key);
                if (oldValue !== null) {
                    // Entry was removed, so check if bucket is empty
                    if (bucket.entries.length == 0) {
                        // Bucket is empty, so remove it from the bucket collections
                        bucketIndex = searchBuckets(buckets, hash);
                        buckets.splice(bucketIndex, 1);
                        delete bucketsByHash[hash];
                    }
                }
            }
            return oldValue;
        };

        this.size = function() {
            var total = 0, i = buckets.length;
            while (i--) {
                total += buckets[i].entries.length;
            }
            return total;
        };
    }

    Hashtable.prototype = {
        each: function(callback) {
            var entries = this.entries(), i = entries.length, entry;
            while (i--) {
                entry = entries[i];
                callback(entry[0], entry[1]);
            }
        },

        equals: function(hashtable) {
            var keys, key, val, count = this.size();
            if (count == hashtable.size()) {
                keys = this.keys();
                while (count--) {
                    key = keys[count];
                    val = hashtable.get(key);
                    if (val === null || val !== this.get(key)) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        },

        putAll: function(hashtable, conflictCallback) {
            var entries = hashtable.entries();
            var entry, key, value, thisValue, i = entries.length;
            var hasConflictCallback = (typeof conflictCallback == FUNCTION);
            while (i--) {
                entry = entries[i];
                key = entry[0];
                value = entry[1];

                // Check for a conflict. The default behaviour is to overwrite the value for an existing key
                if ( hasConflictCallback && (thisValue = this.get(key)) ) {
                    value = conflictCallback(key, thisValue, value);
                }
                this.put(key, value);
            }
        },

        clone: function() {
            var clone = new Hashtable(this.properties);
            clone.putAll(this);
            return clone;
        }
    };

    Hashtable.prototype.toQueryString = function() {
        var entries = this.entries(), i = entries.length, entry;
        var parts = [];
        while (i--) {
            entry = entries[i];
            parts[i] = encodeURIComponent( toStr(entry[0]) ) + "=" + encodeURIComponent( toStr(entry[1]) );
        }
        return parts.join("&");
    };

    return Hashtable;
})();

/**
 * jquery.numberformatter - Formatting/Parsing Numbers in jQuery
 * 
 * Written by
 * Michael Abernethy (mike@abernethysoft.com),
 * Andrew Parry (aparry0@gmail.com)
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * @author Michael Abernethy, Andrew Parry
 * @version 1.2.4-RELEASE ($Id$)
 * 
 * Dependencies
 * 
 * jQuery (http://jquery.com)
 * jshashtable (http://www.timdown.co.uk/jshashtable)
 * 
 * Notes & Thanks
 * 
 * many thanks to advweb.nanasi.jp for his bug fixes
 * jsHashtable is now used also, so thanks to the author for that excellent little class.
 *
 * This plugin can be used to format numbers as text and parse text as Numbers
 * Because we live in an international world, we cannot assume that everyone
 * uses "," to divide thousands, and "." as a decimal point.
 *
 * As of 1.2 the way this plugin works has changed slightly, parsing text to a number
 * has 1 set of functions, formatting a number to text has it's own. Before things
 * were a little confusing, so I wanted to separate the 2 out more.
 *
 *
 * jQuery extension functions:
 *
 * formatNumber(options, writeBack, giveReturnValue) - Reads the value from the subject, parses to
 * a Javascript Number object, then formats back to text using the passed options and write back to
 * the subject.
 * 
 * parseNumber(options) - Parses the value in the subject to a Number object using the passed options
 * to decipher the actual number from the text, then writes the value as text back to the subject.
 * 
 * 
 * Generic functions:
 * 
 * formatNumber(numberString, options) - Takes a plain number as a string (e.g. '1002.0123') and returns
 * a string of the given format options.
 * 
 * parseNumber(numberString, options) - Takes a number as text that is formatted the same as the given
 * options then and returns it as a plain Number object.
 * 
 * To achieve the old way of combining parsing and formatting to keep say a input field always formatted
 * to a given format after it has lost focus you'd simply use a combination of the functions.
 * 
 * e.g.
 * $("#salary").blur(function(){
 *      $(this).parseNumber({format:"#,###.00", locale:"us"});
 *      $(this).formatNumber({format:"#,###.00", locale:"us"});
 * });
 *
 * The syntax for the formatting is:
 * 0 = Digit
 * # = Digit, zero shows as absent
 * . = Decimal separator
 * - = Negative sign
 * , = Grouping Separator
 * % = Percent (multiplies the number by 100)
 * 
 * For example, a format of "#,###.00" and text of 4500.20 will
 * display as "4.500,20" with a locale of "de", and "4,500.20" with a locale of "us"
 *
 *
 * As of now, the only acceptable locales are 
 * Arab Emirates -> "ae"
 * Australia -> "au"
 * Austria -> "at"
 * Brazil -> "br"
 * Canada -> "ca"
 * China -> "cn"
 * Czech -> "cz"
 * Denmark -> "dk"
 * Egypt -> "eg"
 * Finland -> "fi"
 * France  -> "fr"
 * Germany -> "de"
 * Greece -> "gr"
 * Great Britain -> "gb"
 * Hong Kong -> "hk"
 * India -> "in"
 * Israel -> "il"
 * Japan -> "jp"
 * Russia -> "ru"
 * South Korea -> "kr"
 * Spain -> "es"
 * Sweden -> "se"
 * Switzerland -> "ch"
 * Taiwan -> "tw"
 * Thailand -> "th"
 * United States -> "us"
 * Vietnam -> "vn"
 **/

(function(jQuery) {

    var nfLocales = new Hashtable();
    
    var nfLocalesLikeUS = [ 'ae','au','ca','cn','eg','gb','hk','il','in','jp','sk','th','tw','us' ];
    var nfLocalesLikeDE = [ 'at','br','de','dk','es','gr','it','nl','pt','tr','vn' ];
    var nfLocalesLikeFR = [ 'bg','cz','fi','fr','no','pl','ru','se' ];
    var nfLocalesLikeCH = [ 'ch' ];
    
    var nfLocaleFormatting = [ [".", ","], [",", "."], [",", " "], [".", "'"] ]; 
    var nfAllLocales = [ nfLocalesLikeUS, nfLocalesLikeDE, nfLocalesLikeFR, nfLocalesLikeCH ]

    function FormatData(dec, group, neg) {
        this.dec = dec;
        this.group = group;
        this.neg = neg;
    };

    function init() {
        // write the arrays into the hashtable
        for (var localeGroupIdx = 0; localeGroupIdx < nfAllLocales.length; localeGroupIdx++) {
            var localeGroup = nfAllLocales[localeGroupIdx];
            for (var i = 0; i < localeGroup.length; i++) {
                nfLocales.put(localeGroup[i], localeGroupIdx);
            }
        }
    };

    function formatCodes(locale, isFullLocale) {
        if (nfLocales.size() == 0)
            init();

         // default values
         var dec = ".";
         var group = ",";
         var neg = "-";
         
         if (isFullLocale == false) {
             // Extract and convert to lower-case any language code from a real 'locale' formatted string, if not use as-is
             // (To prevent locale format like : "fr_FR", "en_US", "de_DE", "fr_FR", "en-US", "de-DE")
             if (locale.indexOf('_') != -1)
                locale = locale.split('_')[1].toLowerCase();
             else if (locale.indexOf('-') != -1)
                locale = locale.split('-')[1].toLowerCase();
        }

         // hashtable lookup to match locale with codes
         var codesIndex = nfLocales.get(locale);
         if (codesIndex) {
            var codes = nfLocaleFormatting[codesIndex];
            if (codes) {
                dec = codes[0];
                group = codes[1];
            }
         }
         return new FormatData(dec, group, neg);
    };
    
    
    /*  Formatting Methods  */
    
    
    /**
     * Formats anything containing a number in standard js number notation.
     * 
     * @param {Object}  options         The formatting options to use
     * @param {Boolean} writeBack       (true) If the output value should be written back to the subject
     * @param {Boolean} giveReturnValue (true) If the function should return the output string
     */
    jQuery.fn.formatNumber = function(options, writeBack, giveReturnValue) {
        return this.each(function() {
            // enforce defaults
            if (writeBack == null)
                writeBack = true;
            if (giveReturnValue == null)
                giveReturnValue = true;
            
            // get text
            var text;
            if (jQuery(this).is(":input"))
                text = new String(jQuery(this).val());
            else
                text = new String(jQuery(this).text());

            // format
            var returnString = jQuery.formatNumber(text, options);
        
            // set formatted string back, only if a success
//          if (returnString) {
                if (writeBack) {
                    if (jQuery(this).is(":input"))
                        jQuery(this).val(returnString);
                    else
                        jQuery(this).text(returnString);
                }
                if (giveReturnValue)
                    return returnString;
//          }
//          return '';
        });
    };
    
    /**
     * First parses a string and reformats it with the given options.
     * 
     * @param {Object} numberString
     * @param {Object} options
     */
    jQuery.formatNumber = function(numberString, options){
        var options = jQuery.extend({}, jQuery.fn.formatNumber.defaults, options);
        var formatData = formatCodes(options.locale.toLowerCase(), options.isFullLocale);
        
        var dec = formatData.dec;
        var group = formatData.group;
        var neg = formatData.neg;
        
        var validFormat = "0#-,.";
        
        // strip all the invalid characters at the beginning and the end
        // of the format, and we'll stick them back on at the end
        // make a special case for the negative sign "-" though, so 
        // we can have formats like -$23.32
        var prefix = "";
        var negativeInFront = false;
        for (var i = 0; i < options.format.length; i++) {
            if (validFormat.indexOf(options.format.charAt(i)) == -1) 
                prefix = prefix + options.format.charAt(i);
            else 
                if (i == 0 && options.format.charAt(i) == '-') {
                    negativeInFront = true;
                    continue;
                }
                else 
                    break;
        }
        var suffix = "";
        for (var i = options.format.length - 1; i >= 0; i--) {
            if (validFormat.indexOf(options.format.charAt(i)) == -1) 
                suffix = options.format.charAt(i) + suffix;
            else 
                break;
        }
       
        options.format = options.format.substring(prefix.length);
        options.format = options.format.substring(0, options.format.length - suffix.length);
        
        // now we need to convert it into a number
        //while (numberString.indexOf(group) > -1) 
        //  numberString = numberString.replace(group, '');
        //var number = new Number(numberString.replace(dec, ".").replace(neg, "-"));
        var number = new Number(numberString);
        
        return jQuery._formatNumber(number, options, suffix, prefix, negativeInFront);
    };
    
    /**
     * Formats a Number object into a string, using the given formatting options
     * 
     * @param {Object} numberString
     * @param {Object} options
     */
    jQuery._formatNumber = function(number, options, suffix, prefix, negativeInFront) {
        var options = jQuery.extend({}, jQuery.fn.formatNumber.defaults, options);
        var formatData = formatCodes(options.locale.toLowerCase(), options.isFullLocale);
        
        var dec = formatData.dec;
        var group = formatData.group;
        var neg = formatData.neg;

        // check overrides
        if (options.overrideGroupSep != null) {
            group = options.overrideGroupSep;
        }
        if (options.overrideDecSep != null) {
            dec = options.overrideDecSep;
        }
        if (options.overrideNegSign != null) {
            neg = options.overrideNegSign;
        }
        
        // Check NAN handling
        var forcedToZero = false;
        if (isNaN(number)) {
            if (options.nanForceZero == true) {
                number = 0;
                forcedToZero = true;
            } else {
                return '';
            }
        }

        // special case for percentages
        if (options.isPercentage == true || (options.autoDetectPercentage && suffix.charAt(suffix.length - 1) == '%')) {
            number = number * 100;
        }

        var returnString = "";
        if (options.format.indexOf(".") > -1) {
            var decimalPortion = dec;
            var decimalFormat = options.format.substring(options.format.lastIndexOf(".") + 1);
            
            // round or truncate number as needed
            if (options.round == true)
                number = new Number(number.toFixed(decimalFormat.length));
            else {
                var numStr = number.toString();
                if (numStr.lastIndexOf('.') > 0) {
                    numStr = numStr.substring(0, numStr.lastIndexOf('.') + decimalFormat.length + 1);
                }
                number = new Number(numStr);
            }
            
            var decimalValue = new Number(number.toString().substring(number.toString().indexOf('.')));
            decimalString = new String(decimalValue.toFixed(decimalFormat.length));
            decimalString = decimalString.substring(decimalString.lastIndexOf('.') + 1);
            for (var i = 0; i < decimalFormat.length; i++) {
                if (decimalFormat.charAt(i) == '#' && decimalString.charAt(i) != '0') {
                    decimalPortion += decimalString.charAt(i);
                    continue;
                } else if (decimalFormat.charAt(i) == '#' && decimalString.charAt(i) == '0') {
                    var notParsed = decimalString.substring(i);
                    if (notParsed.match('[1-9]')) {
                        decimalPortion += decimalString.charAt(i);
                        continue;
                    } else
                        break;
                } else if (decimalFormat.charAt(i) == "0")
                    decimalPortion += decimalString.charAt(i);
            }
            returnString += decimalPortion
         } else
            number = Math.round(number);

        var ones = Math.floor(number);
        if (number < 0)
            ones = Math.ceil(number);

        var onesFormat = "";
        if (options.format.indexOf(".") == -1)
            onesFormat = options.format;
        else
            onesFormat = options.format.substring(0, options.format.indexOf("."));

        var onePortion = "";
        if (!(ones == 0 && onesFormat.substr(onesFormat.length - 1) == '#') || forcedToZero) {
            // find how many digits are in the group
            var oneText = new String(Math.abs(ones));
            var groupLength = 9999;
            if (onesFormat.lastIndexOf(",") != -1)
                groupLength = onesFormat.length - onesFormat.lastIndexOf(",") - 1;
            var groupCount = 0;
            for (var i = oneText.length - 1; i > -1; i--) {
                onePortion = oneText.charAt(i) + onePortion;
                groupCount++;
                if (groupCount == groupLength && i != 0) {
                    onePortion = group + onePortion;
                    groupCount = 0;
                }
            }
            
            // account for any pre-data padding
            if (onesFormat.length > onePortion.length) {
                var padStart = onesFormat.indexOf('0');
                if (padStart != -1) {
                    var padLen = onesFormat.length - padStart;
                    
                    // pad to left with 0's or group char
                    var pos = onesFormat.length - onePortion.length - 1;
                    while (onePortion.length < padLen) {
                        var padChar = onesFormat.charAt(pos);
                        // replace with real group char if needed
                        if (padChar == ',')
                            padChar = group;
                        onePortion = padChar + onePortion;
                        pos--;
                    }
                }
            }
        }
        
        if (!onePortion && onesFormat.indexOf('0', onesFormat.length - 1) !== -1)
            onePortion = '0';

        returnString = onePortion + returnString;

        // handle special case where negative is in front of the invalid characters
        if (number < 0 && negativeInFront && prefix.length > 0)
            prefix = neg + prefix;
        else if (number < 0)
            returnString = neg + returnString;
        
        if (!options.decimalSeparatorAlwaysShown) {
            if (returnString.lastIndexOf(dec) == returnString.length - 1) {
                returnString = returnString.substring(0, returnString.length - 1);
            }
        }
        returnString = prefix + returnString + suffix;
        return returnString;
    };


    /*  Parsing Methods */


    /**
     * Parses a number of given format from the element and returns a Number object.
     * @param {Object} options
     */
    jQuery.fn.parseNumber = function(options, writeBack, giveReturnValue) {
        // enforce defaults
        if (writeBack == null)
            writeBack = true;
        if (giveReturnValue == null)
            giveReturnValue = true;
        
        // get text
        var text;
        if (jQuery(this).is(":input"))
            text = new String(jQuery(this).val());
        else
            text = new String(jQuery(this).text());
    
        // parse text
        var number = jQuery.parseNumber(text, options);
        
        if (number) {
            if (writeBack) {
                if (jQuery(this).is(":input"))
                    jQuery(this).val(number.toString());
                else
                    jQuery(this).text(number.toString());
            }
            if (giveReturnValue)
                return number;
        }
    };
    
    /**
     * Parses a string of given format into a Number object.
     * 
     * @param {Object} string
     * @param {Object} options
     */
    jQuery.parseNumber = function(numberString, options) {
        var options = jQuery.extend({}, jQuery.fn.parseNumber.defaults, options);
        var formatData = formatCodes(options.locale.toLowerCase(), options.isFullLocale);

        var dec = formatData.dec;
        var group = formatData.group;
        var neg = formatData.neg;

        // check overrides
        if (options.overrideGroupSep != null) {
            group = options.overrideGroupSep;
        }
        if (options.overrideDecSep != null) {
            dec = options.overrideDecSep;
        }
        if (options.overrideNegSign != null) {
            neg = options.overrideNegSign;
        }

        var valid = "1234567890";
        var validOnce = '.-';
        var strictMode = options.strict;
        
        // now we need to convert it into a number
        while (numberString.indexOf(group)>-1) {
            numberString = numberString.replace(group, '');
        }
        numberString = numberString.replace(dec, '.').replace(neg, '-');
        var validText = '';
        var hasPercent = false;

        if (options.isPercentage == true || (options.autoDetectPercentage && numberString.charAt(numberString.length - 1) == '%')) {
            hasPercent = true;
        }

        for (var i = 0; i < numberString.length; i++) {
            if (valid.indexOf(numberString.charAt(i)) > -1) {
                validText = validText + numberString.charAt(i);
            } else if (validOnce.indexOf(numberString.charAt(i)) > -1) {
                validText = validText + numberString.charAt(i);
                validOnce = validOnce.replace(numberString.charAt(i), '');
            } else {
                if (options.allowPostfix) {
                    // treat anything after this point (inclusive) as a postfix
                    break;
                } else if (strictMode) {
                    // abort and force the text to NaN as it's not strictly valid
                    validText = 'NaN';
                    break;
                }
            }
        }
        var number = new Number(validText);
        if (hasPercent) {
            number = number / 100;
            var decimalPos = validText.indexOf('.');
            if (decimalPos != -1) {
                var decimalPoints = validText.length - decimalPos - 1;
                number = number.toFixed(decimalPoints + 2);
            } else {
                number = number.toFixed(2);
            }
        }

        return number;
    };

    jQuery.fn.parseNumber.defaults = {
        locale: "dk",
        decimalSeparatorAlwaysShown: false,
        isPercentage: false,            // treats the input as a percentage (i.e. input divided by 100)
        autoDetectPercentage: true,     // will search if the input string ends with '%', if it does then the above option is implicitly set
        isFullLocale: false,
        strict: false,                  // will abort the parse if it hits any unknown char
        overrideGroupSep: null,         // override for group separator
        overrideDecSep: null,           // override for decimal point separator
        overrideNegSign: null,          // override for negative sign
        allowPostfix: false             // will truncate the input string as soon as it hits an unknown char
    };

    jQuery.fn.formatNumber.defaults = {
        format: "#,###.##",
        locale: "dk",
        decimalSeparatorAlwaysShown: false,
        nanForceZero: true,
        round: true,
        isFullLocale: false,
        overrideGroupSep: null,
        overrideDecSep: null,
        overrideNegSign: null,
        isPercentage: false,            // treats the input as a percentage (i.e. input multiplied by 100)
        autoDetectPercentage: true      // will search if the format string ends with '%', if it does then the above option is implicitly set
    };
    
    Number.prototype.toFixed = function(precision) {
        return jQuery._roundNumber(this, precision);
    };
    
    jQuery._roundNumber = function(number, decimalPlaces) {
        var power = Math.pow(10, decimalPlaces || 0);
        var value = String(Math.round(number * power) / power);
        
        // ensure the decimal places are there
        if (decimalPlaces > 0) {
            var dp = value.indexOf(".");
            if (dp == -1) {
                value += '.';
                dp = 0;
            } else {
                dp = value.length - (dp + 1);
            }
            
            while (dp < decimalPlaces) {
                value += '0';
                dp++;
            }
        }
        return value;
    };

 })(jQuery);