package com.syd.safetymsg;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;

import com.litesuits.orm.LiteOrm;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @ClassName: LocalCastielService
 * @Description: 本地服务
 * @author 猴子搬来的救兵 http://blog.csdn.net/mynameishuangshuai
 * @version
 */
public class LocalCastielService extends Service {

    private String TAG = getClass().getName();
    private static final int NOTIFICATION_FLAG = 1;
    static LiteOrm liteOrm;
    private PendingIntent pintent;
    MyBinder myBinder;
    MyServiceConnection myServiceConnection;

    @Override
    public void onCreate() {
        super.onCreate();
        if (myBinder == null) {
            myBinder = new MyBinder();
        }
        myServiceConnection = new MyServiceConnection();


    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        this.bindService(new Intent(this, RemoteCastielService.class), myServiceConnection, Context.BIND_IMPORTANT);

// 在Android进行通知处理，首先需要重系统哪里获得通知管理器NotificationManager，它是一个系统Service。
        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        PendingIntent pendingIntent3 = PendingIntent.getActivity(this, 0,
                new Intent(this, MainActivity.class), 0);
        // 通过Notification.Builder来创建通知，注意API Level
        // API16之后才支持
        Notification notify3 = new Notification.Builder(this)
                .setSmallIcon(R.drawable.default_head)
                .setTicker("TickerText:" + "您有新短消息，请注意查收！")
                .setContentTitle("Notification Title")
                .setContentText("This is the notification message")
                .setContentIntent(pendingIntent3).setNumber(1).getNotification(); // 需要注意build()是在API
        // level16及之后增加的，API11可以使用getNotificatin()来替代
        notify3.flags |= Notification.FLAG_AUTO_CANCEL; // FLAG_AUTO_CANCEL表明当通知被用户点击时，通知将被清除。
        manager.notify(NOTIFICATION_FLAG, notify3);// 步骤4：通过通知管理器来发起通知。如果id不同，则每click，在status哪里增加一个提

        // 设置service为前台进程，避免手机休眠时系统自动杀掉该服务
        startForeground(startId, notify3);







        return START_STICKY;
    }

    class MyServiceConnection implements ServiceConnection {

        @Override
        public void onServiceConnected(ComponentName arg0, IBinder arg1) {
            Log.i("castiel", "远程服务连接成功");
        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) {
            // 启动RemoteCastielService
            LocalCastielService.this.startService(new Intent(LocalCastielService.this, RemoteCastielService.class));
            LocalCastielService.this.bindService(new Intent(LocalCastielService.this, RemoteCastielService.class),
                    myServiceConnection, Context.BIND_IMPORTANT);
        }

    }

    class MyBinder extends CastielProgressConnection.Stub {

        @Override
        public String getProName() throws RemoteException {
            return "Local猴子搬来的救兵";
        }

    }
    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "onDestroy() executed");
    }

    @Override
    public IBinder onBind(Intent arg0) {
        return myBinder;
    }

}