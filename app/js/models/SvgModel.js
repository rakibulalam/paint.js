define([
  "jquery",
  "underscore",
  "backbone"
], function ($, _, Backbone) {
    var SvgModel = Backbone.Model.extend({
      defaults: {		  
		  
        pos1:null,
        pos2:null,
        type:null,
        value:null,
				
      },
  			
    });

    return SvgModel;
    });