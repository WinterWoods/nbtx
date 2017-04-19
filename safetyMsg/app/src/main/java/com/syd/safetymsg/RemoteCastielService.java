package com.syd.safetymsg;
import android.app.Service;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;

/**
 *
 * @ClassName: RemoteCastielService
 * @Description: 远程服务
 * @author 猴子搬来的救兵 http://blog.csdn.net/mynameishuangshuai
 */
public class RemoteCastielService extends Service {
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
        this.bindService(new Intent(this,LocalCastielService.class), myServiceConnection, Context.BIND_IMPORTANT);

        return START_STICKY;
    }

    class MyServiceConnection implements ServiceConnection {

        @Override
        public void onServiceConnected(ComponentName arg0, IBinder arg1) {
            Log.i("castiel", "本地服务连接成功");
        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) {
            // 启动LocalCastielService
            RemoteCastielService.this.startService(new Intent(RemoteCastielService.this,LocalCastielService.class));
            RemoteCastielService.this.bindService(new Intent(RemoteCastielService.this,LocalCastielService.class), myServiceConnection, Context.BIND_IMPORTANT);
        }

    }

    class MyBinder extends CastielProgressConnection.Stub {

        @Override
        public String getProName() throws RemoteException {
            return "Remote猴子搬来的救兵";
        }

    }

    @Override
    public IBinder onBind(Intent arg0) {
        return myBinder;
    }

}