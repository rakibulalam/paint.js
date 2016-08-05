// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
    shim: {
      jquery:{ 
        exports: '$'
        },
      underscore: {
        exports: '_'
        },
      backbone: {          
        exports: 'Backbone',
        deps: ['underscore', 'jquery']
        },

      svg:{
      	exports: 'svg'
      },
     

    },
	
	
  paths: {
    jquery: 'libs/jquery/jquery-1.12.3.min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-min',
    svg: 'libs/svg/svg.min',
    router: './router',
    templates: '../templates'
  }
 
});


require([
  'app',
], function(App){	
  App.initialize();
  

  
});


