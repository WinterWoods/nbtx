package com.syd.safetymsg.Models.HttpsApi;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by east on 2017/4/24.
 */

public class MessageResultModel {
    public String getRandomString() {
        return RandomString;
    }

    public void setRandomString(String randomString) {
        RandomString = randomString;
    }

    public List<MsgInfo> getData() {
        return data;
    }

    public void setData(List<MsgInfo> data) {
        this.data = data;
    }

    public MessageResultModel() {
        data=new ArrayList<MsgInfo>();

    }

    private String RandomString;
    private List<MsgInfo> data;
}
