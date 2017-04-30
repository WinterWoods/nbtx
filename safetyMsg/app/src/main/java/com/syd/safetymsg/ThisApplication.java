package com.syd.safetymsg;

import android.app.Application;
import com.litesuits.orm.LiteOrm;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.ImageLoaderConfiguration;
import com.syd.common.data.DataKeeper;
import com.syd.okhttp.OkHttpUtils;

import okhttp3.OkHttpClient;

/**
 * Created by 78967 on 2017/3/9.
 */

public class ThisApplication extends Application {
    public DataKeeper dataKeeper;
    public LiteOrm liteOrm;
    public static ThisApplication instance;
    public void onCreate() {
        super.onCreate();
        instance = this;
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

        DisplayImageOptions options = new DisplayImageOptions.Builder()
                .cacheInMemory(true)
                .cacheOnDisk(true)
                .build();
        ImageLoaderConfiguration config = new ImageLoaderConfiguration.Builder(getApplicationContext())
                .defaultDisplayImageOptions(options)
                .build();
        ImageLoader.getInstance().init(config);

        dataKeeper=new DataKeeper(this,"config");
    }
    public static ThisApplication getInstance() {
        return instance;
    }

}
