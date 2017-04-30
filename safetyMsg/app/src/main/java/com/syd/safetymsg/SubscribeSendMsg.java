package com.syd.safetymsg;

import android.app.ActivityManager;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;

import com.litesuits.orm.db.assit.QueryBuilder;
import com.syd.common.utils.NotificationUtil;
import com.syd.safetymsg.Models.HttpsApi.MsgModel;
import com.syd.safetymsg.Models.HttpsApi.OftenList;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import microsoft.aspnet.signalr.client.hubs.HubProxy;

/**
 * Created by east on 2017/4/29.
 */

public class SubscribeSendMsg {
    public static void sendMsg(Context context, HashMap<String, SignalrService.ClientCallback> clientCallbacks, HubProxy mHubProxy_msgManager, MsgModel model) {
        //接受到新的消息要进行数据库更新
        //告诉后台,已经收到了这条消息
        MsgModel result = model;
        Map<String, String> par = new HashMap<>();
        par.put("NoSendKey", result.getNoSendKey());
        mHubProxy_msgManager.invoke("sendMsgReturn", par);
        //开始更新本地数据库
        OftenList oldOften = null;
        String key = model.getReceivedKey() + model.getSendKey();
        if (model.getSendKey().equals(SignalrService.getUserInfo().getKey())) {
            key = model.getSendKey() + model.getReceivedKey();
        }
        List<OftenList> oftenLists = ThisApplication.getInstance().liteOrm.query(new QueryBuilder<OftenList>(OftenList.class).where("Key = ?", new String[]{key}));
        if (oftenLists.size() != 0) {
            oldOften = oftenLists.get(0);
        }
//        for (OftenList often : SignalrService.getOftenLists()) {
////如果是个人聊天
//            if (model.getType().equals("1")) {
//                if (SignalrService.getUserInfo().getKey().equals(result.getSendKey())) {
//                    //如果是我发送的
//                    if (often.getFriendKey().equals(model.getReceivedKey())) {
//                        oldOften = often;
//                        break;
//                    }
//                } else {
//                    //不是我发的
//                    if (often.getFriendKey().equals(model.getSendKey())) {
//                        oldOften = often;
//                        break;
//                    }
//                }
//            } else {
//                //如果是群聊天
//                if (often.getFriendKey().equals(model.getReceivedKey())) {
//                    //如果找到旧的
//                    oldOften = often;
//                    break;
//                }
//            }
//
//        }
        if (oldOften == null) {
            //添加一个
            OftenList newOften = new OftenList();
            newOften.setKey(model.getSendKey() + model.getReceivedKey());
            newOften.setEditTime(model.getSendTime());
            newOften.setLastTime(model.getSendTime());
            if (SignalrService.getUserInfo().getKey().equals(result.getSendKey())) {
                newOften.setFriendName(model.getReceivedName());
                newOften.setFriendKey(model.getReceivedKey());
            } else {
                newOften.setFriendName(model.getSendName());
                newOften.setFriendKey(model.getSendKey());
            }
            newOften.setMessageCount(0);
            newOften.setLastMsgContext(model.getContext());
            newOften.setType(model.getType());
            ThisApplication.getInstance().liteOrm.save(newOften);
            oldOften = newOften;
        } else {
            //修改原来的
            oldOften.setEditTime(model.getSendTime());
            oldOften.setLastTime(model.getSendTime());
            if (SignalrService.getUserInfo().getKey().equals(result.getSendKey())) {
                oldOften.setFriendName(model.getReceivedName());
                oldOften.setFriendKey(model.getReceivedKey());
            } else {
                oldOften.setFriendName(model.getSendName());
                oldOften.setFriendKey(model.getSendKey());
                oldOften.setMessageCount(oldOften.getMessageCount() + 1);
            }

            oldOften.setLastMsgContext(model.getContext());
            ThisApplication.getInstance().liteOrm.update(oldOften);
        }
        //遍历集合，通知所有的实现类，即activity
        Iterator iter = clientCallbacks.entrySet().iterator();
        while (iter.hasNext()) {
            Map.Entry entry = (Map.Entry) iter.next();
            //Object key = entry.getKey();
            SignalrService.ClientCallback val = (SignalrService.ClientCallback) entry.getValue();
            val.editOftenInfo(oldOften);
        }
        if (!SignalrService.getUserInfo().getKey().equals(result.getSendKey())) {

            Intent[] intents = new Intent[2];
            intents[0] = Intent.makeRestartActivityTask(new ComponentName(context, MainActivity.class));
            intents[1] = new Intent(context, MessageSendActivity.class);
            //
            oldOften.setLastMsgContext(result.getContext());
            oldOften.setFriendKey(result.getSendKey());
            oldOften.setUserKey(SignalrService.getUserInfo().getKey());
            oldOften.setFriendName(result.getSendName());
            oldOften.setLastTime(result.getSendTime());
            oldOften.setType(result.getType());

            intents[1].putExtra("often", oldOften);
            PendingIntent contentIntent = PendingIntent.getActivities(
                    context,
                    0,
                    intents,
                    PendingIntent.FLAG_UPDATE_CURRENT);//|PendingIntent.FLAG_CANCEL_CURRENT
            String titstr = result.getSendName();
            if (SignalrService.getNew_Message_Count() > 1) {
                titstr = "(共" + SignalrService.getNew_Message_Count() + "条)" + result.getSendName();
            }

            NotificationUtil.notification(context, contentIntent, 0, R.mipmap.logo, "新消息", titstr + "   " + Utils.dateFormat(result.getSendTime()), result.getContext());
            SignalrService.setNew_Message_Count(SignalrService.getNew_Message_Count() + 1);
        }
    }

    private static String getRunningActivityName(Context context) {
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        String runningActivity = activityManager.getRunningTasks(1).get(0).topActivity.getClassName();
        return runningActivity;
    }
}