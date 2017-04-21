package com.syd.safetymsg;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * Created by east on 2017/4/21.
 */

public class Utils {
    public static int getTimesmorning(){
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return (int) (cal.getTimeInMillis()/1000);
    }
    public static int getTimesnight(){
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 24);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return (int) (cal.getTimeInMillis()/1000);
    }
    public static int getTimesnowyear(){
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.DAY_OF_MONTH,0);
        cal.set(Calendar.MONTH,0);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return (int) (cal.getTimeInMillis()/1000);
    }
    public static int getTimesnow() {
        Calendar cal = Calendar.getInstance();
        return (int) (cal.getTimeInMillis()/1000);
    }
    public static String dateFormat(Date date){
        Calendar calendar=Calendar.getInstance();
       int dataCal=  (int) (calendar.getTimeInMillis()/1000);
        calendar.setTime(date);
        if(dataCal-getTimesmorning()>0) {
            //今天只显示时间 HH:mm
            DateFormat df = new SimpleDateFormat("HH:mm");
            return df.format(date);
        }
        else if(dataCal-getTimesmorning()<0&&dataCal-getTimesnowyear()>0) {
            //昨天,并在今年以上显示MM-dd HH:mm
            DateFormat df = new SimpleDateFormat("MM-dd HH:mm");
            return df.format(date);
        }
        else if(dataCal-getTimesnowyear()<0){
            //yy-MM-dd HH:mm:ss
            DateFormat df = new SimpleDateFormat("yy-MM-dd HH:mm:ss");
            return df.format(date);
        }
        return  "";
        //SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }
}
