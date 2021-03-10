/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2020
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/sniff",
        "dojo/_base/connect",
        "dojo/aspect",
        "dojo/dom-class",
        "dojo/dom-geometry",
        "dojo/dom-style",
        "dijit/_Widget",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dijit/layout/ContentPane",
        "ecm/model/SearchTemplate",
        "ecm/model/UnifiedSearchTemplate",
        "ecm/widget/search/SearchTab",
        // "newDocByTemplateDojo/Override/AmitSearchTab",
        "ecm/widget/dialog/BaseDialog",
        "ecm/widget/dialog/LoginDialog",
        "dojo/text!../templates/SearchDialogContent.html"
    ],

    function (declare, //
              lang, //
              has, //
              connect, //
              aspect, //
              domClass, //
              domGeometry, //
              domStyle, //
              _Widget, //
              _TemplatedMixin, //
              _WidgetsInTemplateMixin, //
              ContentPane, //
              SearchTemplate, //
              UnifiedSearchTemplate, //
              SearchTab, //
              BaseDialog, //
              LoginDialog, //
              template) {

        /**
         * @name ecm.widget.search.SearchDialog
         * @class Provides a dialog box that is used to open and run saved searches.
         * @augments ecm.widget.dialog.BaseDialog
         */
        return declare("ecm.widget.search.SearchDialog", [
            BaseDialog
        ], {
            /** @lends ecm.widget.search.SearchDialog.prototype */
            contentString: template,
            widgetsInTemplate: true,

            /**
             * @deprecated As of release 2.0.1
             */
            builder: null,

            /**
             * @private Sets the title of the dialog and propagates the repository to SearchTab widget.
             */
            postCreate: function () {
                this.inherited(arguments);
                domClass.add(this.domNode, "ecmSearchDialog");
                domStyle.set(this.domNode, "maxHeight", "none");
                this.setMaximized(true);
                this.setSizeToViewportRatio(true);
                //if (has("ie")) { // IE doesn't seem to be handling the resizable of this screen well
                //this.setResizable(true);
                //}

                this.textDir = has("text-direction");
                if (this.searchTemplate) {
                    this.setTitle(!this.textDir ? this.searchTemplate.name : this.enforceTextDirWithUcc(null, this.searchTemplate.name));
                } else {
                    this.setTitle(this.messages.workspacebuilder_search_dialog_title);
                }

                this.search.repository = this.repository;
                this.search.setSearchTemplate(this.searchTemplate);

                if (this.searchTemplate.isInstanceOf && this.searchTemplate.isInstanceOf(UnifiedSearchTemplate)) {
                    this._subscribeToLoginDialogOnCancel();
                    var onLoadHandler = aspect.after(this.search, "onLoad", lang.hitch(this, function () {
                        this._unsubscribeToLoginDialogOnCancel();
                        onLoadHandler.remove();
                    }));
                }
                if (this.search.searchForm) {
                    this.own(aspect.after(this.searchTemplate, "onUnsupportedSearchCriteriaRetrieved", lang.hitch(this, function () {
                        this.hide();
                    })));
                }

                this.search.resize();
            },

            _subscribeToLoginDialogOnCancel: function () {
                this._unsubscribeToLoginDialogOnCancel();
                this._LoginDialogOnCancelHandle = connect.subscribe("ecm.widget.dialog.LoginDialog.onCancel", lang.hitch(this, function (message) {
                    this._unsubscribeToLoginDialogOnCancel();
                    this.hide();
                }));
            },

            _unsubscribeToLoginDialogOnCancel: function () {
                if (this._LoginDialogOnCancelHandle)
                    connect.unsubscribe(this._LoginDialogOnCancelHandle);
                this._LoginDialogOnCancelHandle = null;
            },

            show: function () {
                this.inherited(arguments);
                this.resize();
            },

            resize: function () {
                this.inherited(arguments);

                if (!this.isMaximized()) {
                    var width = domGeometry.getContentBox(this.titleBar).w;
                    domGeometry.setContentSize(this.containerNode, {
                        w: width < 0 ? 0 : width
                    });
                }
                if (has("ie")) {
                    var totalHeight = domGeometry.getMarginBox(this.domNode).h;
                    var titleHeight = domGeometry.getContentBox(this.titleBar).h;
                    var actionBarHeight = domGeometry.getContentBox(this.actionBar).h;
                    var resizeHandleHeight = domGeometry.getContentBox(this.resizeHandle).h;
                    if (!this.isMaximized()) {
                        var height = totalHeight - titleHeight - actionBarHeight - resizeHandleHeight;
                        domStyle.set(this.search.searchContainerNode, "height", height + "px");
                    } else {
                        var height = totalHeight;
                        domStyle.set(this.search.searchContainerNode, "height", height + "px");
                    }
                }
            },

            onCancel: function () {
            }
        });
    });
