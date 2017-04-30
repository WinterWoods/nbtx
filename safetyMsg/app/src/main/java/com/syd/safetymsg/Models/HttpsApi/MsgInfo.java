package com.syd.safetymsg.Models.HttpsApi;

import java.io.Serializable;
import java.util.Date;

/**
 * Created by east on 2017/4/24.
 */

public class MsgInfo implements Serializable {
    private String Key;
    private String ReceivedKey;
    private Date SendTime;
    private Date ReadTime;
    private String ReadPersonCount;
    private String Context;
    private String Type;
    private String MsgType;
    private String FileUpOver;
    private String FileKey;

    public String getKey() {
        return Key;
    }

    public void setKey(String key) {
        Key = key;
    }

    public String getReceivedKey() {
        return ReceivedKey;
    }

    public void setReceivedKey(String receivedKey) {
        ReceivedKey = receivedKey;
    }

    public Date getSendTime() {
        return SendTime;
    }

    public void setSendTime(Date sendTime) {
        SendTime = sendTime;
    }

    public Date getReadTime() {
        return ReadTime;
    }

    public void setReadTime(Date readTime) {
        ReadTime = readTime;
    }

    public String getReadPersonCount() {
        return ReadPersonCount;
    }

    public void setReadPersonCount(String readPersonCount) {
        ReadPersonCount = readPersonCount;
    }

    public String getContext() {
        return Context;
    }

    public void setContext(String context) {
        Context = context;
    }

    public String getType() {
        return Type;
    }

    public void setType(String type) {
        Type = type;
    }

    public String getMsgType() {
        return MsgType;
    }

    public void setMsgType(String msgType) {
        MsgType = msgType;
    }

    public String getFileUpOver() {
        return FileUpOver;
    }

    public void setFileUpOver(String fileUpOver) {
        FileUpOver = fileUpOver;
    }

    public String getFileKey() {
        return FileKey;
    }

    public void setFileKey(String fileKey) {
        FileKey = fileKey;
    }
}
