define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/i18n!newDocByTemplateDojo/nls/messages",

        "ecm/model/Action",
        "ecm/model/Request",
        "newDocByTemplateDojo/Override/AmitSearchDialog",
        "ecm/model/SearchTemplate",
        "ecm/widget/dialog/AddDocumentFromEditServiceTemplateDialog",
        "ecm/widget/dialog/AddContentItemDialog",
        "ecm/model/Desktop",
        "ecm/widget/layout/CommonActionsHandler",

        "newDocByTemplateDojo/LocalDefinition"],
    function (declare, lang, ExtMessages,
              Action, Request, SearchDialog, SearchTemplate, AddDocumentFromEditServiceTemplateDialog, AddContentItemDialog, Desktop, CommonActionsHandler,array,
              LocalDefinition) {
        return declare("newDocByTemplateDojo.action.RightClickDocFromTemplateAction", [
            CommonActionsHandler,
            Action
        ], {

            associateEntryTemplate: null,
            _extMessages: ExtMessages,

            isEnabled: function (repository, listType, items, teamspace,   resultSet) {
                debugger;
                var enabled = this.inherited(arguments);
                if (items && items[0].isFolder && items[0].getContentClass) {
                    var currentFolder =items[0];
                    //debugger;
                    this.associateEntryTemplate = array.filter(LocalDefinition.getCacheResponce().configurationGridData, function(fld) {
                        if (currentFolder.attributes.FldNumerator && currentFolder.attributes.FldNumerator!=null)
                            return fld.folderClass == currentFolder.getContentClass().id && currentFolder.attributes.FldNumerator.startsWith(fld.orgUnit)
                        else
                            return false;
                    },this);
                    // debugger;
                    return enabled && this.associateEntryTemplate && this.associateEntryTemplate.length == 1;
                }
                //debugger;
                return false;

            },

            isVisible: function (repository, listType) {
                debugger;
                return this.inherited(arguments);
            },

            isGlobalEnabled: function(resultSet, items, repository) {
                if (resultSet && resultSet.parentFolder && resultSet.parentFolder.isFolder()) {
                    var currentFolder =resultSet.parentFolder;

                    if (!currentFolder.hasPrivilege("privAddToFolder"))
                        return false;
                    // debugger;
                    this.associateEntryTemplate = array.filter(LocalDefinition.getCacheResponce().configurationGridData, function(fld) {
                        if (currentFolder.attributes.FldNumerator && currentFolder.attributes.FldNumerator!=null)
                            return fld.folderClass == currentFolder.getContentClass().id && currentFolder.attributes.FldNumerator.startsWith(fld.orgUnit)
                        else
                            return false;
                    },this);

                    return  this.associateEntryTemplate && this.associateEntryTemplate.length == 1;
                }
                return false;
            },

            performAction: function (repository, itemList, callback, teamspace, resultSet, parameterMap) {
                var destinationFolder = itemList[0];

                var self = this;

                // debugger;
                this.associateEntryTemplate = array.filter(LocalDefinition.getCacheResponce().configurationGridData, function(fld) {
                    if (destinationFolder.attributes.FldNumerator && destinationFolder.attributes.FldNumerator!=null)
                        return fld.folderClass == destinationFolder.getContentClass().id && destinationFolder.attributes.FldNumerator.startsWith(fld.orgUnit)
                    else
                        return false;
                },this);
                if (!(this.associateEntryTemplate && this.associateEntryTemplate.length == 1)){
                    return;
                }
                debugger;
                var vsId = this.associateEntryTemplate[0].searchTemplateVsId;

                repository.retrieveSearchTemplate("", vsId, "released", lang.hitch(this, function (searchTemplate) {
                    self.srchDialog = new SearchDialog({
                        searchTemplate: searchTemplate,
                        repository: repository,
                        showSearch: true,
                        style: {minHeight: "700px", minWidth: "1000px"}
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

                debugger;
                this._addDocumentFromEditServiceTemplateDialog.show(currentItem.repository, destinationFolder, true, false, lang.hitch(this, function (item) {
                }), null, false);
            },

            selectTemplate: function (dialog, destinationFolder) {
                var selectedArr = dialog.search.searchResults.grid.select.row._lastSelectedIds;
                if (!selectedArr) {
                    // console.log("no item selected in this grid");
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