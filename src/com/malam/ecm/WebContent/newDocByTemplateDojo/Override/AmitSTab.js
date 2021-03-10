/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2020
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/aspect",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/on",
	"dojo/string",
	"dojo/query",
	"dojo/NodeList-traverse",
	"dojo/NodeList-manipulate",
	"dojox/html/entities",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/focus",
	"dijit/Menu",
	"dijit/MenuItem",
	"dijit/MenuSeparator",
	"dijit/PopupMenuItem",
	"dijit/form/Button",
	"dijit/form/CheckBox",
	"dijit/form/DropDownButton",
	"dijit/layout/ContentPane",
	"idx/layout/BorderContainer",
	"idx/html",
	"ecm/LoggerMixin",
	"ecm/model/Desktop",
	"ecm/model/Message",
	"ecm/model/ResultSet",
	"ecm/model/SearchConfiguration",
	"ecm/model/SearchCriterion",
	"ecm/model/SearchTemplate",
	// "ecm/model/SearchCriteria",
	"newDocByTemplateDojo/Override/AmitSearchCriteria",
	"ecm/model/UnifiedSearchTemplate",
	"ecm/model/_searchUtils",
	"ecm/model/admin/AdminConfig",
	"ecm/widget/search/_SearchPaneContainer",
	"ecm/widget/search/ClassCriteria",
	"ecm/widget/search/SearchInCriteria",
	"ecm/widget/search/SearchMoreOptions",
	"ecm/widget/search/SearchPropertyOptions",
	"ecm/widget/search/SearchResultsDisplayOptions",
	"ecm/widget/search/UnifiedSearchScope",
	"ecm/widget/search/SearchForm",
	"ecm/widget/dialog/MessageDialog",
	"ecm/widget/search/ODSaveSearchDialog",
	"ecm/widget/search/ODManageSaveSearchDialog",
	"ecm/widget/listView/ContentList",
	"ecm/widget/listView/gridModules/SingleSort",
	"ecm/widget/listView/gridModules/DndRowCopy",
	"ecm/widget/listView/gridModules/DndFromDesktopAddDoc",
	"ecm/widget/listView/gridModules/RowContextMenu",
	"dojo/text!../templates/SearchTab.html"
], function(declare, lang, array, aspect,
			domClass, domGeometry, domStyle,
			on, string, query, nlt, nlm,
			entities, _WidgetBase, _TemplatedMixin,
			_WidgetsInTemplateMixin, focus, Menu, MenuItem,
			MenuSeparator, PopupMenuItem, Button, CheckBox,
			DropDownButton, ContentPane, BorderContainer,
			idxHtml, LoggerMixin, Desktop, Message,
			ResultSet, SearchConfiguration, SearchCriterion, SearchTemplate,SearchCriteria,  UnifiedSearchTemplate, utils, AdminConfig, _SearchPaneContainer, ClassCriteria, SearchInCriteria, SearchMoreOptions, SearchPropertyOptions, SearchResultsDisplayOptions, UnifiedSearchScope, SearchForm, MessageDialog, ODSaveSearchDialog, ODManageSaveSearchDialog, ContentList, SingleSort, DndRowCopy, DndFromDesktopAddDoc, RowContextMenu, template) {

	/**
	 * @name ecm.widget.search.SearchTab
	 * @class Provides a widget that contains a {@link ecm.widget.search.SearchForm} widget and a
	 *        {@link ecm.widget.listView.ContentList} widget with the widget events wired together. The parent for the
	 *        SearchTab widget is an <code>idx.widget.ContentPane</code> or other widget that passes the
	 *        <code>container</code> attribute to this widget.
	 * @augments dijit._WidgetBase
	 */
	return declare("newDocByTemplateDojo.Override.AmitSTab", [
		_WidgetBase,
		_TemplatedMixin,
		_WidgetsInTemplateMixin,
		_SearchPaneContainer,
		LoggerMixin
	], {
		/** @lends ecm.widget.search.SearchTab.prototype */
		templateString: template,

		/**
		 * @deprecated As of release 2.0.1
		 */
		showingContentList: false,
		/**
		 * @deprecated As of release 2.0.1
		 */
		showingSearchToggleArea: true,
		/**
		 * @deprecated As of release 2.0.1
		 */
		showEdit: true,
		/**
		 * @deprecated As of release 2.0.1
		 */
		showClear: true,

		/**
		 * A {@link ecm.model.SearchTemplate} object of the search being opened
		 */
		searchTemplate: null,

		/**
		 * The version of the search to be opened, i.e., "current", "released" or "specific". If not defined, the
		 * released version is opened.
		 * 
		 * @since 2.0.3
		 */
		version: null,

		/**
		 * Indicates whether to automatically run the search when loaded. Only applicable to searches that are free of
		 * errors, and meet the minimum criteria requirements.
		 * 
		 * @since 2.0.3
		 */
		runSearchOnLoad: false,

		/**
		 * Indicates whether to automatically open the first item in the results list if the search runs automatically
		 * when opened and returns a single item.
		 * 
		 * @since 2.0.3.5
		 */
		openItemOnLoad: false,

		/**
		 * Indicates whether to automatically run the search and hide the search criteria when loaded. Only applicable
		 * to searches that are free of errors, and meet the minimum criteria requirements.
		 * 
		 * @since 2.0.3
		 */
		hideSearchCriteria: false,

		/**
		 * The ID of the search feature that hosts this search tab.
		 * 
		 * @since 2.0.3
		 */
		searchFeatureId: "searchPane",
		
		/*
		 * Boolean default state of the display all properties option
		 * @since 3.0.4
		 */
		displayAllPropertiesDefault: false,

		constructor: function(cArgs) {
			this.messages = ecm.messages;
		},

		/**
		 * @private Sets up the relationships with other widgets being used in this widget.
		 */
		postCreate: function() {
			this.inherited(arguments);

			this.searchForm.setTeamspace(this.teamspace);
			if (this.searchTemplate) {
				this.searchTemplate = this.searchTemplate.clone();
				this.searchTemplate.UUID = this.uid;
			}

			//set the state of the search buttons as that of the searchforms search button
			this.searchForm.searchButton.watch("disabled", lang.hitch(this, function(name, oldV, newV) {
				var disabled = newV ? true : false;
				this.searchButton.set("disabled", disabled);
				if (this._searchConfig.isResultsAppendSupported()) {
					this._appendResults.set("disabled", (disabled || !this._appendable));
				}

				if (this.searchTemplate.odViewPrivateSearch && this.searchTemplate.odViewPublicSearch) {
					this._odSaveMenuItem.set("disabled", disabled);
				}
			}));

			this.connect(this.searchForm, "onChange", function() {
				this._setToolbarButtonDisabledState("RefreshGrid", true);
			});
			this.connect(this.searchForm, "onKeyDown", function() {
				this._setToolbarButtonDisabledState("RefreshGrid", true);
			});

			this.connect(this.searchForm, "onSearchCriteriaLoad", function() {
				this._setSearchLabel();

				// Reset the repository in case the search template is configured to search in a repository other than its own
				this._searchConfig = SearchConfiguration.getSearchConfiguration({
					repository: utils.getSearchInRepository(this.searchTemplate)
				});

				// Allow editing only if the user has sufficient privileges and the search was created
				if ((!this.searchTemplate.repository._isP8() || this.searchTemplate.currentVersion) && this.searchTemplate.isNavigatorSavedSearch() && (this.searchTemplate.hasPrivilege("privMajorVersion") || (this.searchTemplate.hasPrivilege("privCheckInOutDoc") && this.searchTemplate.hasPrivilege("privEditProperties")))) {
					domStyle.set(this.editButton.domNode, "display", "");
				}

				if (this._searchConfig.isResultsDisplaySupported() || (this.searchTemplate.isInstanceOf && this.searchTemplate.isInstanceOf(UnifiedSearchTemplate))) {
					this._initializeResultsDisplay();
				}
				this.searchResults.setGridExtensionModules(this._getContentListGridModules());
				this.searchResults.setContentListModules(this._getContentListModules());

				this.connect(this.searchResults, "onModulesLoaded", lang.hitch(this, function() {
					var feature = Desktop.getFeatureById(this.searchFeatureId);
					var config = feature ? feature.configurations : null;
					if (config && config.documentInfoPaneDefaultOpen) {
						var docInfoModule = this.searchResults.getContentListModule("rightPane");
						if (docInfoModule) {
							docInfoModule.setPaneWidth();
							this.searchResults.gridContainer.restore("trailing");
							this.searchResults.gridContainer.onPanelOpen();
						}
					}
				}));

				if (!this._loaded && (this.searchTemplate.isAutoRun() || this.runSearchOnLoad || this.hideSearchCriteria)) {
					var invalidEditor = this.searchForm.validate();
					var isStoredSearch = this.searchTemplate.getContentType() == SearchTemplate.prototype.P8_STORED_SEARCH;
					if (invalidEditor != null && isStoredSearch) {
						this._updateRecentSearches();
						Desktop.addMessage(Message.createErrorMessage("invalid_xt_stored_search_criteria_error", [
							invalidEditor.get("value")
						]));
					} else if (!isStoredSearch && this.hideSearchCriteria && (invalidEditor != null || !this._meetsMinimumCriteria())) {
						// Redisplay the criteria pane
						domClass.remove(this.searchCriteriaPane.domNode, "dijitHidden");
						domClass.remove(this.searchCriteriaPane._splitterWidget.domNode, "dijitHidden");
						domClass.remove(this.searchResultsHeaderArrowNode, "dijitHidden");
						this.searchResultsHeaderTitleNode.tabIndex = 0;
						this.searchResultsHeaderTitleNode.style.cursor = "pointer";
						this.connect(this.searchResultsHeaderTitleNode, "onclick", "_toggleSearchResults");
						this.connect(this.searchResultsHeaderTitleNode, "onkeydown", "_onKeyDownToggleSearchResults");
						this.resize();
						this._updateRecentSearches();
						if (invalidEditor != null && invalidEditor.focus)
							invalidEditor.focus();
					} else {
						this._search(lang.hitch(this, function(results) {
							this._updateRecentSearches();
							if (this.openItemOnLoad && results && results.items && results.items.length == 1) {
								setTimeout(lang.hitch(this, function() {
									this.searchResults._performDefaultActionForRowId(0);
								}), 500);
							}
						}));
					}
				} else {
					this._updateRecentSearches();
				}
				this._setDisplayAllPropsState();

				if (!this._initialized) {
					var repository = this.teamspace || this.searchTemplate.repository;
					if (repository) {
						// Add the search to the list of opened searches
						repository.addOpenedSearch(this.searchTemplate);
					}
					this._initialized = true;
				}

				this.onLoad();
			});

			//set results once search is complete
			this.connect(this.searchForm, "onSearchCompleted", function(resultSet) {
				if (this._appendResults.get("value")) {
					this.searchResults.appendResultSet(resultSet);
				} else {
					this.searchResults.setResultSet(resultSet);
				}

				this.resize();
				this._setToolbarButtonDisabledState("RefreshGrid", false);

				if (this._searchConfig.isResultsAppendSupported()) {
					var resultSet = this.searchResults.getResultSet();
					this._appendable = (resultSet && resultSet.items.length > 0);
					this._appendResults.set("disabled", !this._appendable);
				}
			});

			this.connect(this._class, "saveOptions", this._applySelectedClasses);

			this.connect(this._moreOptions, "saveOptions", function() {
				this.searchForm.getSearchTemplate().moreOptions = this._moreOptions.getSelectedOptions();
			});
			this.connect(this._moreOptions, "onChange", function() {
				this._fitSearchLabel();
				this._setToolbarButtonDisabledState("RefreshGrid", true);
			});

			this.connect(this._propertyOptions, "onChange", function() {
				this._fitSearchLabel();
				this.searchForm.getSearchTemplate().andSearch = this._propertyOptions.getSelectedOptions().matchAll;
				this._setToolbarButtonDisabledState("RefreshGrid", true);
			});

			this.connect(this._resultsDisplayOptions, "hide", lang.hitch(this, function() {
				this._resultsDisplayButton.focus();
			}));

			if (!this.searchForm.showFormButtons) {
				// let searchForm know the search function
				this.searchForm.searchFunction = lang.hitch(this, this._search);
			}
		},

		onLoad: function() {
			this._loaded = true;

			// Set the focus on first load, unless there's a search in progress (the results list will be focused on completion)
			if (!this._focused && !this._searching) {
				this._focused = true;
				this._focusNode(this.searchCriteriaHeaderTitleNode);
			}
		},

		_escapeHTML: function(html) {
			return entities.encode(entities.decode(html));
		},

		_focusNode: function(node) {
			setTimeout(function() {
				focus.focus(node);
			}, 500);
		},

		/**
		 * @private Disables a button on the toolbar.
		 * @param actionId
		 *            A string holding the Id of the toolbar button
		 * @param disabled
		 *            A boolean flag to enable/disable the button
		 */
		_setToolbarButtonDisabledState: function(actionId, disabled) {
			var toolbar = this.searchResults.getContentListModule('toolbar');
			if (toolbar) {
				var button = toolbar.getButton(actionId);
				if (button)
					button.set("disabled", disabled);
			}
		},

		/**
		 * @private Collects grid extension modules used for this widget.
		 * @return An array of modules
		 */
		_getContentListGridModules: function() {
			var array = [];
			//if (this.searchTemplate.repository && !this.searchTemplate.repository._isOnDemand()) {
			//enable drag&drop for CMOD 
			if (this.searchTemplate.repository) {
				array.push(DndRowCopy);
				array.push(DndFromDesktopAddDoc);
			}
			array.push(SingleSort);
			array.push(RowContextMenu);
			return array;
		},

		/**
		 * @private Collects content list modules used for this widget.
		 * @return An array of modules
		 */
		_getContentListModules: function() {
			var modules = [];
			require([
				"ecm/widget/listView/modules/Toolbar2",
				"ecm/widget/listView/modules/Bar",
				"ecm/widget/listView/modules/Breadcrumb",
				"ecm/widget/listView/modules/DocInfo",
				"ecm/widget/listView/modules/ViewDetail",
				"ecm/widget/listView/modules/ViewMagazine",
				"ecm/widget/listView/modules/ViewFilmStrip",
				"ecm/widget/listView/modules/InlineMessage"
			], lang.hitch(this, function(Toolbar, Bar, Breadcrumb, DocInfo, ViewDetail, ViewMagazine, ViewFilmStrip, InlineMessage) {
				var viewModules = [];

				var feature = Desktop.getFeatureById(this.searchFeatureId);
				var config = feature ? feature.configurations : null;
				if (config && config.showViews && config.showViews.length > 0) {
					for (var i = 0; i < config.showViews.length; i++) {
						var viewId = config.showViews[i];
						if (viewId == "detail") {
							viewModules.push(ViewDetail);
						} else if (viewId == "magazine") {
							viewModules.push(ViewMagazine);
						} else if (viewId == "filmstrip") {
							viewModules.push(ViewFilmStrip);
						}
					}
				}
				if (viewModules.length == 0) {
					viewModules.push(ViewDetail);
					viewModules.push(ViewMagazine);
					if (Desktop.showViewFilmstrip)
						viewModules.push(ViewFilmStrip);
				}

				var detailsListView = Desktop.getRequestParam("defaultListView");
				if ((detailsListView == "viewDetail" && array.indexOf(viewModules, ViewDetail) > -1) //
						|| (detailsListView == "viewMagazine" && array.indexOf(viewModules, ViewMagazine) > -1) //
						|| (detailsListView == "viewFilmStrip" && array.indexOf(viewModules, ViewFilmStrip) > -1))
					this.searchResults._viewCurrentName = detailsListView;

				modules.push({
					moduleClass: Bar,
					top: [
						[
							[
								{
									moduleClass: Toolbar
								},
								{
									moduleClasses: viewModules,
									"className": "BarViewModules"
								}
							]
						],
						[
							[
								{
									moduleClass: Breadcrumb,
									rootPrefix: ecm.messages.showing_results + " "
								}
							]
						],
						[
							[
								{
									moduleClass: InlineMessage
								}
							]
						]
					]
				});
				if (this.searchTemplate.repository && !this.searchTemplate.repository._isOnDemand()) {
					// Show the document info pane if it's configured to be shown on the search feature or the search feature is unavailable
					if (!config || config.showDocumentInfoPane) {
						modules.push({
							moduleClass: DocInfo,
							selectAutoOpen: config ? config.documentInfoPaneOpenOnSelection : true, // feature's default is true
							showSystemProps: false
						});
					}
				}
			}));

			return modules;
		},

		/**
		 * @private Updates selected classes to be searched against.
		 */
		_applySelectedClasses: function() {
			var classes = this.searchForm.getSearchTemplate().classes;
			var selectedClasses = this._class.getSelectedOptions();
			for (var i = 0; i < classes.length; i++) {
				if (!classes[i].isHidden())
					classes[i].selected = array.some(selectedClasses, function(selectedItem) {
						return selectedItem.className == classes[i].name;
					});
			}
			this._setToolbarButtonDisabledState("RefreshGrid", true);
		},

		/**
		 * @private Initializes this widget when the container is updated.
		 */
		onTabUpdate: function() {
			//load the the search template in the search form
			if (this.searchForm && this.searchTemplate) {
				if (this.searchForm.getSearchTemplate()) { // search was saved
					this._setSearchLabel();
				} else {
					this._initialize();
				}
			}
		},

		/**
		 * @private Initializes widgets used in the header to display general search criteria defined in the search.
		 */
		_setSearchLabel: function() {
			if (!this.searchTemplate.searchCriteria)
				return; // this should be called again once search criteria are loaded

			var fitNeeded = false;
			var repo = utils.getSearchInRepository(this.searchTemplate);
			var hasPropertyCriteria = this._hasPropertyCriteria();
			if (repo && !repo._isOnDemand() && this.searchTemplate.classDisplayName) {
				fitNeeded = true;
				if (!this._isClassCriteriaHidden())
					domClass.remove(this._class.domNode, "dijitHidden");
				this._class.setSearchTemplate(this.searchTemplate);

				if (!this._isSearchInCriteriaHidden())
					domClass.remove(this._searchIn.domNode, "dijitHidden");
				this._searchIn.setSearchTemplate(this.searchTemplate);

				var folderSearch = this.searchTemplate.objectType == SearchConfiguration.prototype.OBJECT_TYPE.FOLDER;
				var folders = this.searchTemplate.folders;
				var hasVersionOption = !this.searchTemplate.isVersionOptionNone() && (!repo._isP8() || !folderSearch && (!folders || folders.length == 0));
				var hasTextCriteria = this._hasTextCriteria();
				var hasFilters = repo._isP8() || repo._isCM();
				if (hasVersionOption || hasTextCriteria || hasFilters) {
					this._moreOptions.versionOptionHidden = !hasVersionOption;
					this._moreOptions.fileTypeOptionHidden = !hasFilters || folderSearch;
					if (hasTextCriteria) {
						if (repo._isCM()) {
							this._moreOptions.setTextPropertyOptionHidden(false);
						} else if (repo._isP8() && hasPropertyCriteria) {
							this._moreOptions.propertyTextReadOnlyOptionHidden = false;
						}
					}

					domClass.remove(this._moreOptions.domNode, "dijitHidden");
					this._moreOptions.setSelectedOptions(this.searchTemplate.moreOptions);
					this._moreOptions.setRepository(repo);
				}
			}

			var nested = array.some(this.searchTemplate.searchCriteria, "return item.isInstanceOf && item.isInstanceOf(this);", SearchCriteria),
				unified = this.searchTemplate.isInstanceOf && this.searchTemplate.isInstanceOf(UnifiedSearchTemplate);
			if (hasPropertyCriteria && !nested //
					&& (unified && !array.some(this.searchTemplate.searchRepositories, "return item.repository._isBox();") //
					|| (!unified && (!repo._isP8() || this.searchTemplate.isNavigatorSavedSearch())))) {
				fitNeeded = true;
				domClass.remove(this._propertyOptions.domNode, "dijitHidden");
				this._propertyOptions.setSelectedOptions({
					matchAll: this.searchTemplate.andSearch
				});
				this._propertyOptions.setRepository(repo);
			}

			if (unified) {
				fitNeeded = true;
				this._unifiedSearchScope.searchRepositories = this.searchTemplate.searchRepositories;
				domClass.remove(this._unifiedSearchScope.domNode, "dijitHidden");
			}

			if (fitNeeded) {
				this._fitSearchLabel();
				this.resize();
			}
		},

		/**
		 * @private Checks if all of the classes defined in the search are hidden.
		 * @return {Boolean} True if all of the classes defined in the search are hidden
		 */
		_isClassCriteriaHidden: function() {
			var classes = this.searchForm.getSearchTemplate().classes;
			if (!classes || classes.length < 1)
				return false;

			var hidden = true;
			for (var i = 0; i < classes.length; i++) {
				if (!classes[i].isHidden()) {
					hidden = false;
					break;
				}
			}
			return hidden;
		},

		/**
		 * @private Checks if all of the folders defined in the search are hidden.
		 * @return {Boolean} True if all of the folders defined in the search are hidden
		 */
		_isSearchInCriteriaHidden: function() {
			var folders = this.searchForm.getSearchTemplate().folders;
			if (!folders || folders.length < 1)
				return false;

			var hidden = true;
			for (var i = 0; i < folders.length; i++) {
				if (!folders[i].isHidden()) {
					hidden = false;
					break;
				}
			}
			return hidden;
		},

		/**
		 * @private Initializes {@link ecm.widget.search.SearchResultsDisplayOptions} widget used within this widget.
		 */
		_initializeResultsDisplay: function() {
			var className = this.searchTemplate.classDisplayName;
			var resultsDisplay = this.searchTemplate.resultsDisplay;
			if (className) {
				if (!this._resultsDisplayOptions._contentClass) {
					var repository = utils.getSearchInRepository(this.searchTemplate);
					var objType =  this.searchTemplate.objectType;
					var filteredProps = this._searchConfig.getFilteredProperties(this._objectType);
					if (resultsDisplay) {
						// Don't exclude properties in the results display (it's the administrator's responsibility to edit the search
						// and remove the properties that were added to the list of hidden properties in the repository configuration
						// since the search was last saved)
						var props = {};
						array.forEach((resultsDisplay.columns || []).concat((resultsDisplay.magazineColumns || [])), "this[item] = item;", props);
						filteredProps = array.filter(filteredProps, "return !this[item];", props);
					}
					this._resultsDisplayOptions.setRepository(repository);
					var contentClass = this.searchTemplate.getSearchContentClass();
					this._resultsDisplayOptions.setContentClass(contentClass, this.searchTemplate.includeSubclasses, objType, filteredProps);
					this._resultsDisplayOptions.setTextSearchEnabled(this.searchTemplate.isTextSearchCriteriaPresent());
					domClass.remove(this._resultsDisplayButton.domNode, "dijitHidden");
				}
				if (resultsDisplay) {
					if (!this.searchTemplate.isNavigatorSavedSearch()) { // XT search
						// Prepend the name property if not already included
						var nameProperty = this._searchConfig.getNameProperty(this.searchTemplate.objectType);
						if (!resultsDisplay.columns || resultsDisplay.columns.length == 0) {
							resultsDisplay.columns = [
								ecm.model.admin.AdminConfig.PSEUDO_NAME
							];
						} else if (!array.some(resultsDisplay.columns, function(col) {
							return col == nameProperty;
						})) {
							resultsDisplay.columns.splice(0, 0, ecm.model.admin.AdminConfig.PSEUDO_NAME);
						}
					}
					this._resultsDisplayOptions.setResultsDisplay(resultsDisplay);
				} else {
					this._resultsDisplayOptions.setResultsDisplay(this._getResultsDisplayDefaults());
				}
			} else if (this.searchTemplate.isInstanceOf && this.searchTemplate.isInstanceOf(UnifiedSearchTemplate)) {
				this._resultsDisplayOptions.setAttributeDefinitions(this.searchTemplate.getAttributeDefinitions());
				this._resultsDisplayOptions.setResultsDisplay(resultsDisplay);
				this._resultsDisplayOptions.setShowClassProperty(array.some(this.searchTemplate.searchRepositories, "return !item.repository._isOnDemand() && !item.repository._isBox();"));
				domClass.remove(this._resultsDisplayButton.domNode, "dijitHidden");
			}
		},

		/**
		 * Resizes the search criteria pane of this widget.
		 */
		resizeSearchCriteria: function() {
			if (this.searchTemplate)
				this._fitSearchLabel();
			
			var height = domGeometry.getMarginBox(this.searchCriteriaPane.domNode).h - domGeometry.getMarginBox(this.searchCriteriaHeader).h - domGeometry.getMarginBox(this.searchBottomArea).h;
			domGeometry.setMarginBox(this.searchForm.domNode, {
				h: height < 0 ? 0 : height
			});

			this.inherited(arguments);
		},

		/**
		 * @private Opens this widget in a new window. Changes made to this widget will not be carried over.
		 */
		openTabInNewWindow: function() {
			if (this.searchTemplate) {
				var href = window.location.href;
				if (href.search("\\?") == -1) {
					href += "?";
				} else {
					href += "&";
				}

				href += "searchTemplateId=" + this.searchTemplate.id;
				var newWindow = window.open(href);
			}
		},

		/**
		 * @deprecated As of release 2.0.1
		 */
		_clear: function() {
			this.searchForm._clear();
		},

		/**
		 * Runs the search if the criteria is valid.
		 * 
		 * @public
		 */
		_search: function(callback) {
			if (this.searchForm._updatingDependentAttributesField && !this.searchForm._deferredCallback) {
				// Defer searching until dependent attributes are updated
				this.searchForm._deferredCallback = lang.hitch(this, "_search", callback);
				return;
			}
			
			var invalidEditor = this.searchForm.validate();
			if (invalidEditor) {
				if (invalidEditor.focus)
					invalidEditor.focus();
			} else if (this._meetsMinimumCriteria()) {
				if (!this._appendResults.get("value")) {
					if (!this.showEdit)
						this._reset();
					this.searchResults.setResultSet(null);
				}
				if (!this.keepSearchCriteriaExpanded.get("value"))
					this._toggleSearchCriteria();
				if (domClass.contains(this.searchResultsContainer.domNode, "dijitHidden"))
					this._toggleSearchResults();
				
				var runSearch = lang.hitch(this, function() {
					this._searching = true;
					Desktop._onRequestOverrideStatusDialogRefocus(false);
					this.searchForm._search(lang.hitch(this, function(results) {
						this._searching = false;
						if (this.searchResults.grid) {
							setTimeout(lang.hitch(this, function() {
								this.searchResults.grid.focus.focusArea("body", true);
								Desktop._onRequestRevertStatusDialogRefocus();
							}), 750);
						} else {
							Desktop._onRequestRevertStatusDialogRefocus();
						}
						if (lang.isFunction(callback))
							callback(results);
					}), null, null, null, function() {
						Desktop._onRequestRevertStatusDialogRefocus();
					});
				});
				if (this._searchConfig.isResultsDisplaySupported() || (this.searchTemplate.isInstanceOf && this.searchTemplate.isInstanceOf(UnifiedSearchTemplate))) {
					if (this._displayAllProps.get("value")) {
						this._getAllPropertiesResultsDisplay(lang.hitch(this, function(resultsDisplay) {
							this.searchForm.getSearchTemplate().resultsDisplay = resultsDisplay;
							runSearch();
						}));
					} else {
						var searchDisplay = this.searchForm._searchTemplateBackup.resultsDisplay;
						var resultsDisplay = this._resultsDisplayOptions.processSearchResultsDisplay(searchDisplay, this.searchForm.isTextSearchCriteriaDefined());
						this.searchForm.getSearchTemplate().resultsDisplay = resultsDisplay;
						runSearch();
					}
				}
				else {
					runSearch();
				}
			}
		},

		/**
		 * Returns true if the search meets the the minimum criteria requirements to run. This method is responsible for prompting the user for
		 * additional criteria before returning false. For example, <code>this._showMessage(this.messages.search_insufficient_input);</code>.
		 * 
		 * @returns true if the search meets the the minimum criteria requirements to run
		 * @public
		 */
		_meetsMinimumCriteria: function() {
			var minCriteriaMet = false;
			var criteria = utils.flattenCriteria(this.searchTemplate.searchCriteria);
			if (this.searchTemplate.isInstanceOf && this.searchTemplate.isInstanceOf(UnifiedSearchTemplate)) {
				// Verify that every repository has at least one value in the criteria
				var textCriteriaRepositories = {};
				var textCriteria = this.searchForm._createTextSearchCriteria();
				var textCriteriaRequired = false;
				var requiredMappings = [];
				array.forEach(this.searchTemplate.searchRepositories, function(searchRepository) {
					if (searchRepository.textSearchEnabled)
						textCriteriaRepositories[searchRepository.id] = textCriteria && textCriteria.text;
				});
				if (criteria && criteria.length) {
					var criteriaRepositories = utils.findCriteriaRepositories(criteria, this.searchTemplate.attributeMappings);
					if (textCriteria && !textCriteria.text) {
						for ( var id in textCriteriaRepositories) {
							if (!(id in criteriaRepositories)) {
								textCriteriaRequired = true;
								break;
							}
						}
					}
					for ( var id in criteriaRepositories) {
						var mapping = criteriaRepositories[id];
						if (!textCriteriaRepositories[id] && mapping !== null && array.indexOf(requiredMappings, mapping) < 0) // doesn't meet minimum criteria
							requiredMappings.push(mapping);
					}
				} else if (textCriteria) {
					textCriteriaRequired = !textCriteria.text;
				}
				requiredMappings = array.map(requiredMappings, function() {
					return mapping.name;
				});
				if (textCriteriaRequired && requiredMappings.length > 0) {
					this._showMessage(string.substitute(this.messages.unified_search_runtime_insufficient_criteria_text_and_properties, [
						"<ul><li>" + requiredMappings.join("</li><li>") + "</li></ul>"
					]));
				} else if (textCriteriaRequired) {
					this._showMessage(this.messages.unified_search_runtime_insufficient_criteria_text);
				} else if (requiredMappings.length > 0) {
					if (textCriteria && !textCriteria.text) {
						this._showMessage(string.substitute(this.messages.unified_search_runtime_insufficient_criteria_text_or_properties, [
							"<ul><li>" + requiredMappings.join("</li><li>") + "</li></ul>"
						]));
					} else {
						this._showMessage(string.substitute(this.messages.unified_search_runtime_insufficient_criteria_property, [
							"<ul><li>" + requiredMappings.join("</li><li>") + "</li></ul>"
						]));
					}
				} else {
					minCriteriaMet = true;
				}
			} else {
				var macros = this._moreOptions.getSelectedOptions().macros;
				if (macros) {
					if (macros.fileTypes && macros.fileTypes.length)
						minCriteriaMet = true;
					if (macros.userActions && (macros.userActions[0].action.indexOf("checkedOut") == 0 || macros.userActions[0].users.length || macros.userActions[0].dates.length))
						minCriteriaMet = true;
				}
				if (!minCriteriaMet) {
					var repository = this.searchTemplate.repository;
					var classId = this.searchTemplate.className;

					// Note: OD requires minimum criteria to run any search, so we always check
					if (repository._isOnDemand() || classId == "$common" || ((classId == "Document" || classId == "Folder") && this.searchTemplate.includeSubclasses)) {
						var hasTextCriteria = this.searchForm.isTextSearchCriteriaDefined();
						var hasAttribCriteria = array.some(criteria, function(criterion) {
							return utils.meetsMinimumCriteria(criterion);
						});
						minCriteriaMet = hasTextCriteria || hasAttribCriteria;
					} else { // subclass selected
						minCriteriaMet = true;
					}
				}
				if (!minCriteriaMet)
					this._showMessage(this.messages.search_insufficient_input);
			}

			return minCriteriaMet;
		},

		/**
		 * Resets this widget with defaults.
		 */
		_reset: function() {
			if (this.searchForm._updatingDependentAttributesField && !this.searchForm._deferredCallback) {
				// Defer resetting until dependent attributes are updated
				this.searchForm._deferredCallback = lang.hitch(this, "_reset");
				return;
			}
			
			this._setToolbarButtonDisabledState("RefreshGrid", true);

			var searchTemplate = this._searchTemplateOrig ? this._searchTemplateOrig.clone() : this.searchForm._searchTemplateBackup;
			if (this.searchTemplate.repository._isOnDemand()) {
				// Retain the list of saved searches
				searchTemplate.odSavedSearches = this.searchTemplate.odSavedSearches;
			}

			this.setSearchTemplate(searchTemplate);
			this._class.setSearchTemplate(searchTemplate, true);
			this._moreOptions.setSelectedOptions(searchTemplate.moreOptions);
			this._propertyOptions.setSelectedOptions({
				matchAll: searchTemplate.andSearch
			});

			if (!this._searchConfig.isResultsAppendSupported()) {
				this._appendable = false;
				this._appendResults.set("disabled", true);
			}
		},

		/**
		 * @private Opens a {@link ecm.widget.search.SearchBuilder} widget containing the search of this widget in a new
		 *          tab.
		 */
		_edit: function() {
			var searchTemplate = this.searchForm._searchTemplateBackup.clone();
			searchTemplate.UUID = searchTemplate.generateUUID();
			this.parentPane.openSearch(searchTemplate.isInstanceOf && searchTemplate.isInstanceOf(UnifiedSearchTemplate) ? "unifiedsearchbuilder" : "searchbuilder", searchTemplate.repository, searchTemplate.generateUUID(), searchTemplate, this.teamspace);
		},

		/**
		 * @deprecated As of release 2.0.1
		 */
		_setDisplay: function(wid, show) {
			var node = wid.domNode || wid;
			if (show) {
				domClass.remove(node, "dijitHidden");
			} else {
				domClass.remove(node, "dijitHidden");
			}
		},

		/**
		 * @private Sets a search to this widget and initializes this widget.
		 * @param searchTemplate
		 *            A {@link ecm.model.SearchTemplate} object to be set
		 * @param reload
		 *            A boolean flag to reload search criteria of the search being set
		 */
		setSearchTemplate: function(searchTemplate, reload) {
			this.searchTemplate = searchTemplate;
			if (reload) {
				this._loaded = false;
				this.searchTemplate.searchCriteria = null;
			}
			this._initialize();
		},

		/**
		 * @private Gets the search used in this widget.
		 * @return {@link ecm.model.SearchTemplate}
		 */
		getSearchTemplate: function() {
			return this.searchTemplate;
		},

		/**
		 * @private Initializes this widget. Adds the current search to the opened searches list and removes when this
		 *          widget is closed.
		 */
		_initialize: function() {
			if (!this._loaded) {
				// Hide the criteria pane for P8 stored searches
				if (this.searchTemplate.getContentType() == SearchTemplate.prototype.P8_STORED_SEARCH || this.hideSearchCriteria) {
					domClass.add(this.searchCriteriaPane.domNode, "dijitHidden");
					domClass.add(this.searchCriteriaPane._splitterWidget.domNode, "dijitHidden");
					domClass.add(this.searchResultsHeaderArrowNode, "dijitHidden");
					this.searchResultsHeaderTitleNode.tabIndex = -1;
					this.searchResultsHeaderTitleNode.style.cursor = "default";
				} else {
					this.connect(this.searchResultsHeaderTitleNode, "onclick", "_toggleSearchResults");
					this.connect(this.searchResultsHeaderTitleNode, "onkeydown", "_onKeyDownToggleSearchResults");
				}
			}

			this._searchConfig = SearchConfiguration.getSearchConfiguration({
				repository: utils.getSearchInRepository(this.searchTemplate)
			});

			if (!this.searchTemplate.repository._isOnDemand()) { //&& this.showDocumentInfoPane) {
				//this._createDocInfoPanels(false);
				//this.itemPropPane.domNode.appendChild(this._itemProperties.domNode);
				//this._doItemPropertiesConnectionsBC(this.searchResultsContainer, "right", this.searchResults, false);
				//this._hidePropertiesPane(this.itemPropPane, this.searchResultsContainer, this.searchResults);
			} else {
				//this.searchResultsContainer.removeChild(this.itemPropPane);
				this.saveQueryDropDownButton.domNode.style.display = "inline";
				this.searchTemplate.retrieveODSavedQueries(lang.hitch(this, function(odSavedQueries) {
					this._enableODSavedQueryButton(odSavedQueries);
				}));
			}

			if (this._searchConfig.isResultsAppendSupported()) {
				domStyle.set(this._appendResults.domNode, "display", "");
				domStyle.set(this._appendResultsLabel, "display", "");
				this._appendable = true;
				this._appendResults.set("disabled", false);
			} else {
				domStyle.set(this._appendResults.domNode, "display", "none");
				domStyle.set(this._appendResultsLabel, "display", "none");
				this._appendable = false;
				this._appendResults.set("disabled", false);
			}

			this.connect(this, "onClose", function(container, page) {
				var repository = this.teamspace || this.searchTemplate.repository;
				if (repository) {
					// Remove the search from the list of opened searches
					repository.removeOpenedSearch(this.searchTemplate);
				}
			});

			if (!this._initialized) {
				// Nullify the criteria so the latest is retrieved
				this.searchTemplate.searchCriteria = null;
			}
			this.searchForm.setSearchTemplate(this.searchTemplate, this.version);
		},

		/**
		 * @deprecated As of release 2.0.1
		 */
		resetPanes: function() {
			if (!domClass.contains(this._searchResultsNode, "dijitHidden")) {
				this._toggleSearchResults();
			}
			if (domClass.contains(this._searchCriteriaNode, "dijitHidden")) {
				this._toggleSearchCriteria();
			}
			this.searchResults.setResultSet(null);
		},

		/**
		 * @private Resizes the summary of the general search criteria displayed on the header.
		 */
		_fitSearchLabel: function() {
			var headerWidth = domGeometry.getContentBox(this.searchCriteriaHeaderContentNode).w;

			var width = headerWidth - domGeometry.getMarginBox(this.imageToggleNode).w - domGeometry.getMarginBox(this.titleToggleNode).w;
			var classWidth = domGeometry.getMarginBox(this._class.domNode).w;
			var searchInWidth = domGeometry.getMarginBox(this._searchIn.domNode).w;
			var moreOptionsWidth = domGeometry.getMarginBox(this._moreOptions.domNode).w;
			var propertyOptionsWidth = domGeometry.getMarginBox(this._propertyOptions.domNode).w;
			var usdWidth = domGeometry.getMarginBox(this._unifiedSearchScope.domNode).w;
			var totalWidth = classWidth + searchInWidth + moreOptionsWidth + propertyOptionsWidth + usdWidth;

			classWidth = Math.floor(width * (classWidth / totalWidth));
			searchInWidth = Math.floor(width * (searchInWidth / totalWidth));
			moreOptionsWidth = Math.floor(width * (moreOptionsWidth / totalWidth));
			propertyOptionsWidth = Math.floor(width * (propertyOptionsWidth / totalWidth));

			var minWidth = domGeometry.getMarginBox(this._class._optionsLink.focusNode).w;
			this._class.summarize(classWidth > minWidth ? classWidth : minWidth);
			minWidth = domGeometry.getMarginBox(this._searchIn._optionsLink.focusNode).w;
			this._searchIn.summarize(searchInWidth > minWidth ? searchInWidth : minWidth);
			if (!domClass.contains(this._moreOptions.domNode, "dijitHidden")) {
				minWidth = domGeometry.getMarginBox(this._moreOptions._optionsLink.focusNode).w;
				this._moreOptions.summarize(moreOptionsWidth > minWidth ? moreOptionsWidth : minWidth);
			}
			if (!domClass.contains(this._propertyOptions.domNode, "dijitHidden")) {
				minWidth = domGeometry.getMarginBox(this._propertyOptions._optionsLink.focusNode).w;
				this._propertyOptions.summarize(propertyOptionsWidth > minWidth ? propertyOptionsWidth : minWidth);
			}

			if (usdWidth) {
				// set the width of searchCriteriaDetailsLeading so that both elements fit on the search title
				usdWidth += 5; // a bit extra spacing
				domStyle.set(this.searchCriteriaDetailsLeading, "width", "calc(100% - " + usdWidth + "px)");
			} else {
				// The searchCriteriaHeaderTitleNode does not contain a width
				// This causes its contents to overflow
				// Giving the DIV a width makes it possible to collapse its content
				domStyle.set(this.searchCriteriaHeaderTitleNode, "width", headerWidth + "px");
			}
		},

		/**
		 * @private Enables the save query button used for CMOD folders.
		 * @param odSavedQueries
		 *            An array of {@link ecm.model.ODSavedSearch} objects to be created as menu
		 */
		_enableODSavedQueryButton: function(odSavedQueries) {
			var self = this;

			if (this.searchTemplate.odViewSavedSearch) {
				this.saveQueryDropDownButton.set("disabled", false);

				if (!this._searchTemplateOrig) {
					this._searchTemplateOrig = this.searchTemplate.clone();
				}

				var isDisabled = false;
				if (!this.searchTemplate.odViewPrivateSearch && !this.searchTemplate.odViewPublicSearch)
					isDisabled = true;
				var addSeparator = true;

				if (this._odSaveMenuItem) {
					this._odSaveMenuItem.set("dislabed", isDisabled);
					addSeparator = false;
				} else {
					this._odSaveMenuItem = new MenuItem({
						label: this.messages.save,
						disabled: isDisabled,
						onClick: function() {
							self._onSave();
						}
					});
					this.savedQueryDropDownButtonMenu.addChild(this._odSaveMenuItem);
				}

				if (this._odDeleteMenuItem) {
					this._odDeleteMenuItem.set("dislabed", isDisabled);
					addSeparator = false;
				} else {
					this._odDeleteMenuItem = new MenuItem({
						label: this.messages.delete_save_searches,
						disabled: isDisabled,
						onClick: function() {
							self._onDeleteSaveSearch();
						}
					});
					this.savedQueryDropDownButtonMenu.addChild(this._odDeleteMenuItem);
				}

				if (addSeparator)
					this.savedQueryDropDownButtonMenu.addChild(new MenuSeparator());

				// Create a menu for OD saved searches
				this._createODSavedQueriesMenu(odSavedQueries);
			}
		},

		/**
		 * @private Creates the saved queries menu for a CMOD folder.
		 * @param odSavedQueries
		 *            An array of {@link ecm.model.ODSavedSearch} objects to be created as menu
		 */
		_createODSavedQueriesMenu: function(odSavedQueries) {
			var self = this;
			if (this._odSavedQueriesMenu) {
				this.savedQueryDropDownButtonMenu.removeChild(this.allSavedQueriesPopupMenu);
				this.allSavedQueriesPopupMenu.destroy();
				this._odSavedQueriesMenu.destroy();
			}
			this._searchTemplateOrig._odSavedSearches = lang.clone(odSavedQueries);

			if (odSavedQueries && odSavedQueries.length > 0) {
				this._odSavedQueriesMenu = new Menu();

				array.forEach(odSavedQueries, function(odSavedQuery) {
					self._odSavedQueriesMenu.addChild(new MenuItem({
						label: self._escapeHTML(odSavedQuery),
						onClick: function() {
							self._loadODSavedQuery(odSavedQuery);
						}
					}));
				});

				this.allSavedQueriesPopupMenu = new PopupMenuItem({
					label: this.messages.all,
					popup: this._odSavedQueriesMenu
				});

				this.savedQueryDropDownButtonMenu.addChild(this.allSavedQueriesPopupMenu);

				// Enable delete if the user has permission to delete
				if (this.searchTemplate.odViewPrivateSearch || this.searchTemplate.odViewPublicSearch)
					this._odDeleteMenuItem.set("disabled", false);

			} else { // disable the delete menu item
				this._odDeleteMenuItem.set("disabled", true);
			}
		},

		/**
		 * @private Displays a dialog to save the current search criteria of a CMOD folder.
		 */
		_onSave: function() {
			this.logEntry("_onSave");

			var self = this;
			var dialog = new ODSaveSearchDialog({
				callback: function(params) {
					self._saveODSearch(params);
				},
				searchTemplate: this.searchTemplate
			});
			dialog.show();

			this.logExit("_onSave");
		},

		/**
		 * @private Displays a dialog to delete saved queries of a CMOD folder.
		 */
		_onDeleteSaveSearch: function(odSavedQueries) {
			this.logEntry("_onDeleteSaveSearch");

			var self = this;
			var dialog = new ODManageSaveSearchDialog({
				callback: function(params) {
					self._deleteODSearch(params);
				},
				searchTemplate: this.searchTemplate
			});
			dialog.show();

			this.logExit("_onDeleteSaveSearch");
		},

		/**
		 * @private Loads a saved query of a CMOD folder.
		 * @param queryName
		 *            A string holding the name of the saved query to be loaded
		 */
		_loadODSavedQuery: function(queryName) {
			this.logEntry("_reloadSearchTemplate");

			this.searchTemplate.retrieveODSavedQuery(queryName, lang.hitch(this, function(savedQuery) {
				var searchTemplate = this.searchTemplate.clone();
				searchTemplate.setCritieraToODSavedQuery(savedQuery);
				this.setSearchTemplate(searchTemplate);
				this._moreOptions.setSelectedOptions(searchTemplate.moreOptions);
			}));

			this.logExit("_reloadSearchTemplate");
		},

		/**
		 * @private Saves the current search criteria of a CMOD folder.
		 * @param params
		 *            Parameters indicating the name of the saved query and whether it's public or not
		 */
		_saveODSearch: function(params) {
			this.logEntry("_saveODSearch");

			if (params) {
				var self = this;

				var isPublic = false;
				if (params.isPublic == "on")
					isPublic = true;

				this.searchTemplate.saveODQuery(params.name, isPublic, function(queryName) {
					self.searchTemplate.retrieveODSavedQueries(function(odSavedSearches) {
						self._createODSavedQueriesMenu(odSavedSearches);
					});
				});
			}

			this.logExit("_saveODSearch");
		},

		/**
		 * @private Deletes selected saved queries of a CMOD folder.
		 * @param params
		 *            Parameters containing saved queries to be deleted
		 */
		_deleteODSearch: function(params) {
			this.logEntry("_deleteODSearch");

			if (params) {
				var self = this;

				if (params) {
					this.searchTemplate.deleteODQueries(params.searchesToDelete, function() {
						self.searchTemplate.retrieveODSavedQueries(function(odSavedSearches) {
							self._createODSavedQueriesMenu(odSavedSearches);
						});
					});
				}
			}

			this.logExit("_deleteODSearch");
		},

		/**
		 * @private Checks if current searh contains at least one text based search criterion.
		 * @return {Boolean} True if current searh contains at least one text based search criterion.
		 */
		_hasTextCriteria: function() {
			var textCriteria = this.searchTemplate.textSearchCriteria;
			if (!(textCriteria instanceof Array) || !textCriteria.length) {
				return false;
			}

			return array.some(textCriteria, function(criterion) {
				return criterion.editProperty != SearchCriterion.prototype.EDIT_PROPERTY.HIDDEN;
			});
		},

		/**
		 * @private Checks if current search criteria contains at least one property based search criterion.
		 * @return {Boolean} True if current search criteria contains at least one property based search criterion.
		 */
		_hasPropertyCriteria: function() {
			var propertyCriteria = utils.flattenCriteria(this.searchTemplate.searchCriteria);
			if (!(propertyCriteria instanceof Array) || !propertyCriteria.length) {
				return false;
			}

			return array.some(propertyCriteria, function(criterion) {
				return !criterion.hidden;
			});
		},

		/**
		 * @private Displays the dialog to define search results display options.
		 */
		_showResultsDisplayOptions: function() {
			this._resultsDisplayOptions.show();
		},

		/**
		 * Displays the given message in a modal dialog.
		 * 
		 * @param message The message to be displayed
		 * @public
		 */
		_showMessage: function(message) {
			if (!this._messageDialog)
				this._messageDialog = new MessageDialog();
			this._messageDialog.showMessage(message);
		},

		_updateRecentSearches: function() {
			var repository = this.searchTemplate.repository;
			if (repository && (!repository._isP8() || !this.version || this.version == "released"))
				(this.teamspace || repository).addRecentSearch(this.searchTemplate);
		},
		
		// Hide the display all props option if the "all" class is selected or if it is a multi class search
		_setDisplayAllPropsState: function() {
			if (!this._initialized) {
				var repository = this.searchTemplate.repository;
				var hide = ((!repository._isCM() && !repository._isP8()) ||  
					(repository._isCM() && this.searchTemplate.className == "$common") || 
					(repository._isP8() && this.searchTemplate.includeSubclasses) ||
					(this.searchTemplate.classes != null && this.searchTemplate.classes.length > 1));

				if (!hide) {
					domClass.remove(this._displayAllPropsArea, "dijitHidden");
					this._displayAllProps.set("value", this.displayAllPropertiesDefault);
				}
			}
		},

		_dispAllPropsClick: function() {
			this._resultsDisplayButton.set("disabled", this._displayAllProps.get("value") != false);
		},
		
		// user checked "display all props", return a search result display that has the default search results with all the available properties
		// in the columns
		// remove the name property
		_getAllPropertiesResultsDisplay: function(callback) {
			var resultsDisplay = this._getResultsDisplayDefaults();
			if (this._resultsDisplayOptions._getShowChildComponentAttribute()) {
				resultsDisplay.showChildComponentAttribute = true;
			}
			// get all available properties from the searchresultsdisplayoptions widget
			this._resultsDisplayOptions._getAvailableProperties(true, lang.hitch(this, function(availProps) {
				var cols = resultsDisplay.columns.slice();
				array.forEach(availProps, function(entry, index) {
					if (!array.some(resultsDisplay.columns, function(item) {
						return item == entry;
					})) {
						cols.push(entry);
					}
				}, this);
				resultsDisplay.columns = cols;
				if (callback)
					callback(resultsDisplay);	
			}));			
		},
		
		_getResultsDisplayDefaults: function() {
			if (this.searchTemplate.isInstanceOf && this.searchTemplate.isInstanceOf(UnifiedSearchTemplate)) {
				// CRS use the search criteria for the default cols
				var defaultColumns = [];
				// need to get the attrib. defs, put them in a map for easy lookup:
				var attribMap = {};
				array.forEach(this.searchTemplate.getAttributeDefinitions(), function(attr) {
					attribMap[attr.id] = attr;
				});
				
				array.forEach(this.searchTemplate.searchCriteria, function(w) {
					var attr = attribMap[w.id]; 
					if (attr != null && !attr._unviewable && array.indexOf(defaultColumns, w.id) < 0)
						defaultColumns.push(w.id);
				});
				return {
					"sortBy": null,
					"sortAsc": true,
					"columns": defaultColumns,
				}	
			} else {
				return {
					"sortBy": ecm.model.admin.AdminConfig.PSEUDO_NAME,
					"sortAsc": true,
					"columns": lang.clone(this._searchConfig.getSearchDefaultColumns(this.searchTemplate.objectType)),
					"magazineColumns": lang.clone(this._searchConfig.getSearchMagazineDefaultColumns(this.searchTemplate.objectType))
				}	
			}
		},
		
		/**
		 * @private Destroys this widget and its contained widgets.
		 */
		destroy: function() {
			if (this._resultsDisplayOptions)
				this._resultsDisplayOptions.destroy();
			if (this.savedQueryDropDownButtonMenu)
				this.savedQueryDropDownButtonMenu.destroy();

			if (this._messageDialog) {
				this._messageDialog.destroy();
				delete this._messageDialog;
			}

			this.inherited(arguments);
		}
	});

});
