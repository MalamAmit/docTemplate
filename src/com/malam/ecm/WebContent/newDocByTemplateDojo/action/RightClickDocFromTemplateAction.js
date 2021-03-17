define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/i18n!newDocByTemplateDojo/nls/messages",

        "ecm/model/Action",
        "ecm/model/Request",
        "ecm/model/ContentItem",

        "newDocByTemplateDojo/Override/MySearchDialog",
        "ecm/model/SearchTemplate",
        "ecm/widget/dialog/AddDocumentFromEditServiceTemplateDialog",
        "ecm/widget/dialog/AddContentItemDialog",
        "ecm/model/Desktop",
        "ecm/widget/layout/CommonActionsHandler",
        "dojo/_base/array",
        "newDocByTemplateDojo/LocalDefinition"
    ],
    function (declare, lang, ExtMessages,
              Action, Request,ContentItem, SearchDialog, SearchTemplate, AddDocumentFromEditServiceTemplateDialog, AddContentItemDialog, Desktop, CommonActionsHandler, array,
              LocalDefinition) {
        return declare("newDocByTemplateDojo.action.RightClickDocFromTemplateAction", [
            CommonActionsHandler,
            Action
        ], {

            associateEntryTemplate: null,
            _extMessages: ExtMessages,

            isEnabled: function (repository, listType, items, teamspace, resultSet) {
                var enabled = this.inherited(arguments);
                if (items && items[0].isFolder && items[0].getContentClass) {
                    var currentFolder = items[0];
                    this.associateEntryTemplate = array.filter(LocalDefinition.getCacheResponce().configurationGridData, function (fld) {
                        if (currentFolder.attributes.FldNumerator && currentFolder.attributes.FldNumerator != null)
                            return fld.folderClass == currentFolder.getContentClass().id && currentFolder.attributes.FldNumerator.startsWith(fld.orgUnit)
                        else
                            return false;
                    }, this);
                    return enabled && this.associateEntryTemplate && this.associateEntryTemplate.length == 1;
                }
                return false;

            },

            isVisible: function (repository, listType) {
                return this.inherited(arguments);
            },

            isGlobalEnabled: function (resultSet, items, repository) {
                if (resultSet && resultSet.parentFolder && resultSet.parentFolder.isFolder()) {

                    var currentFolder = null;

                    if (resultSet.parentFolder.item)
                        currentFolder = resultSet.parentFolder.item;
                    else
                        currentFolder = resultSet.parentFolder

                    if (!currentFolder.hasPrivilege("privAddToFolder"))
                        return false;
                    this.associateEntryTemplate = array.filter(LocalDefinition.getCacheResponce().configurationGridData, function (fld) {
                        if (currentFolder.attributes.FldNumerator && currentFolder.attributes.FldNumerator != null)
                            return fld.folderClass == currentFolder.getContentClass().id && currentFolder.attributes.FldNumerator.startsWith(fld.orgUnit)
                        else
                            return false;
                    }, this);

                    return this.associateEntryTemplate && this.associateEntryTemplate.length == 1;
                }
                return false;
            },

            performAction: function (repository, itemList, callback, teamspace, resultSet, parameterMap) {
                var destinationFolder = itemList[0];

                var self = this;

                this.associateEntryTemplate = array.filter(LocalDefinition.getCacheResponce().configurationGridData, function (fld) {
                    if (destinationFolder.attributes.FldNumerator && destinationFolder.attributes.FldNumerator != null)
                        return fld.folderClass == destinationFolder.getContentClass().id && destinationFolder.attributes.FldNumerator.startsWith(fld.orgUnit)
                    else
                        return false;
                }, this);
                if (!(this.associateEntryTemplate && this.associateEntryTemplate.length == 1)) {
                    return;
                }
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
                    self.srchDialog.show(this.associateEntryTemplate[0].showResultsOnly);

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

                var self = this;
                this._addDocumentFromEditServiceTemplateDialog.setMaximized(false);
                // this._addDocumentFromEditServiceTemplateDialog.addButton("Generate from template", function () {
                //     self.addDoc(self._addDocumentFromEditServiceTemplateDialog);
                // }, false, true);
                this._addDocumentFromEditServiceTemplateDialog.show(currentItem.repository, destinationFolder, true, false, lang.hitch(this, function (item) {
                }), null, false);
            },






            // addDoc: function (dialog) {
            //     debugger;
            //
            //
            //
            //     if (!dialog.isValid(true)) {
            //         return;
            //     }
            //     var selectedFolder = dialog.addContentItemGeneralPane.folderSelector.getSelected().item;
            //     var folderId;
            //     if (dialog.repository.type == "cm") {
            //         if (dialog.addContentItemGeneralPane._unfiled && dialog.addContentItemGeneralPane._unfiled.checked) {
            //             folderId = "";
            //         } else if (selectedFolder && selectedFolder.id) {
            //             folderId =  selectedFolder.id;
            //         }
            //     } else if (dialog.repository.type == "p8") {
            //         folderId = selectedFolder && selectedFolder.id && !selectedFolder.rootFolder ? selectedFolder.id : "";
            //     }
            //
            //     var className = dialog.addContentItemPropertiesPane.getDocumentType();
            //     var titlePropertyName = dialog.addContentItemPropertiesPane.getTitlePropertyName();
            //     var titleField = titlePropertyName ? dialog.addContentItemPropertiesPane.getPropertyValue(titlePropertyName) : "";
            //
            //     var properties = dialog.addContentItemPropertiesPane.getPropertiesJSON();
            //     var permissions = dialog.addContentItemSecurityPane.getPermissions();
            //
            //     var setSecurityParent = (dialog._teamspace && dialog.repository._isP8());
            //     if (!setSecurityParent && dialog._entryTemplate && dialog._entryTemplate.inheritSecurityFromParentFolder) {
            //         setSecurityParent = true;
            //     }
            //
            //     var templateId = "";
            //     var vsId = "";
            //     var mimeType ="";
            //     var templateName = "";
            //     if (!dialog.sourceDocument) {
            //         if (dialog._templateCtrl) {
            //             if (dialog._templateCtrl instanceof FilteringSelect) {
            //                 templateId = dialog._templateCtrl.get("value");
            //                 var selectedItem = dialog._templateCtrl.store.query({id: templateId});
            //                 if (selectedItem && selectedItem.length > 0) {
            //                     vsId = selectedItem[0].vsId;
            //                     mimeType = selectedItem[0].mimeType;
            //                     templateName = selectedItem[0].label;
            //                 }
            //             } else {
            //                 if (dialog._items && dialog._items.length > 0) {
            //                     templateId = dialog._items[0].id;
            //                     vsId = dialog._items[0].vsId;
            //                     mimeType = dialog._items[0].repository.type == "cm" ? dialog._items[0].attributes.mimeType : dialog._items[0].attributes.MimeType;
            //                     templateName = dialog._items[0].name;
            //                 } else {
            //                     if (dialog.categoryId == "Word") {
            //                         templateName = dialog.defaultWordTemplateName;
            //                     } else if (dialog.categoryId == "PowerPoint") {
            //                         templateName = dialog.defaultPowerPointTemplateName;
            //                     } else if (dialog.categoryId == "Excel"){
            //                         templateName = dialog.defaultExcelTemplateName;
            //                     }
            //                 }
            //             }
            //         }
            //     } else {
            //         templateId = dialog.sourceDocument.id;
            //         templateName = dialog.sourceDocument.filename;
            //         vsId = dialog.sourceDocument.vsId;
            //         mimeType = dialog.sourceDocument.mimetype;
            //     }
            //
            //     var bodyParms = {
            //         "acl": permissions,
            //         "criterias": properties
            //     };
            //     var params = {
            //         "repositoryId": dialog.repository.id,
            //         "categoryId": dialog.categoryId,
            //         "documentTitle": titleField,
            //         "folderId": folderId,
            //         "className": className,
            //         "securityPolicyId": dialog._getSecurityPolicyId(),
            //         "set_security_parent": setSecurityParent ? "true" : "false",
            //         "editServiceTemplateId": templateId,
            //         "editServiceTemplateName": templateName,
            //         "vsId": vsId,
            //         "mimetype" : mimeType
            //     };
            //     var request = Request.postService("editServiceCreateDocument", dialog.repository.type, params, "text/json", JSON.stringify(bodyParms),
            //         lang.hitch(dialog, function(response) { // success
            //             if (response) {
            //                 var item = ContentItem.createFromJSON(response, dialog.repository, dialog.resultSet, selectedFolder);
            //                 item.id = item.docid;
            //                 item.originalId = item.id
            //                 selectedFolder.refresh();
            //
            //                 if (dialog._callback) {
            //                     dialog._callback(item);
            //                 }
            //
            //                 if (dialog._entryTemplate && dialog._entryTemplate.workflow) {
            //                     dialog._startWorkflow(item);
            //                 }
            //
            //                 dialog.onCancel();
            //             }
            //         }));
            // },
            selectTemplate: function (dialog, destinationFolder) {
                var selectedArr = dialog.search.searchResults.grid.select.row._lastSelectedIds;
                if (!selectedArr || selectedArr.length > 1) {
                    // console.log("no item selected in this grid");
                    alert("Please select One template from the list");
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