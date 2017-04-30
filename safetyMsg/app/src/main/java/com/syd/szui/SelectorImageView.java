package com.syd.szui;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.drawable.Drawable;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;

import com.syd.safetymsg.R;



/**
 * Created by east on 2017/4/26.
 */

@SuppressLint("AppCompatCustomView")
public class SelectorImageView  extends ImageView {
    static Drawable pressdrawable;
    static Drawable normaldrawable;
    public SelectorImageView(Context context) {
        super(context);
    }

    public SelectorImageView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        //属性类型数组
        TypedArray typedArray = context.obtainStyledAttributes
                (attrs, R.styleable.SelectorImageView);
        pressdrawable= typedArray.getDrawable(R.styleable.SelectorImageView_pressBackground);
        normaldrawable= typedArray.getDrawable(R.styleable.SelectorImageView_normalBackground);
        typedArray.recycle();   //清理资源，回收资源，为了防止下一次使用的时候造成影响
        this.setImageDrawable(normaldrawable);
        super.setOnTouchListener(touchListener);
    }

    public SelectorImageView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    public SelectorImageView(Context context, @Nullable AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
    }
    public final  static OnTouchListener touchListener = new  OnTouchListener(){
        public boolean onTouch(View v, MotionEvent event) {
            ImageView imageView = (ImageView) v;
            if (event.getAction() == MotionEvent.ACTION_UP) {
                imageView.setImageDrawable(normaldrawable);
            }
            if (event.getAction() == MotionEvent.ACTION_DOWN) {
                imageView.setImageDrawable(pressdrawable);
            }
            return  false;
        }
    };
}
