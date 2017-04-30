package com.syd.safetymsg;

import android.app.Activity;
import android.graphics.Rect;
import android.nfc.Tag;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.ViewTreeObserver;

import com.syd.common.log.Log;

/**
 * Created by east on 2017/4/27.
 */

public class SoftKeyboardUtil {
    public static void observeSoftKeyboard(final Activity activity, final OnSoftKeyboardChangeListener listener) {
        final View decorView = activity.getWindow().getDecorView();
        decorView.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            int previousKeyboardHeight = -1;
            @Override
            public void onGlobalLayout() {
                Rect rect = new Rect();
                decorView.getWindowVisibleDisplayFrame(rect);
                int screenHeight = activity.getWindow().getDecorView().getRootView().getHeight()-rect.top-getSoftButtonsBarHeight(activity);
                int displayHeight = rect.bottom - rect.top;
                int keyboardHeight = screenHeight - displayHeight;
                Log.i("!!!!!!","虚拟键盘;"+keyboardHeight);
                //int height = screenHeight-keyboardHeight;

                if (previousKeyboardHeight != keyboardHeight) {
                    boolean hide = (double) displayHeight / screenHeight > 0.8;
                    listener.onSoftKeyBoardChange(keyboardHeight, !hide);

                }


                previousKeyboardHeight = keyboardHeight;

            }
        });
    }
    private static int getSoftButtonsBarHeight(Activity activity) {
        DisplayMetrics metrics = new DisplayMetrics();
        //这个方法获取可能不是真实屏幕的高度
        activity.getWindowManager().getDefaultDisplay().getMetrics(metrics);
        int usableHeight = metrics.heightPixels;
        //获取当前屏幕的真实高度
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            activity.getWindowManager().getDefaultDisplay().getRealMetrics(metrics);
        }
        int realHeight = metrics.heightPixels;
        if (realHeight > usableHeight) {
            return realHeight - usableHeight;
        } else {
            return 0;
        }
    }
    public interface OnSoftKeyboardChangeListener {
        void onSoftKeyBoardChange(int softKeybardHeight, boolean visible);
    }
}
