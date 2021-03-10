package com.malam.ecm.action;

import java.util.Locale;
import java.util.ResourceBundle;

import com.ibm.ecm.extension.PluginAction;
import com.ibm.json.java.JSONObject;


public class RightClickDocFromTemplateAction extends PluginAction {


	public String getId() {
		return "RightClickDocFromTemplateAction";
	}

	public String getName(Locale locale) {
		ResourceBundle resource = ResourceBundle.getBundle("com.malam.ecm.nls.uetMessages", locale);
		return resource.getString("action.createDocByTemplate");
	}


	public String getIcon() {
		return "";
	}
<<<<<<< HEAD
	
=======

>>>>>>> 5e3738dd8634e6f7ef58343f82508a146598d2ce
	public String getIconClass() {
		return "";
	}


	public String getPrivilege() {
		return "";
	}


	public boolean isMultiDoc() {
		return false;
	}


	public boolean isGlobal() {
		return true;
	}

<<<<<<< HEAD
	
=======

>>>>>>> 5e3738dd8634e6f7ef58343f82508a146598d2ce
	public String getActionFunction() {
		return "";
	}


	public String getServerTypes() {
		return "p8";
	}

<<<<<<< HEAD
		public String[] getMenuTypes() {
=======
	public String[] getMenuTypes() {
>>>>>>> 5e3738dd8634e6f7ef58343f82508a146598d2ce
		return new String[0];
	}


	public JSONObject getAdditionalConfiguration(Locale locale) {
		return new JSONObject();
	}


	public String getActionModelClass() {
		return "newDocByTemplateDojo.action.RightClickDocFromTemplateAction";
	}
}
