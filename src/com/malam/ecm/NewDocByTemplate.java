package com.malam.ecm;

import java.util.Locale;
import com.ibm.ecm.extension.Plugin;
import com.ibm.ecm.extension.PluginAction;
import com.ibm.ecm.extension.PluginService;
import com.malam.ecm.action.RightClickDocFromTemplateAction;
import com.malam.ecm.service.GetConfigurationService;
/*
import javax.servlet.http.HttpServletRequest;

import com.ibm.ecm.extension.Plugin;
import com.ibm.ecm.extension.PluginAction;
import com.ibm.ecm.extension.PluginFeature;
import com.ibm.ecm.extension.PluginLayout;
import com.ibm.ecm.extension.PluginMenu;
import com.ibm.ecm.extension.PluginMenuType;
import com.ibm.ecm.extension.PluginODAuthenticationService;
import com.ibm.ecm.extension.PluginOpenAction;
import com.ibm.ecm.extension.PluginRequestFilter;
import com.ibm.ecm.extension.PluginResponseFilter;
import com.ibm.ecm.extension.PluginService;
import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.ibm.ecm.extension.PluginViewerDef;
import com.ibm.ecm.extension.PluginRepositoryType;
import com.ibm.ecm.extension.PluginAPI;
import com.malam.ecm.action.RightClickDocFromTemplateAction;
import com.malam.ecm.service.GetConfigurationService;
*/

public class NewDocByTemplate extends Plugin {

	private PluginAction[] pluginActions = new PluginAction[0];
	//private PluginOpenAction[]  pluginOpenActions = new PluginOpenAction[0];
	//private PluginRequestFilter[] pluginRequestFilters = new PluginRequestFilter[0];
	//private PluginResponseFilter[] pluginResponseFilters = new PluginResponseFilter[0];
	private PluginService[] pluginServices = new PluginService[0];
	//private PluginODAuthenticationService odAuthenticationService = null;
	//private PluginViewerDef[] pluginViewerDefs = new PluginViewerDef[0];
	//private PluginLayout[] pluginLayouts = new PluginLayout[0];
	//private PluginFeature[] pluginFeatures = new PluginFeature[0];
	//private PluginMenuType[] pluginMenuTypes = new PluginMenuType[0];
//private PluginMenu[] pluginMenus = new PluginMenu[0];
	//private PluginRepositoryType[] pluginRepositoryTypes = new PluginRepositoryType[0];
	//private PluginAPI[] pluginAPIs = new PluginAPI[0];


	public String getId() {
		return "NewDocByTemplate";
	}


	public String getName(Locale locale) {
		return "New Doc By Template";
	}


	public String getVersion() {
		return "3.0.8";
	}


	public String getCopyright() {
		return "Optionally add a Copyright statement here";
	}


	public String getScript() {
		return "NewDocByTemplate.js";
	}


	public String getDebugScript() {
		return getScript();
	}


	public String getDojoModule() {
		return "newDocByTemplateDojo";
	}

	public String getCSSFileName() {
		return "NewDocByTemplate.css";
	}


	public String getDebugCSSFileName() {
		return getCSSFileName();
	}
		

	public String getConfigurationDijitClass() {
		return "newDocByTemplateDojo.ConfigurationPane";
	}

	public PluginService[] getServices() {
		if (pluginServices.length == 0) {
			pluginServices = new PluginService[] {new GetConfigurationService()};
		}
		return pluginServices;
	}


	public PluginAction[] getActions() {
		if (pluginActions.length == 0) {
			pluginActions = new PluginAction[] {
					new RightClickDocFromTemplateAction()};
		}
		return pluginActions;
	}
}
