define(["dojo/_base/declare",
        "ecm/model/Action",
        "ecm/model/Request",
        "docTemplatePluginDojo/TemplatesDialog"],
    function (declare, Action, Request, TemplatesDialog) {
        return declare("docTemplatePluginDojo.RightClickDocFromTemplateAction", [Action], {


            isEnabled: function (repository, listType, items, teamspace, resultSet) {
                debugger;

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
                        items[0].getContentClass().name == "AmitFolder"
                    //&& !hasChildren;
                }
                return false;
            },


            isVisible: function (repository, listType) {
                debugger;
                return this.inherited(arguments);
            },


            performAction: function (repository, itemList, callback, teamspace, resultSet, parameterMap) {
                debugger;
                var className = "";
                var folderParams = {};
                Request.invokePluginService("DocTemplatePlugin",
                    "GetConfigurationService", {
                        requestCompleteCallback: function (response) {
                            debugger;
                            className = response.enableFolderClassName;
                            folderParams = response.folderSelectorParam;

                            var test = function (dossierFolder) {

                            }
                            // repository.retrieveItem(
                            //     "/CustomerDossiers",
                            //     function (rootFolder) {
                            //         var addContentItemDialog = new AddContentItemDialog();
                            //         addContentItemDialog.setDefaultContentClass(className);
                            //         addContentItemDialog.show(repository, rootFolder, false, false, test, null, false, null);
                            //         addContentItemDialog.set("title", "Create new Doc");
                            //         addContentItemDialog.setIntroText("Create new doc from template");
                            //     });
                            var templatesDialog = new TemplatesDialog();
                            templatesDialog.show()
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