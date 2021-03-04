define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "ecm/widget/dialog/BaseDialog",
    "dojo/text!./templates/TemplatesDialog.html",
    "dijit/layout/ContentPane",
    "ecm/widget/listView/gridModules/Async",
    "gridx/Grid",
    "gridx/modules/select/Row",
    "dojo/store/Memory"
], function (declare,
             lang,
             BaseDialog,
             template,
             ContentPane,
             Cache,
             Grid,
             SelectRow,
             Memory) {


    return declare("newDocByTemplateDojo.TemplatesDialog", [BaseDialog], {
        constructor: function () {
            this._createGrid();
        },

        _createGrid: function () {

            // Destroying the grid does not free the store; must take
            // care of that manually.
            if (this.store)
                this.store = null;
            // this.store = this._resultSet.getStore();


            this.store = new Memory({
                data: [{
                    id: 1,
                    column_1: 'Feed4',
                    column_2: '444',
                    column_3: ''
                }, {
                    id: 2,
                    column_1: 'Feed5',
                    column_2: '555',
                    column_3: 0
                }]
            })
            debugger;
            let grid = new Grid({
                cacheClass: Cache,
                // pageSize: this._resultSet.pageSize,
                store: this.store,
                structure: [
                    {id: "column_1", field: "name", name: "Name", width: "50%"},
                    {id: "column_2", field: "genre", name: "Genre"},
                    {id: "column_3", field: "composer", name: "Composer"},
                    {id: "column_4", field: "year", name: "Year"}
                ],
                // selectRowTriggerOnCell: !has("ecmMobile") && !this._allowCheckboxes,
                modules: [SelectRow],
                // textDir: has("text-direction"),
                // headerHidden: this.headerHidden,
                contentList: this,
                selectRowTriggerOnCell: true,
                // barBottom: this._isShowPaginationBar() ? [ListViewPaginationBar] : null
            });

            // grid.placeAt(this.gridPoint);
            // grid.startup();
            // // In IE, setting the vScrollerBuffSize helps with the focus on rows jumping back several rows when using the keyboard
            // // to go up near the top of the list.
            // if (!this._isShowPaginationBar() && (has("ie") || has("trident")) ) {
            //     if (grid.rowCount() > 0) {
            //         grid.vScrollerBuffSize = 0;		// row count nodes above/below the grid body viewport
            //     }
            // }

            // grid.body._loadFail = lang.hitch(this, function(e) {
            // });
            // grid.contentList = this;
            //
            // this._grid = grid;
            // this._createGridConnections();
            //
            // domConstruct.place(grid.domNode, gridArea.domNode, "only");
            // grid.startup();

        },
    });
});