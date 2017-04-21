package com.syd.safetymsg;

import android.os.Build;

import com.syd.okhttp.OkHttpUtils;
import com.syd.okhttp.builder.GetBuilder;
import com.syd.okhttp.builder.PostFormBuilder;

/**
 * Created by east on 2017/4/17.
 */

public class CommHttp {
    public static String BaseUrl="http://172.16.42.247:10156/api/";
    public static PostFormBuilder post(String url)
    {
        return OkHttpUtils.post().url(BaseUrl+url);
    }
    public  static String getHeadPic(String userKey){
        return getHeadPic(userKey,"1");
    }
    public  static String getHeadPic(String userKey,String type){
        return "http://" + SignalrService.headPhotoModel.getServiceIP() + ":" + SignalrService.headPhotoModel.getServicePort() + "/api/FileManager/GetHeadPic?invitation=nbtx&serviceKey=" + SignalrService.headPhotoModel.getMessageServiceKey() + "&ticket=" + SignalrService.headPhotoModel.getQueryKey() + "&type=" + type + "&userKey=" + userKey;
    }
}
