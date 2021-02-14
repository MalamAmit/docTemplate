require(["dojo/_base/declare", "dojo/_base/lang",
        "ecm/widget/dialog/AddContentItemDialog"],
    function (declare, lang) {
        lang.setObject("createDocFromTemplateAction", function (repository, items, callback, teamspace, resultSet, parameterMap) {
            console.log("amit 1 - requestCompleteCallback")
            Request.invokePluginService("DocTemplatePlugin", "GetConfigurationService", {
                requestCompleteCallback: function (response) {

                    console.log("amit 2 - requestCompleteCallback")
                    // var dossierRootFolder = response.configuration[1].value;
                    // var dossierFolderClass = response.configuration[0].value;
                } //requestCompleteCallback
            });
        });
    });
