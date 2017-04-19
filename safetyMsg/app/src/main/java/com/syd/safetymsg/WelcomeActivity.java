package com.syd.safetymsg;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Bundle;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;


import com.litesuits.orm.LiteOrm;
import com.litesuits.orm.log.OrmLog;
import com.syd.okhttp.callback.Callback;
import com.syd.safetymsg.Models.HttpsApi.LoginAuthUserOKModel;
import com.syd.safetymsg.Models.sqlite.ConfigModel;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import okhttp3.Call;

public class WelcomeActivity extends Activity implements View.OnClickListener {
    private String TAG = getClass().getName();
    private Handler handler;

    private Button button;
    private TextView textView3;
    private Context context;

    private LiteOrm liteOrm;

    //所需要申请的权限数组
    private static final String[] permissionsArray = new String[]{
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
    };
    //还需申请的权限列表
    private List<String> permissionsList = new ArrayList<String>();
    //申请权限后的返回码
    private static final int REQUEST_CODE_ASK_PERMISSIONS = 1;
    private AlertDialog dialog;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 版本判断。当手机系统大于 23 时，才有必要去判断权限是否获取
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            for (String permission : permissionsArray) {
                if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                    permissionsList.add(permission);
                }
            }
            showDialogTipUserRequestPermission();

        }

        context = this;
        liteOrm = ((ThisApplication) getApplication()).liteOrm;

        setContentView(R.layout.activity_welcome);

        InitView();
    }

    // 提示用户该请求权限的弹出框
    private void showDialogTipUserRequestPermission() {

        new AlertDialog.Builder(this)
                .setTitle("存储权限不可用")
                .setMessage("由于系统需要获取存储空间，为你存储个人信息；\n否则，您将无法正常使用")
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
        ActivityCompat.requestPermissions(this, permissionsList.toArray(new String[permissionsList.size()]), REQUEST_CODE_ASK_PERMISSIONS);
    }

    // 用户权限 申请 的回调方法
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case REQUEST_CODE_ASK_PERMISSIONS:
                for (int i=0; i<permissions.length; i++) {
                    if (grantResults[i] == PackageManager.PERMISSION_GRANTED) {
                        Toast.makeText(this, "做一些申请成功的权限对应的事！"+permissions[i], Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(this, "权限被拒绝： "+permissions[i], Toast.LENGTH_SHORT).show();
                    }
                }
                break;
            default:
                super.onRequestPermissionsResult(requestCode, permissions, grantResults);
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

    //获取单实例
    private void LoadData() throws IOException {
        String uniqueId = DeviceUtils.GetDeviceId(this);
        ConfigModel config = liteOrm.queryById(0, ConfigModel.class);
        if (config == null) {
            config = new ConfigModel();
            config.setToken("");
            liteOrm.save(config);
        }
        final ConfigModel finalConfig = config;
        CommHttp.post("AuthorizationManager/TestConnService")
                .addParams("Token", config.getToken())
                .addParams("Device", uniqueId)
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

                    List list = liteOrm.query(ConfigModel.class);
                    OrmLog.i(TAG, list);

                    Intent intent = new Intent(context, MainActivity.class);
                    startActivity(intent);
                    finish();
                }
            }
        });
    }
}
