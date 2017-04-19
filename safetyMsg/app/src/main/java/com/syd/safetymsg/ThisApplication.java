package com.syd.safetymsg;

import android.app.Application;
import android.app.Service;
import android.os.Vibrator;
import android.util.Log;
import com.litesuits.orm.LiteOrm;
import com.syd.okhttp.OkHttpUtils;

import okhttp3.OkHttpClient;

/**
 * Created by 78967 on 2017/3/9.
 */

public class ThisApplication extends Application {
    public LiteOrm liteOrm;
    public void onCreate() {
        super.onCreate();
        /**
         * 初始化数据库访问类
         * */
        if (liteOrm == null) {
            liteOrm = LiteOrm.newSingleInstance(this, "safetymsg.db");
        }

        liteOrm.setDebugged(true); // open the log

        OkHttpClient okHttpClient = new OkHttpClient.Builder()
                //其他配置
                .build();
        OkHttpUtils.initClient(okHttpClient);

    }
}
