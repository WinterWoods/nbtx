var merge = require('webpack-merge');

var commonData = require('./commonData');

module.exports = {
	"dataSource":merge(commonData, {
		"data": {
	        "chartId": 1004,
	        "title": "高频场所",
	        "subTitle": "勿删",
	        "count": 358,
	        "trend" : 5,
	        "inds": [
	            {
	                "indId": 10011,
	                "indTitle": "今日网吧TOP54",
	                "indType": "LINE",
	                "indData": [
	                    {
	                    	"id":10001,
	                        "k": "咀吧19",
	                        "v": 35,
	                        "lng": 120.237,
	                        "lat": 30.367,
	                        "sj90": 110,
	                        "sj90day": 760,
	                        "nocrime": 50,
	                        "crime": 11,
	                        "violence": 73,
	                        "i7": 2,
	                        "change": 10,
	                        "address":'杭州下城区中山北路120号2，3楼',
	                        "tel":'020-65618134'
	                    },
	                    {
	                    	"id":10002,
	                        "k": "咀吧2",
	                        "v": 62,
	                        "lng": 120.237,
	                        "lat": 30.367,
	                        "sj90": 190,
	                        "sj90day": 720,
	                        "nocrime": 50,
	                        "crime": 20,
	                        "violence": 32,
	                        "i7": 2,
	                        "change": 3,
	                        "address":'杭州下城区中山北路492号2，3楼',
	                        "tel":'0951-65618134'
	                    },
	                    {
	                    	"id":10003,
	                        "k": "咀吧3",
	                        "v": 42,
	                        "lng": 120.237,
	                        "lat": 30.367,
	                        "sj90": 190,
	                        "sj90day": 720,
	                        "nocrime": 40,
	                        "crime": 60,
	                        "violence": 23,
	                        "i7": 2,
	                        "change": 6,
	                        "address":'杭州下城区中山北路120号2，3楼',
	                        "tel":'0951-65618134'
	                    },
	                    {
	                    	"id":10004,
	                        "k": "咀吧4",
	                        "v": 72,
	                        "lng": 120.237,
	                        "lat": 30.367,
	                        "sj90": 190,
	                        "sj90day": 720,
	                        "nocrime": 80,
	                        "crime": 30,
	                        "violence": 42,
	                        "i7": 2,
	                        "change": 2,
	                        "address":'杭州下城区中山北路62号2，3楼',
	                        "tel":'0951-65618134'
	                    },
	                    {
	                    	"id":10005,
	                        "k": "咀吧5",
	                        "v": 52,
	                        "lng": 120.237,
	                        "lat": 30.367,
	                        "sj90": 190,
	                        "sj90day": 720,
	                        "nocrime": 50,
	                        "crime": 18,
	                        "violence": 23,
	                        "i7": 2,
	                        "change": 0,
	                        "address":'杭州下城区中山北路45号2，3楼',
	                        "tel":'0951-65618134'
	                    }
	                ]
	            },
	            {
	                "indId": 10012,
	                "indTitle": "今日酒店TOP5",
	                "indType": "LINE",
	                "indData": [
	                    {
	                    	"id":10006,
	                        "k": "酒店1",
	                        "v": 32,
	                        "lng": 120.237,
	                        "lat": 30.367,
	                        "sj90": 190,
	                        "sj90day": 720,
	                        "nocrime": 60,
	                        "crime": 100,
	                        "violence": 28,
	                        "i7": 2,
	                        "change": 7,
	                        "address":'杭州下城区中山北路72号2，3楼',
	                        "tel":'0951-65618134'
	                    },
	                    {
	                    	"id":10007,
	                        "k": "酒店2",
	                        "v": 47,
	                        "lng": 120.237,
	                        "lat": 30.367,
	                        "sj90": 190,
	                        "sj90day": 720,
	                        "nocrime": 60,
	                        "crime": 14,
	                        "violence": 52,
	                        "i7": 2,
	                        "change": 4,
	                        "address":'杭州下城区中山北路32号2，3楼',
	                        "tel":'0951-65618134'
	                    },
	                    {
	                    	"id":10008,
	                        "k": "酒店3",
	                        "v": 19,
	                        "lng": 120.237,
	                        "lat": 30.367,
	                        "sj90": 190,
	                        "sj90day": 720,
	                        "nocrime": 30,
	                        "crime": 3,
	                        "violence": 28,
	                        "i7": 2,
	                        "change": 2,
	                        "address":'杭州下城区中山北路12号2，3楼',
	                        "tel":'0951-65618134'
	                    },
	                    {
	                    	"id":10009,
	                        "k": "酒店4",
	                        "v": 43,
	                        "lng": 120.237,
	                        "lat": 30.367,
	                        "sj90": 190,
	                        "sj90day": 720,
	                        "nocrime": 40,
	                        "crime": 70,
	                        "violence": 26,
	                        "i7": 2,
	                        "change": -1,
	                        "address":'杭州下城区中山北路55号2，3楼',
	                        "tel":'0951-65618134'
	                    },
	                    {
	                    	"id":10010,
	                        "k": "酒店5",
	                        "v": 20,
	                        "lng": 120.237,
	                        "lat": 30.367,
	                        "sj90": 190,
	                        "sj90day": 720,
	                        "nocrime": 40,
	                        "crime": 100,
	                        "violence": 72,
	                        "i7": 2,
	                        "change": 5,
	                        "address":'杭州下城区中山北路42号2，3楼',
	                        "tel":'0951-65618134'
	                    }
	                ]
	            }
	        ],
	        "expire": "2015-11-16 23:59:59",
	        "isExpire": 0
		}
	}),
    "subtitle": merge(commonData, {
        "data": {
            "charId": 1000,
            "title": "",
            "subtitle": "",
            "count": "",
            "type": "count-title",
            "inds": [
                {
                    "indId":"1",
                    "indTitle": "今日高频现场SJ人数:",
                    "indType":"count",
                    "indData": [
                        {
                            "v":10,
                            "change":10
                        }
                    ]
                }
            ]
        }
    }),
    "responseRange": merge(commonData, {
        "data": {
            "charId": 1001,
            "title": "",
            "subtitle": "",
            "count": "",
            "type": "map",
            "inds": [
                {
                    "indId":"2",
                    "indTitle": "",
                    "indType":"circle",
                    "indData": [
                        {
                            "lg": "120.1530000",
                            "la": "30.2870000",
                            "v":20
                        }
                    ]
                }
            ]
        }
    }),
    "topPeople": merge(commonData, {
        "data": {
            "charId": 1002,
            "title": "",
            "subtitle": "",
            "count": "",
            "type": "panel",
            "inds": [
                {
                    "indId":"3",
                    "indTitle": "网吧今日人数排行",
                    "indType":"bar",
                    "indData": [
                        {
                            "k": "网鱼网咖",
                            "v": 50,
                            "lg": "120.1530000",
                            "la": "30.2870000",
                            "address":"地址",
                            "subInds": [
                                {
                                    "indId":"3",
                                    "indType":"count",
                                    "indTitle":"今日sj人数",
                                    "indData": [
                                        {
                                            "v":10
                                        }
                                    ]
                                },
                                {
                                    "indId":"4",
                                    "indType":"bar",
                                    "indTitle":"风险类型",
                                    "indData": [
                                        {
                                            "k":"无前科",
                                            "v":10
                                        }
                                    ]
                                },
                                {
                                    "indId":"5",
                                    "indType":"count",
                                    "indTitle":"90天sj人数",
                                    "indData": [
                                        {
                                            "v":10
                                        }
                                    ]
                                },
                                {
                                    "indId":"5",
                                    "indType":"count",
                                    "indTitle":"90天sj人登录总天数",
                                    "indData": [
                                        {
                                            "v":10
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "indId":"6",
                    "indTitle": "酒店今日人数排行",
                    "indType":"bar",//
                    "indData": [
                        {
                            "k": "如家",
                            "v": 50,
                            "lg": "120.1530000",
                            "la": "30.2870000",
                            "address":"地址",
                            "subInds": [
                                {
                                    "indId":"7",
                                    "indType":"count",
                                    "indTitle":"今日sj人数",
                                    "indData": [
                                        {
                                            "v":10
                                        }
                                    ]
                                },
                                {
                                    "indId":"8",
                                    "indType":"bar",
                                    "indTitle":"风险类型",
                                    "indData": [
                                        {
                                            "k":"无前科",
                                            "v":10
                                        }
                                    ]
                                },
                                {
                                    "indId":"9",
                                    "indType":"count",
                                    "indTitle":"90天sj人数",
                                    "indData": [
                                        {
                                            "v":10
                                        }
                                    ]
                                },
                                {
                                    "indId":"10",
                                    "indType":"count",
                                    "indTitle":"90天sj人入住总天数",
                                    "indData": [
                                        {
                                            "v":10
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    })
};