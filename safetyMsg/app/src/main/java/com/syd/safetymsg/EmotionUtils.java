package com.syd.safetymsg;

import android.support.v4.util.ArrayMap;

import java.util.HashMap;
import java.util.LinkedHashMap;

/**
 * Created by east on 2017/4/28.
 */

public class EmotionUtils {
    public static LinkedHashMap<String, Integer> EMOTION_CLASSIC_MAP;
    static {
        EMOTION_CLASSIC_MAP = new LinkedHashMap<>();

        EMOTION_CLASSIC_MAP.put("[微笑]", R.drawable.emotion_001);
        EMOTION_CLASSIC_MAP.put("[憨笑]", R.drawable.emotion_002);
        EMOTION_CLASSIC_MAP.put("[色]", R.drawable.emotion_003);
        EMOTION_CLASSIC_MAP.put("[发呆]", R.drawable.emotion_004);
        EMOTION_CLASSIC_MAP.put("[老板]", R.drawable.emotion_005);
        EMOTION_CLASSIC_MAP.put("[流泪]", R.drawable.emotion_006);
        EMOTION_CLASSIC_MAP.put("[害羞]", R.drawable.emotion_007);
        EMOTION_CLASSIC_MAP.put("[闭嘴]", R.drawable.emotion_008);
        EMOTION_CLASSIC_MAP.put("[睡]", R.drawable.emotion_009);
        EMOTION_CLASSIC_MAP.put("[大哭]", R.drawable.emotion_010);
        EMOTION_CLASSIC_MAP.put("[尴尬]", R.drawable.emotion_011);
        EMOTION_CLASSIC_MAP.put("[发怒]", R.drawable.emotion_012);
        EMOTION_CLASSIC_MAP.put("[调皮]", R.drawable.emotion_013);
        EMOTION_CLASSIC_MAP.put("[大笑]", R.drawable.emotion_014);
        EMOTION_CLASSIC_MAP.put("[惊讶]", R.drawable.emotion_015);
        EMOTION_CLASSIC_MAP.put("[流汗]", R.drawable.emotion_016);
        EMOTION_CLASSIC_MAP.put("[广播]", R.drawable.emotion_017);
        EMOTION_CLASSIC_MAP.put("[阴笑]", R.drawable.emotion_018);
        EMOTION_CLASSIC_MAP.put("[你强]", R.drawable.emotion_019);
        EMOTION_CLASSIC_MAP.put("[怒吼]", R.drawable.emotion_020);
        EMOTION_CLASSIC_MAP.put("[惊愕]", R.drawable.emotion_021);
        EMOTION_CLASSIC_MAP.put("[疑问]", R.drawable.emotion_022);
        EMOTION_CLASSIC_MAP.put("[OK]", R.drawable.emotion_023);
        EMOTION_CLASSIC_MAP.put("[鼓掌]", R.drawable.emotion_024);
        EMOTION_CLASSIC_MAP.put("[握手]", R.drawable.emotion_025);
        EMOTION_CLASSIC_MAP.put("[偷笑]", R.drawable.emotion_026);
        EMOTION_CLASSIC_MAP.put("[无聊]", R.drawable.emotion_027);
        EMOTION_CLASSIC_MAP.put("[加油]", R.drawable.emotion_028);
        EMOTION_CLASSIC_MAP.put("[快哭了]", R.drawable.emotion_029);
        EMOTION_CLASSIC_MAP.put("[吐]", R.drawable.emotion_030);
        EMOTION_CLASSIC_MAP.put("[晕]", R.drawable.emotion_031);
        EMOTION_CLASSIC_MAP.put("[摸摸]", R.drawable.emotion_032);
        EMOTION_CLASSIC_MAP.put("[胜利]", R.drawable.emotion_033);
        EMOTION_CLASSIC_MAP.put("[飞吻]", R.drawable.emotion_034);
        EMOTION_CLASSIC_MAP.put("[跳舞]", R.drawable.emotion_035);
        EMOTION_CLASSIC_MAP.put("[傻笑]", R.drawable.emotion_036);
        EMOTION_CLASSIC_MAP.put("[鄙视]", R.drawable.emotion_037);
        EMOTION_CLASSIC_MAP.put("[嘘]", R.drawable.emotion_038);
        EMOTION_CLASSIC_MAP.put("[衰]", R.drawable.emotion_039);
        EMOTION_CLASSIC_MAP.put("[思考]", R.drawable.emotion_040);
        EMOTION_CLASSIC_MAP.put("[亲亲]", R.drawable.emotion_041);
        EMOTION_CLASSIC_MAP.put("[无奈]", R.drawable.emotion_042);
        EMOTION_CLASSIC_MAP.put("[感冒]", R.drawable.emotion_043);
        EMOTION_CLASSIC_MAP.put("[对不起]", R.drawable.emotion_044);
        EMOTION_CLASSIC_MAP.put("[再见]", R.drawable.emotion_045);
        EMOTION_CLASSIC_MAP.put("[投降]", R.drawable.emotion_046);
        EMOTION_CLASSIC_MAP.put("[哼]", R.drawable.emotion_047);
        EMOTION_CLASSIC_MAP.put("[欠扁]", R.drawable.emotion_048);
        EMOTION_CLASSIC_MAP.put("[恭喜]", R.drawable.emotion_049);
        EMOTION_CLASSIC_MAP.put("[可怜]", R.drawable.emotion_050);
        EMOTION_CLASSIC_MAP.put("[舒服]", R.drawable.emotion_051);
        EMOTION_CLASSIC_MAP.put("[爱意]", R.drawable.emotion_052);
        EMOTION_CLASSIC_MAP.put("[单挑]", R.drawable.emotion_053);
        EMOTION_CLASSIC_MAP.put("[财迷]", R.drawable.emotion_054);
        EMOTION_CLASSIC_MAP.put("[迷惑]", R.drawable.emotion_055);
        EMOTION_CLASSIC_MAP.put("[委屈]", R.drawable.emotion_056);
        EMOTION_CLASSIC_MAP.put("[灵感]", R.drawable.emotion_057);
        EMOTION_CLASSIC_MAP.put("[天使]", R.drawable.emotion_058);
        EMOTION_CLASSIC_MAP.put("[鬼脸]", R.drawable.emotion_059);
        EMOTION_CLASSIC_MAP.put("[凄凉]", R.drawable.emotion_060);
        EMOTION_CLASSIC_MAP.put("[郁闷]", R.drawable.emotion_061);
        EMOTION_CLASSIC_MAP.put("[发烧]", R.drawable.emotion_062);
        EMOTION_CLASSIC_MAP.put("[邪恶]", R.drawable.emotion_063);
        EMOTION_CLASSIC_MAP.put("[算账]", R.drawable.emotion_064);
        EMOTION_CLASSIC_MAP.put("[色情狂]", R.drawable.emotion_065);
        EMOTION_CLASSIC_MAP.put("[忍者]", R.drawable.emotion_066);
        EMOTION_CLASSIC_MAP.put("[炸弹]", R.drawable.emotion_067);
        EMOTION_CLASSIC_MAP.put("[邮件]", R.drawable.emotion_068);
        EMOTION_CLASSIC_MAP.put("[电话]", R.drawable.emotion_069);
        EMOTION_CLASSIC_MAP.put("[礼物]", R.drawable.emotion_070);
        EMOTION_CLASSIC_MAP.put("[爱心]", R.drawable.emotion_071);
        EMOTION_CLASSIC_MAP.put("[心碎]", R.drawable.emotion_072);
        EMOTION_CLASSIC_MAP.put("[嘴唇]", R.drawable.emotion_073);
        EMOTION_CLASSIC_MAP.put("[鲜花]", R.drawable.emotion_074);
        EMOTION_CLASSIC_MAP.put("[残花]", R.drawable.emotion_075);
        EMOTION_CLASSIC_MAP.put("[出差]", R.drawable.emotion_076);
        EMOTION_CLASSIC_MAP.put("[干杯]", R.drawable.emotion_077);
        EMOTION_CLASSIC_MAP.put("[赞]", R.drawable.emotion_078);
    }
    public static int getImgByName(String imgName) {
        Integer integer=null;
        integer = EMOTION_CLASSIC_MAP.get(imgName);
        return integer == null ? null : integer;
    }
}
