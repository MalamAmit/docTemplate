define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/store/Memory",

        "gridx/Grid",
        "gridx/core/model/cache/Sync",
        "gridx/modules/select/Row",

        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "ecm/widget/ValidationTextBox",
        "ecm/widget/admin/PluginConfigurationPane",
        "ecm/widget/_FolderSelectorDropDown",
        "ecm/widget/ContentClassSelector",
        "dojo/text!./templates/ConfigurationPane.html"],
    function (declare, lang, MemoryStore,
              Grid, Cache, SelectRow,

              _TemplatedMixin,
              _WidgetsInTemplateMixin,
              ValidationTextBox,
              PluginConfigurationPane,
              _FolderSelectorDropDown,
              ContentClassSelector,
              template) {

        return declare("docTemplatePluginDojo.ConfigurationPane",
            [PluginConfigurationPane, _TemplatedMixin, _WidgetsInTemplateMixin], {
                templateString: template,
                widgetsInTemplate: true,

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
                            width: "10%"
                        },
                        {
                            id: "OrgUnit",
                            field: "OrgUnit",
                            name: "OrgUnit",
                            width: "10%"
                        },
                        {
                            id: "FolderClass ",
                            field: "FolderClass ",
                            name: "FolderClass ",
                            width: "20%"
                        },
                        {
                            id: "SearchTemplateVsId",
                            field: "SearchTemplateVsId",
                            name: "Search template VsId",
                            width: "40%"
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

                    grid.placeAt(this.myGrid);
                    grid.startup();
                    grid.resize();

                    this.own(aspect.after(grid.select.row, "onSelectionChange", lang.hitch(this, function (evt) {
                        this.checkFldAssButtons();
                    }), true));


                    return grid;
                },


                load: function (callback) {
                    this.repository = ecm.model.desktop.getRepositoryByName("OS1");
                    this.enableFolderClassName.setRepository(this.repository);
                    this.enableFolderClassName.setVisibleOnlyForFolder(true);
                    this.enableFolderClassName.setRootClassId("Folder");
                    this.folderSelector.setRoot(this.repository);

                    if (this.configurationString) {
                        var jsonConfig = JSON.parse(this.configurationString);

                        if (jsonConfig.enableFolderClassName !== undefined) {
                            this.enableFolderClassName.setSelected(jsonConfig.enableFolderClassName);
                        }

                        if (jsonConfig.folderSelectorParam !== undefined) {
                            this.repository.retrieveItem(jsonConfig.folderSelectorParam.id, lang.hitch(this, function (item) {
                                this.folderSelector.setSelected(item);
                            }));
                        }
                    }
                },

                _onParamChange: function () {
                    this.onSaveNeeded(true);
                },

                save: function () {
                    var configJson = {};
                    configJson.enableFolderClassName = this.enableFolderClassName.getSelected().id;
                    configJson.folderSelectorParam = {
                        id: this.folderSelector.getSelected().item.id,
                        path: this.folderSelector.getSelected().path
                    }
                    this.configurationString = JSON.stringify(configJson);
                },

                validate: function () {
                    return true;
                },

            });
    });