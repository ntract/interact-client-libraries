define(['handlebars'], function(Handlebars) {
	
	Handlebars.registerHelper("if_on", function(object, value, block) {
        if (object && object[value]) {
            return block.fn(this);
        } else {
            return block.inverse(this);
        }
    });

    Handlebars.registerHelper("if_equals", function(test, value, block) {
        if (test == value) {
            return block.fn(this);
        } else {
            return block.inverse(this);
        }
    });

    Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
            
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    });


})