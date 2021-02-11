require(["dojo/_base/declare",
        "dojo/_base/lang",
        "ecm/widget/dialog/AddContentItemDialog"],
    function (declare, lang, AddContentItemDialog) {
        /**
         * Use this function to add any global JavaScript methods your plug-in requires.
         */
        ``
        lang.setObject("createDocFromTemplateAction", function (repository, items, callback, teamspace, resultSet, parameterMap) {
            console.log("amit - createDocFromTemplateAction");

            // var templateFolderPath = repository.templateFolderPath;
            var showListOfTemplates = function () {
                console.log("amit - showListOfTemplates");
            }
            var param = "/test";
            repository.retrieveItem(param, function (){
                var addContentItemDialog = new AddContentItemDialog();
            //     // addContentItemDialog.setDefaultContentClass(dossierFolderClass);
                addContentItemDialog.show(repository, false, false, showListOfTemplates, null, false, null);
                addContentItemDialog.set("title", "choose template");
                addContentItemDialog.setIntroText("Na nan an nnnaa.");
            })



            /*
          * Add custom code for your action here. For example, your action might launch a dialog or call a plug-in service.
          */
        });
    });
