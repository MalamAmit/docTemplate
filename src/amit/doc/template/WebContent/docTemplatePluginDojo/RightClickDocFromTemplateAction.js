define(["dojo/_base/declare",
        "ecm/model/Action",
        "ecm/model/Request",
        "docTemplatePluginDojo/TemplatesDialog",
        "ecm/widget/search/SearchDialog",
        "ecm/model/SearchTemplate"],
    function (declare, Action, Request, TemplatesDialog, SearchDialog, SearchTemplate) {
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
                        items[0].getContentClass().name == "AmitFolder"
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
                            // var templatesDialog = new TemplatesDialog();
                            // templatesDialog.show()

                            // var cls = item._unifiedSearch ? UnifiedSearchTemplate : SearchTemplate;
                            var template = new SearchTemplate({
                                id: "StoredSearch,{0DC081DE-3B0D-42C6-B213-63729230F9A9},{60F57A6E-0000-CD1D-815E-3F792C408580}",
                                name: "StoredSearch",
                                repository: ecm.model.desktop.getRepository("OS1"),
                                description: "item.description"
                            });

                            this.search = new SearchDialog({
                                searchTemplate: template,
                                repository: ecm.model.desktop.getRepository("OS1"),
                                showSearch: true
                            });
                            this.search.setMaximized(false);
                            this.search.setSize(600,900);

                            this.search.show();
                        }
                    });

            },


            setBrowseRootFolder: function (newRootFolder, browseFeature) {
                browseFeature.folderTree.setFolder(newRootFolder);
                // optionally set content list to the first child.
            }
        });
    });