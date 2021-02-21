define(["dojo/_base/declare",
        "ecm/model/Action",
        "ecm/model/Request"],
    function (declare, Action, Request) {
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
               var root = "/";
               var folderClass;
                Request.invokePluginService("DocTemplatePlugin",
                    "GetConfigurationService", {
                        requestCompleteCallback: function (response) {
                            root = response.enableFolderClassName;
                            folderClass = response.folderSelectorId;
                            console.log("root " + root);
                            console.log("folderClass " + folderClass);
                        }
                    });

                repository.retrieveItem(
                    root,
                    function (rootItem) {
                        var addContentItemDialog = new AddContentItemDialog();
                        addContentItemDialog.setDefaultContentClass(folderClass);
                        addContentItemDialog.show(repository, rootItem, false, false, _test, null, false, null);
                        addContentItemDialog.set("Choose Template", "Create new doc from template");
                        addContentItemDialog.setIntroText("You will generate new doc from the template you choose.");
                    });
            },


            setBrowseRootFolder: function (newRootFolder, browseFeature) {
                debugger;
                browseFeature.folderTree.setFolder(newRootFolder);
                // optionally set content list to the first child.
            }
        });
    });