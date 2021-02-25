define(["dojo/_base/declare",
        "ecm/model/Action",
        "ecm/model/Request",
        "docTemplatePluginDojo/TemplatesDialog",
        "ecm/widget/search/SearchDialog",
        "ecm/model/SearchTemplate",
        "ecm/widget/dialog/AddDocumentFromEditServiceTemplateDialog",
        "ecm/widget/dialog/BaseDialog"],
    function (declare,
              Action,
              Request,
              TemplatesDialog,
              SearchDialog,
              SearchTemplate,
              AddDocumentDialog,
              BaseDialog) {
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
                var self = this;
                Request.invokePluginService("DocTemplatePlugin",
                    "GetConfigurationService", {
                        requestCompleteCallback: function (response) {
                            className = response.enableFolderClassName;
                            folderParams = response.folderSelectorParam;

                            //todo: replace id from configuration
                            var template = new SearchTemplate({
                                id: "StoredSearch,{0DC081DE-3B0D-42C6-B213-63729230F9A9},{60F57A6E-0000-CD1D-815E-3F792C408580}",
                                name: "StoredSearch",
                                repository: ecm.model.desktop.getRepository("OS1"),
                                description: "item.description"
                            });

                            self.srchDialog = new SearchDialog({
                                searchTemplate: template,
                                repository: ecm.model.desktop.getRepository("OS1"),
                                showSearch: true,
                                style: {minHeight: "700px", minWidth: "1000px"}
                            });

                            self.srchDialog.setTitle("Choose template");
                            self.srchDialog.setMaximized(false)
                            self.srchDialog.addButton("Select Template", self.selectTemplate, false, true);
                            self.srchDialog.show();
                        }
                    });
            },

            selectTemplate: function () {
                this.srchDialog.destroy();

                // var selectedArr = this.srchDialog.searchResults.grid.select.row._lastSelectedIds;
                // if (!selectedArr) {
                //     console.log("no item selected in this grid");
                //     return;
                // }
                // var selected = selectedArr[0];
                // console.log("selected", selected);

                // this.addDocumentDialog = new AddDocumentDialog();
                // targetRepository = ecm.model.desktop.getRepository("OS1");
                // parentFolder = targetRepository.rootItem
                // this.addDocumentDialog.show(targetRepository, parentFolder, true, false, null, null, true);

            },

            setBrowseRootFolder: function (newRootFolder, browseFeature) {
                browseFeature.folderTree.setFolder(newRootFolder);
                // optionally set content list to the first child.
            }
        });
    });