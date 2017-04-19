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
}
