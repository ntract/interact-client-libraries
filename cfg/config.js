plugins.config(function(done) {

    var path = "plugins/interact-client-libraries/res/";

    plugins.waitFor(function() {

        return plugins.flags.core;

    }, function() {
    
        setupRequireJS();
        setupHandlebarsTemplates();
        
    });

    function setupRequireJS() {

        requirejs.config({
            shim: {
                backbone: {
                    deps: [
                        'underscore',
                        'jquery'
                    ],
                    exports: 'Backbone'
                },
                underscore: {
                    exports: '_'
                },
                handlebars: {
                    exports: 'Handlebars'
                },
                velocity: {
                    deps: [
                        'jquery'
                    ]
                },
                imageReady: {
                    deps: [
                        'jquery'
                    ]
                },
                inview: {
                    deps: [
                        'jquery'
                    ]
                }
            },
            map: {
                "*": {
                    "underscore": path+"underscore",
                    "backbone": path+"backbone",
                    "velocity": path+"velocity",
                    "inview": path+"inview",
                    "imageReady": path+"imageready",
                    "handlebars": path+"handlebars-v4.0.5",
                    "bowser": path+"bowser",
                    "DOMDiffer": path+"DOMDiffer",
                    "backbone.controller": path+"backbone.controller",
                    "backbone.differ": path+"backbone.differ",
                    "events": path+"events",
                    "jquery.longpress": path+"jquery.longpress",
                    "helpers": path+"helpers"
                }
            }
        });

    }

    function setupHandlebarsTemplates() {

        requirejs(["handlebars", "underscore"], function(Handlebars, _) {
            //post compile handlebars templates
            for (var k in plugins.templates) {
                plugins.templates[k] = Handlebars.template(plugins.templates[k]);
            }

            plugins.flags.libraries = true;

            done();
            
        });
    }


});