define(["dojo/_base/declare",
        "ecm/model/Action",
        "ecm/model/Request",
        "ecm/widget/dialog/AddContentItemDialog"],
    function (declare, Action, Request, AddContentItemDialog) {
        return declare("docTemplatePluginDojo.RightClickDocFromTemplateAction", [Action], {


            isEnabled: function (repository, listType, items, teamspace, resultSet) {

                var enabled = this.inherited(arguments);

                if (items && items[0].isFolder && items[0].getContentClass) {
                    // var hasChildren = false;
                    // if (!!items[0]._folderContents) {
                    //     items[0]._folderContents[""]?.items.forEach(item => {
                    //         if (item.mimeType && item.mimeType === "folder") {
                    //             hasChildren = true;
                    //         }
                    //     });
                    // }
                    return enabled &&
                        items[0].isFolder() &&
                        items[0].getContentClass().name == "CustomerDossier"
                    //&& !hasChildren;
                }
                return false;
            },


            isVisible: function (repository, listType) {
                return this.inherited(arguments);
            },


            performAction: function (repository, itemList, callback, teamspace, resultSet, parameterMap) {
                var className = "";
                var folderParams = {};
                Request.invokePluginService("DocTemplatePlugin",
                    "GetConfigurationService", {
                        requestCompleteCallback: function (response) {
                            className = response.enableFolderClassName;
                            folderParams = response.folderSelectorParam;

                            var _createFolderSubStructure = function (dossierFolder) {

                            }
                            repository.retrieveItem(
                                "/CustomerDossiers",
                                function (dossierRootFolderItem) {
                                    var addContentItemDialog = new AddContentItemDialog();
                                    addContentItemDialog.setDefaultContentClass("CustomerDossier");
                                    addContentItemDialog.show(repository, dossierRootFolderItem, false, false, _createFolderSubStructure, null, false, null);
                                    addContentItemDialog.set("title", "Create new Dossier");
                                    addContentItemDialog.setIntroText("This folder will be the top level folder of your dossier.");
                                });
                        }
                    });

            },


            setBrowseRootFolder: function (newRootFolder, browseFeature) {
                debugger;
                browseFeature.folderTree.setFolder(newRootFolder);
                // optionally set content list to the first child.
            }
        });
    });