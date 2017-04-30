package com.syd.safetymsg;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.os.Bundle;
import android.support.v4.app.ListFragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.BaseAdapter;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.alibaba.fastjson.JSON;
import com.daimajia.androidanimations.library.Techniques;
import com.daimajia.androidanimations.library.YoYo;
import com.daimajia.swipe.SimpleSwipeListener;
import com.daimajia.swipe.SwipeLayout;
import com.daimajia.swipe.adapters.BaseSwipeAdapter;
import com.google.gson.JsonElement;
import com.litesuits.orm.db.assit.QueryBuilder;
import com.litesuits.orm.log.OrmLog;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.syd.safetymsg.Models.HttpsApi.MsgModel;
import com.syd.safetymsg.Models.HttpsApi.OftenList;
import com.syd.safetymsg.Models.HttpsApi.UserInfo;
import com.yalantis.phoenix.PullToRefreshView;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;
import java.util.Objects;

import microsoft.aspnet.signalr.client.Action;
import microsoft.aspnet.signalr.client.ErrorCallback;
import microsoft.aspnet.signalr.client.SignalRFuture;

import static android.content.Context.BIND_AUTO_CREATE;

/**
 * Created by 78967 on 2017/2/15.
 */

public class MessageFragment extends Fragment implements SignalrService.ClientCallback, SignalrService.Callback {
    private String TAG = getClass().getName();
    private ListView mListView;
    private MessageListViewAdapter mTitleAdapter;
    private List<OftenList> mOftenList=new ArrayList<>();
    private Handler handler;

    private  View lLoadingView;
    private MainActivity mainActivity;
    private Context context;

    private TextView no_conn_ser;

    public MessageFragment(MainActivity activity){
        mainActivity=activity;
        mainActivity.service.addClientCallback(this);
        mainActivity.Callback=MessageFragment.this;
    }
    private final int SERVICE_CLOSED=0;
    private final int SERVICE_CONNECTED=1;
    //刷新列表
    private final int RE_VIEW_OFTEN_LIST=3;
    //接受线程消息
    private void handlerEvent(){
        //handler与线程之间的通信及数据处理
        handler = new Handler() {
            public void handleMessage(Message msg) {
                if (msg.what == SERVICE_CLOSED) {
                    no_conn_ser.setVisibility(View.VISIBLE);
                    //mPullToRefreshView.setRefreshing(false);

                }
                if (msg.what == SERVICE_CONNECTED) {
                    //mPullToRefreshView.setRefreshing(false);
                    no_conn_ser.setVisibility(View.GONE);
                    LoadData();
                }
                if (msg.what == RE_VIEW_OFTEN_LIST) {
                    mListView.setVisibility(View.VISIBLE);
                    lLoadingView.setVisibility(View.GONE);
                    mTitleAdapter.notifyDataSetChanged();
                }
            }
        };
    }
    @Override
    public void closed() {
        //当没有连接服务器的时候
        Message message=new Message();
        message.what=SERVICE_CLOSED;
        handler.sendMessage(message);

    }

    @Override
    public void connected() {
        //连接成功
        Message message=new Message();
        message.what=SERVICE_CONNECTED;
        handler.sendMessage(message);

    }
//    PullToRefreshView mPullToRefreshView;
//    public static final int REFRESH_DELAY = 2000;

    AdapterView.OnItemClickListener mItemClickListener = new AdapterView.OnItemClickListener() {
        @Override
        public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
            String title = null;
            OftenList titleData = (OftenList) mTitleAdapter.getItem(position);
            if (titleData != null) {
                title = titleData.getFriendName();
                if (title != null) {
                    Log.i(TAG,title);
                    Intent intent=new Intent(((MainActivity) getActivity()), MessageSendActivity.class);
                    intent.putExtra("often",titleData);
                    startActivity(intent);
                }
            }
        }
    };
    AdapterView.OnItemLongClickListener mLongClickListener = new AdapterView.OnItemLongClickListener() {

        @Override
        public boolean onItemLongClick(AdapterView<?> parent, View view, int position, long id) {
            return false;
        }
    };

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.message_fg, container, false);
        context=getContext();
        mOftenList=new ArrayList<OftenList>();
        mListView = (ListView) view.findViewById(R.id.listView);
        mTitleAdapter = new MessageListViewAdapter();
        mListView.setAdapter(mTitleAdapter);
        mListView.setOnItemClickListener(mItemClickListener);
        mListView.setOnItemLongClickListener(mLongClickListener);
        //绑定加载中等组件
        lLoadingView=view.findViewById(R.id.layout_loading);
        no_conn_ser=(TextView)view.findViewById(R.id.no_conn_ser);
//        mPullToRefreshView = (PullToRefreshView) view.findViewById(R.id.pull_to_refresh);
//        mPullToRefreshView.setOnRefreshListener(new PullToRefreshView.OnRefreshListener() {
//            @Override
//            public void onRefresh() {
//                LoadData();
//                mPullToRefreshView.postDelayed(new Runnable() {
//                    @Override
//                    public void run() {
//                        mPullToRefreshView.setRefreshing(false);
//                    }
//                }, REFRESH_DELAY);
//            }
//        });
        handlerEvent();
        mListView.setVisibility(View.GONE);
        lLoadingView.setVisibility(View.VISIBLE);
        LoadData();
        return view;
    }

    private  void  LoadData() {
        List<OftenList> list = ThisApplication.getInstance().liteOrm.query(new QueryBuilder<OftenList>(OftenList.class));
        mOftenList.clear();
        mOftenList.addAll(list);
        Message Message = new Message();
        Message.what = RE_VIEW_OFTEN_LIST;
        handler.sendMessage(Message);
    }




    class MessageListViewAdapter extends BaseSwipeAdapter {

        @Override
        public int getCount() {
            return mOftenList.size();
        }

        @Override
        public Object getItem(int position) {
            return mOftenList.get(position);
        }

        @Override
        public long getItemId(int position) {
            return position;
        }

        @Override
        public int getSwipeLayoutResourceId(int position) {
            return R.id.swipe;
        }

        @Override
        public View generateView(int position, ViewGroup parent) {

            View view = getActivity().getLayoutInflater().inflate(R.layout.message_list_item, null);
            SwipeLayout swipeLayout = (SwipeLayout)view.findViewById(getSwipeLayoutResourceId(position));
            swipeLayout.addSwipeListener(new SimpleSwipeListener() {
                @Override
                public void onOpen(SwipeLayout layout) {
                    YoYo.with(Techniques.Tada).duration(500).delay(100).playOn(layout.findViewById(R.id.trash));
                }
            });
            view.findViewById(R.id.delete).setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(getActivity(), "click delete", Toast.LENGTH_SHORT).show();
                }
            });
            ViewHolder viewHolder;
            viewHolder = (ViewHolder) view.getTag();
            if (viewHolder == null) {
                viewHolder = new ViewHolder();
                viewHolder.mTitleImageView = (ImageView) view.findViewById(R.id.titleImageView);
                viewHolder.mTitleTextView = (TextView) view.findViewById(R.id.titleTextView);
                viewHolder.mMessageTextView = (TextView) view.findViewById(R.id.messageTextView);
                viewHolder.mTimeTextView = (TextView) view.findViewById(R.id.timeTextView);
                viewHolder.mOtherTextView=(TextView)view.findViewById(R.id.otherTextView) ;
                view.setTag(viewHolder);
            }


            return view;
        }
        @Override
        public void fillValues(int position, View convertView){
            ViewHolder viewHolder = (ViewHolder) convertView.getTag();

            final OftenList data = (OftenList) getItem(position);
            viewHolder.mTitleTextView.setText(data.getFriendName());

            ImageLoader.getInstance().displayImage(CommHttp.getHeadPic(data.getFriendKey(), data.getType()), viewHolder.mTitleImageView);

            viewHolder.mMessageTextView.setText(SpanStringUtils.getEmotionContent(context,viewHolder.mMessageTextView,data.getLastMsgContext()));
            if (data.getLastTime() != null)
                viewHolder.mTimeTextView.setText(Utils.dateFormat(data.getLastTime()));
            else
                viewHolder.mTimeTextView.setText(Utils.dateFormat(data.getEditTime()));
            if(data.getMessageCount()==0){
                viewHolder.mOtherTextView.setVisibility(View.GONE);
            }
            else{
                viewHolder.mOtherTextView.setVisibility(View.VISIBLE);
                viewHolder.mOtherTextView.setText(data.getMessageCount()>99?"99+":data.getMessageCount()+"");
            }
        }

        class ViewHolder {
            protected ImageView mTitleImageView;
            protected TextView mTitleTextView;
            protected TextView mMessageTextView;
            protected  TextView mTimeTextView;
            protected TextView mOtherTextView;
        }
    }


    @Override
    public void exceptionHandler(String errMsg) {

    }

    @Override
    public void sendMsg(MsgModel model) {

    }

    @Override
    public void reLoadOftenList() {

    }

    @Override
    public void editOftenInfo(OftenList often) {
        //如果某一个发生变化,在这里进行修改,不用从新读取数据库
        for (OftenList o:mOftenList){
            if(o.getKey().equals(often.getKey()))
            {
                mOftenList.remove(o);
                break;
            }
        }
        mOftenList.add(0,often);
        Message Message = new Message();
        Message.what = RE_VIEW_OFTEN_LIST;
        handler.sendMessage(Message);
    }
}