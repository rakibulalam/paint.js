define(['underscore','backbone'],function(_,backbone){
  	var _observer = {};
  	_.extend(_observer, backbone.Events);
  	return _observer;
})