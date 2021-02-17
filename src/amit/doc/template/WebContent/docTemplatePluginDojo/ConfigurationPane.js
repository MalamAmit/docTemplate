define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "ecm/widget/ValidationTextBox",
        "ecm/widget/admin/PluginConfigurationPane",
        "ecm/widget/_FolderSelectorDropDown",
        "ecm/widget/ContentClassSelector",
        "dojo/text!./templates/ConfigurationPane.html"],
    function (declare, lang, _TemplatedMixin,
              _WidgetsInTemplateMixin, ValidationTextBox,
              PluginConfigurationPane, _FolderSelectorDropDown, ContentClassSelector, template) {
        return declare("docTemplatePluginDojo.ConfigurationPane",
            [PluginConfigurationPane, _TemplatedMixin, _WidgetsInTemplateMixin], {
                templateString: template,
                widgetsInTemplate: true,

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


                        debugger;
                        if (jsonConfig.folderSelectorId !== undefined) {
                            this.repository.retrieveItem(jsonConfig.folderSelectorId, lang.hitch(this, function(item) {
                                console.log("item 1", item)
                                this.folderSelector.setSelected(item);
                            }));
                        }
                    }
                },

                _onParamChange: function () {
                    console.log("_onParamChange")
                    this.onSaveNeeded(true);
                },


                save: function () {
                    var configJson = {};
                    console.log("save")
                    debugger;
                    configJson.enableFolderClassName = this.enableFolderClassName.getSelected();
                    console.log("enableFolderClassName.getSelected();  " + this.enableFolderClassName.getSelected())

                    configJson.folderSelectorId = this.folderSelector.getSelected().item.id;
                    console.log("this.folderSelector.getSelected().item.id  " + this.folderSelector.getSelected().item.id)

                    this.configurationString = JSON.stringify(configJson);
                },

                validate: function () {
                    return true;
                },

            });
    });