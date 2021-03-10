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


	public String getActionFunction() {
		return "";
	}


	public String getServerTypes() {
		return "p8";
	}

	public String[] getMenuTypes() {
		return new String[0];
	}


	public JSONObject getAdditionalConfiguration(Locale locale) {
		return new JSONObject();
	}


	public String getActionModelClass() {
		return "newDocByTemplateDojo.action.RightClickDocFromTemplateAction";
	}
}
