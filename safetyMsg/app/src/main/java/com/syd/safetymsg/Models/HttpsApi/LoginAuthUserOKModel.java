package com.syd.safetymsg.Models.HttpsApi;

/**
 * Created by 78967 on 2017/3/16.
 */

public class LoginAuthUserOKModel extends BaseModel {
    private String ConnServiceIP;
    private String ConnServicePort;
    private String Key;
    private String GuidAuth;

    public String getConnServiceIP() {
        return ConnServiceIP;
    }

    public void setConnServiceIP(String connServiceIP) {
        ConnServiceIP = connServiceIP;
    }

    public String getConnServicePort() {
        return ConnServicePort;
    }

    public void setConnServicePort(String connServicePort) {
        ConnServicePort = connServicePort;
    }

    public String getKey() {
        return Key;
    }

    public void setKey(String key) {
        Key = key;
    }

    public String getGuidAuth() {
        return GuidAuth;
    }

    public void setGuidAuth(String guidAuth) {
        GuidAuth = guidAuth;
    }
}
