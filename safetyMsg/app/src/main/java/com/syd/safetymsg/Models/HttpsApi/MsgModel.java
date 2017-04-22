package com.syd.safetymsg.Models.HttpsApi;

import java.util.Date;

/**
 * Created by east on 2017/4/22.
 */

public class MsgModel {
    private String Key;
    private String SendKey;
    private String ReceivedKey;
    private Date SendTime;
    private Date ReadTime;
    private String Context;
    private boolean IsSend;
    private String Type;

    public String getKey() {
        return Key;
    }

    public void setKey(String key) {
        Key = key;
    }

    public String getSendKey() {
        return SendKey;
    }

    public void setSendKey(String sendKey) {
        SendKey = sendKey;
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

    public String getContext() {
        return Context;
    }

    public void setContext(String context) {
        Context = context;
    }

    public boolean isSend() {
        return IsSend;
    }

    public void setSend(boolean send) {
        IsSend = send;
    }

    public String getType() {
        return Type;
    }

    public void setType(String type) {
        Type = type;
    }

    public String getSendName() {
        return SendName;
    }

    public void setSendName(String sendName) {
        SendName = sendName;
    }

    public String getMsgType() {
        return MsgType;
    }

    public void setMsgType(String msgType) {
        MsgType = msgType;
    }

    public boolean isFileUpOver() {
        return FileUpOver;
    }

    public void setFileUpOver(boolean fileUpOver) {
        FileUpOver = fileUpOver;
    }

    public String getNoSendKey() {
        return NoSendKey;
    }

    public void setNoSendKey(String noSendKey) {
        NoSendKey = noSendKey;
    }

    private String SendName;
    private String MsgType;
    private boolean FileUpOver;
    private String NoSendKey;
}
