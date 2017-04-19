package com.syd.safetymsg;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.Message;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import com.syd.common.log.Log;
import com.syd.common.utils.ToastUtil;
import com.syd.okhttp.callback.Callback;
import com.syd.safetymsg.Models.HttpsApi.LoginAuthUserOKModel;

import okhttp3.Call;
import okhttp3.Request;

public class LoginActivity extends  Activity implements View.OnClickListener {
    private String TAG = getClass().getName();
    private Handler handler;
    private Context context;
    private Button button;

    private EditText et_name;
    private EditText et_password;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        InitView();
        handlerEvent();
        context = this;
    }
    private void InitView(){
        button=(Button) findViewById(R.id.button);
        button.setOnClickListener(this);

        et_name=(EditText)findViewById(R.id.editText_name);
        et_password=(EditText)findViewById(R.id.editText_password);
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
    private  void  LoadData() {
        CommHttp.post("AuthorizationManager/LoginService")
                .addParams("LoginName", et_name.getText().toString())
                .addParams("Password", et_password.getText().toString())
                .build().execute(new Callback<LoginAuthUserOKModel>() {
            @Override
            public void onBefore(Request request, int id)
            {
                button.setText("正在登陆....");
                button.setEnabled(false);
            }

            @Override
            public void onAfter(int id)
            {
                button.setText("登陆");
                button.setEnabled(true);
            }
            @Override
            public void onError(Call call, Exception e, int id) {
                ToastUtil.showShort(context, e.getMessage());
            }

            @Override
            public void onResponse(LoginAuthUserOKModel response, int id) {
                Log.i(TAG, "正确-->" + response.getConnServiceIP()+ response.getConnServicePort());
                //登陆成功,需要连接signalR,并跳转
                Intent intent=new Intent(context,MainActivity.class);
                startActivity(intent);
                finish();
            }
        });
    }


//        //测试服务器是否通,如果通
//        class LoginAuthUserOKModelRequest extends JsonAbsRequest<LoginAuthUserOKModel> {
//            public LoginAuthUserOKModelRequest(String url, HttpParamModel param) {
//                super(url, param);
//            }
//        }
//        LoginAuthUserOKModelRequest request = new LoginAuthUserOKModelRequest("/AuthorizationManager/LoginService", new LoginAuthUserModel("123","234"))
//                .setMethod(HttpMethods.Post)
//                .setHttpListener(new HttpListener<LoginAuthUserOKModel>() {
//                    @Override
//                    public void onSuccess(LoginAuthUserOKModel s, Response<LoginAuthUserOKModel> response) {
//                        Log.i(TAG, "正确-->" + s.getConnServiceIP());
//                        Message msg = new Message();
//                        msg.what = 0;
//                        handler.sendMessage(msg);
//                    }
//
//                    @Override
//                    public void onFailure(HttpException e, Response<LoginAuthUserOKModel> response) {
//                        Log.i(TAG, "错误-->" + e.getMessage());
//                    }
//                });
//        CommonHttp.getInstance().executeAsync(request);
//    }
    //接受线程消息
    private void handlerEvent(){
        final Context context=this;
        //handler与线程之间的通信及数据处理
        handler = new Handler() {
            public void handleMessage(Message msg) {

            }
        };
    }
}
