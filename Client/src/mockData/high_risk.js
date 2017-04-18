/**
 * Created by wb-feiyuyu on 2016/1/4.
 */
var merge = require('webpack-merge');

module.exports = {
    //预警名单列表
    warnListData:{
        "message": "请求成功,返回数据",
        "data": {
            "orders": [{
                "uuId": "5aa80154-ad1b-434d-bc3a-b892963fd05d",
                "nick": "yy",
                "name": "rrr",
                "cellPhone": "10086",
                "receiveAddress": "xxx地址",
                "goodsTitle": "computer",
                "payTime": "2016-01-12 10:51:35",
                "formatPayTime": "01-12 10:51:35",
                "goodsType": "瞄准器"
            }, {
                "uuId": "498325c1-6a82-4295-8b97-f73ac097f4f2",
                "nick": "yy",
                "name": "rrr",
                "cellPhone": "10086",
                "receiveAddress": "xxx地址",
                "goodsTitle": "computer",
                "payTime": "2016-01-12 10:51:35",
                "formatPayTime": "01-12 10:51:35",
                "goodsType": "消声器"
            }, {
                "uuId": "321d5ab5-a4f0-4f95-8e96-edc739d6b55f",
                "nick": "yy",
                "name": "rrr",
                "cellPhone": "10086",
                "receiveAddress": "xxx地址",
                "goodsTitle": "computer",
                "payTime": "2016-01-12 10:51:35",
                "formatPayTime": "01-12 10:51:35",
                "goodsType": "消声器"
            }, {
                "uuId": "aadaa9e4-2d3b-4a98-84da-6bdc8b0d1886",
                "nick": "yy",
                "name": "rrr",
                "cellPhone": "10086",
                "receiveAddress": "xxx地址",
                "goodsTitle": "computer",
                "payTime": "2016-01-12 10:51:35",
                "formatPayTime": "01-12 10:51:35",
                "goodsType": "其他枪配工具/辅料"
            }, {
                "uuId": "415e191f-264e-462f-8974-9780352ff1a5",
                "nick": "yy",
                "name": "rrr",
                "cellPhone": "10086",
                "receiveAddress": "xxx地址",
                "goodsTitle": "computer",
                "payTime": "2016-01-12 10:51:35",
                "formatPayTime": "01-12 10:51:35",
                "goodsType": "瞄准器"
            }, {
                "uuId": "420618c3-e0de-4ab1-b404-e57323288bb0",
                "nick": "xx",
                "name": "rrr",
                "cellPhone": "10086",
                "receiveAddress": "xxx地址",
                "goodsTitle": "computer",
                "payTime": "2016-01-12 10:51:35",
                "formatPayTime": "01-12 10:51:35",
                "goodsType": "洋火枪"
            }],
            "accounts": [{
                "idCard": null,
                "accountId": "393570784",
                "uuId": "fc1f3a54-02aa-4125-b1f8-341e4f2e53a3",
                "riskLevel": "1",
                "goodsTypes": "疑似枪管材料、疑似弹药装置、瞄准器",
                "hitTime": "2016-01-12 10:51:35",
                "photo": "http://img.name2012.com/uploads/allimg/2015-06/30-023131_451.jpg",
                "formatHitTime": "01-12 10:51:35",
                "registerType": null,
                "nick": "yy",
                "isAuth": "0",
                "name": "rrr",
                "accountType": 2,
                "riskComment": "yujingreirong",
                "key": "RISK_PURCHASE%3AWARN%3AGUN%3A393570784%3A2%3A040113%3A20160112105135"
            }, {
                "idCard": null,
                "accountId": "393570774",
                "uuId": "8e5e89f4-9615-4ca1-9b2c-37f4c85fdec8",
                "riskLevel": null,
                "goodsTypes": "消声器、疑似枪身材料",
                "hitTime": "2016-01-12 10:51:35",
                "photo": "http://img.name2012.com/uploads/allimg/2015-06/30-023131_451.jpg",
                "formatHitTime": "01-12 10:51:35",
                "registerType": null,
                "nick": "yy",
                "isAuth": "0",
                "name": "rrr",
                "accountType": 2,
                "riskComment": "yujingreirong",
                "key": "RISK_PURCHASE%3AWARN%3AGUN%3A393570774%3A2%3A040113%3A20160112105135"
            }, {
                "idCard": null,
                "accountId": "393570777",
                "uuId": "6555a563-ea54-48ed-918f-0181ede8e9a8",
                "riskLevel": null,
                "goodsTypes": "消声器",
                "hitTime": "2016-01-12 10:51:35",
                "photo": "http://img.name2012.com/uploads/allimg/2015-06/30-023131_451.jpg",
                "formatHitTime": "01-12 10:51:35",
                "registerType": null,
                "nick": "yy",
                "isAuth": "0",
                "name": "rrr",
                "accountType": 2,
                "riskComment": "yujingreirong",
                "key": "RISK_PURCHASE%3AWARN%3AGUN%3A393570777%3A2%3A040113%3A20160112105135"
            }, {
                "idCard": null,
                "accountId": "151286247",
                "uuId": "b923439c-5c68-4a45-a558-e548216aab0e",
                "riskLevel": "3",
                "goodsTypes": "疑似枪管材料、疑似弹药装置、瞄准器",
                "hitTime": "2016-01-12 10:51:35",
                "photo": "http://img.name2012.com/uploads/allimg/2015-06/30-023131_451.jpg",
                "formatHitTime": "01-12 10:51:35",
                "registerType": null,
                "nick": "yy",
                "isAuth": "0",
                "name": "rrr",
                "accountType": 2,
                "riskComment": "yujingreirong",
                "key": "RISK_PURCHASE%3AWARN%3AGUN%3A151286247%3A2%3A040113%3A20160112105135"
            }, {
                "idCard": null,
                "accountId": "1087682040",
                "uuId": "97b45da0-863a-473b-b7a2-5f8e7b778ea8",
                "riskLevel": "3",
                "goodsTypes": "其他枪配工具/辅料",
                "hitTime": "2016-01-12 10:51:35",
                "photo": "http://img.name2012.com/uploads/allimg/2015-06/30-023131_451.jpg",
                "formatHitTime": "01-12 10:51:35",
                "registerType": null,
                "nick": "yy",
                "isAuth": "0",
                "name": "rrr",
                "accountType": 2,
                "riskComment": "yujingreirong",
                "key": "RISK_PURCHASE%3AWARN%3AGUN%3A1087682040%3A2%3A040113%3A20160112105135"
            }, {
                "idCard": "652823199611041613",
                "accountId": "652823199611041613",
                "uuId": "fbdb2912-effd-49c4-9db8-294657689711",
                "riskLevel": "1",
                "goodsTypes": "火柴枪、射钉枪、链条枪、发令枪、洋火枪",
                "hitTime": "2016-01-12 10:51:35",
                "photo": "http://img.name2012.com/uploads/allimg/2015-06/30-023131_451.jpg",
                "formatHitTime": "01-12 10:51:35",
                "registerType": "常住人口",
                "nick": "xx",
                "isAuth": "1",
                "name": "rrr",
                "accountType": 1,
                "riskComment": "yujingreirong",
                "key": "RISK_PURCHASE%3AWARN%3AGUN%3A652823199611041613%3A1%3A040113%3A20160112105135"
            }]
        },
        "code": "200"
    },
    //购买订单列表
    buyListData:{
        "message": "请求成功,返回数据",
        "data": [{
            "uuId": "e46fb640-a503-41ea-a464-92f95c14e0ac",
            "nick": "yy",
            "name": "rrr",
            "cellPhone": "10086",
            "receiveAddress": "xxx地址",
            "goodsTitle": "computer",
            "payTime": "2016-01-12 10:51:35",
            "formatPayTime": "01-12 10:51:35",
            "goodsType": "疑似枪管材料、疑似弹药装置、瞄准器"
        }, {
            "uuId": "657bd218-9fc8-4f07-8a6b-cb15da2dd664",
            "nick": "yy",
            "name": "rrr",
            "cellPhone": "10086",
            "receiveAddress": "xxx地址",
            "goodsTitle": "computer",
            "payTime": "2016-01-12 10:51:35",
            "formatPayTime": "01-12 10:51:35",
            "goodsType": "疑似弹药装置"
        }, {
            "uuId": "ecb80f41-a200-4309-9f10-c06715e57e77",
            "nick": "yy",
            "name": "rrr",
            "cellPhone": "10086",
            "receiveAddress": "xxx地址",
            "goodsTitle": "computer",
            "payTime": "2016-01-12 10:51:35",
            "formatPayTime": "01-12 10:51:35",
            "goodsType": "瞄准器"
        }],
        "code": "200"
    },
    //一级类目
    firstLevel:{
        "data": {
            "chartId": 1043,
            "title": "高危购买枪支相关",
            "subTitle": "枪支相关",
            "inds": [{
                "indId": 10166,
                "indTitle": "近24小时高危购买账号数",
                "indType": "LINE",
                "indData": 87,
                "change": 0
            }, {
                "indId": 10167,
                "indTitle": "枪支一级分类指标",
                "indType": "PIE_ROLL",
                "indData": [{
                    "chartId": 1047,
                    "v": 15,
                    "change": 0,
                    "sub_key": "0102",
                    "k": "火药枪"
                }, {
                    "chartId": 1047,
                    "v": 26,
                    "change": 0,
                    "sub_key": "0103",
                    "k": "组装枪"
                }, {
                    "chartId": 1047,
                    "v": 15,
                    "change": 0,
                    "sub_key": "0101",
                    "k": "土制枪"
                }],
                "change": 0
            }],
            "expire": "2016-01-12 23:59:59",
            "isExpire": 0
        },
        "code": 200
    },
    //二级类目
    secondLevel:{
        "data": {
            "chartId": 1047,
            "title": "枪支二级【账号数、单项账号数】",
            "subTitle": "枪支二级【账号数、单项账号数】",
            "inds": [{
                "indId": 10165,
                "indTitle": "单项枪支二级账号数",
                "indType": "LINE",
                "indData": [{
                    "v": 4,
                    "change": 0,
                    "k": "疑似枪管材料"
                }, {
                    "v": 4,
                    "change": 0,
                    "k": "疑似枪身材料"
                }, {
                    "v": 4,
                    "change": 0,
                    "k": "疑似弹药装置"
                }, {
                    "v": 5,
                    "change": 0,
                    "k": "击发装置"
                }, {
                    "v": 4,
                    "change": 0,
                    "k": "瞄准器"
                }, {
                    "v": 5,
                    "change": 0,
                    "k": "消声器"
                }],
                "change": 0
            }, {
                "indId": 10168,
                "indTitle": "枪支二级账号数",
                "indType": "LINE",
                "indData": 26,
                "change": 0
            }],
            "expire": "2016-01-12 23:59:59",
            "isExpire": 0
        },
        "code": 200
    }
}