require(["dojo/_base/declare",
        "dojo/_base/lang",
        "ecm/model/Request"],
    function (declare, lang, Request) {

        lang.setObject("createDocFromTemplateAction", function (repository, items, callback, teamspace, resultSet, parameterMap) {
        });

        lang.setObject("rightClickDocFromTemplateAction", function (repository, items, callback, teamspace, resultSet, parameterMap) {
            console.log("rightClickDocFromTemplateAction")
            /*
          * Add custom code for your action here. For example, your action might launch a dialog or call a plug-in service.
          */
        });
    });
