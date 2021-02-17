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
                    this.folderSelectorDropDown.setRoot(this.repository);


                    if (this.configurationString) {
                        var jsonConfig = JSON.parse(this.configurationString);

                        if (jsonConfig.configuration[0].value !== undefined) {
                            this.enableFolderClassName.setSelected(jsonConfig.configuration[0].value);
                        }

                        if (jsonConfig.configuration[1].value !== undefined) {
                            this.folderSelectorDropDown.setSelected(jsonConfig.configuration[1].value);
                        }
                    }
                },

                _onParamChange: function () {
                    console.log("_onParamChange")
                    this.onSaveNeeded(true);
                },

                save: function () {
                    console.log("save 1 " + this.folderSelectorDropDown.getSelected())
                    var configArray = new Array();
                    var configString = {
                        name: "enableFolderClassName",
                        // value: this.enableFolderClassName.selectedContentClass.id
                        value: this.enableFolderClassName.getSelected()

                    };
                    configArray.push(configString);
                    configString = {
                        name: "folderSelectorDropDown",
                        value: this.folderSelectorDropDown.getSelected()
                    };
                    configArray.push(configString);
                    var configJson = {
                        "configuration": configArray
                    };
                    console.log("save 2 " + configJson)
                    this.configurationString = JSON.stringify(configJson);
                    console.log("configurationString 1" + this.configurationString)
                },

                validate: function () {
                    return true;
                },

            });
    });