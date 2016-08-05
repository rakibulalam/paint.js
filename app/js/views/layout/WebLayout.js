define([
 'jquery',
  'underscore',
  'backbone',
  'svg',
  'collections/SvgCollection',
  "text!templates/layout/WebLayoutTemplate.html",
], function ($,_,Backbone,svg,SvgCollection,WebLayoutTemplate) {


var WebLayout = Backbone.View.extend({ 
    template:_.template(WebLayoutTemplate),
    el:'body',
    svg_el:null,
    tool_name:null,
    event_counter:0,
    polyline:[],
    events:{
        'click .tools':'select_tool',
        'mousedown #svg':'mousedownSvg',
        'mousemove #svg':'mousemoveSvg',
    },
    initialize:function(){
      this.render().init_svg().gridRender().toolRender();  
      this.collection=new SvgCollection();    
                       
    },
    render:function()
    {
    	this.$el.append(this.template);
           return this;
    },
    init_svg:function()
    {
       this.svg_el= new SVG('svg');
       return this;
    },
    gridRender:function()
    {
      if(!_.isNull(this.svg_el))
      {
        var _height=this.$el.find('#svg').height();
        var _width=this.$el.find('#svg').width();
        for(var i=10; i<_height; i+=10)
        {         
            this.svg_el.line(0, i, _width, i).stroke({ width: 0.5 });         
        }
        for(var i=10; i<_width; i+=10)
        {         
            this.svg_el.line(i, _height, i, 0).stroke({ width: 0.5 });         
        }       
      }
      return this;
    },
    toolRender:function()
    {
      var tooldraw=new SVG('tool');
      var _height=this.$el.find('#tool').height();
      var _width=this.$el.find('#tool').width();
      var _radius=_width/1.5;
      var _x_pos=_radius-(_width/2);
      var _y_pos=10;
      tooldraw.circle(_radius).fill('#fff').stroke({ width: 1 }).x(_x_pos).y(_y_pos)
      .addClass('tools');
      _y_pos+=_radius+10;
      tooldraw.rect(_radius,_radius).fill('#fff').stroke({ width: 1 }).x(_x_pos).y(_y_pos)
      .addClass('tools');
      _y_pos+=_radius+10;
      tooldraw.line(0,0,_radius,_radius).fill('#fff').stroke({ width: 5 }).x(_x_pos).y(_y_pos)
      .addClass('tools');
      _y_pos+=_radius+10;
      tooldraw.path([
          ['M', 0, 30]
        , ['C', 0, -30, 20, -30,20,0]        
        , ['C', 20, 30, 40,30, 40,0]        
        , ['C', 40, -30, 60, -30,60,0]        
      ]).fill('#fff').stroke({ width: 1 }).x(_x_pos).y(_y_pos)
      .addClass('tools');
      return this;
    },
    tool_resset:function()
    {
      this.$el.find('#tool').children('svg').children().attr('fill','#fff');
    },
    select_tool:function(e)
    {
      this.tool_resset();
      $(e.target).attr('fill','#EEE');
      //var draw_svg=this.svg_el.size('100%', '100%');            
      this.tool_name=$(e.target).prop('tagName');
      // if(_tag_name=='circle')
      // {
      //   draw_svg.circle().draw();
      // }else if(_tag_name=='rect')
      // {
      //   draw_svg.rect().draw();
      // }else if(_tag_name=='line')
      // {
      //   draw_svg.line(0,0,10,200).draw();
      // }
      console.log(this.tool_name);
    },
    mousedownSvg:function(e)
    {
        var that=this;
        var _pos=$(e.target).offset();
        var _x_pos=e.pageX;
        var _y_pos=e.pageY;
        this.event_counter+=1;
        if(this.event_counter==1){
          this.model=new Backbone.Model({pos1:[_x_pos,_y_pos],type:that.tool_name},{silent: true});
          this.model.on('change', this.draw_svg, this);
        }
          if(this.event_counter>1)
          {
            this.collection.add(this.model);
            console.log(this.collection);
            this.event_counter=0;
          }
        
    },
    mousemoveSvg:function(e)
    {
      if(!_.isUndefined(this.model))
      {
        var _x_pos=e.pageX;
        var _y_pos=e.pageY;
        this.model.set({"pos2":[_x_pos,_y_pos]});
      }       
    },
    draw_svg:function()
    {
      var that=this;
       
      if(!_.isUndefined(this.model) && this.event_counter<2)
      {
          var tagName=this.model.get('type');
          var pos1=this.model.get('pos1');
          var pos2=this.model.get('pos2');
          var _distance=this.getDistanceTwoPoint(pos1[0],pos1[1],pos2[0],pos2[1]);
          var _id=this.model.cid;
          var _x_pos=pos1[0];
          var _y_pos=pos1[1];
          var p={x:pos2[0],y:pos2[1]};
          
        if(tagName=='circle')
        {
          
          if(_.isNull(SVG.get(_id)))
          {

            this.svg_el.circle(_distance).fill('none').stroke({ width: 1 }).attr('id',_id).x(_x_pos).y(_y_pos);
          }else
          {
            
            var circle = {
                    cx: _x_pos,
                    cy: _y_pos,
                    r: Math.sqrt(
                        (p.x - _x_pos) * (p.x - _x_pos) +
                        (p.y - _y_pos) * (p.y - _y_pos)
                    )
            };
            if(this.event_counter==1){
              SVG.get(_id).attr(circle);
              this.model.set({value:circle});
            }
            
          }
        }else if(tagName=='rect')
        {

          if(_.isNull(SVG.get(_id)))
          {
            this.svg_el.rect(_distance,_distance).fill('none').stroke({ width: 1 }).attr('id',_id).x(_x_pos).y(_y_pos);

          }else
          {

               var rect = {
                x: _x_pos,
                y: _y_pos
              };

              rect.width = p.x - rect.x;
              rect.height = p.y - rect.y;

              

              if (rect.width < 1) {
                  rect.x = rect.x + rect.width;
                  rect.width = -rect.width;
              }

              if (rect.height < 1) {
                  rect.y = rect.y + rect.height;
                  rect.height = -rect.height;
              }

              if(this.event_counter==1){
                SVG.get(_id).attr(rect);
                this.model.set({value:rect});
              }
          }



        }else if(tagName=='line')
        {
          if(_.isNull(SVG.get(_id)))
          {
            this.svg_el.line(_x_pos,_y_pos,_x_pos,_y_pos).fill('none').stroke({ width: 1 }).attr('id',_id).x(_x_pos).y(_y_pos);
          }else
          {
            var line={
              x1:_x_pos,
              y1:_y_pos,
              x2:p.x,
              y2:p.y
            }
             if(this.event_counter==1){
                SVG.get(_id).attr(line);
                this.model.set({value:line});
              }
          }
        }else if(tagName=='path')
        {

          if(_.isNull(SVG.get(_id)))
          {
             this.polyline=[];
            this.polyline.push([_x_pos,_y_pos]);
           // this.svg_el.path([['M',_x_pos,_y_pos] , ['C', _x_pos,_y_pos,p.x,p.y,p.x,p.y]]).fill('none').stroke({ width: 1 }).attr('id',_id).x(_x_pos).y(_y_pos);
            this.svg_el.polyline([[_x_pos,_y_pos],[0,0]]).fill('none').stroke({ width: 1 }).attr('id',_id).x(_x_pos).y(_y_pos);
          }else
          {
              
            // var path={
            //   d:'M'+_x_pos+' '+_y_pos+' C'+_x_pos+' '+ _y_pos+' '+p.x+' '+p.y+' '+p.x+''+p.y,
            // };
            //var plot=this.plot_curve(_x_pos,_y_pos,p.x,p.y);
            //console.log();
         //this.svg_el.polyline([[_x_pos,_y_pos],[p.x,p.y]].push([p.x,p.y])).fill('none').stroke({ width: 1 }).attr('id',_id).x(_x_pos).y(_y_pos);
         this.polyline.push([p.x,p.y]);
        var  path={
            points:that.polyline
          };
         
             if(this.event_counter==1){

                SVG.get(_id).attr(path);
                this.model.set({value:path});

              }
          }
        }

        
      }
    },
    getDistanceTwoPoint:function(x1,y1,x2,y2)
    {
      return Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );
    },
     plot_curve:function(x,y,xx,yy)
      {
          // returns an array of x,y coordinates to graph a perfect curve between 2 points.
          var startX=x;  
          var startY=y;  

          var endX=xx;  
          var endY=yy;  

          var diff_x = xx - x;
          var diff_y = yy - y;

          var xy = [];
          var xy_count = -1;

          var bezierX=x;  // x1
          var bezierY=yy; // y2

          var t;   

          for(t=0.0; t<=1; t+=0.01)  
          {
            xy_count++;
            xy[xy_count] = {};
            xy[xy_count].x = Math.round(  (1-t)*(1-t)*startX + 2*(1-t) * t * bezierX + t*t*endX);
            xy[xy_count].y = Math.round(  (1-t)*(1-t)*startY + 2*(1-t) * t * bezierY + t*t*endY);
          }

          return xy; // returns array of coordinates
      }



	
  });

    return WebLayout;

});
