define(['underscore', 'backbone'], function(_, Backbone) {

	var Controller = Backbone.Controller = function(options) {
		options || (options = {});
		this.initialize.apply(this, arguments);
	};

	_.extend(Controller.prototype, Backbone.Events, {

		initialize: function() {}

	});
	
	Controller.extend = Backbone.View.extend;

	return Controller;
});
