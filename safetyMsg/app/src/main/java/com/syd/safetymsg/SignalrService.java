package com.syd.safetymsg;

import android.app.Service;
import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.nfc.Tag;
import android.os.Binder;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.view.View;

import com.google.gson.JsonElement;
import com.syd.common.log.Log;
import com.syd.safetymsg.Models.HttpsApi.LoginAuthUserOKModel;
import com.syd.safetymsg.Models.HttpsApi.UserInfo;

import java.util.List;
import java.util.concurrent.ExecutionException;

import microsoft.aspnet.signalr.client.Action;
import microsoft.aspnet.signalr.client.ErrorCallback;
import microsoft.aspnet.signalr.client.LogLevel;
import microsoft.aspnet.signalr.client.Logger;
import microsoft.aspnet.signalr.client.MessageReceivedHandler;
import microsoft.aspnet.signalr.client.SignalRFuture;
import microsoft.aspnet.signalr.client.http.StreamResponse;
import microsoft.aspnet.signalr.client.hubs.HubConnection;
import microsoft.aspnet.signalr.client.hubs.HubProxy;
import microsoft.aspnet.signalr.client.hubs.SubscriptionHandler1;
import microsoft.aspnet.signalr.client.transport.LongPollingTransport;

/**
 * Created by east on 2017/4/19.
 */

public class SignalrService extends Service {
    private String TAG = getClass().getName();
    public static LoginAuthUserOKModel model;
    private MyBinder mBinder = new MyBinder();
    private HubConnection mHubConnection;

    public HubProxy getmHubProxy_msgManager() {
        return mHubProxy_msgManager;
    }

    private HubProxy mHubProxy_userManager;
    private HubProxy mHubProxy_msgManager;

    public Callback getCallback() {
        return callback;
    }

    public void setCallback(Callback callback) {
        this.callback = callback;
    }

    //回调接口
    private Callback callback;

    //回调接口的集合
    private clientCallback clientCallback;

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "onCreate() executed");

    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "onStartCommand() executed");
        new Thread(new Runnable() {
        @Override  
        public void run() {
            initConnect();
            initHubProxy();
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

    public void setCallback(MainActivity mainActivity) {

    }



    class MyBinder extends Binder {

        public SignalrService getService() {
            return SignalrService.this;
        }

        public void startDownload() {
            Log.d("TAG", "startDownload() executed");
            // 执行具体的下载任务  
        }
    }
    /**
     * 回调接口
     * @author Ivan Xu
     *
     */
    public interface Callback {
        public void error();

        public void connected();

        public void closed();

        public void successed(UserInfo userInfo);
    }
    public interface clientCallback {
        public void exceptionHandler(String errMsg);

        public void sendMsg();

        public void receiveMsg();

        public void msgReadedList();
    }
    public void initHubProxy(){
        // 开始执行后台任务
        mHubProxy_msgManager=mHubConnection.createHubProxy("msgManager");
        mHubProxy_msgManager.subscribe("exceptionHandler").addReceivedHandler(new Action<JsonElement[]>() {
            @Override
            public void run(JsonElement[] jsonElements) throws Exception {

            }
        });

        mHubProxy_userManager=mHubConnection.createHubProxy("userManager");
    }
    private void initConnect() {
        Log.i(TAG,"!!!!!!!!!!!!!!");
        // Connect to the server
        mHubConnection = new HubConnection("http://"+model.getConnServiceIP()+":"+model.getConnServicePort()+"/");//初始化连接
        if (mHubConnection != null) {
            mHubConnection.error(new ErrorCallback() {
                @Override
                public void onError(Throwable error) {
                    Log.i(TAG,"发生异常;"+error.getMessage());
                    if(callback!=null)
                        callback.error();
                    error.printStackTrace();
                }
            });
            mHubConnection.connected(new Runnable() {
                @Override
                public void run() {
                    if(callback!=null)
                        callback.connected();
                    Log.i(TAG,"状态:connected");
                }
            });
            // Subscribe to the closed event
            mHubConnection.closed(new Runnable() {
                @Override
                public void run() {
                    if(callback!=null)
                        callback.closed();
                    Log.i(TAG,"已经断开");
                }
            });
        }
    }
    public interface sendCallback<T>{
        public void successed(T obj);
    }
    public <E> SignalRFuture<E>  sendMsg(final Class<E> resultClass,final String method, final sendCallback<E> callback, Object... args) {
        return mHubProxy_msgManager.invoke(resultClass, method, args).done(new Action<E>() {
            @Override
            public void run(final E e) throws Exception {
                Handler handler = new Handler() {
                    public void handleMessage(Message msg) {
                        E obj = (E) msg.obj;
                        callback.successed(obj);
                    }
                };
                Message msg = new Message();
                msg.what = 0;
                msg.obj = e;
                handler.sendMessage(msg);
            }
        });
    }
    private void openConnect(){
        mHubConnection.start().done(new Action<Void>() {
            @Override
            public void run(Void aVoid) throws Exception {
                Log.i(TAG,"连接成功");
                mHubProxy_userManager.invoke(UserInfo.class,"signIn",model).done(new Action<UserInfo>() {
                    @Override
                    public void run(UserInfo userInfo) throws Exception {
                        Log.i(TAG, "返回值:"+userInfo.getHubId());
                        if(callback!=null)
                            callback.successed(userInfo);
                    }
                });
            }
        });
    }
}