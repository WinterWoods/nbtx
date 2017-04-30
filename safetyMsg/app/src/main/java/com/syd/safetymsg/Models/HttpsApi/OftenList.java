package com.syd.safetymsg.Models.HttpsApi;

import com.litesuits.orm.db.annotation.PrimaryKey;
import com.litesuits.orm.db.enums.AssignType;

import java.io.Serializable;
import java.util.Date;

/**
 * Created by east on 2017/4/20.
 */

public class OftenList implements Serializable {
    @PrimaryKey(AssignType.BY_MYSELF)
    private String Key;
    private String FriendName;
    private String FriendKey;
    private Date LastTime;
    private String LastMsgContext;
    private int MessageCount;
    private String Type;
    private String IsRemove;

    public String UserKey;

    public String getUserKey() {
        return UserKey;
    }

    public void setUserKey(String userKey) {
        UserKey = userKey;
    }

    public String getFriendName() {
        return FriendName;
    }

    public void setFriendName(String friendName) {
        FriendName = friendName;
    }

    public String getFriendKey() {
        return FriendKey;
    }

    public void setFriendKey(String friendKey) {
        FriendKey = friendKey;
    }

    public Date getLastTime() {
        return LastTime;
    }

    public void setLastTime(Date lastTime) {
        LastTime = lastTime;
    }

    public String getLastMsgContext() {
        return LastMsgContext;
    }

    public void setLastMsgContext(String lastMsgContext) {
        LastMsgContext = lastMsgContext;
    }

    public int getMessageCount() {
        return MessageCount;
    }

    public void setMessageCount(int messageCount) {
        MessageCount = messageCount;
    }

    public String getType() {
        return Type;
    }

    public void setType(String type) {
        Type = type;
    }

    public String getIsRemove() {
        return IsRemove;
    }

    public void setIsRemove(String isRemove) {
        IsRemove = isRemove;
    }






    public String getKey() {
        return Key;
    }

    public void setKey(String key) {
        Key = key;
    }

    public Date getEditTime() {
        return EditTime;
    }

    public void setEditTime(Date editTime) {
        EditTime = editTime;
    }

    private Date EditTime;
}
