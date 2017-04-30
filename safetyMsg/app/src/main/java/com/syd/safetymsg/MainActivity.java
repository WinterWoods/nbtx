package com.syd.safetymsg;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.res.ColorStateList;
import android.content.res.Resources;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.syd.common.io.stream.StringBuilderWriter;
import com.syd.common.utils.ToastUtil;
import com.syd.safetymsg.Models.HttpsApi.MsgModel;
import com.syd.safetymsg.Models.HttpsApi.OftenList;
import com.syd.safetymsg.Models.HttpsApi.UserInfo;

public class MainActivity extends FragmentActivity implements OnClickListener,SignalrService.ClientCallback, SignalrService.Callback {
    private Context context;
    // 初始化顶部栏显示
    private ImageView titleLeftImv;
    private TextView titleTv;
    // 定义4个Fragment对象
    private MessageFragment messageFragment;
    private ContactsFragment contactsFragment;
    private MyFragment myFragment;
    private Handler handler;
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

    public SignalrService.Callback Callback;

    @Override
    public void exceptionHandler(String errMsg) {
        ToastUtil.showShort(this,errMsg);
    }

    @Override
    public void sendMsg(MsgModel model) {

    }
    //当接受到新的消息的时候


    @Override
    public void reLoadOftenList() {

    }

    @Override
    public void editOftenInfo(OftenList often) {
        //在这里修改有没有新消息
    }

    @Override
    public void closed() {
        Message message = new Message();
        message.what = 1;
        handler.sendMessage(message);
        if(Callback!=null)
            Callback.closed();
    }

    @Override
    public void connected() {
        Message message = new Message();
        message.what = 2;
        handler.sendMessage(message);
        if(Callback!=null)
            Callback.connected();

    }


    //接受线程消息
    private void handlerEvent(){
        //handler与线程之间的通信及数据处理
        handler = new Handler() {
            public void handleMessage(Message msg) {
                if(msg.what == 2) {
                    ToastUtil.showShort(context,"服务器连接成功!");
                }
                if(msg.what==1){
                    ToastUtil.showShort(context,"服务器断开,正在尝试!");
                }
            }
        };

    }
    class MyServiceConn implements ServiceConnection {

        @Override
        public void onServiceConnected(ComponentName name, IBinder binder) {
            service = ((SignalrService.MyBinder) binder).getService();
            setChioceItem(0); // 初始化页面加载时显示第一个选项卡
            service.addClientCallback(MainActivity.this);
            service.setCallback(MainActivity.this);


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
        context=this;
        fragmentManager = getSupportFragmentManager();
        initView(); // 初始化界面控件
        handlerEvent();

    }
    @Override
    protected void onResume()
    {
        super.onResume();
        conn=new MyServiceConn();
        bindService(new Intent(this, SignalrService.class), conn,
                BIND_AUTO_CREATE);

    }
    /**
     * 初始化页面
     */
    private void initView() {

        setContentView(R.layout.activity_main);
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
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            moveTaskToBack(false);
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}