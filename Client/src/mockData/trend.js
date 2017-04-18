/**
 * Created by wb-feiyuyu on 2015/12/26.
 */
var merge = require('webpack-merge');

module.exports = {
    //venueWarning
    // 地图的所有信息
    "venueWarningData": {
        "message": "请求成功,返回数据",
        "data": {
            "alertLocation": [{
                "id": 1,
                "detail": {"详细地址": "杭州市滨江区西兴街道奥体博览中心主体育场", "名称": "杭州奥体中心", "下榻人数": "", "联系电话": "", "管辖单位": "滨江区分局", "联系人": ""},
                "alertLocation": "杭州奥体中心",
                "venueType": 1,
                "radius": "5000.0",
                "displayPriority": "1",
                "lng": 120.2123562,
                "lat": 30.229065
            }, {
                "id": 4,
                "detail": {"详细地址": "杭州市上城区江城路893号", "名称": "杭州火车城站", "下榻人数": "", "联系电话": "", "管辖单位": "上城区分局", "联系人": ""},
                "alertLocation": "杭州火车城站",
                "venueType": 4,
                "radius": "3000.0",
                "displayPriority": "1",
                "lng": 120.183118,
                "lat": 30.24355
            }, {
                "id": 6,
                "detail": {"详细地址": "杭州市上城区秋涛路407号‎", "名称": "杭州汽车南站", "下榻人数": "", "联系电话": "", "管辖单位": "上城区分局", "联系人": ""},
                "alertLocation": "杭州汽车南站",
                "venueType": 4,
                "radius": "3000.0",
                "displayPriority": "1",
                "lng": 120.187465,
                "lat": 30.235075
            }],
            "alertMainBody": [{
                "alertRisk": "购买无人机",
                "detail": {"业务时间": "2015-09-20: 09: 20: 00", "淘宝账户昵称": "xxx", "淘宝账户头像": "xxxxxx", "姓名": "xxxxxx", "身份证号": "xxx"},
                "alertTime": "2015-12-24 17:03:47.0",
                "alertSource": 1,
                "accountId": "1012643059",
                "riskLevel": 0,
                "foundTime": "2015-12-23 17:03:57.0",
                "accountType": 2,
                "lng": 30.214964,
                "riskComment": null,
                "alertLocationId": 1,
                "lat": 120.210016,
                "alertSubject": 2
            }, {
                "alertRisk": "杀人",
                "detail": {"案件地点": "xxx1", "案件简要": "xxxxxx1", "报案时间": "2015-09-20: 09: 20: 00"},
                "alertTime": "2015-12-24 17:03:47.0",
                "alertSource": 1,
                "accountId": "x1012000",
                "riskLevel": 0,
                "foundTime": "2015-12-23 17:03:57.0",
                "accountType": 2,
                "lng": 30.214964,
                "riskComment": "2015-09-20: 09: 20: 00,xxx1,xxxxxx1",
                "alertLocationId": 1,
                "lat": 120.210016,
                "alertSubject": 1
            }, {
                "alertRisk": "抢劫",
                "detail": {"案件地点": "xxx2", "案件简要": "xxxxxx2", "报案时间": "2015-09-20: 09: 20: 00"},
                "alertTime": "2015-12-24 17:03:47.0",
                "alertSource": 1,
                "accountId": "x1012000",
                "riskLevel": 0,
                "foundTime": "2015-12-23 17:03:57.0",
                "accountType": 2,
                "lng": 30.214964,
                "riskComment": "2015-09-20: 09: 20: 00,xxx2,xxxxxx2",
                "alertLocationId": 1,
                "lat": 120.210016,
                "alertSubject": 1
            }],
            "serverTime": null
        },
        "code": "200"
    },
    //meetingInfo
    //G20会议
    meetingInfoData: {
        "message": "请求成功,返回数据",
        "data": [{
            "startTime": "2015-12-25 21:24:09.0",
            "meetingComment": "习大大在会馆发表评论并钱啊网国际酒店用餐的空间阿飞阿里看的份",
            "endTime": "2015-12-25 23:24:17.0",
            "meetingDate": "2015-12-25"
        }, {
            "startTime": "2015-12-25 16:34:26.0",
            "meetingComment": "习大大一行畅游西湖",
            "endTime": "2015-12-25 17:34:38.0",
            "meetingDate": "2015-12-25"
        },{
            "startTime": "2015-12-25 21:24:09.0",
            "meetingComment": "习大大在会馆发表评论并钱啊网国际酒店用餐的空间阿飞阿里看的份",
            "endTime": "2015-12-25 23:24:17.0",
            "meetingDate": "2015-12-25"
        }, {
            "startTime": "2015-12-25 16:34:26.0",
            "meetingComment": "习大大一行畅游西湖",
            "endTime": "2015-12-25 17:34:38.0",
            "meetingDate": "2015-12-25"
        },{
            "startTime": "2015-12-25 21:24:09.0",
            "meetingComment": "习大大在会馆发表评论并钱啊网国际酒店用餐的空间阿飞阿里看的份",
            "endTime": "2015-12-25 23:24:17.0",
            "meetingDate": "2015-12-25"
        }, {
            "startTime": "2015-12-25 16:34:26.0",
            "meetingComment": "习大大一行畅游西湖",
            "endTime": "2015-12-25 17:34:38.0",
            "meetingDate": "2015-12-25"
        }],
        "code": "200"
    },
    //trend
    //24小时预警
    trendData: {
        "message": "请求成功,返回数据",
        "data": {
            "trends": [{
                "alertRisk": "购买无人机",
                "detail": {"业务时间": "2015-09-20: 09: 20: 00", "淘宝账户昵称": "xxx", "淘宝账户头像": "xxxxxx", "姓名": "xxxxxx", "身份证号": "xxx"},
                "alertTime": "2015-12-24 17:03:47.0",
                "alertSource": 1,
                "accountId": "1012643059",
                "riskLevel": 3,
                "foundTime": "2015-12-23 17:03:57.0",
                "accountType": 2,
                "lng": 30.214964,
                "riskComment": null,
                "alertLocationId": 1,
                "lat": 120.210016,
                "alertSubject": 2
            }, {
                "alertRisk": "杀人",
                "detail": {"案件地点": "xxx1", "案件简要": "xxxxxx1", "报案时间": "2015-09-20: 09: 20: 00"},
                "alertTime": "2015-12-24 17:03:47.0",
                "alertSource": 1,
                "accountId": "x1012000",
                "riskLevel": 3,
                "foundTime": "2015-12-23 17:03:57.0",
                "accountType": 2,
                "lng": 30.214964,
                "riskComment": "2015-09-20: 09: 20: 00,xxx1,xxxxxx1",
                "alertLocationId": 1,
                "lat": 120.210016,
                "alertSubject": 1
            }, {
                "alertRisk": "抢劫",
                "detail": {"案件地点": "xxx2", "案件简要": "xxxxxx2", "报案时间": "2015-09-20: 09: 20: 00"},
                "alertTime": "2015-12-24 17:03:47.0",
                "alertSource": 1,
                "accountId": "x1012000",
                "riskLevel": 3,
                "foundTime": "2015-12-23 17:03:57.0",
                "accountType": 2,
                "lng": 30.214964,
                "riskComment": "2015-09-20: 09: 20: 00,xxx2,xxxxxx2",
                "alertLocationId": 1,
                "lat": 120.210016,
                "alertSubject": 1
            }], "count": 3
        },
        "code": "200"
    },
    //动向信息表  无参数全部，有场馆id则取 场馆下
    trendInfoData:{
        "message": "请求成功,返回数据",
        "data": {
            "alertMainBody": [
                {
                    "accountType": "1",                  //自然人的1，还是阿里的2, 案事件3'
                    "accountId": "10000100",             //包括自然人身份证号和阿里Havana_id, 案事件编码'
                    "alertTime": "2015-12-26 04:05:01",  //过期参考时间
                    "alertRisk": "高危购买",             //Mtee规则标签
                    "foundTime": "2015-12-26 04:05:01", //业务发生时间
                    "alertSubject": "1",                 //'1 案事件|2 关注人员|3 重点人员|4 互联网账户|5 关注车辆|6 重点车辆|7 高危订单'
                    "alertSource": "1",                  //1:线下 2：互联网
                    "lng": "120.154962",                         //经度
                    "lat": "30.230593",                         //纬度
                    "riskComment": "XXX出入场馆",
                    "detail": {
                        "报案时间": "2015-12-26 09:20:00",
                        "案件地点": "xxx",
                        "案件简要": "xxxxxx"
                    }
                }
                ,
                {
                    "accountType": "1",                  //自然人的1，还是阿里的2, 案事件3'
                    "accountId": "10000100",             //包括自然人身份证号和阿里Havana_id, 案事件编码'
                    "alertTime": "2015-12-26 04:05:01",  //过期参考时间
                    "alertRisk": "高危购买",             //Mtee规则标签
                    "foundTime": "2015-12-26 04:05:01", //业务发生时间
                    "alertSubject": "2",                 //'1 案事件|2 关注人员|3 重点人员|4 互联网账户|5 关注车辆|6 重点车辆|7 高危订单'
                    "alertSource": "1",                  //1:线下 2：互联网
                    "lng": "120.220016",                         //经度
                    "lat": "30.274964",                         //纬度
                    "riskComment": "XXX出入场馆",
                    "detail": {
                        "报案时间": "2015-12-26 09:20:00",
                        "案件地点": "xxx",
                        "案件简要": "xxxxxx"
                    }
                },
                {
                    "accountType": "1",                  //自然人的1，还是阿里的2, 案事件3'
                    "accountId": "10000100",             //包括自然人身份证号和阿里Havana_id, 案事件编码'
                    "alertTime": "2015-12-26 04:05:01",  //过期参考时间
                    "alertRisk": "高危购买",             //Mtee规则标签
                    "foundTime": "2015-12-26 04:05:01", //业务发生时间
                    "alertSubject": "3",                 //'1 案事件|2 关注人员|3 重点人员|4 互联网账户|5 关注车辆|6 重点车辆|7 高危订单'
                    "alertSource": "1",                  //1:线下 2：互联网
                    "lng": "120.210016",                         //经度
                    "lat": "30.254964",                         //纬度
                    "riskComment": "XXX出入场馆",
                    "detail": {
                        "报案时间": "2015-12-26 09:20:00",
                        "案件地点": "xxx",
                        "案件简要": "xxxxxx"
                    }
                },
                {
                    "accountType": "1",                  //自然人的1，还是阿里的2, 案事件3'
                    "accountId": "10000100",             //包括自然人身份证号和阿里Havana_id, 案事件编码'
                    "alertTime": "2015-12-26 04:05:01",  //过期参考时间
                    "alertRisk": "高危购买",             //Mtee规则标签
                    "foundTime": "2015-12-26 04:05:01", //业务发生时间
                    "alertSubject": "4",                 //'1 案事件|2 关注人员|3 重点人员|4 互联网账户|5 关注车辆|6 重点车辆|7 高危订单'
                    "alertSource": "1",                  //1:线下 2：互联网
                    "lng": "120.200016",                         //经度
                    "lat": "30.204964",                         //纬度
                    "riskComment": "XXX出入场馆",
                    "detail": {
                        "报案时间": "2015-12-26 09:20:00",
                        "案件地点": "xxx",
                        "案件简要": "xxxxxx"
                    }
                },
                {
                    "accountType": "1",                  //自然人的1，还是阿里的2, 案事件3'
                    "accountId": "10000100",             //包括自然人身份证号和阿里Havana_id, 案事件编码'
                    "alertTime": "2015-12-26 04:05:01",  //过期参考时间
                    "alertRisk": "高危购买",             //Mtee规则标签
                    "foundTime": "2015-12-26 04:05:01", //业务发生时间
                    "alertSubject": "5",                 //'1 案事件|2 关注人员|3 重点人员|4 互联网账户|5 关注车辆|6 重点车辆|7 高危订单'
                    "alertSource": "1",                  //1:线下 2：互联网
                    "lng": "120.290016",                         //经度
                    "lat": "30.294964",                         //纬度
                    "riskComment": "XXX出入场馆",
                    "detail": {
                        "报案时间": "2015-12-26 09:20:00",
                        "案件地点": "xxx",
                        "案件简要": "xxxxxx"
                    }
                },
                {
                    "accountType": "1",                  //自然人的1，还是阿里的2, 案事件3'
                    "accountId": "10000100",             //包括自然人身份证号和阿里Havana_id, 案事件编码'
                    "alertTime": "2015-12-26 04:05:01",  //过期参考时间
                    "alertRisk": "高危购买",             //Mtee规则标签
                    "foundTime": "2015-12-26 04:05:01", //业务发生时间
                    "alertSubject": "6",                 //'1 案事件|2 关注人员|3 重点人员|4 互联网账户|5 关注车辆|6 重点车辆|7 高危订单'
                    "alertSource": "1",                  //1:线下 2：互联网
                    "lng": "120.280016",                         //经度
                    "lat": "30.284964",                         //纬度
                    "riskComment": "XXX出入场馆",
                    "detail": {
                        "报案时间": "2015-12-26 09:20:00",
                        "案件地点": "xxx",
                        "案件简要": "xxxxxx"
                    }
                },
                {
                    "accountType": "1",                  //自然人的1，还是阿里的2, 案事件3'
                    "accountId": "10000100",             //包括自然人身份证号和阿里Havana_id, 案事件编码'
                    "alertTime": "2015-12-26 04:05:01",  //过期参考时间
                    "alertRisk": "高危购买",             //Mtee规则标签
                    "foundTime": "2015-12-26 04:05:01", //业务发生时间
                    "alertSubject": "7",                 //'1 案事件|2 关注人员|3 重点人员|4 互联网账户|5 关注车辆|6 重点车辆|7 高危订单'
                    "alertSource": "1",                  //1:线下 2：互联网
                    "lng": "120.270016",                         //经度
                    "lat": "30.274964",                         //纬度
                    "riskComment": "XXX出入场馆",
                    "detail": {
                        "报案时间": "2015-12-26 09:20:00",
                        "案件地点": "xxx",
                        "案件简要": "xxxxxx"
                    }
                },
                {
                    "accountType": "1",                  //自然人的1，还是阿里的2, 案事件3'
                    "accountId": "10000100",             //包括自然人身份证号和阿里Havana_id, 案事件编码'
                    "alertTime": "2015-12-26 04:05:01",  //过期参考时间
                    "alertRisk": "高危购买",             //Mtee规则标签
                    "foundTime": "2015-12-26 04:05:01", //业务发生时间
                    "alertSubject": "5",                 //'1 案事件|2 关注人员|3 重点人员|4 互联网账户|5 关注车辆|6 重点车辆|7 高危订单'
                    "alertSource": "2",                  //1:线下 2：互联网
                    "lng": "120.260016",                         //经度
                    "lat": "30.264964",                         //纬度
                    "riskComment": "XXX出入场馆",
                    "detail": {
                        "报案时间": "2015-12-26 09:20:00",
                        "案件地点": "xxx",
                        "案件简要": "xxxxxx"
                    }
                },
                {
                    "accountType": "1",                  //自然人的1，还是阿里的2, 案事件3'
                    "accountId": "10000100",             //包括自然人身份证号和阿里Havana_id, 案事件编码'
                    "alertTime": "2015-12-26 04:05:01",  //过期参考时间
                    "alertRisk": "高危购买",             //Mtee规则标签
                    "foundTime": "2015-12-26 04:05:01", //业务发生时间
                    "alertSubject": "3",                 //'1 案事件|2 关注人员|3 重点人员|4 互联网账户|5 关注车辆|6 重点车辆|7 高危订单'
                    "alertSource": "2",                  //1:线下 2：互联网
                    "lng": "120.250016",                         //经度
                    "lat": "30.254964",                         //纬度
                    "riskComment": "XXX出入场馆",
                    "detail": {
                        "报案时间": "2015-12-26 09:20:00",
                        "案件地点": "xxx",
                        "案件简要": "xxxxxx"
                    }
                }
            ],
            "alertLocation": [
                {
                    "id":"1",
                    "type": "1",// 1主场馆,  2 会议场馆, 3 接待酒店,4 1圈,5 3圈,6 5圈
                    "name": "XXX场馆", //具体预警位置的名称
                    "lng": "120.154962",
                    "lat": "30.230593",
                    "radius": "5000",//预警区域半径 米
                    "displayPriority": "1",//显示优先级
                    "hitTime": "20",//命中次数
                    "detail": {
                        "场馆地址": "xxx",
                        "联系人": "xxxxxx",
                        "管辖": "xxxxxx",
                        "下榻人数": "xxxxxx",
                        "电话": "xxxxxx"
                    }
                },
                {
                    "id":"2",
                    "type": "2",// 1主场馆,  2 会议场馆, 3 接待酒店,4 1圈,5 3圈,6 5圈
                    "name": "XXX场馆", //具体预警位置的名称
                    "lng": "120.240016",
                    "lat": "30.254964",
                    "radius": "5000",//预警区域半径 米
                    "displayPriority": "1",//显示优先级
                    "hitTime": "20",//命中次数
                    "detail": {
                        "场馆地址": "xxx",
                        "联系人": "xxxxxx",
                        "管辖": "xxxxxx",
                        "下榻人数": "xxxxxx",
                        "电话": "xxxxxx"
                    }
                },{
                    "id":"3",
                    "type": "3",// 1主场馆,  2 会议场馆, 3 接待酒店,4 1圈,5 3圈,6 5圈
                    "name": "XXX场馆", //具体预警位置的名称
                    "lng": "120.24016",
                    "lat": "30.234964",
                    "radius": "5000",//预警区域半径 米
                    "displayPriority": "1",//显示优先级
                    "hitTime": "20",//命中次数
                    "detail": {
                        "场馆地址": "xxx",
                        "联系人": "xxxxxx",
                        "管辖": "xxxxxx",
                        "下榻人数": "xxxxxx",
                        "电话": "xxxxxx"
                    }
                }
                ,{
                    "id":"4",
                    "type": "4",// 1主场馆,  2 会议场馆, 3 接待酒店,4 1圈,5 3圈,6 5圈
                    "name": "XXX场馆", //具体预警位置的名称
                    "lng": "120.22954",
                    "lat": "30.228337",
                    "radius": "5000",//预警区域半径 米
                    "displayPriority": "1",//显示优先级
                    "hitTime": "20000",//命中次数
                    "detail": {
                        "场馆地址": "xxx",
                        "联系人": "xxxxxx",
                        "管辖": "xxxxxx",
                        "下榻人数": "xxxxxx",
                        "电话": "xxxxxx"
                    }
                }
                ,{
                    "id":"5",
                    "type": "5",// 1主场馆,  2 会议场馆, 3 接待酒店,4 1圈,5 3圈,6 5圈
                    "name": "XXX场馆", //具体预警位置的名称
                    "lng": "120.210016",
                    "lat": "30.224964",
                    "radius": "5000",//预警区域半径 米
                    "displayPriority": "1",//显示优先级
                    "hitTime": "20",//命中次数
                    "detail": {
                        "场馆地址": "xxx",
                        "联系人": "xxxxxx",
                        "管辖": "xxxxxx",
                        "下榻人数": "xxxxxx",
                        "电话": "xxxxxx"
                    }
                }
            ],
            "serverTime": "2015-12-26 04:09:08"
        },
        "code": "200"
    },
    //场馆详情
    venueData:{
        "message": "请求成功,返回数据",
        "data":[
            {
                "accountType": "1",                  //自然人的1，还是阿里的2, 案事件3'
                "accountId": "10000100",             //包括自然人身份证号和阿里Havana_id, 案事件编码'
                "alertTime": "2010-01-01 04:05:01",  //过期参考时间
                "alertRisk": "高危购买",             //Mtee规则标签
                "foundTime": "2010-01-0104: 05: 01", //业务发生时间
                "alertSubject": "1",                 //'1 案事件|2 关注人员|3 重点人员|4 互联网账户|5 关注车辆|6 重点车辆|7 高危订单'
                "alertSource": "1",                  //1:线下 2：互联网
                "lng": "20",                         //经度
                "lat": "30",                         //纬度
                "riskComment": "XXX出入场馆",
                "detail": {
                    "报案时间": "2015-09-20: 09: 20: 00",
                    "案件地点": "xxx",
                    "案件简要": "xxxxxx"
                }
            }
        ],
        "code": "200"
    }
}