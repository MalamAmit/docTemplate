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


            folderClassName:null,
            isEnabled: function(repository, listType, items, teamspace,
                                resultSet) {
                var enabled = this.inherited(arguments);
                if (items && items[0].isFolder && items[0].getContentClass) {
                    if (!this.folderClassName) {
                        Request.invokePluginService("DocTemplatePlugin",
                            "GetConfigurationService",
                            {
                                requestCompleteCallback: dojo.hitch(this,
                                    function(response) {
                                        this.folderClassName = response.configuration[0].value;
                                    })
                            });
                    }
                    var sameClass =
                        (items[0].getContentClass().name==this.folderClassName);
                    return enabled && items[0].isFolder() && sameClass;
                }
                return false;
            },


            // isEnabled: function (repository, listType, items, teamspace, resultSet) {
            //     var enabled = this.inherited(arguments);
            //     Request.invokePluginService("DocTemplatePlugin",
            //         "GetConfigurationService", {
            //             requestCompleteCallback: function (response) {
            //
            //                 if (items && items[0].isFolder && items[0].getContentClass) {
            //                     return enabled &&
            //                         items[0].isFolder() &&
            //                         items[0].getContentClass().name == "AmitFolder"
            //                 }
            //                 return false;
            //             }
            //         });
            // },


            isVisible: function (repository, listType) {
                return this.inherited(arguments);
            },


            performAction: function (repository, itemList, callback, teamspace, resultSet, parameterMap) {
                var destinationFolder = itemList[0];

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

                            repository.retrieveSearchTemplate("", vsId, "released", lang.hitch(this, function (searchTemplate) {
                                self.srchDialog = new SearchDialog({
                                    searchTemplate: searchTemplate,
                                    repository: repository,
                                    showSearch: true,
                                    style: {minHeight: "700px", minWidth: "1000px"}
                                });

                                self.srchDialog.setTitle("Choose template");
                                self.srchDialog.setMaximized(false)
                                self.srchDialog.addButton("Select Template", function () {
                                    self.selectTemplate(self.srchDialog, destinationFolder)
                                }, false, true);
                                self.srchDialog.show();

                            }), lang.hitch(this, function () {
                                alert("Search Template could not be retrieved");
                                // Remove the search template from recent searches if it could not be retrieved.
                            }));


                        }
                    });
            },


            onDocumentReady: function (currentItem, destinationFolder) {
                if (this._addDocumentFromEditServiceTemplateDialog) {
                    this._addDocumentFromEditServiceTemplateDialog.destroyRecursive();
                }
                this._addDocumentFromEditServiceTemplateDialog = AddDocumentFromEditServiceTemplateDialog({
                    categoryId: null,
                    sourceDocument: currentItem,
                    style: {minHeight: "700px", minWidth: "1000px"}
                });
                this._addDocumentFromEditServiceTemplateDialog.setMaximized(false);

                this._addDocumentFromEditServiceTemplateDialog.show(ecm.model.desktop.getRepository("OS1"), destinationFolder, true, false, lang.hitch(this, function (item) {
                    // this.actionEditWithNativeApplication(repository,  [item], null, null, null, {newAdded: true});
                }), null, false);
            },

            selectTemplate: function (dialog, destinationFolder) {
                var selectedArr = dialog.search.searchResults.grid.select.row._lastSelectedIds;
                dialog.destroy();
                if (!selectedArr) {
                    console.log("no item selected in this grid");
                    alert("Please select template from the list");
                    return;
                }
                var documentId = selectedArr[0];
                Desktop.getDefaultRepository().retrieveItem(documentId, lang.hitch(this, function (currentItem) {
                    this.onDocumentReady(currentItem, destinationFolder);
                }));

                //
                // Desktop.getDefaultRepository().retrieveItem(destinationFolder, lang.hitch(this, function (currentItem) {
                //     console.log("Amit");
                // }));
            },

            setBrowseRootFolder: function (newRootFolder, browseFeature) {
                browseFeature.folderTree.setFolder(newRootFolder);
                // optionally set content list to the first child.
            }
        });
    });