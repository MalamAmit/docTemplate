define(["dojo/_base/declare",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "ecm/widget/ValidationTextBox",
        "ecm/widget/admin/PluginConfigurationPane",
        "dojo/text!./templates/ConfigurationPane.html"],
    function (declare, _TemplatedMixin, _WidgetsInTemplateMixin, ValidationTextBox, PluginConfigurationPane, template) {
        return declare("dossierPluginDojo.ConfigurationPane",
            [PluginConfigurationPane, _TemplatedMixin, _WidgetsInTemplateMixin], {
                templateString: template,
                widgetsInTemplate: true,

                load: function (callback) {
                    if (this.configurationString) {
                        var jsonConfig = JSON.parse(this.configurationString);
                        this.enableFolderClassName.set('value', jsonConfig.configuration[0].value);
                        this.folderTemplateName.set('value', jsonConfig.configuration[1].value);
                        this.templateFolderStructureField.set('value',
                            jsonConfig.configuration[2].value);
                    }
                },

                validate: function () {
                    return true;
                }
            });
    });
