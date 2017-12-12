'use strict';

var TurnTable = function(el, data, options) {
  this.$el = el;
  this.data = data || [];
  this.defaultOptions = {
    rootClass: 'turntable',
    wrapClass: 'turntable-wrap',
    maskClass: 'turntable-mask',
    mainClass: 'turntable-main',
    itemClass: 'turntable-item',
    actionClass: 'turntable-action',
    actionLabel: '抽奖',
    radius: 100,
    lineWidth: 1,
    lineColor: '#E44025',
    outerLineWidth: 5,
    fillColors: ['#FFB820', '#FFCB3F'],
    defaultSelected: 0,
    duration: 5000,
    delay: 100,
    speed: 3600,
    timingFunction: 'ease-in-out',
    renderItem: function(idx, item) {
      var t = document.createElement('span');
      t.innerHTML = item;
      return t;
    },
    lottery: function(data) {
      data = data || [];

      if (data.length <= 0) {
        return -1;
      }

      return Math.round(Math.random() * data.length - 1);
    },
    handleLotteryResult: function(idx, item) {
      alert('data[' + idx + '] = ' + item);
    }
  };
  this.options = {};
  for (var key in this.defaultOptions) {
    this.options[key] = options[key] || this.defaultOptions[key];
  }
};

TurnTable.prototype = {
  __initialize: function() {
    if (this.$el.className.indexOf(this.options.rootClass) < 0) {
      this.$el.className = this.$el.className + ' ' + this.options.rootClass;
    }

    this.$wrap = document.createElement('div');
    this.$wrap.className = this.options.wrapClass;
    this.$el.appendChild(this.$wrap);

    this.$canvas = document.createElement('canvas');
    this.$canvas.className = this.options.maskClass;
    this.$wrap.appendChild(this.$canvas);

    this.$main = document.createElement('ul');
    this.$main.className = this.options.mainClass;
    this.$wrap.appendChild(this.$main);

    this.$action = document.createElement('span');
    this.$action.className = this.options.actionClass;
    this.$action.innerHTML = this.options.actionLabel;
    this.$el.appendChild(this.$action);

    this.$el.style.width = this.$el.style.height = this.$wrap.style.width = this.$wrap.style.height = this.$main.style.width = this.$main.style.height =
      this.options.radius * 2 + 'px';

    this.$canvas.width = this.$canvas.height = this.options.radius * 2;

    this.render();
    this.afterRender();
  },
  clear: function() {},
  drawMask: function() {
    var context = this.$canvas.getContext('2d'),
      l = this.data.length;

    if (l <= 0) {
      return;
    }

    var r = 360 / l,
      deg = Math.PI / 180;

    context.translate(this.options.radius, this.options.radius);

    // 绘制圆
    for (var i = 0; i < l; i++) {
      context.save();
      context.beginPath();
      context.moveTo(0, 0);
      // 画出圆弧
      context.arc(
        0,
        0,
        this.options.radius - this.options.lineWidth / 2,
        (i * r - r / 2 - 90) * deg,
        ((i + 1) * r - r / 2 - 90) * deg
      );

      // 连接到圆心
      context.lineTo(0, 0);
      context.closePath();

      context.lineWidth = this.options.lineWidth;
      context.strokeStyle = this.options.lineColor;
      context.fillStyle = this.options.fillColors[
        i % this.options.fillColors.length
      ];

      context.fill();
      context.stroke();
      context.restore();
    }

    // 绘制圆外圈
    context.beginPath();
    context.arc(
      0,
      0,
      this.options.radius - this.options.outerLineWidth / 2,
      0,
      360 * deg
    );
    context.strokeStyle = this.options.lineColor;
    context.lineWidth = this.options.outerLineWidth;
    context.stroke();
  },
  drawMain: function() {
    var l = this.data.length;

    if (l <= 0) {
      return;
    }

    var r = 360 / l;

    var fm = document.createDocumentFragment();
    for (var i = 0; i < l; i++) {
      var item = document.createElement('li');
      item.className = this.options.itemClass;
      item.appendChild(this.options.renderItem(i, this.data[i]));

      item.style.transform = 'rotate(' + -r * i + 'deg)';

      fm.appendChild(item);
    }

    this.$main.appendChild(fm);
  },

  startLottery: function(result) {
    var that = this;

    result = result || that.options.lottery(that.data);

    if (result < 0) {
      return;
    }

    that.$action.setAttribute('data-disabled', true);
    that.$action.className = that.options.actionClass + ' disabled';

    var counts = parseInt(that.$wrap.getAttribute('data-counts'));
    var r = 360 / that.data.length;
    var rotation = (counts + 1) * that.options.speed + result * r;

    that.$wrap.style.transform = 'rotate(' + rotation + 'deg)';
    that.$wrap.setAttribute('data-counts', counts + 1);

    setTimeout(function() {
      that.$action.removeAttribute('data-disabled', true);
      that.$action.className = that.options.actionClass;

      that.options.handleLotteryResult(result, that.data[result]);
    }, that.options.duration);
  },

  render: function() {
    var that = this;
    that.clear();
    that.drawMask();
    that.drawMain();

    that.$action.onclick = function() {
      if (that.$action.getAttribute('data-disabled')) {
        return;
      }

      that.startLottery();
    };
  },
  afterRender: function() {
    var l = this.data.length;

    if (l <= 0) {
      return;
    }

    var r = 360 / l;

    this.currentSelected =
      this.options.defaultSelected >= l ? l : this.options.defaultSelected;

    this.$wrap.style.transform = 'rotate(' + this.currentSelected * r + 'deg)';
    this.$wrap.setAttribute('data-counts', 0);

    this.$wrap.style.transitionDelay = this.options.delay / 1000 + 's';
    this.$wrap.style.transitionDuration = this.options.duration / 1000 + 's';
    this.$wrap.style.transitionTimingFunction = this.options.timingFunction;
  }
};

TurnTable.init = function(el, data, options) {
  var turntable = new TurnTable(el, data, options);
  turntable.__initialize();
  return turntable;
};
