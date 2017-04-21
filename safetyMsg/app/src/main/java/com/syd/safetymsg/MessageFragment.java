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
import com.google.gson.JsonElement;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.syd.safetymsg.Models.HttpsApi.OftenList;
import com.syd.safetymsg.Models.HttpsApi.UserInfo;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;
import java.util.Objects;

import microsoft.aspnet.signalr.client.Action;
import microsoft.aspnet.signalr.client.SignalRFuture;

import static android.content.Context.BIND_AUTO_CREATE;

/**
 * Created by 78967 on 2017/2/15.
 */

public class MessageFragment extends Fragment {
    private String TAG = getClass().getName();
    private ListView mListView;
    private MessageListViewAdapter mTitleAdapter;
    private List<OftenList> mOftenList;
    private Handler handler;

    private  View lLoadingView;
    private MainActivity mainActivity;
    public MessageFragment(MainActivity activity){
        mainActivity=activity;
    }

    AdapterView.OnItemClickListener mTitleListener = new AdapterView.OnItemClickListener() {
        @Override
        public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
            String title = null;
            OftenList titleData = (OftenList) mTitleAdapter.getItem(position);
            if (titleData != null) {
                title = titleData.getFriendName();
                if (title != null) {
                    Log.i(TAG,title);
                    Intent intent=new Intent(((MainActivity) getActivity()), MessageSendActivity.class);
                    startActivity(intent);
                }
            }
        }
    };

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.message_fg, container, false);
        mOftenList=new ArrayList<OftenList>();
        mListView = (ListView) view.findViewById(R.id.listView);
        mTitleAdapter = new MessageListViewAdapter();
        mListView.setAdapter(mTitleAdapter);
        mListView.setOnItemClickListener(mTitleListener);
        //绑定加载中等组件
        lLoadingView=view.findViewById(R.id.layout_loading);
        handlerEvent();
        LoadData();
        return view;
    }
    //接受线程消息
    private void handlerEvent(){
        //handler与线程之间的通信及数据处理
        handler = new Handler() {
            public void handleMessage(Message msg) {
                if (msg.what == 0) {
                    //msg.obj是获取handler发送信息传来的数据
                    //@SuppressWarnings("unchecked")
                    //List<TitleData> person = (List<TitleData>) msg.obj;
                    //给ListView绑定数据

                    mListView.setVisibility(View.VISIBLE);
                    lLoadingView.setVisibility(View.GONE);
                    mTitleAdapter.notifyDataSetChanged();
                }
            }
        };
    }
    private  void  LoadData() {
        //将页面显示为加载中
        mListView.setVisibility(View.GONE);
        lLoadingView.setVisibility(View.VISIBLE);
        //开一条子线程加载网络数据
        mainActivity.service.sendMsg(OftenList[].class,"myOftenList", new SignalrService.sendCallback<OftenList[]>() {
            @Override
            public void successed(OftenList[] obj) {
                for(OftenList often:obj){
                    Log.i(TAG,often.getUserKey());
                    mOftenList.add(often);
                }
                Message msg = new Message();
                msg.what = 0;
                msg.obj = mOftenList;
                handler.sendMessage(msg);
            }
        });
    }

    class MessageListViewAdapter extends BaseAdapter {

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
        public View getView(int position, View convertView, ViewGroup parent) {
            ViewHolder viewHolder;
            View view = convertView;

            if (view == null) {
                view = getActivity().getLayoutInflater().inflate(R.layout.message_list_item, null);
                viewHolder = new ViewHolder();
                viewHolder.mTitleImageView = (ImageView) view.findViewById(R.id.titleImageView);
                viewHolder.mTitleTextView = (TextView) view.findViewById(R.id.titleTextView);
                viewHolder.mMessageTextView = (TextView) view.findViewById(R.id.messageTextView);
                viewHolder.mTimeTextView = (TextView) view.findViewById(R.id.timeTextView);
                view.setTag(viewHolder);
            } else {
                viewHolder = (ViewHolder) view.getTag();
            }

            final OftenList data = (OftenList) getItem(position);
            viewHolder.mTitleTextView.setText(data.getFriendName());

            ImageLoader.getInstance().displayImage(CommHttp.getHeadPic(data.getFriendKey(), data.getType()), viewHolder.mTitleImageView);
            viewHolder.mMessageTextView.setText(data.getLastMsgContext());
            if (data.getLastTime() != null)
                viewHolder.mTimeTextView.setText(Utils.dateFormat(data.getLastTime()));
            else
                viewHolder.mTimeTextView.setText(Utils.dateFormat(data.getEditTime()));
            return view;
        }

        class ViewHolder {
            protected ImageView mTitleImageView;
            protected TextView mTitleTextView;
            protected TextView mMessageTextView;
            protected  TextView mTimeTextView;
        }
    }
}