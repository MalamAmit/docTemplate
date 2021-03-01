define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/aspect",
        "dojo/store/Memory",
        "ecm/widget/dialog/BaseDialog",
        "ecm/widget/ContentClassSelector",

        "dojo/text!./templates/AddConfigDialog.html"
    ],
    function (declare, lang, array, aspect, MemoryStore,
              BaseDialog, ContentClassSelector, template) {

        return declare("docTemplatePluginDojo.AddConfigDialog", [
            BaseDialog
        ], {

            contentString: template,
            widgetsInTemplate: true,
            constructor: function(args){
                // this.title = args.title;
            },
            _onParamChange: function () {

            },
            postCreate: function() {
                this.inherited(arguments);
                this.setResizable(false);
                this.setMaximized(false);
                this.setExpandable(false);
                this.setTitle("title");
                console.log("postCreate")

                this.templateSelector.repository == null;
                this.enableFolderClassName.repository == null;
                this.repository = ecm.model.desktop.getRepositoryByName("OS1");


                this.templateSelector.setRepository(this.repository);
                this.enableFolderClassName.setRepository(this.repository);

                this.enableFolderClassName.setVisibleOnlyForFolder(true);
                this.enableFolderClassName.setRootClassId("Folder");

                // if (params.searchTemplate) {
                //     this.templateSelector.setSelected(params.searchTemplate);
                // }
            }
        })
    })
