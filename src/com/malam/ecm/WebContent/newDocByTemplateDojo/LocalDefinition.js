define([
	"dojo/_base/declare",
    "ecm/model/Request",
    "ecm/model/_ModelObject"
], function (declare, Request,_ModelObject) {
	var LocalDefinition = declare("newDocByTemplateDojo.LocalDefinition", [_ModelObject], {
		cacheResponce : null,
		setCacheResponce:function (){
			if (!this.cacheResponce){
		          var self=this;
		          Request.invokePluginService("NewDocByTemplate", "GetConfigurationService", {
			     	requestCompleteCallback: function(response)	{
			     		 self.cacheResponce=response;
			     		}
			        });
				}			
		},
		
		getCacheResponce:function ()
		{
			//debugger;
			if (!this.cacheResponce){
				  this.setCacheResponce();
		     		 return this.cacheResponce;
		     		}
		    else {
		    	return this.cacheResponce;}
		},
		
		constructor: function () {
			this.setCacheResponce();
		}

	});
	
	newDocByTemplateDojo.LocalDefinition = new LocalDefinition({
		id: "LocalDefinitionAction",
		name: "LocalDefinitionAction"
	});
	return newDocByTemplateDojo.LocalDefinition;
});
