package com.syd.safetymsg;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import com.litesuits.orm.LiteOrm;
import com.syd.common.log.Log;
import com.syd.common.utils.ToastUtil;
import com.syd.okhttp.callback.Callback;
import com.syd.safetymsg.Models.HttpsApi.LoginAuthUserOKModel;
import com.syd.safetymsg.Models.HttpsApi.UserInfo;
import com.syd.safetymsg.Models.sqlite.ConfigModel;

import okhttp3.Call;
import okhttp3.Request;

public class LoginActivity extends  Activity implements View.OnClickListener,SignalrService.SignInCallbak {
    private String TAG = getClass().getName();
    private Handler handler;
    private Context context;
    private Button button;

    private EditText et_name;
    private EditText et_password;

    private SignalrService service;
    private MyServiceConn conn;

    private LiteOrm liteOrm;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        InitView();
        handlerEvent();
        context = this;
        liteOrm = ((ThisApplication) getApplication()).liteOrm;
        conn=new MyServiceConn();

    }

    private void InitView() {
        button = (Button) findViewById(R.id.button);
        button.setOnClickListener(this);

        et_name = (EditText) findViewById(R.id.editText_name);
        et_password = (EditText) findViewById(R.id.editText_password);
    }
    class MyServiceConn implements ServiceConnection {

        @Override
        public void onServiceConnected(ComponentName name, IBinder binder) {
            service = ((SignalrService.MyBinder) binder).getService();
            //将当前activity添加到接口集合中
            service.setSignInCallback(LoginActivity.this);
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            // TODO Auto-generated method stub
            service = null;
        }
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.button:
                //登录
                LoadData();
                break;
        }
    }

    private void LoadData() {
        String uniqueId = DeviceUtils.GetDeviceId(this);
        CommHttp.post("AuthorizationManager/LoginService")
                .addParams("LoginName", et_name.getText().toString())
                .addParams("Password", et_password.getText().toString())
                .addParams("Device", uniqueId)
                .addParams("Typ", "2")
                .build().execute(new Callback<LoginAuthUserOKModel>() {
            @Override
            public void onBefore(Request request, int id) {
                button.setText("正在登陆....");
                button.setEnabled(false);
            }

            @Override
            public void onAfter(int id) {

            }

            @Override
            public void onError(Call call, Exception e, int id) {
                ToastUtil.showShort(context, e.getMessage());
                button.setText("登陆");
                button.setEnabled(true);
            }

            @Override
            public void onResponse(LoginAuthUserOKModel response, int id) {
                liteOrm.deleteDatabase();
                liteOrm.openOrCreateDatabase();
                ConfigModel config = new ConfigModel();
                config.setToken(response.getGuidAuth());
                config.setInit(false);
                liteOrm.save(config);
                SignalrService.model = response;

                Intent startIntent = new Intent(context, SignalrService.class);
                startService(startIntent);
                bindService(new Intent(context, SignalrService.class), conn,
                        BIND_AUTO_CREATE);
            }
        });
    }
    @Override
    public void onPause()
    {
        super.onPause();
    }
    //接受线程消息
    private void handlerEvent() {
        final Context context = this;
        //handler与线程之间的通信及数据处理
        handler = new Handler() {
            public void handleMessage(Message msg) {

            }
        };
    }

    @Override
    public void error(String err) {
        ToastUtil.showShort(this,err);
    }

    @Override
    public void reLogin() {

    }

    @Override
    public void initMain() {
        //登陆成功,需要连接signalR,并跳转
        Intent intent = new Intent(context, MainActivity.class);
        startActivity(intent);
        finish();
    }

    @Override
    protected void onDestroy() {
        // TODO Auto-generated method stub
        super.onDestroy();
        unbindService(conn);
    }
}
