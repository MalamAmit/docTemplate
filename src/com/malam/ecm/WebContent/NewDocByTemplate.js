require(["dojo/_base/declare",
        "dojo/_base/lang",
        "ecm/model/Request"],
    function (declare, lang, Request) {
        lang.setObject("createDocFromTemplateAction", function (repository, items, callback, teamspace, resultSet, parameterMap) {
            console.log("amit 1 - requestCompleteCallback")
            Request.invokePluginService("NewDocByTemplate",
                "GetConfigurationService", {
                    requestCompleteCallback: function (response) {
                        response.configuration[1].value;
                        response.configuration[0].value;
                        console.log("configuration[1] " + response.configuration[1].value);
                        console.log("configuration[0] " + response.configuration[0].value);
                        console.log("amit 2 - requestCompleteCallback")
                    }
                });
        });

        lang.setObject("rightClickDocFromTemplateAction", function (repository, items, callback, teamspace, resultSet, parameterMap) {
            console.log("rightClickDocFromTemplateAction")
            /*
          * Add custom code for your action here. For example, your action might launch a dialog or call a plug-in service.
          */
        });
    });
