/**
 * Adapted by LIU Hao (@haoliu87, http://haoliu.cc)
 *
 * By Hakim El Hattab (@hakimel, http://hakim.se)
 *
 * Inspired by http://patakk.tumblr.com/post/33304597365
 */
(function() {
	var canvas = document.getElementById( 'myCanvas' ),
		context = canvas.getContext( '2d' ),

		width = window.innerWidth * 0.6,
		height = window.innerHeight * 0.6,

		radius = Math.min( width, height ) * 0.5,

		// Number of layers
		quality = 100,

		// Layer instances
		layers = [],

		// Width/height of layers
		layerSize = radius * 0.4,

		// Layers that overlap to create the infinity illusion
		layerOverlap = Math.round( quality * 0.5 );

	function initialize() {
		for( var i = 0; i < quality; i++ ) {
			layers.push({
				x: width/2 + Math.sin( i / quality * 2 * Math.PI ) * ( radius - layerSize ),
				y: height/2 + Math.cos( i / quality * 2 * Math.PI ) * ( radius - layerSize ),
				r: ( i / quality ) * Math.PI * 0.5
			});
		}
		resize();
		update();
	}

	function resize() {
		canvas.width = width;
		canvas.height = height;
	}

	function update() {
		requestAnimationFrame(update);
		step();
		clear();
		paint();
	}

	// Takes a step in the simulation
	function step () {
		for( var i = 0, len = layers.length; i < len; i++ ) {
			// the rolling speed
			layers[i].r += 0.003;
		}
	}

	// Clears the painting
	function clear() {
		context.clearRect( 0, 0, canvas.width, canvas.height );
	}

	// Paints the current state
	function paint() {
		// original method

		// Number of layers in total
		var layersLength = layers.length;

		// Draw the overlap layers
		for( var i = layersLength - layerOverlap, len = layersLength; i < len; i++ ) {
			context.save();
			context.globalCompositeOperation = 'destination-over';
			paintLayer( layers[i] );
			context.restore();

		}

		// Cut out the overflow layers using the first layer as a mask
		context.save();
		context.globalCompositeOperation = 'destination-in';
		paintLayer( layers[0], true );
		context.restore();

		// // Draw the normal layers underneath the overlap
		for( var i = 0, len = layersLength; i < len; i++ ) {
			context.save();
			context.globalCompositeOperation = 'destination-over';
			paintLayer( layers[i] );
			context.restore();
		}

		// Zach's method
		// var i, layer, _i, _j, _len, _ref, _ref1, _ref2;
		// for(i = _i = _ref = layers.length-layerOverlap, _ref1 = layers.length; _ref <= _ref1 ? _i < _ref1 : _i > _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
		// 	context.save();
		// 	context.globalCompositeOperation = 'destination-over';
		// 	paintLayer(layers[i]);
		// 	context.restore();
		// }

		// context.save();
		// context.globalCompositeOperation = 'destination-in';
		// paintLayer(layers[0], true);
		// context.restore();
		// _ref2 = layers;


		// for(_j = 0, _len = _ref2.length; _j<_len; _j++) {
		// 	layer = _ref2[_j];
		// 	context.save();
		// 	context.globalCompositeOperation = 'destination-over';
		// 	paintLayer(layer);
		// 	context.restore();
		// }


	}

	// Paint one layer
	function paintLayer( layer, mask ) {
		size = layerSize + ( mask ? 20 : 0 );
		size2 = size / 2;

		context.translate( layer.x, layer.y );
		context.rotate( layer.r );

		// No stroke if this is a mask
		if( !mask ) {
			context.strokeStyle = '#092e68';
			context.lineWidth = 1;
			context.strokeRect( -size2, -size2, size, size );
		}

		context.fillStyle = '#fff';
		context.fillRect( -size2, -size2, size, size );
	}

	/**
	 * rAF polyfill.
	 */
	(function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelAnimationFrame = 
			  window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
				  timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};

		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
	})();

	initialize();

})();