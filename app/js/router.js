define([
  'jquery',
  'underscore',
  'backbone',
  'views/layout/WebLayout'
], function($, _, Backbone,WebLayout){

  var AppRouter = Backbone.Router.extend({
    routes: {
              '': 'home',
            
    }
  });

  var initialize = function(){
    	var app_router = new AppRouter;
    	var that=this;
     
      app_router.on('route:home',function(){	
           var Web=new WebLayout();
	     });
  
	  Backbone.history.start({
      pushState: true,
      root: '/svg'
      });
     //  $(document).on('click', 'a:not([data-bypass])', function (evt) {

     //    var href = $(this).attr('href');
     //    var protocol = this.protocol + '//';
     //     $('html, body').animate({scrollTop : 0},2000).fadeIn();
     //    if (href.slice(protocol.length) !== protocol) {
     //    evt.preventDefault();
     //    app_router.navigate(href, true);
     //    }
     // });
   
  }

  return {
    initialize: initialize
  }
});