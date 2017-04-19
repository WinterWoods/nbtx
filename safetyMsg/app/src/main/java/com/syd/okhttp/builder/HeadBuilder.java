package com.syd.okhttp.builder;

import com.syd.okhttp.OkHttpUtils;
import com.syd.okhttp.request.OtherRequest;
import com.syd.okhttp.request.RequestCall;

/**
 * Created by zhy on 16/3/2.
 */
public class HeadBuilder extends GetBuilder
{
    @Override
    public RequestCall build()
    {
        return new OtherRequest(null, null, OkHttpUtils.METHOD.HEAD, url, tag, params, headers,id).build();
    }
}
