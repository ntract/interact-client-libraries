define([
    'DOMDiffer',
    'backbone'
], function(DOMDiffer) {

    // Abstract view - Do not instantiate directly, please extend first
    var ddInstance, ddOptions, ddTemp;

    Backbone.DiffView = Backbone.View.extend({

        // Default view Properties
        isRemoved: false,
        hasRendered: false,

        // Developer configurable properties
        renderAttributes: undefined,

        initialize: function initialize(options){
            options = options || {};

            // Debouce render so that many variable changes can be lumped into a single redraw
            this.render = _.debounce(_.bind(this.render, this), 17);

            // Create a state model to manage view-only states
            this.state = options.state || new Backbone.Model({});

            if (this.state && this.state.listenTo)
                this.listenTo(this.state, "change", this.onChangeRenderFilter, this);
            
            if (this.model && this.model.listenTo)
                this.listenTo(this.model, "change", this.onChangeRenderFilter, this);

            this.trigger("initialize", options);
            this.postInitialize.apply(this, arguments);
            this.trigger("postInitialize", options);
        },

        // Override with post initialize code
        postInitialize: function postInitialize(options) {},

        // Override with pre rendering code
        preRender: function preRender(isFirstRender) {},

        render: function render() {

            // Do not allow render if the view has been removed
            if (this.isRemoved) return;

            var isFirstRender = !this.hasRendered;

            this.trigger("preRender", this, isFirstRender);
            this.preRender(isFirstRender);

            var template = this.constructor.template;

            if (typeof template === "string") template = plugins.templates[template];

            var renderedHTML = template(this.getRenderData());;

            if (this.hasRendered) {

                var ddTemp = document.createElement(this.renderTagName || "div");
                // Push renderedHTML into temporary DOM node
                ddTemp.innerHTML = renderedHTML;

                //var startTime = (new Date()).getTime();

                // Update this.el from ddTemp
                var diff = ddInstance.nodeUpdateNode(this.el, ddTemp, {
                    ignoreContainer: true,
                    returnDiff: true
                });

                //var totalTime = (new Date()).getTime() - startTime;

                //console.log("diffing", totalTime+"ms", diff.length + "changes", diff);

            } else {

                 // Push renderedHTML straight into DOM
                this.el.innerHTML = renderedHTML;

            }

            _.defer(_.bind(function() {
                // Don't continue after remove
                if (this.isRemoved) return;
                
                var isFirstRender = !this.hasRendered;

                this.postRender(isFirstRender);
                this.trigger("postRender", this, isFirstRender);

                this.hasRendered = true;

            }, this));

        },

        getRenderData: function getRenderData() {
            // Combine all view and state data into template parameters

            var state;
            var model;
            var collection;

            // Handle backbone models or flat json objects
            if (this.model && this.model.toJSON) {
                model = this.model.toJSON();
            } else {
                model = this.model;
            }
            if (this.collection && this.collection.toJSON) {
                collection = this.collection.toJSON();
            } else {
                collection = this.collection;
            }
            if (this.state && this.state.toJSON) {
                state = this.state.toJSON();
            } else {
                state = this.state;
            }

            // Create a handlebars context similar to the usual context
            // this.state take precedence over this.model
            var rtn = _.extend({}, state, model, state);
            
            // Extend tempalte context with separated properties
            rtn.state = state;
            rtn.model = model;
            rtn.collection = collection;


            return rtn;
        },

        // Used to limited the rerenders based on model and state change events
        onChangeRenderFilter: function onChangeRenderFilter(model, value) {

            // If there are no renderAttributes the render always
            if (!this.renderAttributes) return this.render();

            // Check renderAttributes
            var shouldRerender = false;
            switch (typeof this.renderAttributes) {
            case "object":
                var changedKeys = _.keys(model.changed);
                shouldRerender =_.some(changedKeys, _.bind(function(key) {
                    return _.contains(this.renderAttributes, key);
                }, this));
                break;
            case "function":
                shouldRerender = this.renderAttributes(model, value);
                break;
            default:
                shouldRerender = true;
            }

            if (shouldRerender) return this.render();

        },

        // Override with post render code
        postRender: function postRender(isFirstRender) {},

        // Normal remove this.el from document
        remove: function remove() {
            if (this.isRemoved) return;

            this.trigger("remove", this);
            this.$el.remove();
            this.detach();
        },

        // Empty this.el if the container needs to stay
        empty: function empty() {
            if (this.isRemoved) return;

            this.trigger("empty", this);
            this.$el.empty();
            this.detach();
        },

        // Detach the view from the dom but leave the dom untouched
        detach: function detach() {
            if (this.isRemoved) return;

            this.trigger("detach", this);
            this.isRemoved = true;
            this.undelegateEvents();
            this.stopListening();
            this.el = undefined;
            this.$el = undefined;
            this.state = undefined;
            this.model = undefined;
            this.collection = undefined;
            this.parentView = undefined;
        }

    });

    // Setup DOMDiffer
    ddOptions = {

        // Do not diff children inside elements with attr <tagName view-container="true"></tagName>
        ignoreSubTreesWithAttributes: [
            "view-container"
        ],

        // Ignore accessibility attributes on rerender
        ignoreAttributes: [
            "tabindex",
            "aria-hidden"
        ],

        ignoreAttributesWithPrefix: [
            "jQuery",
            "sizzle"
        ]

    };

    ddInstance = new DOMDiffer(ddOptions);

    // Create a temporary DOM node in which to render templates for diffing
    ddTemp = document.createElement("div");


});
