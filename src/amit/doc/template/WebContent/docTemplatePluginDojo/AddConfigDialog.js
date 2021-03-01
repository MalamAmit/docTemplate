define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/aspect",
        "dojo/store/Memory",
        "ecm/widget/dialog/BaseDialog",
        "ecm/widget/ContentClassSelector",

        "dojo/text!./templates/AddConfigDialog.html"
    ],
    function (declare, lang, array, aspect, MemoryStore,
              BaseDialog, ContentClassSelector, template) {

        return declare("docTemplatePluginDojo.AddConfigDialog", [
            BaseDialog
        ], {

            contentString: template,
            widgetsInTemplate: true,
            _editData: null,

            show: function (editData) {
                this.okButton.set("disabled", true);
                this._editData = editData;
                this._loadData();
                this.inherited(arguments);
            },

            _loadData: function () {
                this.orgUnitPrefixFiled.set("value", "");
                // this.enableFolderClassName.setSelected();
                // this.templateSelector.setSelected();


                if (this._editData) {
                    setTimeout(lang.hitch(this, function () {
                        if (this._editData.OrgUnit)
                            this.orgUnitPrefixFiled.set('value', this._editData.OrgUnit);

                        if (this._editData.FolderClass) {
                            this.enableFolderClassName.setSelected(this._editData.FolderClass);
                        }
                        if (this._editData.SearchTemplateVsId)
                            this.templateSelector.set('value', this._editData.SearchTemplateVsId);
                        this._onFieldChange();
                    }, 300));
                }
            },

            _onParamChange: function () {
                this.okButton.set('disabled', !this._validateData());
            },
            postCreate: function () {
                this.inherited(arguments);
                this.setResizable(false);
                this.setMaximized(false);
                this.setExpandable(false);
                this.setTitle("Add Doc Template configuration");

                this.okButton = this.addButton("OK", "saveAssociate", true, true);


                this.templateSelector.repository == null;
                this.enableFolderClassName.repository == null;
                this.repository = ecm.model.desktop.getRepositoryByName("OS1");


                this.templateSelector.setRepository(this.repository);
                this.enableFolderClassName.setRepository(this.repository);

                this.enableFolderClassName.setVisibleOnlyForFolder(true);
                this.enableFolderClassName.setRootClassId("Folder");

                // if (params.searchTemplate) {
                //     this.templateSelector.setSelected(params.searchTemplate);
                // }
            },
            saveAssociate: function () {
                if (this._validateData()) {
                    var body = {};
                    body.orgUnitPrefix = this.orgUnitPrefixFiled.get("value");
                    body.enableFolderClassName = this.enableFolderClassName.getSelected().id;
                    body.searchTemplateVsId = this.templateSelector.getSelected().vsId;
                    // if (this._isEdit()) {
                    //     this.onEdit(screenData, this._editData);
                    // } else {
                    this.onAdd(body);
                    // }
                    this.onCancel();
                }
            },
            _onFieldChange: function() {
                this.okButton.set('disabled', !this._validateData()); // Disable ok button if not valid
            },
            _validateData: function () {
                var value = this.enableFolderClassName.selectedContentClass;
                if (value == null || value.id == null || value.id == "")
                    return false;

                value = this.templateSelector.getSelected();
                if (value == null || value.id == null || value.id == "")
                    return false;

                value = this.orgUnitPrefixFiled.get("value");
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
