require(["dojo/_base/declare", "dojo/_base/lang",
        "ecm/widget/dialog/AddContentItemDialog",
        "ecm/model/Request"],
    function (declare, lang) {
        lang.setObject("createDocFromTemplateAction", function (repository, items, callback, teamspace, resultSet, parameterMap) {
            console.log("amit 1 - requestCompleteCallback")


            Request.invokePluginService("DocTemplatePlugin",
                "GetConfigurationService",{
                    requestCompleteCallback: function(response) {
                        response.configuration[1].value;
                        response.configuration[0].value;
                        console.log("amit 2 - requestCompleteCallback")
                    }
                });
        });
    });
