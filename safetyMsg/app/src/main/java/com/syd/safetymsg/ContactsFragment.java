package com.syd.safetymsg;

import android.content.Context;
import android.provider.Settings;
import android.support.v4.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.syd.common.utils.ToastUtil;
import com.syd.okhttp.OkHttpUtils;
import com.syd.okhttp.callback.StringCallback;
import com.syd.safetymsg.Models.HttpsApi.LoginAuthUserOKModel;

import okhttp3.Call;

/**
 * Created by 78967 on 2017/2/15.
 */

public class ContactsFragment extends Fragment implements View.OnClickListener {
    private EditText luckNum;
    private Button send;
    private Context context;
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.contacts_fg, container, false);
        luckNum=(EditText)view.findViewById(R.id.editText);

        send=(Button)view.findViewById(R.id.button3);
        send.setOnClickListener(this);
        context=getContext();
        return view;
    }

    @Override
    public void onClick(View v) {
        //172.16.42.247
        OkHttpUtils.post().url("http://cj.yinjily.com/api/"+"WXApi/setWinning")
                .addParams("m", System.currentTimeMillis()+"")
                .addParams("l", luckNum.getText().toString())
                .addHeader("invitation","yjmm")
                .addHeader("ticket","123")
                .build().execute(new StringCallback() {
            @Override
            public void onError(Call call, Exception e, int id) {
                ToastUtil.showShort(context,"失败");
            }

            @Override
            public void onResponse(String response, int id) {
                ToastUtil.showShort(context,"成功");
            }
        });

    }
}