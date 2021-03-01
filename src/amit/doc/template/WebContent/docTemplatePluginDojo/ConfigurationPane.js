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
                staticRepository: ecm.model.desktop.getRepositoryByName("OS1"),

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
                            id: "repository",
                            field: "repository",
                            name: "Repository",
                            width: "25%"
                        },
                        {
                            id: "orgUnit",
                            field: "orgUnit",
                            name: "Org Unit",
                            width: "25%"
                        },
                        {
                            id: "folderClass",
                            field: "folderClass",
                            name: "Folder Class",
                            width: "25%"
                        },
                        {
                            id: "searchTemplateVsId",
                            field: "searchTemplateVsId",
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

                    this.own(aspect.after(grid.select.row, "onSelectionChange", lang.hitch(this, function(evt) {
                        this.updateEnableButton();
                    }), true));
                    return grid;
                },

                newButtonClick: function () {
                    var dialog = new AddConfigDialog();

                    this.own(aspect.after(dialog, "onAdd", lang.hitch(this, function (data) {
                        this.configurationGrid.model.store.add({
                            "repository": this.staticRepository.id,
                            "orgUnit": data.orgUnitPrefixParam,
                            "folderClass": data.enableFolderClassParam,
                            "searchTemplateVsId": data.searchTemplateVsIdParam,
                        });
                        this._onFieldChange();
                        this.configurationGrid.resize();
                    }), true));

                    dialog.show(null);
                },

                editButtonClick: function () {
                    var currItem = this.getRowSelected()[0];

                    var currData = {};
                    currData.repository = currItem.repository;
                    currData.orgUnit = currItem.orgUnit;
                    currData.folderClass = currItem.folderClass;
                    currData.searchTemplateVsId = currItem.searchTemplateVsId;

                    var dialog = new AddConfigDialog();

                    this.own(aspect.after(dialog, "onEdit", lang.hitch(this, function (data, originalData) {
                        currItem.repository = this.staticRepository.id;
                        currItem.orgUnit = data.orgUnitPrefixParam,
                        currItem.folderClass =  data.enableFolderClassParam,
                        currItem.searchTemplateVsId =  data.searchTemplateVsIdParam,
                        this.configurationGrid.model.store.put(currItem, {
                            id: currItem.id,
                            overwrite: true
                        });
                        this._onFieldChange();
                    }), true));

                    dialog.show(currData);
                },

                deleteButtonClick: function() {
                    var items = this.getRowSelected();
                    if (items) {
                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];
                            this.configurationGrid.model.store.remove(item.id);
                        }
                    }

                    this.updateEnableButton();
                },

                getRowSelected: function () {
                    return this.configurationGrid && this.configurationGrid.select ? this.getAssItems(this.configurationGrid.select.row.getSelected()) : [];
                },

                getAssItems: function (rowIndexs) {
                    var items = [];
                    for (var i = 0; i < rowIndexs.length; i++) {
                        var row = this.configurationGrid.row(rowIndexs[i]);
                        if (row) {
                            items.push(row.item());
                        }
                    }
                    return items;
                },

                updateEnableButton: function () {
                    var items = this.getRowSelected();
                    this.editButton.set("disabled", !(items.length == 1));
                    this.deleteButton.set("disabled", !(items.length > 0));
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