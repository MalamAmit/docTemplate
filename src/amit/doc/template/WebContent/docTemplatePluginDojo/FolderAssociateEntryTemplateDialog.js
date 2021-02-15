define([
	    "dojo/_base/declare",
	    "dojo/_base/lang",
	    "dojo/_base/array",
	    "dojo/aspect",
		"dojo/store/Memory",
		"ecm/widget/dialog/BaseDialog",
		"ecm/widget/ContentClassSelector",

		"dojo/text!./templates/FolderAssociateEntryTemplateDialog.html"
	],
	function(declare, lang, array, aspect, MemoryStore,
			 BaseDialog, ContentClassSelector, template) {

		return declare("docTemplatePluginDojo.FolderAssociateEntryTemplateDialog", [
			BaseDialog
		], {
		
		contentString: template,
		widgetsInTemplate: true,
		_editData: null,

		postCreate: function() {
			this.repository = ecm.model.desktop.getRepositoryByName("OS1");
			this.folderClassField.setRepository(this.repository);
			this.folderClassField.setRootClassId("Folder");
			this.folderClassField.setVisibleOnlyForFolder(true);

			var cb = lang.hitch(this, function(entryTemplates, cn1, cn2) {
				var items = [];

				array.forEach(entryTemplates, function(ent) {
					items.push({
						id: ent.vsId,
						name: ent.name,
						className: ent.addClassName,
						vsId: ent.vsId,
						entId: ent.id
					})
				}, this);

			});

			this.repository.retrieveEntryTemplates(cb, "Folder");


			this.inherited(arguments);
			this.setResizable(false);
			this.setMaximized(false);
			this.setExpandable(false);
			this.setTitle("title");

			this.okButton = this.addButton("OK", "saveAssociate", true, true);
	
			aspect.after(this.folderClassField, "onContentClassSelected", lang.hitch(this, function(contentClass) {
				this._onFieldChange();
			}), true);
			

			try {
				var desktopRepositories = ecm.model.desktop.repositories != null && ecm.model.desktop.repositories.length > 0;
				var items = [];
				if (desktopRepositories) {
					for (var i = 0; i < ecm.model.desktop.repositories.length; i++) {
						var rep = ecm.model.desktop.repositories[i];
						console.log("desktopRepositories: " + rep)
						items.push({
							"id": rep.id,
							"label": rep.name
						});
					}
				}
				
				this.repositoryField.set("store", new MemoryStore({
					data: items
				}));
				
													
			} catch (e) {
				alert("Failed to load : " + e.message);
			}

		},
		
		show: function(editData) {
			this.okButton.set("disabled", true);
			this._editData = editData;
			this._loadData();
			this.inherited(arguments);
		},

		_isEdit: function() {
			return this._editData != null && this._editData;
		},


		_loadData: function() {
			this.repositoryField.set("value", "");
			this.folderClassField.set("value", "");

			if (this._editData) {
				if (this._editData.repositoryId)
					this.repositoryField.set("value", this._editData.repositoryId);
				
				setTimeout(lang.hitch(this, function() {
					if (this._editData.folderClassName)
						this.folderClassField.setSelected(this._editData.folderClassName);
					this._onFieldChange();
				}, 200));			
			}			
		},

		repositoryChange: function(repositoryName) {
			this.repository = ecm.model.desktop.getRepositoryByName(repositoryName);
			 
			this.folderClassField.setRepository(this.repository);
			this.folderClassField.setRootClassId("Folder");
			this.folderClassField.setVisibleOnlyForFolder(true);
	
			var cb = lang.hitch(this, function(entryTemplates, cn1, cn2) {
				var items = [];
	
				array.forEach(entryTemplates, function(ent) {
					items.push({
						id: ent.vsId,
				        name: ent.name,
						className: ent.addClassName,
						vsId: ent.vsId,
						entId: ent.id
				    })
		        }, this);

			});
				
			this.repository.retrieveEntryTemplates(cb, "Folder");
		},
		
		_onFieldChange: function() {
			this.okButton.set('disabled', !this._validateData()); // Disable ok button if not valid
		},

		_validateData: function() {
			var value = this.folderClassField.selectedContentClass;
			if (value == null || value.id == null || value.id == "")
				return false;

			return true;
		},
		
		saveAssociate: function() {
			if (this._validateData()) {
				var screenData = {};
			
				screenData.repositoryId = this.repositoryField.get("value");
				screenData.folderClassName = this.folderClassField.selectedContentClass.id;

				if (this._isEdit()) {
					this.onEdit(screenData, this._editData);
				} else {
					this.onAdd(screenData);
				}
				this.onCancel();
			}	
		},
		
		// override to get data entered on the screen
		onEdit: function(screenData, originalData) {
		},

		// override to get data entered on the screen
		onAdd: function(screenData) {
		}
		
	});
});
