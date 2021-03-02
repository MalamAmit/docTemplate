define(["dojo/_base/declare",
        "dojo/_base/lang",

        "ecm/model/Action",
        "ecm/model/Request",
        "docTemplatePluginDojo/TemplatesDialog",
        "ecm/widget/search/SearchDialog",

        "ecm/model/SearchTemplate",
        "ecm/widget/dialog/AddDocumentFromEditServiceTemplateDialog",
        "ecm/widget/dialog/AddContentItemDialog",
        "ecm/model/Desktop",

        "ecm/widget/layout/CommonActionsHandler",

        "ecm/widget/dialog/BaseDialog"],
    function (declare, lang,
              Action,
              Request,
              TemplatesDialog,
              SearchDialog,
              SearchTemplate,
              AddDocumentFromEditServiceTemplateDialog,
              AddContentItemDialog,
              Desktop,
              CommonActionsHandler,
              BaseDialog) {
        return declare("docTemplatePluginDojo.RightClickDocFromTemplateAction", [
            CommonActionsHandler,
            Action
        ], {


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

                            // todo - replace
                            // todo - replace
                            // todo - replace
                            var vsId = response.configurationGridData[0].searchTemplateVsId;
                            var folderClass = response.configurationGridData[0].folderClass;

                            Desktop.getDefaultRepository().retrieveSearchTemplate("", vsId, "released", lang.hitch(this, function (searchTemplate) {
                                console.log("amit")
                                self.srchDialog = new SearchDialog({
                                    searchTemplate: searchTemplate,
                                    repository: ecm.model.desktop.getRepository("OS1"),
                                    showSearch: true,
                                    style: {minHeight: "700px", minWidth: "1000px"}
                                });

                                self.srchDialog.setTitle("Choose template");
                                self.srchDialog.setMaximized(false)
                                self.srchDialog.addButton("Select Template", function () {
                                    self.selectTemplate(self.srchDialog, folderClass)
                                }, false, true);
                                self.srchDialog.show();

                            }), lang.hitch(this, function () {
                                alert("Search Template could not be retrieved");
                                // Remove the search template from recent searches if it could not be retrieved.
                            }));


                        }
                    });
            },


            onDocumentReady: function (currentItem) {
                if (this._addDocumentFromEditServiceTemplateDialog) {
                    this._addDocumentFromEditServiceTemplateDialog.destroyRecursive();
                }
                this._addDocumentFromEditServiceTemplateDialog = AddDocumentFromEditServiceTemplateDialog({
                    categoryId: null,
                    sourceDocument: currentItem,
                    style: {minHeight: "700px", minWidth: "1000px"}
                });
                this._addDocumentFromEditServiceTemplateDialog.setMaximized(false);

                this._addDocumentFromEditServiceTemplateDialog.show(ecm.model.desktop.getRepository("OS1"), null, true, false, lang.hitch(this, function (item) {
                    // this.actionEditWithNativeApplication(repository,  [item], null, null, null, {newAdded: true});
                }), null, false);
            },
            selectTemplate: function (dialog, folderClass) {
                var selectedArr = dialog.search.searchResults.grid.select.row._lastSelectedIds;
                dialog.destroy();
                if (!selectedArr) {
                    console.log("no item selected in this grid");
                    alert("Please select template from the list");
                    return;
                }
                var documentId = selectedArr[0];
                Desktop.getDefaultRepository().retrieveItem(documentId, lang.hitch(this, function (currentItem) {
                    this.onDocumentReady(currentItem);
                }));


                Desktop.getDefaultRepository().retrieveItem(folderClass, lang.hitch(this, function (currentItem) {
                    console.log("Amit");
                }));
            },

            setBrowseRootFolder: function (newRootFolder, browseFeature) {
                browseFeature.folderTree.setFolder(newRootFolder);
                // optionally set content list to the first child.
            }
        });
    });