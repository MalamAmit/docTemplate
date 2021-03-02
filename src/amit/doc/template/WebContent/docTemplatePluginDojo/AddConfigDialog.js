define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/aspect",
        "dojo/store/Memory",
        "ecm/widget/dialog/BaseDialog",
        "ecm/widget/ContentClassSelector",
        "ecm/model/SearchTemplate",

        "dojo/text!./templates/AddConfigDialog.html"
    ],
    function (declare, lang, array, aspect, MemoryStore,
              BaseDialog, ContentClassSelector, SearchTemplate, template) {

        return declare("docTemplatePluginDojo.AddConfigDialog", [
            BaseDialog
        ], {

            contentString: template,
            widgetsInTemplate: true,
            _editData: null,
            staticRepository: ecm.model.desktop.getRepositoryByName("OS1"),

            show: function (editData) {
                console.log("show: function");
                this.okButton.set("disabled", true);
                this._editData = editData;
                this._loadData();
                this.inherited(arguments);
            },

            _loadData: function () {
                if (this._editData) {
                    setTimeout(lang.hitch(this, function () {
                        if (this._editData.orgUnit)
                            this.orgUnitPrefixField.set('value', this._editData.orgUnit);

                        if (this._editData.folderClass) {
                            this.enableFolderClassName.setSelected(this._editData.folderClass);
                        }
                        if (this._editData.searchTemplateVsId)

                            //retrieve search template
                            var request = this.repository.retrieveSearchTemplate(item.id, item.vsId, "released", lang.hitch(this, function(searchTemplate) {
                                this._treeModel.onChange(searchTemplate);
                                this._addContextMenu(evt, searchTemplate);
                            }), lang.hitch(this, function() {
                                // Remove the search template from recent searches if it could not be retrieved.
                                if (this.teamspace) {
                                    this.teamspace.removeRecentSearches([
                                        item
                                    ]);
                                } else {
                                    this.repository.removeRecentSearches([
                                        item
                                    ]);
                                }
                            }));


                            // var sTemplate = new SearchTemplate({
                            //     id: this._editData.searchTemplateVsId,
                            //     name: "StoredSearch",
                            //     repository: ecm.model.desktop.getRepository("OS1"),
                            //     description: "item.description"
                            // });
                        this.searchTemplateSelector.setSelected(sTemplate);
                        this._onFieldChange();
                    }, 300));
                }
            },

            _onParamChange: function () {
                this.okButton.set('disabled', !this._validateData());
            },

            postCreate: function () {
                console.log("postCreate: function");
                this.inherited(arguments);
                this.setResizable(false);
                this.setMaximized(false);
                this.setExpandable(false);
                this.setTitle("Add Doc Template configuration");

                this.okButton = this.addButton("OK", "saveData", true, true);


                this.searchTemplateSelector.repository == null;
                this.enableFolderClassName.repository == null;
                this.searchTemplateSelector.setRepository(this.staticRepository);
                this.enableFolderClassName.setRepository(this.staticRepository);

                this.enableFolderClassName.setVisibleOnlyForFolder(true);
                this.enableFolderClassName.setRootClassId("Folder");

                // if (params.searchTemplate) {
                //     this.searchTemplateSelector.setSelected(params.searchTemplate);
                // }
            },
            saveData: function () {
                this.getVsId = function () {
                    if (this.searchTemplateSelector.getSelected().vsId) {
                         return this.searchTemplateSelector.getSelected().vsId;
                    } else {
                        // todo: get version Id
                        // return ...
                    }
                }
                if (this._validateData()) {
                    var body = {};
                    body.orgUnitPrefixParam = this.orgUnitPrefixField.get("value");
                    body.enableFolderClassParam = this.enableFolderClassName.getSelected().id;
                    body.searchTemplateVsIdParam = this.getVsId();
                    if (this._isEdit()) {
                        this.onEdit(body, this._editData);
                    } else {
                        this.onAdd(body);
                    }
                    this.onCancel();
                }
            },
            _isEdit: function () {
                return this._editData != null && this._editData;
            },
            _onFieldChange: function () {
                this.okButton.set('disabled', !this._validateData()); // Disable ok button if not valid
            },
            _validateData: function () {
                var value = this.enableFolderClassName.selectedContentClass;
                if (value == null || value.id == null || value.id == "")
                    return false;

                value = this.searchTemplateSelector.getSelected();
                if (value == null || value.id == null || value.id == "")
                    return false;

                value = this.orgUnitPrefixField.get("value");
                if (value == null || value == "")
                    return false;

                return true;
            },
            // override to get data entered on the screen
            onEdit: function (screenData, originalData) {
            },

            // override to get data entered on the screen
            onAdd: function (screenData) {
            },


            // _isEdit: function () {
            //     return this._editData != null && this._editData;
            // },
        })
    })
