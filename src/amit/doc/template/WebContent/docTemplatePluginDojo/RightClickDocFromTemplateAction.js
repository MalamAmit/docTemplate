define(["dojo/_base/declare",
        "dojo/_base/lang",

        "ecm/model/Action",
        "ecm/model/Request",
        "docTemplatePluginDojo/TemplatesDialog",
        "ecm/widget/search/SearchDialog",
        "ecm/widget/layout/CommonActionsHandler",

        "ecm/model/SearchTemplate",
        "ecm/widget/dialog/AddDocumentFromEditServiceTemplateDialog",
        "ecm/widget/dialog/AddContentItemDialog",
        "ecm/model/Desktop",

        "ecm/widget/dialog/BaseDialog"],
    function (declare, lang,
              Action,
              Request,
              TemplatesDialog,
              SearchDialog,
              CommonActionsHandler,
              SearchTemplate,
              AddDocumentDialog,
              AddContentItemDialog,
              Desktop,
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
                            var vsId = "{1031E877-0000-CC1E-BAFF-E5B64CF41B41}";

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
                                    self.selectTemplate(self.srchDialog)
                                }, false, true);
                                self.srchDialog.show();

                            }), lang.hitch(this, function () {
                                alert("Search Template could not be retrieved");
                                // Remove the search template from recent searches if it could not be retrieved.
                            }));


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
                // this.addContentItem = new AddContentItemDialog({
                //     destroyWhenFinished: true
                // });
                // this.addContentItem.show();
                new CommonActionsHandler();
                this._actionAddEditServiceDocument(null, ecm.model.desktop.getRepository("OS1"), null, null, null, null, null);
            },


            _actionAddEditServiceDocument: function (categoryId, repository, items, callback, teamspace, resultSet, sourceDocument) {

                if (this._addDocumentFromEditServiceTemplateDialog) {
                    this._addDocumentFromEditServiceTemplateDialog.destroyRecursive();
                }
                var source = null;
                if (sourceDocument && sourceDocument.length > 0) {
                    source = sourceDocument[0];
                }
                this._addDocumentFromEditServiceTemplateDialog = AddDocumentFromEditServiceTemplateDialog({
                    categoryId: categoryId,
                    sourceDocument: source
                });

                var parentFolder = null;
                // if (items && items.length > 0) {
                //     if (!items[0].isFolder()) {
                //         var parent = items[0].parent;
                //         if (parent && parent.isInstanceOf && parent.isInstanceOf(ecm.model.Favorite)) { // If the parent item is a favorite...
                //             if (parent.item && parent.item.isFolder && parent.item.isFolder()) { // If this is a folder favorite, use the folder item.
                //                 parent = parent.item;
                //             } else {
                //                 parent = null;
                //             }
                //         } else if (parent && !parent.isFolder()) {
                //             parent = null;
                //         }
                //         parentFolder = parent;
                //     } else {
                //         parentFolder = items[0];
                //     }
                // }


                // Use search result content class as default if no parentFolder
                var defaultContentClass = null;
                if (!parentFolder && resultSet) {
                    var contentClass = this._getSearchTemplateSingleContentClass(resultSet.searchTemplate, repository);
                    if (contentClass)
                        defaultContentClass = contentClass;
                }
                this._addDocumentFromEditServiceTemplateDialog.setDefaultContentClass(defaultContentClass);

                // The parent folder repository may be different than the one passed above in P8.
                // Users can add documents/folders to folder work item attachments in other object stores.
                var targetRepository = (parentFolder && parentFolder.repository) || repository;

                this._showAddDocDialogForEditService(repository, parentFolder, targetRepository, teamspace);
            },

            setBrowseRootFolder: function (newRootFolder, browseFeature) {
                browseFeature.folderTree.setFolder(newRootFolder);
                // optionally set content list to the first child.
            }
        });
    });