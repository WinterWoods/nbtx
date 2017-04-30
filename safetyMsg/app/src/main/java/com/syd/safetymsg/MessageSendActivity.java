package com.syd.safetymsg;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.widget.LinearLayoutManager;
import android.text.Editable;
import android.text.InputType;
import android.text.TextWatcher;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.support.v7.widget.RecyclerView;

import com.nostra13.universalimageloader.core.ImageLoader;
import com.syd.common.utils.InputMethodUtils;
import com.syd.common.utils.ToastUtil;
import com.syd.safetymsg.Models.HttpsApi.MessageResultModel;
import com.syd.safetymsg.Models.HttpsApi.MsgInfo;
import com.syd.safetymsg.Models.HttpsApi.MsgModel;
import com.syd.safetymsg.Models.HttpsApi.OftenList;
import com.syd.swipebacklayout.lib.app.SwipeBackActivity;
import com.syd.szui.BackEditText;
import com.syd.szui.SelectorImageView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import microsoft.aspnet.signalr.client.Action;


public class MessageSendActivity extends SwipeBackActivity implements View.OnClickListener, SignalrService.ClientCallback, View.OnFocusChangeListener {
    private String TAG = getClass().getName();
    private OftenList often;
    private TextView textView_name;
    private ImageView imageView_back;
    private ImageView imageView_userinfo;
    private RecyclerView recyclerView;
    private ChatAdapter adapter;
    private Handler handler;
    public SignalrService service;
    private MyServiceConn conn;
    //输入内容矿体
    private BackEditText etContext;
    //键盘是否显示标志
    private boolean imFlag=false;
    private boolean fragmentFlag=false;
    private ImageView imageview_ib_face;
    private IbFaceFragment ibFaceFragment;
    private BottomOtherFragment bottomOtherFragment;
    private View message_send_bottom_frame;
    //发送按钮
    private SelectorImageView selectorImageView;
    private Button btn_send;
    LinearLayoutManager linearLayoutManager;
    private ArrayList<MsgInfo> dataList = new ArrayList<>();

    private Context context;
    private int softInpputHeight=700;
    private boolean isHaveInputHeight=false;
    private int backFlag=0;
    private boolean inputFlag=false;
    private View view_line;
    private int ibFaceNum=0;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        InitView();
        handlerEvent();
        LoadData();
        getKeyboradHeight();
        //InputMethodUtils
    }
    private void InitView(){
        context=this;
        setContentView(R.layout.activity_message_send);
        textView_name=(TextView)findViewById(R.id.textView_name);
        imageView_back=(ImageView)findViewById(R.id.message_send_back);
        imageView_back.setOnClickListener(this);
        imageView_userinfo=(ImageView)findViewById(R.id.message_send_userinfo);
        imageView_userinfo.setOnClickListener(this);

        recyclerView = (RecyclerView) findViewById(R.id.recylerView);
        recyclerView.setHasFixedSize(true);
        linearLayoutManager=  new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false);
        recyclerView.setLayoutManager(linearLayoutManager);
        adapter = new ChatAdapter();
        adapter.setmItemClickListener(itemClickListener);
        recyclerView.setAdapter(adapter);


        selectorImageView=(SelectorImageView)findViewById(R.id.tv_send_other);
        selectorImageView.setOnClickListener(this);

        etContext=(BackEditText)findViewById(R.id.et);
        etContext.setOnFocusChangeListener(this);

        etContext.setOnTouchListener(new View.OnTouchListener(){
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                int inType = etContext.getInputType(); // backup the input type
                etContext.setInputType(InputType.TYPE_NULL); // disable soft input
                etContext.onTouchEvent(event); // call native handler
                etContext.setInputType(inType); // restore input type
                etContext.setSelection(etContext.getText().length());
                InputMethodUtils.showSoftInput(v);
                inputFlag=true;
                imFlag=true;
                fragmentFlag=true;
                ShowIbFaceFrame(ibFaceFragment);

                return true;
            }
        });
        etContext.addTextChangedListener(new EditChangedListener());
        etContext.setBackListener(new BackEditText.BackListener() {
            @Override
            public void back(TextView textView) {
                if(message_send_bottom_frame.getVisibility()==View.VISIBLE||backFlag<2){
                    //InputMethodUtils.hideSoftInput(getWindow().getDecorView());
                    HideIbFace();
                    backFlag=backFlag+1;
                }
                else{
                    finish();
                }
            }
        });
        GlobalOnItemClickManagerUtils.getInstance(context).attachToEditText(etContext);


        btn_send=(Button)findViewById(R.id.btn_send);
        btn_send.setOnClickListener(this);


        imageview_ib_face=(ImageView)findViewById(R.id.imageview_ib_face);
        imageview_ib_face.setOnClickListener(this);
        ibFaceFragment = new IbFaceFragment();
        bottomOtherFragment=new BottomOtherFragment();
        view_line=(View)findViewById(R.id.view_line);
        message_send_bottom_frame=findViewById(R.id.message_send_bottom_frame);
        softInpputHeight=ThisApplication.getInstance().dataKeeper.getInt("softInpputHeight",softInpputHeight);

        new Handler().postDelayed(new Runnable(){
            public void run() {
                getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
                Log.i(TAG,"输入法 模式SOFT_INPUT_ADJUST_PAN:"+getWindow().getAttributes().softInputMode);
            }
        }, 200);

        if(softInpputHeight!=700){
            ViewGroup.LayoutParams layoutParams= message_send_bottom_frame.getLayoutParams();
            //layoutParams
            layoutParams.height=softInpputHeight;
            isHaveInputHeight=true;
            new Handler().postDelayed(new Runnable(){
                public void run() {
                    getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
                    Log.i(TAG,"输入法 模式SOFT_INPUT_ADJUST_PAN:"+getWindow().getAttributes().softInputMode);
                }
            }, 200);
        }

    }
    class EditChangedListener implements TextWatcher {

        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
            if(etContext.getText().length()>0){
                btn_send.setVisibility(View.VISIBLE);
                selectorImageView.setVisibility(View.GONE);

            }
            else{
                selectorImageView.setVisibility(View.VISIBLE);
                btn_send.setVisibility(View.GONE);
            }
        }

        @Override
        public void afterTextChanged(Editable s) {

        }
    };
    private MyItemClickListener itemClickListener= new MyItemClickListener() {
        @Override
        public void onItemClick(View view, int position) {
            ToastUtil.showShort(context,dataList.get(position).getContext());
        }
    };
    private void LoadData(){

        Intent intent = this.getIntent();
        often=(OftenList)intent.getSerializableExtra("often");
        textView_name.setText(often.getFriendName());
        often.setMessageCount(0);

        SignalrService.EditOften(often);
        SignalrService.setNew_Message_Init();
        conn=new MyServiceConn();
        bindService(new Intent(this, SignalrService.class), conn,
                BIND_AUTO_CREATE);
    }
    private void getKeyboradHeight() {
        final Activity activity = this;

        SoftKeyboardUtil.observeSoftKeyboard(this, new SoftKeyboardUtil.OnSoftKeyboardChangeListener() {
            @Override
            public void onSoftKeyBoardChange(int softKeybardHeight, boolean visible) {
                Log.i(TAG,"键盘高度:"+softKeybardHeight+","+ (visible?"显示":"不显示"));
                if(visible&&!isHaveInputHeight){
                    isHaveInputHeight=true;
                    softInpputHeight=softKeybardHeight;
                    ThisApplication.getInstance().dataKeeper.putInt("softInpputHeight",softKeybardHeight);
                    //设置底部高度
                    ViewGroup.LayoutParams layoutParams= message_send_bottom_frame.getLayoutParams();
                    //layoutParams
                    layoutParams.height=softInpputHeight;
                    ShowIbFaceFrame(ibFaceFragment);
                    new Handler().postDelayed(new Runnable(){
                        public void run() {
                            getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING);
                            Log.i(TAG,"输入法 模式SOFT_INPUT_ADJUST_NOTHING:"+getWindow().getAttributes().softInputMode);
                        }
                    }, 200);
                }
            }
        });
    }
//初始化表情高度
        //ViewGroup.LayoutParams layoutParams= message_send_bottom_frame.getLayoutParams();
        //layoutParams.height=softInpputHeight;

    //接受线程消息
    private void handlerEvent(){
        //handler与线程之间的通信及数据处理
        handler = new Handler() {
            public void handleMessage(Message msg) {
                if (msg.what == 0) {

                    adapter.notifyDataSetChanged();
                    recyclerView.smoothScrollToPosition(dataList.size());
                }
                if(msg.what==1){
                    adapter.notifyDataSetChanged();
                    recyclerView.smoothScrollToPosition(dataList.size());
                    etContext.setText("");
                }
            }
        };
    }

    @Override
    public void exceptionHandler(String errMsg) {

    }

    @Override
    public void sendMsg(MsgModel model) {
        if(model.getType().equals("1")){
            //如果是个人聊天
            if(model.getSendKey().equals(SignalrService.getUserInfo().getKey())){
                if(!model.getReceivedKey().equals(often.getFriendKey())){
                    //如果是我发的,但是不是发给这个人的,不处理
                    return;
                }
            }
            else{
                if(!model.getSendKey().equals(often.getFriendKey())){
                    //如果不是我发的,但是不是发给我的,不处理
                    return;
                }
            }
        }
        else {
            if(!model.getReceivedKey().equals(often.getFriendKey())){
                //如果不是这个群不处理
                return;
            }
        }

        Log.i(TAG, model.getKey());
        MsgInfo msgInfo=new MsgInfo();
        msgInfo.setContext(model.getContext());
        msgInfo.setKey(model.getKey());
        msgInfo.setMsgType(model.getMsgType());
        msgInfo.setSendTime(model.getSendTime());
        msgInfo.setReadTime(model.getReadTime());
        msgInfo.setType(model.getType());
        msgInfo.setReceivedKey(model.getReceivedKey());
        dataList.add(msgInfo);
        Message msg = new Message();
        msg.what = 1;
        handler.sendMessage(msg);
    }

    @Override
    public void reLoadOftenList() {

    }

    @Override
    public void editOftenInfo(OftenList often) {

    }

    @Override
    public void onFocusChange(View v, boolean hasFocus) {

    }

    class MyServiceConn implements ServiceConnection {

        @Override
        public void onServiceConnected(ComponentName name, IBinder binder) {
            service = ((SignalrService.MyBinder) binder).getService();
            //将当前activity添加到接口集合中
            service.addClientCallback(MessageSendActivity.this);
            Map<String,String> map=new HashMap<>();
            map.put("SendKey", often.getFriendKey());
            map.put("Type",often.getType());
            map.put("PageSize","5");
            map.put("LastMsgKey","");
            service.msgManagerInvoke(MessageResultModel.class,"messageList", new SignalrService.sendCallback<MessageResultModel>() {
                @Override
                public void successed(MessageResultModel obj) {
                    dataList.clear();
                    for(MsgInfo msg:obj.getData()){
                        Log.i(TAG,msg.getKey());
                        dataList.add(msg);
                    }
                    Message msg = new Message();
                    msg.what = 0;
                    handler.sendMessage(msg);
                }

                @Override
                public void error(String msg) {
                    //TODO 没有添加失败事件
                }
            },map);
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
            case R.id.message_send_back:
                finish();
                break;
            case R.id.message_send_userinfo:
                ToastUtil.showShort(this,often.getFriendName());
                break;
            case R.id.imageview_ib_face:
                ibFaceClick(ibFaceFragment);
                break;
            case  R.id.btn_send:
                //发送消息
                SendMessage();
                break;
            case R.id.tv_send_other:
                //发送其他信息,比如文件,照片,等.
                ibFaceClick(bottomOtherFragment);
                break;
            default:
                break;
        }
    }
    private void SendMessage(){
        String content=etContext.getText().toString();
        if(content.length()>200){
            ToastUtil.showShort(this,"消息太长了.");
        }
        if(content.length()==0){
            ToastUtil.showShort(this,"空消息就不要发了.");
        }
        Map<String,String> par=new HashMap<>();
        par.put("ReceivedKey",often.getFriendKey());
        par.put("Type",often.getType());
        par.put("Context",etContext.getText().toString());
        par.put("MsgType","1");
        service.msgManagerInvoke(MsgInfo.class, "sendMessage", new SignalrService.sendCallback<MsgInfo>() {
            @Override
            public void successed(MsgInfo obj) {
                dataList.add(obj);
                Message msg = new Message();
                msg.what = 1;
                handler.sendMessage(msg);

            }

            @Override
            public void error(String msg) {
                //TODO 没有添加失败事件
            }
        },par);
    }
    private String LastFragment="";
    private void ibFaceClick(Fragment fragmentActivity){
        etContext.setFocusable(true);
        etContext.setFocusableInTouchMode(true);
        etContext.requestFocus();
        etContext.requestFocusFromTouch();
        if(!LastFragment.equals(fragmentActivity.getClass().toString())&&!imFlag){
            ibFaceNum=0;
            LastFragment=fragmentActivity.getClass().toString();
        }
        if(ibFaceNum>0){
            InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
            imm.toggleSoftInput(InputMethodManager.SHOW_FORCED, 0);
            imFlag=!imFlag;
        }
        else{
            imFlag=false;
        }
        ShowIbFaceFrame(fragmentActivity);
    }
    private void ShowIbFaceFrame(Fragment fragmentActivity){
        ibFaceNum=ibFaceNum+1;
        //
        if(imFlag){
            imageview_ib_face.setImageResource(R.drawable.ib_face_normal);
        }
        else{
            imageview_ib_face.setImageResource(R.drawable.ib_face_pressed);
        }
        ShowBottomFrame(fragmentActivity);
    }
    private void ShowBottomFrame(Fragment fragmentActivity){
        message_send_bottom_frame.setVisibility(View.VISIBLE);
        FragmentTransaction transaction =getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.message_send_bottom_frame,fragmentActivity);
        transaction.addToBackStack(null);
        transaction.commit();
        Log.i(TAG,"输入法 模式commit:"+getWindow().getAttributes().softInputMode);
        new Handler().postDelayed(new Runnable(){
            public void run() {
                Log.i(TAG,"输入法 模式postDelayed:"+getWindow().getAttributes().softInputMode);
                recyclerView.smoothScrollToPosition(dataList.size());
            }
        }, 300);
    }
    private void HideIbFace(){
        ibFaceNum=0;
        imageview_ib_face.setImageResource(R.drawable.ib_face_normal);
        imFlag=false;
        message_send_bottom_frame.setVisibility(View.GONE);
    }
    public interface MyItemClickListener {
        void onItemClick(View view, int position);
    }
    class ChatAdapter extends RecyclerView.Adapter<ChatAdapter.BaseAdapter> {

        private MyItemClickListener mItemClickListener;

        public void setmItemClickListener(MyItemClickListener mItemClickListener) {
            this.mItemClickListener = mItemClickListener;
        }

        public void replaceAll(ArrayList<MsgInfo> list) {
            dataList.clear();
            if (list != null && list.size() > 0) {
                dataList.addAll(list);
            }
            notifyDataSetChanged();
        }

        public void addAll(ArrayList<MsgInfo> list) {
            if (dataList != null && list != null) {
                dataList.addAll(list);
                notifyItemRangeChanged(dataList.size(),list.size());
            }

        }

        @Override
        public ChatAdapter.BaseAdapter onCreateViewHolder(ViewGroup parent, int viewType) {
            MsgInfo msg=dataList.get(viewType);
            if(msg.getType().equals("1")){
                //如果是1对1聊天
                if(!msg.getReceivedKey().equals(SignalrService.getUserInfo().getKey()))
                {
                    //如果是我发送的
                    if(msg.getMsgType().equals("1")){
                        //如果是文字
                        return new ChatTextRightViewHolder(LayoutInflater.from(parent.getContext()).inflate(R.layout.chat_text_right, parent, false),this.mItemClickListener);
                    }
                }
                else{
                    //如果不是我发送的
                    if(msg.getMsgType().equals("1")){
                        //如果是文字
                        return new ChatTextLeftViewHolder(LayoutInflater.from(parent.getContext()).inflate(R.layout.chat_text_left, parent, false),this.mItemClickListener);
                    }
                }

            }
            else{
                //如果是群聊
            }
            if(msg.getMsgType()=="1"){
                return new ChatTextLeftViewHolder(LayoutInflater.from(parent.getContext()).inflate(R.layout.chat_text_left, parent, false),this.mItemClickListener);
            }
            return null;
        }

        @Override
        public void onBindViewHolder(ChatAdapter.BaseAdapter holder, int position) {
            holder.setData(dataList.get(position));
        }

        @Override
        public int getItemViewType(int position) {
            return position;
        }

        @Override
        public int getItemCount() {
            return dataList != null ? dataList.size() : 0;
        }

        public class BaseAdapter extends RecyclerView.ViewHolder {

            public BaseAdapter(View itemView) {
                super(itemView);
            }

            void setData(Object object) {

            }
        }

        private class ChatTextLeftViewHolder extends BaseAdapter implements View.OnClickListener {
            private ImageView ic_user;
            private TextView tv;
            private MyItemClickListener mListener;

            public ChatTextLeftViewHolder(View view,MyItemClickListener myItemClickListener) {
                super(view);
                ic_user = (ImageView) itemView.findViewById(R.id.titleImageView);
                tv = (TextView) itemView.findViewById(R.id.tv);
                mListener=myItemClickListener;
                view.setOnClickListener(this);
            }

            @Override
            void setData(Object object) {
                super.setData(object);
                MsgInfo model = (MsgInfo) object;
                ImageLoader.getInstance().displayImage(CommHttp.getHeadPic(model.getReceivedKey(), model.getType()), ic_user);
                //Picasso.with(itemView.getContext()).load(model.getIcon()).placeholder(R.mipmap.ic_launcher).into(ic_user);

                tv.setText(SpanStringUtils.getEmotionContent(context,tv,model.getContext()));
            }

            @Override
            public void onClick(View v) {
                mListener.onItemClick(v,getLayoutPosition());
            }
        }

        private class ChatTextRightViewHolder extends BaseAdapter implements View.OnClickListener {
            private ImageView ic_user;
            private TextView tv;
            private MyItemClickListener mListener;
            public ChatTextRightViewHolder(View view,MyItemClickListener myItemClickListener) {
                super(view);
                ic_user = (ImageView) itemView.findViewById(R.id.titleImageView);
                tv = (TextView) itemView.findViewById(R.id.tv);
                mListener=myItemClickListener;
                view.setOnClickListener(this);
            }

            @Override
            void setData(Object object) {
                super.setData(object);
                MsgInfo model = (MsgInfo) object;
                ImageLoader.getInstance().displayImage(CommHttp.getHeadPic(SignalrService.getUserInfo().getKey(), model.getType()), ic_user);


                tv.setText(SpanStringUtils.getEmotionContent(context,tv,model.getContext()));
            }

            @Override
            public void onClick(View v) {
                mListener.onItemClick(v,getLayoutPosition());
            }
        }
    }
    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        if (ev.getAction() == MotionEvent.ACTION_DOWN) {
            View v = getCurrentFocus();
            if (isShouldHideInput(v, ev)) {
                InputMethodUtils.hideSoftInput(v);
                imFlag=false;
                inputFlag=false;
                HideIbFace();
            }
            return super.dispatchTouchEvent(ev);
        }
        // 必不可少，否则所有的组件都不会有TouchEvent了
        if (getWindow().superDispatchTouchEvent(ev)) {
            return true;
        }
        return onTouchEvent(ev);
    }
    public  boolean isShouldHideInput(View v, MotionEvent event) {
        if (v != null ) {
            int[] leftTop = { 0, 0 };
            //获取输入框当前的location位置
            view_line.getLocationInWindow(leftTop);
            int left = leftTop[0];
            int top = leftTop[1];
            int bottom = top + v.getHeight();
            int right = left + v.getWidth();
            if (event.getY() > 0 &&
                    event.getY() < top) {
                // 点击的是输入框区域，保留点击EditText的事件
                return true;
            } else {
                return false;
            }
        }
        return false;
    }
    @Override
    protected void onDestroy() {
        // TODO Auto-generated method stub
        super.onDestroy();
        service.removeClientCallback(this);
        unbindService(conn);
    }
}
