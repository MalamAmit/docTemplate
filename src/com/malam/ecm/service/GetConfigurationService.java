package com.malam.ecm.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ibm.ecm.extension.PluginService;
import com.ibm.ecm.extension.PluginServiceCallbacks;

import java.io.PrintWriter;


public class GetConfigurationService extends PluginService {


    public String getId() {
        return "GetConfigurationService";
    }


    public String getOverriddenService() {
        return null;
    }

        public void execute(PluginServiceCallbacks callbacks,
                        HttpServletRequest request, HttpServletResponse response) throws Exception {
        String configuration = callbacks.loadConfiguration();
        PrintWriter responseWriter = response.getWriter();
        try {
            responseWriter.print(configuration);
            responseWriter.flush();
        } finally {
            responseWriter.close();
        }
    }
}
