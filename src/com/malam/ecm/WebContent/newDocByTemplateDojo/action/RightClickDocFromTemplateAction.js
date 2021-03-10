define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/i18n!newDocByTemplateDojo/nls/messages",

        "ecm/model/Action",
        "ecm/model/Request",
        // "ecm/widget/search/SearchDialog",
        "newDocByTemplateDojo/Override/AmitSearchDialog",
        "ecm/model/SearchTemplate",
        "ecm/widget/dialog/AddDocumentFromEditServiceTemplateDialog",
        "ecm/widget/dialog/AddContentItemDialog",
        "ecm/model/Desktop",
        "ecm/widget/layout/CommonActionsHandler",

        "newDocByTemplateDojo/LocalDefinition"],
    function (declare, lang, ExtMessages,
              Action, Request, SearchDialog, SearchTemplate, AddDocumentFromEditServiceTemplateDialog, AddContentItemDialog, Desktop, CommonActionsHandler,
              LocalDefinition) {
        return declare("newDocByTemplateDojo.action.RightClickDocFromTemplateAction", [
            CommonActionsHandler,
            Action
        ], {

            folderClassName: null,
            _extMessages: ExtMessages,

            isEnabled: function (repository, listType, items, teamspace,
                                 resultSet) {
                var enabled = this.inherited(arguments);
                if (items && items[0].isFolder && items[0].getContentClass) {
                    if (!this.folderClassName) {
                        this.folderClassName = LocalDefinition.getCacheResponce().configurationGridData[0].folderClass;
                    }
                    var sameClass = (items[0].getContentClass().name == this.folderClassName);
                    return enabled && items[0].isFolder() && sameClass;
                }
                return false;
            },

            isGlobalEnabled: function (resultSet, items, repository) {
                debugger;
                var enabled = this.inherited(arguments);
                // if (items && items[0].isFolder && items[0].getContentClass) {
                //     if (!this.folderClassName) {
                //         this.folderClassName = LocalDefinition.getCacheResponce().configurationGridData[0].folderClass;
                //     }
                //     var sameClass = (items[0].getContentClass().name == this.folderClassName);
                //     return enabled && items[0].isFolder() && sameClass;
                // }
                return false;
            },

            isVisible: function (repository, listType) {
                return this.inherited(arguments);
            },

            performAction: function (repository, itemList, callback, teamspace, resultSet, parameterMap) {
                var destinationFolder = itemList[0];

                var self = this;

                // todo - replace to dynamic configuration
                var vsId = LocalDefinition.getCacheResponce().configurationGridData[0].searchTemplateVsId;

                repository.retrieveSearchTemplate("", vsId, "released", lang.hitch(this, function (searchTemplate) {

                    self.srchDialog = new SearchDialog({
                        searchTemplate: searchTemplate,
                        repository: repository,
                        showSearch: false,
                        search: {hideSearchCriteria: true},
                        style: {minHeight: "700px", minWidth: "1000px"},
                    });


                    self.srchDialog.setTitle(this._extMessages.CHOOSE_TEMPLATE);
                    self.srchDialog.setMaximized(false)
                    self.srchDialog.addButton(this._extMessages.CHOOSE_TEMPLATE, function () {
                        self.selectTemplate(self.srchDialog, destinationFolder)
                    }, false, true);
                    self.srchDialog.show();

                }), lang.hitch(this, function () {
                    alert("Search Template could not be retrieved");
                    // Remove the search template from recent searches if it could not be retrieved.
                }));
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

                this._addDocumentFromEditServiceTemplateDialog.show(currentItem.repository, destinationFolder, true, false, lang.hitch(this, function (item) {
                }), null, false);
            },

            selectTemplate: function (dialog, destinationFolder) {
                var selectedArr = dialog.search.searchResults.grid.select.row._lastSelectedIds;
                if (!selectedArr) {
                    console.log("no item selected in this grid");
                    alert("Please select template from the list");
                    return;
                }
                dialog.destroy();
                var documentId = selectedArr[0];
                Desktop.getDefaultRepository().retrieveItem(documentId, lang.hitch(this, function (currentItem) {
                    this.onDocumentReady(currentItem, destinationFolder);
                }));
            },

            setBrowseRootFolder: function (newRootFolder, browseFeature) {
                browseFeature.folderTree.setFolder(newRootFolder);
                // optionally set content list to the first child.
            }
        });
    });