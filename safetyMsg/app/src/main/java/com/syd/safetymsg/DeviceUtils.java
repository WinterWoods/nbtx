package com.syd.safetymsg;

import android.content.Context;
import android.telephony.TelephonyManager;

import java.util.UUID;

/**
 * Created by east on 2017/4/18.
 */

public class DeviceUtils {
    public static String GetDeviceId(Context context) {
        final TelephonyManager tm = (TelephonyManager) context.getApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);

        final String tmDevice, tmSerial, tmPhone, androidId;
        tmDevice = "" + tm.getDeviceId();
        tmSerial = "" + tm.getSimSerialNumber();
        androidId = "" + android.provider.Settings.Secure.getString(context.getContentResolver(), android.provider.Settings.Secure.ANDROID_ID);

        UUID deviceUuid = new UUID(androidId.hashCode(), ((long) tmDevice.hashCode() << 32) | tmSerial.hashCode());
        String uniqueId = deviceUuid.toString();
        return  uniqueId;
    }
}
