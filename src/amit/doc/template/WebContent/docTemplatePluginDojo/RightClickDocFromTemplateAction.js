define(["dojo/_base/declare",
        "ecm/model/Action",
        "ecm/model/Request",
        "docTemplatePluginDojo/TemplatesDialog",
        "ecm/widget/search/SearchDialog",
        "ecm/model/SearchTemplate",
        "ecm/widget/dialog/AddDocumentFromEditServiceTemplateDialog",
        "ecm/widget/dialog/AddContentItemDialog",
        "ecm/widget/dialog/BaseDialog"],
    function (declare,
              Action,
              Request,
              TemplatesDialog,
              SearchDialog,
              SearchTemplate,
              AddDocumentDialog,
              AddContentItemDialog,
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


                            // todo - old
                            // var template = new SearchTemplate({
                            //     id: "StoredSearch,{0DC081DE-3B0D-42C6-B213-63729230F9A9},{60F57A6E-0000-CD1D-815E-3F792C408580}",
                            //     name: "StoredSearch",
                            //     repository: ecm.model.desktop.getRepository("OS1"),
                            //     description: "item.description"
                            // });

                            // todo - new
                            // this.searchTemplateSelector.repository.retrieveSearchTemplate("", this._editData.searchTemplateVsId, "released", lang.hitch(this, function (searchTemplate) {
                            //     this.searchTemplateSelector.setSelected(searchTemplate);
                            //     this._onFieldChange();
                            // }), lang.hitch(this, function () {
                            //     alert("Search Template could not be retrieved");
                            //     // Remove the search template from recent searches if it could not be retrieved.
                            // }));

                            self.srchDialog = new SearchDialog({
                                searchTemplate: template,
                                repository: ecm.model.desktop.getRepository("OS1"),
                                showSearch: true,
                                style: {minHeight: "700px", minWidth: "1000px"}
                            });

                            self.srchDialog.setTitle("Choose template");
                            self.srchDialog.setMaximized(false)
                            self.srchDialog.addButton("Select Template", function(){ self.selectTemplate(self.srchDialog) }, false, true);
                            self.srchDialog.show();
                        }
                    });
            },


            selectTemplate: function (dialog) {
                var selectedArr = dialog.search.searchResults.grid.select.row._lastSelectedIds;
                dialog.destroy();
                if (!selectedArr) {
                    console.log("no item selected in this grid");
                    alert("Please select template from the list");
                    return;
                }
                var selected = selectedArr[0];
                console.log("selected", selected);

                // this.addDocumentDialog = new AddDocumentDialog({
                //     style: {minHeight: "700px", minWidth: "1000px"}
                // });
                // this.addDocumentDialog.setMaximized(false)
                // targetRepository = ecm.model.desktop.getRepository("OS1");
                // parentFolder = targetRepository.rootItem
                // this.addDocumentDialog.show(targetRepository, parentFolder, true, false, null, null, true);

                this.addContentItem = new AddContentItemDialog({
                    destroyWhenFinished: true
                });
                this.addContentItem.show();

            },

            setBrowseRootFolder: function (newRootFolder, browseFeature) {
                browseFeature.folderTree.setFolder(newRootFolder);
                // optionally set content list to the first child.
            }
        });
    });