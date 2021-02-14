
require(["dojo/_base/declare","dojo/_base/lang",
        "ecm/widget/dialog/AddContentItemDialog"],
    function(declare, lang ) {
        lang.setObject("createDocFromTemplateAction", function (repository, items, callback, teamspace, resultSet, parameterMap) {
            var dossierRootFolder = "/CustomerDossiers"; //CM code:folder-PID
            var dossierFolderClass = "CustomerDossier"; //CM code: item type


            //CM code: folder-PID of item for template folder structure
            var func = function () {
                console.log("open dialog");
            };

            repository.retrieveItem(dossierRootFolder,
                function(dossierRootFolderItem) {
                    var addContentItemDialog = new AddContentItemDialog();

                    // addContentItemDialog.setDefaultContentClass(class...);

                    addContentItemDialog.show(repository, dossierRootFolderItem, false, false, func, null, false, null);
                    addContentItemDialog.set("title","Show templates for doc");
                    addContentItemDialog.setIntroText("descriptions...");
                });


            // var param = "/test";
            // repository.retrieveItem(param, function (){
            //     var addContentItemDialog = new AddContentItemDialog();
            // //     // addContentItemDialog.setDefaultContentClass(dossierFolderClass);
            //     addContentItemDialog.show(repository, false, false, showListOfTemplates, null, false, null);
            //     addContentItemDialog.set("title", "choose template");
            //     addContentItemDialog.setIntroText("Na nan an nnnaa.");
            // })



            /*
          * Add custom code for your action here. For example, your action might launch a dialog or call a plug-in service.
          */
        });
    });
