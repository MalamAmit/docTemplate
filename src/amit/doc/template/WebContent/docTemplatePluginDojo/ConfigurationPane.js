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

                    if (this.configurationString) {
                        var jsonConfig = JSON.parse(this.configurationString);
                        console.log("jsonConfig.configuration[0].value " + jsonConfig.configuration[0].value)
                        if (jsonConfig.configuration[0].value !== undefined) {
                            this.enableFolderClassName.setSelected(jsonConfig.configuration[0].value);
                        }
                        // this.folderTemplateName.set('value', jsonConfig.configuration[1].value);
                    }


                    this.folderSelectorDropDown.setRoot(this.repository);
                    // var destPath=this.folderSelectorDropDown.getSelected().path;
                    // this._callback(destPath.replace(this.folderSelectorDropDown.repositoryTeamspaceName, ""));
                },

                _onParamChange: function () {
                    console.log("_onParamChange")
                    this.onSaveNeeded(true);
                },

                test: function (){
                    console.log("test")
                },

                save: function () {
                    var configArray = new Array();
                    var configString = {
                        name: "enableFolderClassName",
                        // value: this.enableFolderClassName.selectedContentClass.id
                        value: this.enableFolderClassName.getSelected()

                    };
                    configArray.push(configString);
                    // configString = {
                    //     name: "folderTemplateName",
                    //     value: this.folderTemplateName.get('value')
                    // };
                    // configArray.push(configString);
                    var configJson = {
                        "configuration": configArray
                    };
                    this.configurationString = JSON.stringify(configJson);
                    console.log("configurationString 1" + this.configurationString)
                },

                validate: function () {
                    return true;
                },

            });
    });