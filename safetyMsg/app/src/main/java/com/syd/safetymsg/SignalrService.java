package com.syd.safetymsg;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.nfc.Tag;
import android.os.Binder;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.support.annotation.NonNull;
import android.support.v7.app.NotificationCompat;
import android.view.View;

import com.alibaba.fastjson.JSON;
import com.google.gson.JsonElement;
import com.litesuits.orm.LiteOrm;
import com.litesuits.orm.db.assit.QueryBuilder;
import com.syd.common.log.Log;
import com.syd.common.utils.NotificationUtil;
import com.syd.okhttp.callback.Callback;
import com.syd.safetymsg.Models.HttpsApi.FileAuthServiceModel;
import com.syd.safetymsg.Models.HttpsApi.LoginAuthUserOKModel;
import com.syd.safetymsg.Models.HttpsApi.MsgModel;
import com.syd.safetymsg.Models.HttpsApi.OftenList;
import com.syd.safetymsg.Models.HttpsApi.UserInfo;
import com.syd.safetymsg.Models.sqlite.ConfigModel;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutionException;

import microsoft.aspnet.signalr.client.Action;
import microsoft.aspnet.signalr.client.ConnectionState;
import microsoft.aspnet.signalr.client.ErrorCallback;
import microsoft.aspnet.signalr.client.LogLevel;
import microsoft.aspnet.signalr.client.Logger;
import microsoft.aspnet.signalr.client.MessageReceivedHandler;
import microsoft.aspnet.signalr.client.SignalRFuture;
import microsoft.aspnet.signalr.client.StateChangedCallback;
import microsoft.aspnet.signalr.client.http.StreamResponse;
import microsoft.aspnet.signalr.client.hubs.HubConnection;
import microsoft.aspnet.signalr.client.hubs.HubProxy;
import microsoft.aspnet.signalr.client.hubs.SubscriptionHandler1;
import microsoft.aspnet.signalr.client.transport.LongPollingTransport;
import okhttp3.Call;

import static com.syd.safetymsg.R.*;
import static com.syd.safetymsg.R.mipmap.*;

/**
 * Created by east on 2017/4/19.
 */

public class SignalrService extends Service {
    private String TAG = getClass().getName();
    public static LoginAuthUserOKModel model;
    public static FileAuthServiceModel headPhotoModel;

    public static List<OftenList> getOftenLists() {
        return oftenLists;
    }

    public static List<OftenList> oftenLists;
    private final static int TIMER=3000;

    public static com.syd.safetymsg.Models.HttpsApi.UserInfo getUserInfo() {
        return UserInfo;
    }

    private static UserInfo UserInfo;

    private MyBinder mBinder = new MyBinder();
    private HubConnection mHubConnection;

    private HubProxy mHubProxy_userManager;
    private HubProxy mHubProxy_msgManager;
    private HubProxy mHubProxy_fileManager;
    private HubProxy mHubProxy_clientCallback;

    private LiteOrm liteOrm;
    private Handler handler = new Handler();
    private boolean timer = false;
    private Runnable runnable = new Runnable() {
        public void run() {
            Log.i(TAG,"计划任务开始执行!!!!");
            openConnect();
                //postDelayed(this,1000)方法安排一个Runnable对象到主线程队列
        }
    };
    //handler.postDelayed(runnable,1000);         // 开始Timer
    //handler.removeCallbacks(runnable);           //停止Timer


    public void setCallback(Callback callback) {
        this.callback = callback;
    }

    //回调接口
    private Callback callback;
    private SignInCallbak signInCallback;

    //回调接口的集合
    private static HashMap<String,ClientCallback> clientCallback = new HashMap<>();


    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "onCreate() executed");
        liteOrm = ((ThisApplication) getApplication()).liteOrm;

    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "onStartCommand() executed");
        new Thread(new Runnable() {
            @Override
            public void run() {
                openConnect();
            }
        }).start();
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        mHubConnection.stop();
        Log.d(TAG, "onDestroy() executed");
    }

    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

    class MyBinder extends Binder {

        public SignalrService getService() {
            return SignalrService.this;
        }

    }

    /**
     * 回调接口
     *
     * @author Ivan Xu
     */
    public interface Callback {
        void closed();

        void connected();

    }


    public interface ClientCallback {
        void exceptionHandler(String errMsg);

        void sendMsg(MsgModel model);

        void reLoadOftenList();

        void editOftenInfo(OftenList often);
    }

    public void addClientCallback(ClientCallback _clientCallback) {
        Log.i(TAG, _clientCallback.getClass());
        if(!clientCallback.containsKey(_clientCallback.getClass().toString()))
        clientCallback.put(_clientCallback.getClass().toString(),_clientCallback);
    }
    public void removeClientCallback(ClientCallback _clientCallback){
        clientCallback.remove(_clientCallback.getClass().toString());
    }
    private int NEW_MESSAGE=0;

    public static void setNew_Message_Count(int num) {
        New_Message_Count = num;
    }
    public static void setNew_Message_Init() {
        New_Message_Count = 1;
    }
    public static int getNew_Message_Count() {
        return New_Message_Count;
    }

    private static int New_Message_Count=1;
    public void initHubProxy() {
        // 开始执行后台任务
        mHubProxy_msgManager = mHubConnection.createHubProxy("msgManager");
        mHubProxy_userManager = mHubConnection.createHubProxy("userManager");
        mHubProxy_fileManager = mHubConnection.createHubProxy("fileManager");
        mHubProxy_clientCallback = mHubConnection.createHubProxy("clientManager");
        mHubProxy_clientCallback.subscribe("sendMsg").addReceivedHandler(new Action<JsonElement[]>() {
            @Override
            public void run(JsonElement[] obj) throws Exception {
                Log.i(TAG, obj[0].toString());
                if (clientCallback != null) {
                    MsgModel result = JSON.parseObject(obj[0].toString(), MsgModel.class);
                    //其他只是存储数据库
                    SubscribeSendMsg.sendMsg(getApplicationContext(),clientCallback, mHubProxy_msgManager,result);
                }
            }
        });
    }
    public interface sendCallback<T> {
        void successed(T obj);
        void error(String msg);
    }
   public SignalRFuture<Void> msgManagerInvoke(String method, Object... args) {
       return mHubProxy_msgManager.invoke(method, args);
   }
    public <E> SignalRFuture<E> msgManagerInvoke(final Class<E> resultClass, final String method, final sendCallback<E> callback, Object... args) {
        if(mHubProxy_msgManager!=null)
        return mHubProxy_msgManager.invoke(resultClass, method, args).done(new Action<E>() {
            @Override
            public void run(final E e) throws Exception {
                callback.successed(e);
            }
        }).onError(new ErrorCallback() {
            @Override
            public void onError(Throwable error) {
                callback.error(error.getMessage());
            }
        });
        else
        {
            callback.error("没有连接到服务器");
        }
        return null;
    }


    public interface SignInCallbak {

        void error(String err);

        void reLogin();
        void initMain();
    }

    public void setSignInCallback(SignInCallbak _signInCallback) {
        signInCallback = _signInCallback;
    }
    private boolean isFirst=false;
    private void openConnect() {
        handler.removeCallbacks(runnable);

        ConfigModel config = liteOrm.queryById(1, ConfigModel.class);
        if (config == null) {
            //如果没有登录过,请登录
            if(signInCallback!=null)
            signInCallback.reLogin();
            return;
        }
        final ConfigModel finalConfig = config;
        String uniqueId = DeviceUtils.GetDeviceId(this);
        CommHttp.post("AuthorizationManager/TestConnService")
                .addParams("Token", finalConfig.getToken())
                .addParams("Device", uniqueId)
                .addParams("Typ", "2")
                .build().execute(new com.syd.okhttp.callback.Callback<LoginAuthUserOKModel>() {
            @Override
            public void onError(Call call, Exception e, int id) {
                //这个异常原因只可能是因为没有连接上服务
                Log.i(TAG,"启动失败:AuthorizationManager/TestConnService!!开启计划任务");

                if(callback!=null)
                callback.closed();
                if(finalConfig.isInit())
                {
                    handler.postDelayed(runnable, TIMER);
                    //已经初始化了,进行离线数据加载
                    if (signInCallback != null&&!isFirst)
                    {
                        isFirst=true;
                        //之后需要缓存的变量在这里缓存
                        UserInfo=liteOrm.queryById(1,UserInfo.class);
                        headPhotoModel=liteOrm.queryById(1,FileAuthServiceModel.class);
                        //还需要加载什么

                        signInCallback.initMain();
                    }
                }
                else{
                    //如果没有初始化,并且错误,需要授权
                    signInCallback.reLogin();
                }
            }

            @Override
            public void onResponse(LoginAuthUserOKModel response, int id) {
                if (response.getGuidAuth() == null || response.getGuidAuth().equals("")) {
                    if (signInCallback != null)
                        signInCallback.reLogin();
                } else {
                    //拿到新的授权,更改本地授权
                    finalConfig.setToken(response.getGuidAuth());
                    liteOrm.save(finalConfig);
                    //连接的服务器信息
                    SignalrService.model = response;
                    //准备开始连接
                    mHubConnection = new HubConnection("http://" + model.getConnServiceIP() + ":" + model.getConnServicePort() + "/");//初始化连接
                    if (mHubConnection != null) {
                        //状态的变化暂时不用管
//                        mHubConnection.stateChanged(new StateChangedCallback() {
//                            @Override
//                            public void stateChanged(ConnectionState oldState, ConnectionState newState) {
//                                Log.i(TAG, "发生stateChanged;" + oldState.toString() + "||" + newState.toString());
//                            }
//                        });
//                        mHubConnection.error(new ErrorCallback() {
//                            @Override
//                            public void onError(Throwable error) {
//                                Log.i(TAG, "发生stateChanged;" + error.getMessage());
//                                error.printStackTrace();
//                            }
//                        });
                        //监控,如果连接上服务,关掉定时器
                        mHubConnection.connected(new Runnable() {
                            @Override
                            public void run() {
                                Log.i(TAG, "状态:connected");

                                handler.removeCallbacks(runnable);
                                timer = false;

                            }
                        });
                        // 发现没有连接到服务器
                        mHubConnection.closed(new Runnable() {
                            @Override
                            public void run() {
                                //通知ui已经跟服务器断开
                                if (callback != null)
                                    callback.closed();
                                //只有连接成功了,才会执行这个
                                if (!timer) {
                                    timer = true;
                                    //重置所有变量
                                    mHubConnection.disconnect();
                                    mHubProxy_msgManager = null;
                                    mHubProxy_userManager = null;
                                    mHubProxy_fileManager = null;
                                    mHubProxy_clientCallback = null;
                                    mHubConnection = null;
                                    handler.postDelayed(runnable, TIMER);
                                    Log.i(TAG,"closed!!开启计划任务");
                                }
                                Log.i(TAG, "已经断开");
                            }
                        });
                        //初始化各种变量
                        initHubProxy();
                        //准备连接服务
                        mHubConnection.start().done(new Action<Void>() {
                            @Override
                            public void run(Void aVoid) throws Exception {
                                Log.i(TAG, "连接成功");
                                mHubProxy_userManager.invoke(UserInfo.class, "signIn", model).done(new Action<UserInfo>() {
                                    @Override
                                    public void run(final UserInfo userInfo) throws Exception {
                                        mHubProxy_fileManager.invoke(FileAuthServiceModel.class, "getPhotoService").done(new Action<FileAuthServiceModel>() {
                                            @Override
                                            public void run(FileAuthServiceModel fileAuthServiceModel) throws Exception {

                                                Log.i(TAG, "返回值:" + userInfo.getHubId() + "端口:" + fileAuthServiceModel.getServicePort());
                                                headPhotoModel = fileAuthServiceModel;
                                                UserInfo = userInfo;
                                                liteOrm.update(userInfo);
                                                liteOrm.update(headPhotoModel);
                                                //系统是否初始化
                                                if(!finalConfig.isInit()){
                                                    //进行系统初始化
                                                    //拉去最近联系人列表
                                                    msgManagerInvoke(OftenList[].class,"myOftenList", new SignalrService.sendCallback<OftenList[]>() {
                                                        @Override
                                                        public void successed(OftenList[] obj) {
                                                            for(OftenList often:obj){
                                                                if(often.getLastTime()==null||often.getLastTime().equals("")){
                                                                    often.setLastTime(often.getEditTime());
                                                                }
                                                                often.setKey(often.getUserKey()+often.getFriendKey());
                                                                liteOrm.save(often);
                                                            }
                                                            finalConfig.setInit(true);
                                                            liteOrm.update(finalConfig);
                                                            //再次进入主界面
                                                            if (signInCallback != null){
                                                                loadNoSendMsg();
                                                                //初始化
                                                                isFirst=true;
                                                                signInCallback.initMain();
                                                            }
                                                        }

                                                        @Override
                                                        public void error(String msg) {
                                                            //TODO
                                                        }
                                                    });
                                                }
                                                else{
                                                    oftenLists= ThisApplication.getInstance().liteOrm.query(new QueryBuilder<OftenList>(OftenList.class));
                                                    if (signInCallback != null&&!isFirst){
                                                        loadNoSendMsg();
                                                        //初始化
                                                        isFirst=true;
                                                        signInCallback.initMain();
                                                    }
                                                    else{
                                                        if (callback != null)
                                                        {
                                                            loadNoSendMsg();
                                                            callback.connected();
                                                        }

                                                    }
                                                }
                                            }
                                        });
                                    }
                                }).onError(new ErrorCallback() {
                                    @Override
                                    public void onError(Throwable error) {
                                        if (signInCallback != null)
                                            signInCallback.reLogin();
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });
    }
    private void loadNoSendMsg(){
        Map<String, String> par = new HashMap<>();
        par.put("Type","2");
        msgManagerInvoke ("noSendMsgGet",par);
    }



    public static void EditOften(OftenList often){
        ThisApplication.getInstance().liteOrm.update(often);
        //遍历集合，通知所有的实现类，即activity
        Iterator iter = clientCallback.entrySet().iterator();
        while (iter.hasNext()) {
            Map.Entry entry = (Map.Entry) iter.next();
            //Object key = entry.getKey();
            SignalrService.ClientCallback val = (SignalrService.ClientCallback) entry.getValue();
            val.editOftenInfo(often);
        }
    }
}