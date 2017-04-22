package com.syd.safetymsg;

import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.res.ColorStateList;
import android.content.res.Resources;
import android.os.IBinder;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.syd.common.utils.ToastUtil;
import com.syd.safetymsg.Models.HttpsApi.MsgModel;

public class MainActivity extends FragmentActivity implements OnClickListener,SignalrService.clientCallback {
    // 初始化顶部栏显示
    private ImageView titleLeftImv;
    private TextView titleTv;
    // 定义4个Fragment对象
    private MessageFragment messageFragment;
    private ContactsFragment contactsFragment;
    private MyFragment myFragment;
    // 帧布局对象，用来存放Fragment对象
    private FrameLayout frameLayout;
    // 定义每个选项中的相关控件
    private RelativeLayout firstLayout;
    private RelativeLayout secondLayout;
    private RelativeLayout fourthLayout;
    private ImageView firstImage;
    private ImageView secondImage;
    private ImageView fourthImage;
    private TextView firstText;
    private TextView secondText;
    private TextView fourthText;
    // 定义几个颜色
    private int whirt = 0xFFFFFFFF;
    private int gray = 0xFF7597B3;
    private int dark = 0xff000000;
    // 定义FragmentManager对象管理器
    private FragmentManager fragmentManager;

    public SignalrService service;
    private MyServiceConn conn;

    public SignalrService.clientCallback ClientCallback;

    @Override
    public void exceptionHandler(String errMsg) {
        ToastUtil.showShort(this,errMsg);
    }
    //当接受到新的消息的时候
    @Override
    public void sendMsg(MsgModel model) {
        //便利列表是否存在,如果存在修改,如果不存在则添加一个
        if(ClientCallback!=null)
            ClientCallback.sendMsg(model);
    }

    public class MyServiceConn implements ServiceConnection {

        @Override
        public void onServiceConnected(ComponentName name, IBinder binder) {
            service = ((SignalrService.MyBinder) binder).getService();
            service.setClientCallback(MainActivity.this);
            setChioceItem(0); // 初始化页面加载时显示第一个选项卡
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            // TODO Auto-generated method stub
            service = null;
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        conn=new MyServiceConn();
        bindService(new Intent(this, SignalrService.class), conn,
                BIND_AUTO_CREATE);
        setContentView(R.layout.activity_main);
        fragmentManager = getSupportFragmentManager();
        initView(); // 初始化界面控件


    }
    /**
     * 初始化页面
     */
    private void initView() {
// 初始化页面标题栏
//        titleLeftImv = (ImageView) findViewById(R.id.title_imv);
//        titleLeftImv.setOnClickListener(new OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                //startActivity(new Intent(MainActivity.this, LoginActivity.class));
//            }
//        });
        titleLeftImv=(ImageView)findViewById(R.id.home_top_logo);
        titleTv = (TextView) findViewById(R.id.textView_logo);
        titleTv.setText("首 页");
// 初始化底部导航栏的控件
        firstImage = (ImageView) findViewById(R.id.first_image);
        secondImage = (ImageView) findViewById(R.id.second_image);
        fourthImage = (ImageView) findViewById(R.id.fourth_image);
        firstText = (TextView) findViewById(R.id.first_text);
        secondText = (TextView) findViewById(R.id.second_text);
        fourthText = (TextView) findViewById(R.id.fourth_text);
        firstLayout = (RelativeLayout) findViewById(R.id.first_layout);
        secondLayout = (RelativeLayout) findViewById(R.id.second_layout);
        fourthLayout = (RelativeLayout) findViewById(R.id.fourth_layout);
        firstLayout.setOnClickListener(MainActivity.this);
        secondLayout.setOnClickListener(MainActivity.this);
        fourthLayout.setOnClickListener(MainActivity.this);
    }
    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.first_layout:
                setChioceItem(0);
                break;
            case R.id.second_layout:
                setChioceItem(1);
                break;
            case R.id.fourth_layout:
                setChioceItem(3);
                break;
            default:
                break;
        }
    }
    /**
     * 设置点击选项卡的事件处理
     *
     * @param index 选项卡的标号：0, 1, 2, 3
     */
    private void setChioceItem(int index) {
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        clearChioce(); // 清空, 重置选项, 隐藏所有Fragment
        hideFragments(fragmentTransaction);

        switch (index) {
            case 0:
                firstImage.setImageResource(R.drawable.home_bottom_tab_icon_message_highlight); //需要的话自行修改
                firstText.setTextColor(ContextCompat.getColor(this, R.color.home_bottom_font_highlight));
                titleTv.setVisibility(View.GONE);
                titleLeftImv.setVisibility(View.VISIBLE);
// 如果fg1为空，则创建一个并添加到界面上
                if (messageFragment == null) {
                    messageFragment = new MessageFragment(this);
                    fragmentTransaction.add(R.id.content, messageFragment);
                } else {
// 如果不为空，则直接将它显示出来
                    fragmentTransaction.show(messageFragment);
                }
                break;
            case 1:
                secondImage.setImageResource(R.drawable.home_bottom_tab_icon_contact_highlight); //需要的话自行修改
                secondText.setTextColor(ContextCompat.getColor(this, R.color.home_bottom_font_highlight));
                titleTv.setText("联系人");
                titleTv.setVisibility(View.VISIBLE);
                titleLeftImv.setVisibility(View.GONE);
                if (contactsFragment == null) {
                    contactsFragment = new ContactsFragment();
                    fragmentTransaction.add(R.id.content, contactsFragment);
                } else {
                    fragmentTransaction.show(contactsFragment);
                }
                break;
            case 3:
                fourthImage.setImageResource(R.drawable.home_bottom_tab_icon_mine_highlight); //需要的话自行修改
                fourthText.setTextColor(ContextCompat.getColor(this, R.color.home_bottom_font_highlight));
                titleTv.setText("我的");
                titleTv.setVisibility(View.VISIBLE);
                titleLeftImv.setVisibility(View.GONE);
                if (myFragment == null) {
                    myFragment = new MyFragment();
                    fragmentTransaction.add(R.id.content, myFragment);
                } else {
                    fragmentTransaction.show(myFragment);
                }
                break;
        }
        fragmentTransaction.commit(); // 提交
    }
    /**
     * 当选中其中一个选项卡时，其他选项卡重置为默认
     */
    private void clearChioce() {
        firstText.setTextColor(ContextCompat.getColor(this, R.color.home_bottom_font_normal));
        firstImage.setImageResource(R.drawable.home_bottom_tab_icon_message_normal);
        secondText.setTextColor(ContextCompat.getColor(this, R.color.home_bottom_font_normal));
        secondImage.setImageResource(R.drawable.home_bottom_tab_icon_contact_normal);
        fourthText.setTextColor(ContextCompat.getColor(this, R.color.home_bottom_font_normal));
        fourthImage.setImageResource(R.drawable.home_bottom_tab_icon_mine_normal);
    }
    /**
     * 隐藏Fragment
     *
     * @param fragmentTransaction
     */
    private void hideFragments(FragmentTransaction fragmentTransaction) {
        if (messageFragment != null) {
            fragmentTransaction.hide(messageFragment);
        }
        if (contactsFragment != null) {
            fragmentTransaction.hide(contactsFragment);
        }
        if (myFragment != null) {
            fragmentTransaction.hide(myFragment);
        }
    }
    //这是最底层activity,不需要背景透明
}