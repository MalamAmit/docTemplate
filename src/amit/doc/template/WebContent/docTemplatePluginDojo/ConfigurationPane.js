define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "ecm/widget/ValidationTextBox",
        "ecm/widget/admin/PluginConfigurationPane",
        "ecm/widget/_FolderSelectorDropDown",
        "ecm/widget/ContentClassSelector",
        "dojo/text!./templates/ConfigurationPane.html",
        "ecm/widget/FolderTree"],
    function (declare, lang, _TemplatedMixin,
              _WidgetsInTemplateMixin, ValidationTextBox,
              PluginConfigurationPane, _FolderSelectorDropDown, ContentClassSelector, template, FolderTree) {
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

                        if (jsonConfig.folderSelectorId !== undefined) {
                            this.repository.retrieveItem(jsonConfig.folderSelectorId, lang.hitch(this, function(item) {
                                this.folderSelector.setSelected(item);
                            }));
                        }
                    }

                    // Setting the repository on the tree
                    this.folderTree.setRepository(this.repository);
                },

                _onParamChange: function () {
                    this.onSaveNeeded(true);
                },

                save: function () {
                    var configJson = {};
                    configJson.enableFolderClassName = this.enableFolderClassName.getSelected().id;
                    configJson.folderSelectorId = this.folderSelector.getSelected().item.id;
                    this.configurationString = JSON.stringify(configJson);
                },

                validate: function () {
                    return true;
                },

            });
    });