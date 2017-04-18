var merge = require('webpack-merge');

var commonData = require('./commonData');

module.exports = {
    "policeData": merge(commonData, {
        "data": {
            "chartId": 1016,
            "title": "公安底数",
            "subTitle": "公安底数",
            "inds": [
                {
                    "indId": 10034,
                    "indTitle": "公安底数",
                    "indType": "NUMBER",
                    "indData": 3141,
                    "change": 0
                },
                {
                    "indId": 10035,
                    "indTitle": "公安底数列表",
                    "indType": "PIE_ROLL",
                    "indData": [
                        {
                            "chartId": 1027,
                            "v": 1961,
                            "change": 0,
                            "subKey": "1",
                            "k": "常口"
                        },
                        {
                            "chartId": 1027,
                            "v": 187,
                            "change": 0,
                            "subKey": "2",
                            "k": "暂口"
                        },
                        {
                            "chartId": 1027,
                            "v": 621,
                            "change": 0,
                            "subKey": "3",
                            "k": "学生"
                        },
                        {
                            "chartId": 1027,
                            "v": 372,
                            "change": 0,
                            "subKey": "4",
                            "k": "不在册"
                        }
                    ],
                    "change": 0
                }
            ],
            "expire": "2015-11-23 23:59:59",
            "isExpire": 0
        },
        "code": 200
    }),
    // 今日在杭SJ
    "inHzData": merge(commonData, {
        "data": {
            "chartId": 1015,
            "title": "今日在杭SJ",
            "subTitle": "今日在杭SJ",
            "inds": [
                {
                    "indId": 10036,
                    "indTitle": "今日在杭SJ",
                    "indType": "PIE",
                    "indData": 3141,
                    "change": 1800
                },
                {
                    "indId": 10041,
                    "indTitle": "今日在杭SJ列表",
                    "indType": "PIE",
                    "indData": [
                        {
                            "chartId": 1028,
                            "v": 2872,
                            "change": 0,
                            "subKey": "1",
                            "k": "在册"
                        },
                        {
                            "chartId": 1028,
                            "v": 123,
                            "change": 0,
                            "subKey": "2",
                            "k": "有落脚点"
                        },
                        {
                            "chartId": 1028,
                            "v": 146,
                            "change": 0,
                            "subKey": "3",
                            "k": "无落脚点"
                        }
                    ],
                    "change": 0
                }
            ],
            "expire": "2015-11-23 23:59:59",
            "isExpire": 0
        },
        "code": 200
    }),
    // 三无落脚点
    "noFootHoldData": merge(commonData, {
        "data": {
        "chartId": 1017,
        "title": "三日无落脚点",
        "subTitle": "三日无落脚点",
        "inds": [
            {
                "indId": 10045,
                "indTitle": "三日无落脚点",
                "indType": "PIE",
                "indData": 10,
                "change": -20
            },
            {
                "indId": 10054,
                "indTitle": "三人无落脚点列表",
                "indType": "PIE",
                "indData": [
                    {
                        "trafficType": 1,
                        "v": 0,
                        "pName": "张三",
                        "gmtCreate": "2015-11-17 13:32:18",
                        "change": 0,
                        "lastHzDate": "2015-11-17 13:32:18",
                        "n": "MF8149",
                        "toCity": "杭州",
                        "fromCity": "北京",
                        "k": "210209199110102323"
                    },
                    {
                        "trafficType": 2,
                        "v": 0,
                        "pName": "李四",
                        "gmtCreate": "2015-11-17 13:33:25",
                        "change": 0,
                        "lastHzDate": "2015-11-17 13:33:25",
                        "n": "K528",
                        "toCity": "杭州",
                        "fromCity": "乌鲁木齐",
                        "k": "210209199110102324"
                    },
                    {
                        "trafficType": 1,
                        "v": 0,
                        "pName": "王五3",
                        "gmtCreate": "2015-11-16 13:34:06",
                        "change": 0,
                        "lastHzDate": "2015-11-16 13:34:06",
                        "n": "JD5352",
                        "toCity": "杭州",
                        "fromCity": "厦门",
                        "k": "210209199110102325"
                    },
                    {
                        "trafficType": 1,
                        "v": 0,
                        "pName": "赵六7",
                        "gmtCreate": "2015-11-16 13:35:25",
                        "change": 0,
                        "lastHzDate": "2015-11-16 13:35:25",
                        "n": "CZ6164",
                        "toCity": "杭州",
                        "fromCity": "乌鲁木齐",
                        "k": "210209199110102326"
                    },
                    {
                        "trafficType": 1,
                        "v": 0,
                        "pName": "杜七1",
                        "gmtCreate": "2015-11-17 15:39:58",
                        "change": 0,
                        "lastHzDate": "2015-11-17 15:39:58",
                        "n": "MF8145",
                        "toCity": "杭州",
                        "fromCity": "乌鲁木齐",
                        "k": "210209199110102327"
                    },
                    {
                        "trafficType": 2,
                        "v": 0,
                        "pName": "陈八2",
                        "gmtCreate": "2015-11-17 15:40:54",
                        "change": 0,
                        "lastHzDate": "2015-11-17 15:40:54",
                        "n": "G7561",
                        "toCity": "杭州",
                        "fromCity": "西安",
                        "k": "210209199110102328"
                    },
                    {
                        "trafficType": 1,
                        "v": 0,
                        "pName": "王九43",
                        "gmtCreate": "2015-11-17 15:41:32",
                        "change": 0,
                        "lastHzDate": "2015-11-17 15:41:32",
                        "n": "CZ6164",
                        "toCity": "杭州",
                        "fromCity": "乌鲁木齐",
                        "k": "210209199110102329"
                    },
                    {
                        "trafficType": 1,
                        "v": 0,
                        "pName": "王十3",
                        "gmtCreate": "2015-11-17 15:42:07",
                        "change": 0,
                        "lastHzDate": "2015-11-17 15:42:07",
                        "n": "MF8145",
                        "toCity": "杭州",
                        "fromCity": "乌鲁木齐",
                        "k": "210209199110102330"
                    },
                    {
                        "trafficType": 2,
                        "v": 0,
                        "pName": "杜十娘2",
                        "gmtCreate": "2015-11-18 15:42:43",
                        "change": 0,
                        "lastHzDate": "2015-11-18 15:42:43",
                        "n": "G7576",
                        "toCity": "杭州",
                        "fromCity": "上海",
                        "k": "210209199110102331"
                    },
                    {
                        "trafficType": 2,
                        "v": 0,
                        "pName": "萧十一郎1",
                        "gmtCreate": "2015-11-18 12:43:32",
                        "change": 0,
                        "lastHzDate": "2015-11-18 12:43:32",
                        "n": "G7541",
                        "toCity": "杭州",
                        "fromCity": "南京",
                        "k": "210209199110102332"
                    }
                ],
                "change": 0
            }
        ],
        "expire": "2015-11-23 23:59:59",
        "isExpire": 0
    },
    "code": 200
    }),
    // 互联网底数
    "internetData": merge(commonData, {
        "data": {
            "chartId": 1018,
            "title": "互联网底数",
            "subTitle": "互联网底数",
            "inds": [
                {
                    "indId": 10046,
                    "indTitle": "互联网底数",
                    "indType": "PIE",
                    "indData": 11110,
                    "change": 0
                },
                {
                    "indId": 10047,
                    "indTitle": "互联网底数列表",
                    "indType": "PIE",
                    "indData": [
                        {
                            "hasLocation": 1,
                            "v": 4964,
                            "change": 0,
                            "k": "有位置"
                        },
                        {
                            "hasLocation": 0,
                            "v": 6146,
                            "change": 0,
                            "k": "无位置"
                        }
                    ],
                    "change": 0
                }
            ],
            "expire": "2015-11-23 23:59:59",
            "isExpire": 0
        },
        "code": 200
    }),
    'policeDetail':{
        "data": {
            "chartId": 1032,
            "title": "公安底数详情",
            "subTitle": "公安底数详情",
            "inds": [
                {
                    "indId": 10149,
                    "indTitle": "底数-在册-合计",
                    "indType": "NUMBER",
                    "indData": 2750,
                    "change": 2357
                },
                {
                    "indId": 10150,
                    "indTitle": "持证情况",
                    "indType": "PIE",
                    "indData": [
                        {
                            "v": 940,
                            "change": 805,
                            "type": 1,
                            "k": "驾照&护照"
                        },
                        {
                            "v": 576,
                            "change": 493,
                            "type": 2,
                            "k": "仅护照"
                        },
                        {
                            "v": 417,
                            "change": 357,
                            "type": 3,
                            "k": "仅驾照"
                        },
                        {
                            "v": 817,
                            "change": 700,
                            "type": 4,
                            "k": "无"
                        }
                    ],
                    "change": 0
                },
                {
                    "indId": 10151,
                    "indTitle": "年龄情况",
                    "indType": "PIE",
                    "indData": [
                        {
                            "v": 22,
                            "change": 18,
                            "k": "0-14岁"
                        },
                        {
                            "v": 2532,
                            "change": 2170,
                            "k": "15-35岁"
                        },
                        {
                            "v": 161,
                            "change": 138,
                            "k": "35岁以上"
                        }
                    ],
                    "change": 0
                },
                {
                    "indId": 10152,
                    "indTitle": "风险类型",
                    "indType": "PIE",
                    "indData": [
                        {
                            "v": 1078,
                            "change": 924,
                            "type": 1,
                            "k": "非暴恐类前科"
                        },
                        {
                            "v": 999,
                            "change": 856,
                            "type": 2,
                            "k": "暴恐类前科"
                        },
                        {
                            "v": 673,
                            "change": 576,
                            "type": 3,
                            "k": "无前科"
                        }
                    ],
                    "change": 0
                },
                {
                    "indId": 10153,
                    "indTitle": "线上人口占比",
                    "indType": "PIE",
                    "indData": [
                        {
                            "v": 1186,
                            "change": 1016,
                            "type": 1,
                            "k": "互联网"
                        },
                        {
                            "v": 1564,
                            "change": 1340,
                            "type": 2,
                            "k": "非互联网"
                        }
                    ],
                    "change": 0
                },
                {
                    "indId": 10154,
                    "indTitle": "性别占比",
                    "indType": "PIE",
                    "indData": [
                        {
                            "v": 1222,
                            "change": 1047,
                            "type": 1,
                            "k": "男"
                        },
                        {
                            "v": 1493,
                            "change": 1279,
                            "type": 2,
                            "k": "女"
                        }
                    ],
                    "change": 0
                },
                {
                    "indId": 10155,
                    "indTitle": "来源地",
                    "indType": "BAR",
                    "indData": [
                        {
                            "v": 514,
                            "change": 440,
                            "type": 1,
                            "k": "于田县"
                        },
                        {
                            "v": 319,
                            "change": 273,
                            "type": 1,
                            "k": "伊吾县"
                        },
                        {
                            "v": 307,
                            "change": 263,
                            "type": 1,
                            "k": "裕民县"
                        },
                        {
                            "v": 234,
                            "change": 200,
                            "type": 1,
                            "k": "策勒县"
                        },
                        {
                            "v": 232,
                            "change": 198,
                            "type": 1,
                            "k": "和田县"
                        },
                        {
                            "v": 227,
                            "change": 194,
                            "type": 1,
                            "k": "洛浦县"
                        },
                        {
                            "v": 227,
                            "change": 194,
                            "type": 1,
                            "k": "沙雅县"
                        },
                        {
                            "v": 136,
                            "change": 116,
                            "type": 1,
                            "k": "柯坪县"
                        },
                        {
                            "v": 319,
                            "change": 273,
                            "type": 2,
                            "k": "呼图壁县"
                        },
                        {
                            "v": 235,
                            "change": 201,
                            "type": 2,
                            "k": "布尔津县"
                        }
                    ],
                    "change": 0
                },
                {
                    "indId": 10160,
                    "indTitle": "重点县",
                    "indType": "BAR",
                    "indData": [
                        {
                            "v": 514,
                            "change": 440,
                            "k": "于田县"
                        },
                        {
                            "v": 319,
                            "change": 273,
                            "k": "伊吾县"
                        },
                        {
                            "v": 235,
                            "change": 201,
                            "k": "布尔津县"
                        },
                        {
                            "v": 232,
                            "change": 198,
                            "k": "和田县"
                        }
                    ],
                    "change": 0
                }
            ],
            "expire": "2015-11-30 23:59:59",
            "isExpire": 0
        },
        "code": 200
    }
    
};