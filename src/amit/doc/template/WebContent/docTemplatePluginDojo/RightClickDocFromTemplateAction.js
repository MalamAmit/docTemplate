define(["dojo/_base/declare", "ecm/model/Action"],
    function (declare, Action) {        return declare("docTemplatePluginDojo.RightClickDocFromTemplateAction", [Action], {



            isEnabled: function (repository, listType, items, teamspace, resultSet) {
                var enabled = this.inherited(arguments);
                debugger;

                if (items && items[0].isFolder && items[0].getContentClass) {
                    var sameClass = items[0].getContentClass().name == "CustomerDossier";
                    return enabled && items[0].isFolder() && sameClass;
                }
                return false;
            },



            isVisible: function (repository, listType) {
                debugger;
                return this.inherited(arguments);
            },


            performAction: function (repository, itemList, callback, teamspace, resultSet, parameterMap) {
                debugger;
            },


            setBrowseRootFolder: function (newRootFolder, browseFeature) {
                debugger;
                browseFeature.folderTree.setFolder(newRootFolder);
                // optionally set content list to the first child.
            }
        });
    });