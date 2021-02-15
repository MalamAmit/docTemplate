define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "ecm/widget/ValidationTextBox",
        "ecm/widget/admin/PluginConfigurationPane",
        "dojo/text!./templates/ConfigurationPane.html",
        "docTemplatePluginDojo/FolderAssociateEntryTemplateDialog"],
    function (declare, lang, _TemplatedMixin, _WidgetsInTemplateMixin, ValidationTextBox,
              PluginConfigurationPane, template, FolderAssociateEntryTemplateDialog) {
        return declare("docTemplatePluginDojo.ConfigurationPane",
            [PluginConfigurationPane, _TemplatedMixin, _WidgetsInTemplateMixin], {
                templateString: template,
                widgetsInTemplate: true,

                load: function (callback) {
                    if (this.configurationString) {
                        var jsonConfig = JSON.parse(this.configurationString);
                        this.enableFolderClassName.set('value', jsonConfig.configuration[0].value);
                        this.folderTemplateName.set('value', jsonConfig.configuration[1].value);
                        new FolderAssociateEntryTemplateDialog().show(null);
                    }
                    this.test();
                },

                _onParamChange: function () {
                    var configArray = new Array();
                    var configString = {
                        name: "enableFolderClassName",
                        value: this.enableFolderClassName.get('value')
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
                    this.onSaveNeeded(true);
                },

                // validate: function () {
                //     if (!this.enableFolderClassName.isValid()
                //         || !this.folderTemplateName.isValid())
                //         return false;
                //     return true;
                // },

                test: function () {
                    this.repository = ecm.model.desktop.getRepositoryByName("OS1");
                    this.enableFolderClassName.setRepository(this.repository);
                    this.enableFolderClassName.setRootClassId("Folder");
                    this.enableFolderClassName.setVisibleOnlyForFolder(true);

                    var cb = lang.hitch(this, function (entryTemplates, cn1, cn2) {
                        var items = [];

                        array.forEach(entryTemplates, function (ent) {
                            items.push({
                                id: ent.vsId,
                                name: ent.name,
                                className: ent.addClassName,
                                vsId: ent.vsId,
                                entId: ent.id
                            })
                        }, this);

                    });
                }
            });
    });