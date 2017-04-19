package com.syd.safetymsg;

import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;

import com.google.gson.JsonElement;
import com.syd.common.log.Log;

import java.util.Scanner;

import microsoft.aspnet.signalr.client.Action;
import microsoft.aspnet.signalr.client.ErrorCallback;
import microsoft.aspnet.signalr.client.MessageReceivedHandler;
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
    public static String HUB_URL ="";
    private MyBinder mBinder = new MyBinder();

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "onCreate() executed");
        beginConnect();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "onStartCommand() executed");
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "onDestroy() executed");
    }

    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }
    class MyBinder extends Binder {
        public void startDownload() {
            Log.d("TAG", "startDownload() executed");
            // 执行具体的下载任务  
        }
    }
    private void beginConnect() {
        Log.i(TAG,"!!!!!!!!!!!!!!");
        // Connect to the server
        HubConnection conn = new HubConnection("http://127.0.0.1:10158/");
        // Create the hub proxy
        HubProxy proxy = conn.createHubProxy("msgManager");
        proxy.subscribe("exceptionHandler").addReceivedHandler(new Action<JsonElement[]>(){
            @Override
            public void run(JsonElement[] jsonElements) throws Exception {

            }
        });
//        proxy.subscribe(new Object() {
//            @SuppressWarnings("unused")
//            public void messageReceived(String name, String message) {
//                System.out.println(name + ": " + message);
//            }
//        });
        // Subscribe to the error event
        conn.error(new ErrorCallback() {
            @Override
            public void onError(Throwable error) {
                error.printStackTrace();
            }
        });
        // Subscribe to the connected event
        conn.connected(new Runnable() {
           @Override
            public void run() {
               Log.i(TAG,"CONNECTED");
            }
        });

        // Subscribe to the closed event
        conn.closed(new Runnable() {
            @Override
            public void run() {
                Log.i(TAG,"DISCONNECTED");
            }

        });
        // Subscribe to the received event
        conn.received(new MessageReceivedHandler() {
            @Override
            public void onMessageReceived(JsonElement json) {
                Log.i(TAG,"RAW received message: " + json.toString());
            }
        });
        // Start the connection
        conn.start()
                .done(new Action<Void>() {
                    @Override
                    public void run(Void obj) throws Exception {
                        Log.i(TAG,"Done Connecting!");
                    }
                });

        proxy.invoke(String.class,"getTicket").done(new Action<String>() {
            @Override
            public void run(String s) {
Log.i(TAG,s);
            }
        });
        //conn.stop();
    }
}