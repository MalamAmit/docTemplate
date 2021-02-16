define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "ecm/widget/ValidationTextBox",
        "ecm/widget/admin/PluginConfigurationPane",
        "ecm/widget/ContentClassSelector",
        "dojo/text!./templates/ConfigurationPane.html"],
    function (declare, lang, _TemplatedMixin,
              _WidgetsInTemplateMixin, ValidationTextBox,
              PluginConfigurationPane, ContentClassSelector, template) {
        return declare("docTemplatePluginDojo.ConfigurationPane",
            [PluginConfigurationPane, _TemplatedMixin, _WidgetsInTemplateMixin], {
                templateString: template,
                widgetsInTemplate: true,

                load: function (callback) {
                    this.repository = ecm.model.desktop.getRepositoryByName("OS1");
                    this.enableFolderClassName.setRepository(this.repository);
                    this.enableFolderClassName.setVisibleOnlyForFolder(true);
                    this.enableFolderClassName.setRootClassId("Folder");


                    if (this.configurationString) {
                        var jsonConfig = JSON.parse(this.configurationString);
                    //
                        if (jsonConfig.configuration[0].value !== undefined) {
                            this.enableFolderClassName.setSelected(jsonConfig.configuration[0].value);
                    //         // this.enableFolderClassName.setSelected("Folder");
                    //         // } else {
                    //         // this.enableFolderClassName.setRootClassId(jsonConfig.configuration[0].value);
                        }
                        this.folderTemplateName.set('value', jsonConfig.configuration[1].value);
                    }

                },

                _onParamChange: function () {
                    console.log("_onParamChange" + this.enableFolderClassName.getRootClassId())

                    this.onSaveNeeded(true);
                },

                save: function(){
                    var configArray = new Array();
                    var configString = {
                        name: "enableFolderClassName",
                        value: this.enableFolderClassName.selectedContentClass.id
                    };
                    configArray.push(configString);
                    configString = {
                        name: "folderTemplateName",
                        value: this.folderTemplateName.get('value')
                    };
                    configArray.push(configString);
                    var configJson = {
                        "configuration": configArray
                    };
                    this.configurationString = JSON.stringify(configJson);
                    console.log("configurationString 1" + this.configurationString)
                },

                validate: function () {
                    // if (!this.enableFolderClassName.isValid()
                    //     || !this.folderTemplateName.isValid())
                    //     return false;
                    return true;
                },

            });
    });