define([
  "jquery",
  "underscore",
  "backbone",
  "models/SvgModel",
], function ($, _, Backbone,SvgModel) {

    var SvgCollection = Backbone.Collection.extend({
        model: SvgModel				
    });
   
    return SvgCollection;

});
