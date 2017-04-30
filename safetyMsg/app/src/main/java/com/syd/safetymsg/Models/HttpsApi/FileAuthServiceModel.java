package com.syd.safetymsg.Models.HttpsApi;

import com.litesuits.orm.db.annotation.PrimaryKey;
import com.litesuits.orm.db.enums.AssignType;

/**
 * Created by east on 2017/4/21.
 */

public class FileAuthServiceModel {
    @PrimaryKey(AssignType.AUTO_INCREMENT)
    private int id;
    private String ServicePort;

    public String getServicePort() {
        return ServicePort;
    }

    public void setServicePort(String servicePort) {
        ServicePort = servicePort;
    }

    public String getServiceIP() {
        return ServiceIP;
    }

    public void setServiceIP(String serviceIP) {
        ServiceIP = serviceIP;
    }

    public String getMessageServiceKey() {
        return MessageServiceKey;
    }

    public void setMessageServiceKey(String messageServiceKey) {
        MessageServiceKey = messageServiceKey;
    }

    public String getQueryKey() {
        return QueryKey;
    }

    public void setQueryKey(String queryKey) {
        QueryKey = queryKey;
    }

    public String getFileKey() {
        return FileKey;
    }

    public void setFileKey(String fileKey) {
        FileKey = fileKey;
    }

    private String ServiceIP;
    private String MessageServiceKey;
    private String QueryKey;
    private String FileKey;
}
