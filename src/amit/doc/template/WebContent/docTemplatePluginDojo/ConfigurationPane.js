define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/store/Memory",
        "dojo/aspect",

        "gridx/Grid",
        "gridx/core/model/cache/Sync",
        "gridx/modules/select/Row",

        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "ecm/widget/ValidationTextBox",
        "ecm/widget/admin/PluginConfigurationPane",
        "ecm/widget/_FolderSelectorDropDown",
        "ecm/widget/ContentClassSelector",
        "dojo/text!./templates/ConfigurationPane.html",
        "docTemplatePluginDojo/AddConfigDialog"],
    function (declare, lang, MemoryStore, aspect,
              Grid, Cache, SelectRow,
              _TemplatedMixin,
              _WidgetsInTemplateMixin,
              ValidationTextBox,
              PluginConfigurationPane,
              _FolderSelectorDropDown,
              ContentClassSelector,
              template,
              AddConfigDialog) {

        return declare("docTemplatePluginDojo.ConfigurationPane",
            [PluginConfigurationPane, _TemplatedMixin, _WidgetsInTemplateMixin], {
                templateString: template,
                widgetsInTemplate: true,
                configurationGrid: null,

                postCreate: function () {
                    this.inherited(arguments);
                    this.configurationGrid = this.createGrid();
                },


                createGrid: function () {
                    var store = new MemoryStore({
                        idProperty: "id",
                        data: []
                    });

                    var structure = [
                        {
                            id: "repositoryId",
                            field: "repositoryId",
                            name: "Repository",
                            width: "25%"
                        },
                        {
                            id: "OrgUnit",
                            field: "OrgUnit",
                            name: "Org Unit",
                            width: "25%"
                        },
                        {
                            id: "FolderClass",
                            field: "FolderClass",
                            name: "Folder Class",
                            width: "25%"
                        },
                        {
                            id: "SearchTemplateVsId",
                            field: "SearchTemplateVsId",
                            name: "Search template VsId",
                            width: "25%"
                        },
                    ];


                    var grid = new Grid({
                        cacheClass: Cache,
                        store: store,
                        structure: structure,
                        autoHeight: true,
                        modules: [
                            SelectRow
                        ],
                        selectRowTriggerOnCell: true
                    });

                    grid.placeAt(this.folderAssociateEntryTemplateContentPane);
                    grid.startup();
                    grid.resize();

                    // this.own(aspect.after(grid.select.row, "onSelectionChange", lang.hitch(this, function (evt) {
                    //     this.checkFldAssButtons();
                    // }), true));

                    return grid;
                },

                checkFldAssButtons: function () {
                    // var items = this.getFldAssSelected();
                    // this.editfolderAssociateButton.set("disabled", !(items.length == 1));
                    // this.deletefolderAssociateButton.set("disabled", !(items.length > 0));
                },

                // getFldAssSelected: function() {
                //     return this.folderAssociateEntryTemplateGrid && this.folderAssociateEntryTemplateGrid.select ? this.getFldAssItems(this.folderAssociateEntryTemplateGrid.select.row.getSelected()) : [];
                // },


                newButtonClick: function () {
                    var dialog = new AddConfigDialog();


                    this.own(aspect.after(dialog, "onAdd", lang.hitch(this, function (data) {
                        debugger;
                        this.configurationGrid.model.store.add({
                            "repositoryId": "repositoryId",
                            "OrgUnit": data.orgUnitPrefix,
                            "FolderClass": data.enableFolderClassName,
                            "SearchTemplateVsId": data.searchTemplateVsId,
                        });
                        this._onFieldChange();
                        this.configurationGrid.resize();
                    }), true));

                    dialog.show(null);
                },

                editButtonClick: function() {
                    var currItem = this.getRowSelected()[0];

                    var currData = {};
                    currData.repositoryId = currItem.repositoryId;
                    currData.OrgUnit = currItem.orgUnitPrefix;
                    currData.FolderClass = currItem.enableFolderClassName;
                    currData.SearchTemplateVsId = currItem.searchTemplateVsId;


                    var dialog = new AddConfigDialog();

                    this.own(aspect.after(dialog, "onEdit", lang.hitch(this, function(saveData, originalData) {
                        // currItem.repositoryId = saveData.repositoryId;
                        // currItem.orgUnitPrefix = saveData.orgUnitPrefix;
                        // currItem.folderClassName = saveData.folderClassName;
                        // currItem.associateEntryTemplateName = saveData.associateEntryTemplate.name;
                        // currItem.associateEntryTemplateClassName = saveData.associateEntryTemplate.className;
                        // currItem.associateEntryTemplateVsId = saveData.associateEntryTemplate.vsId;
                        // this.documentAssociateEntryTemplateGrid.model.store.put(currItem, {
                        //     id: currItem.id,
                        //     overwrite: true
                        // });
                        // this._onFieldChange();
                    }), true));

                    dialog.show(currData);
                },

                getRowSelected: function() {
                    return this.configurationGrid && this.configurationGrid.select ? this.getAssItems(this.configurationGrid.select.row.getSelected()) : [];
                },

                getAssItems: function(rowIndexs) {
                    var items = [];
                    for (var i = 0; i < rowIndexs.length; i++) {
                        var row = this.configurationGrid.row(rowIndexs[i]);
                        if (row) {
                            items.push(row.item());
                        }
                    }
                    return items;
                },

                _onFieldChange: function () {
                    this.onSaveNeeded(true);
                },


                load: function (callback) {
                    try {
                        if (this.configurationString) {
                            var jsonConfig = JSON.parse(this.configurationString);

                            this.configurationGrid.setStore(new MemoryStore({
                                idProperty: "id",
                                data: jsonConfig.configurationGridData == null ? [] : jsonConfig.configurationGridData
                            }));

                        }
                    } catch (e) {
                        alert("Failed to load configuration: " + e.message);
                    }
                },

                _onParamChange: function () {
                    // this.onSaveNeeded(true);
                },

                save: function () {
                    var configJson = {};
                    configJson.configurationGridData = this.configurationGrid.model.store.data;
                    this.configurationString = JSON.stringify(configJson);
                },

                validate: function () {
                    return true;
                },

            });
    });