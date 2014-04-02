// Generated by CoffeeScript 1.6.2
(function() {
  var Spinner,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Spinner = (function() {
    function Spinner($canvas) {
      this.$canvas = $canvas;
      this.update = __bind(this.update, this);
      this.canvas = this.$canvas[0];
      this.context = this.canvas.getContext('2d');
      this.height = this.width = 220;
      //this.width = this.height = Math.min(window.innerWidth * 0.3, window.innerHeight * 0.3);
      this.radius = 0.5 * Math.min(this.width, this.height);
      this.quality = 75;
      this.layers = [];
      this.layerSize = this.radius * 0.5;
      this.layerOverlap = Math.round(this.quality * 0.5);
      this.animate = false;
    }

    Spinner.prototype.initialize = function() {
      var i, _i, _ref;

      for (i = _i = 0, _ref = this.quality; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.layers.push({
          x: (this.width / 2) + Math.sin(i / this.quality * 2 * Math.PI) * (this.radius - this.layerSize),
          y: (this.height / 2) + Math.cos(i / this.quality * 2 * Math.PI) * (this.radius - this.layerSize),
          r: (i / this.quality) * Math.PI * 0.5
        });
      }
      this.resize();
      return this.update();
    };

    Spinner.prototype.resize = function() {
      this.canvas.width = this.width;
      return this.canvas.height = this.height;
    };

    Spinner.prototype.update = function() {
      this.clear();
      this.paint();
      if (this.animate) {
        requestAnimationFrame(this.update);
        return this.step();
      }
    };

    Spinner.prototype.step = function() {
      var i, _i, _ref, _results;

      _results = [];
      for (i = _i = 0, _ref = this.layers.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.layers[i].r += 0.005);
      }
      return _results;
    };

    Spinner.prototype.clear = function() {
      return this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    Spinner.prototype.paint = function() {
      var i, layer, _i, _j, _len, _ref, _ref1, _ref2, _results;

      for (i = _i = _ref = this.layers.length - this.layerOverlap, _ref1 = this.layers.length; _ref <= _ref1 ? _i < _ref1 : _i > _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
        this.context.save();
        this.context.globalCompositeOperation = 'destination-over';
        this.paintLayer(this.layers[i]);
        this.context.restore();
      }
      this.context.save();
      this.context.globalCompositeOperation = 'destination-in';
      this.paintLayer(this.layers[0], true);
      this.context.restore();
      _ref2 = this.layers;
      _results = [];
      for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
        layer = _ref2[_j];
        this.context.save();
        this.context.globalCompositeOperation = 'destination-over';
        this.paintLayer(layer);
        _results.push(this.context.restore());
      }
      return _results;
    };

    Spinner.prototype.paintLayer = function(layer, mask) {
      var half_size, size;

      size = this.layerSize + (mask ? 25 : 0);
      half_size = size / 2;
      this.context.translate(layer.x, layer.y);
      this.context.rotate(layer.r);
      if (!mask) {
        this.context.strokeStyle = '#092e68';
        this.context.lineWidth = 1;
        this.context.strokeRect(-half_size, -half_size, size, size);
      }
      this.context.fillStyle = '#fff';
      return this.context.fillRect(-half_size, -half_size, size, size);
    };

    return Spinner;

  })();

  $(function() {
    var spinner;

    spinner = new Spinner($('header canvas'));
    spinner.initialize();
    $(spinner.canvas).mouseenter(function() {
      spinner.animate = true;
      return spinner.update();
    });
    return $(spinner.canvas).mouseleave(function() {
      return spinner.animate = false;
    });
  });

}).call(this);
