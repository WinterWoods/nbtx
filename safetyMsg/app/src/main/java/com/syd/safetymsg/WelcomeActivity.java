package com.syd.safetymsg;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Bundle;
import android.os.IBinder;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;


import com.litesuits.orm.LiteOrm;
import com.litesuits.orm.log.OrmLog;
import com.syd.common.log.Log;
import com.syd.okhttp.callback.Callback;
import com.syd.safetymsg.Models.HttpsApi.LoginAuthUserOKModel;
import com.syd.safetymsg.Models.HttpsApi.UserInfo;
import com.syd.safetymsg.Models.sqlite.ConfigModel;

import java.io.IOException;
import java.util.List;

import okhttp3.Call;

public class WelcomeActivity extends Activity implements View.OnClickListener,SignalrService.Callback {
    private String TAG = getClass().getName();
    private Handler handler;

    private Button button;
    private TextView textView3;
    private Context context;

    private LiteOrm liteOrm;

    private SignalrService service;
    private MyServiceConn conn;

    // 要申请的权限
    private String[] permissions = {Manifest.permission.WRITE_EXTERNAL_STORAGE,Manifest.permission.ACCESS_FINE_LOCATION,Manifest.permission.READ_PHONE_STATE};
    private AlertDialog dialog;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        context = this;
        conn=new MyServiceConn();
        liteOrm = ((ThisApplication) getApplication()).liteOrm;

        setContentView(R.layout.activity_welcome);

        InitView();

        // 版本判断。当手机系统大于 23 时，才有必要去判断权限是否获取
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {

            // 检查该权限是否已经获取
            int i = ContextCompat.checkSelfPermission(this, permissions[0]);
            // 权限是否已经 授权 GRANTED---授权  DINIED---拒绝
            if (i != PackageManager.PERMISSION_GRANTED) {
                // 如果没有授予该权限，就去提示用户请求
                showDialogTipUserRequestPermission();
            }
            else{
                try {
                    LoadData();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    // 提示用户该请求权限的弹出框
    private void showDialogTipUserRequestPermission() {
        new AlertDialog.Builder(this)
                .setTitle("存储权限不可用")
                .setMessage("需要获取存储空间，为你存储个人信息；\n否则，您将无法正常使用")
                .setPositiveButton("立即开启", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        startRequestPermission();
                    }
                })
                .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        finish();
                    }
                }).setCancelable(false).show();
    }

    // 开始提交请求权限
    private void startRequestPermission() {
        ActivityCompat.requestPermissions(this, permissions, 321);
    }

    // 用户权限 申请 的回调方法
    /**
     * Callback received when a permissions request has been completed.
     */
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        if (requestCode == 321) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (grantResults[0] != PackageManager.PERMISSION_GRANTED) {
                    // 判断用户是否 点击了不再提醒。(检测该权限是否还可以申请)
                    boolean b = shouldShowRequestPermissionRationale(permissions[0]);
                    if (!b) {
                        // 用户还是想用我的 APP 的
                        // 提示用户去应用设置界面手动开启权限
                        showDialogTipUserGoToAppSettting();
                    } else
                        finish();
                } else {

                    Toast.makeText(this, "权限获取成功", Toast.LENGTH_SHORT).show();
                    try {
                        LoadData();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }
    // 提示用户去应用设置界面手动开启权限

    private void showDialogTipUserGoToAppSettting() {

        dialog = new AlertDialog.Builder(this)
                .setTitle("存储权限不可用")
                .setMessage("请在-应用设置-权限-中，允许使用存储权限来保存用户数据")
                .setPositiveButton("立即开启", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        // 跳转到应用设置界面
                        goToAppSetting();
                    }
                })
                .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        finish();
                    }
                }).setCancelable(false).show();
    }

    // 跳转到当前应用的设置界面
    private void goToAppSetting() {
        Intent intent = new Intent();

        intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        Uri uri = Uri.fromParts("package", getPackageName(), null);
        intent.setData(uri);

        startActivityForResult(intent, 123);
    }

    //
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 123) {

            if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                // 检查该权限是否已经获取
                int i = ContextCompat.checkSelfPermission(this, permissions[0]);
                // 权限是否已经 授权 GRANTED---授权  DINIED---拒绝
                if (i != PackageManager.PERMISSION_GRANTED) {
                    // 提示用户应该去应用设置界面手动开启权限
                    showDialogTipUserGoToAppSettting();
                } else {
                    if (dialog != null && dialog.isShowing()) {
                        dialog.dismiss();
                    }
                    Toast.makeText(this, "权限获取成功", Toast.LENGTH_SHORT).show();
                    try {
                        LoadData();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    private void InitView() {

        textView3 = (TextView) findViewById(R.id.textView3);

        button = (Button) findViewById(R.id.button2);
        button.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.button2:
                finish();
                break;
        }
    }

    @Override
    public void error() {

    }

    @Override
    public void connected() {

    }

    @Override
    public void closed() {

    }

    @Override
    public void successed(UserInfo userInfo) {
        Intent intent = new Intent(context, MainActivity.class);
        startActivity(intent);
        finish();
    }

    public class MyServiceConn implements ServiceConnection {

        @Override
        public void onServiceConnected(ComponentName name, IBinder binder) {
            service = ((SignalrService.MyBinder) binder).getService();
            //将当前activity添加到接口集合中
            service.setCallback(WelcomeActivity.this);
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            // TODO Auto-generated method stub
            service = null;
        }
    }
    //获取单实例
    private void LoadData() throws IOException {
        String uniqueId = DeviceUtils.GetDeviceId(this);
        ConfigModel config = liteOrm.queryById(1, ConfigModel.class);
        if (config == null) {
            config = new ConfigModel();
            config.setToken("");
            liteOrm.save(config);
        }
        final ConfigModel finalConfig = config;
        CommHttp.post("AuthorizationManager/TestConnService")
                .addParams("Token", config.getToken())
                .addParams("Device", uniqueId)
                .addParams("Typ", "2")
                .build().execute(new Callback<LoginAuthUserOKModel>() {
            @Override
            public void onError(Call call, Exception e, int id) {
                Log.i("APP", "服务器返回信息!!!!!!!!!!" + e.getMessage());
                button.setVisibility(View.VISIBLE);
                textView3.setVisibility(View.GONE);
            }

            @Override
            public void onResponse(LoginAuthUserOKModel response, int id) {
                if (response.getGuidAuth() == null || response.getGuidAuth().equals("")) {
                    //如果没有登陆过,跳转登陆界面.
                    Intent intent = new Intent(context, LoginActivity.class);
                    startActivity(intent);
                    finish();
                } else {
                    //是否已经登陆过,如果登陆过.直接登陆
                    finalConfig.setToken(response.getGuidAuth());
                    liteOrm.save(finalConfig);

                    SignalrService.model = response;

                    Intent startIntent = new Intent(context, SignalrService.class);
                    startService(startIntent);
                    bindService(new Intent(context, SignalrService.class), conn,
                            BIND_AUTO_CREATE);
                }
            }
        });
    }
}
