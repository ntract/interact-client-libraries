define(['underscore', 'backbone'], function(_, Backbone) {

	var Controller = Backbone.Controller = function(options) {
		options || (options = {});
		this.initialize.apply(this, arguments);
	};

	_.extend(Controller.prototype, Backbone.Events, {

		initialize: function() {},

		remove: function() {
			this.stopListening();
		}

	});
	
	Controller.extend = Backbone.View.extend;

	return Controller;
});
