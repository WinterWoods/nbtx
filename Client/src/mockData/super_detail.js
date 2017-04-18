var merge = require('webpack-merge');

var commonData = require('./commonData');

module.exports = {
    //自然人基本信息
    "naturalData": {
        "data": {
            "accountType":1,
            "birthday": 1449042206649,
            "enName": "Warriors",
            "nationality": "维吾尔族",
            "nativePlace": "新疆乌鲁木齐草场",
            "cnName": "无双",
            "cellphone": "18569881477,15896338522",
            "certificateNo": "423333198805125693",
            "gender": "男",
            "addressInHz": "杭州市西湖区余杭塘路866号-19号楼103",
            "photo": "照片",
            "birthPlace": "新疆乌鲁木齐草场",
            "dangerTag":'打防控违法人员,重点人口',
            "commonTag":'娱乐场所从业人员,无业游民',
            "maritalStatus":1, // 婚姻状况,"未婚":1,"已婚":2,"离异":3
            "specialProfessions":'打劫的',
            "alipayVerifyType":1,//已认证 1，未认证0
            "idCardRelation":1,
            "mobileRelation":1,
            "workFlg":1,
            "addressFlg":1,
            "educateFlg":0,
            "driverFlg":1,
            "passportFlg":1,
            "vehicleFlg":1,
            "nonVehicleFlg":1,
            "dnaFlg":1,
            "fingerprintFlg":1,
            "otherFlg":1,
            "mobileFlg":1,
            "socialSecurityFlg":1,
            "estateFlg":1,
            "fundFlg":1,
            riskLevel:1
        },
        code:200
    },
    //淘宝账号信息表
    taobaoData: {
        "data": [{
                "accountType":2,
                "birthday": 1449042206649,
                "enName": "Warriors",
                "nationality": "藏族",
                "nativePlace": "拉萨",
                "cnName": "无双飞燕",
                "cellphone": "18569881477",
                "certificateNo": "233331988051288693",
                "gender": "男",
                "addressInHz": "杭州市西湖区余杭塘路99号楼23",
                "photo": "照片",
                "birthPlace": "新疆乌鲁木齐草场",
                "dangerTag":'打防控违法人员,重点人口',
                "commonTag":'娱乐场所从业人员,无业游民',
                "maritalStatus":2, // 婚姻状况,"未婚":1,"已婚":2,"离异":3
                "specialProfessions":'打劫的人',
                "alipayVerifyType":0,
                "idCardRelation":0,
                "mobileRelation":1,
                "workFlg":1,
                "addressFlg":1,
                "educateFlg":0,
                "driverFlg":1,
                "passportFlg":1,
                "vehicleFlg":1,
                "nonVehicleFlg":1,
                "dnaFlg":1,
                "fingerprintFlg":1,
                "otherFlg":1,
                "mobileFlg":1,
                "socialSecurityFlg":1,
                "estateFlg":1,
                "fundFlg":1,
                nick:'323',
                shopAuthName:'323',
                riskLevel:2
            },
            {
                "birthday": 1449042206649,
                "enName": "Warriors",
                "nationality": "藏族",
                "nativePlace": "新疆乌鲁木齐草场",
                "cnName": "无双来块的1",
                "cellphone": "18569881477,15896338522",
                "certificateNo": "423333198805125693",
                "gender": "男",
                "addressInHz": "杭州市西湖区余杭塘路866号-19号楼103",
                "photo": "照片",
                "birthPlace": "新疆乌鲁木齐草场",
                "dangerTag":'打防控违法人员,重点人口',
                "commonTag":'娱乐场所从业人员,无业游民',
                "maritalStatus":1, // 婚姻状况,"未婚":1,"已婚":2,"离异":3
                "specialProfessions":'打劫的',
                riskLevel:2,
                nick:'324',
                shopAuthName:'324'
            },
            {
                "birthday": 1449042206649,
                "enName": "Warriors",
                "nationality": "藏族",
                "nativePlace": "新疆乌鲁木齐草场",
                "cnName": "无双块的2",
                "cellphone": "18569881477,15896338522",
                "certificateNo": "423333198805125693",
                "gender": "男",
                "addressInHz": "杭州市西湖区余杭塘路866号-19号楼103",
                "photo": "照片",
                "birthPlace": "新疆乌鲁木齐草场",
                "dangerTag":'打防控违法人员,重点人口',
                "commonTag":'娱乐场所从业人员,无业游民',
                "maritalStatus":1, // 婚姻状况,"未婚":1,"已婚":2,"离异":3
                "specialProfessions":'打劫的',
                riskLevel:2,
                nick:'325',
                shopAuthName:'325'
            },
            {
                "birthday": 1449042206649,
                "enName": "Warriors",
                "nationality": "藏族",
                "nativePlace": "新疆乌鲁木齐草场",
                "cnName": "无地方双3",
                "cellphone": "18569881477,15896338522",
                "certificateNo": "423333198805125693",
                "gender": "男",
                "addressInHz": "杭州市西湖区余杭塘路866号-19号楼103",
                "photo": "照片",
                "birthPlace": "新疆乌鲁木齐草场",
                "dangerTag":'打防控违法人员,重点人口',
                "commonTag":'娱乐场所从业人员,无业游民',
                "maritalStatus":1, // 婚姻状况,"未婚":1,"已婚":2,"离异":3
                "specialProfessions":'打劫的',
                nick:'326',
                shopAuthName:'326'
            },
            {
                "birthday": 1449042206649,
                "enName": "Warriors",
                "nationality": "藏族",
                "nativePlace": "新疆乌鲁木齐草场",
                "cnName": "无大富大贵双4",
                "cellphone": "18569881477,15896338522",
                "certificateNo": "423333198805125693",
                "gender": "男",
                "addressInHz": "杭州市西湖区余杭塘路866号-19号楼103",
                "photo": "照片",
                "birthPlace": "新疆乌鲁木齐草场",
                "dangerTag":'打防控违法人员,重点人口',
                "commonTag":'娱乐场所从业人员,无业游民',
                "maritalStatus":1, // 婚姻状况,"未婚":1,"已婚":2,"离异":3
                "specialProfessions":'打劫的',
                riskLevel:2,
                nick:'327',
                shopAuthName:'327'
            },
            {
                "birthday": 1449042206649,
                "enName": "Warriors",
                "nationality": "藏族",
                "nativePlace": "新疆乌鲁木齐草场",
                "cnName": "无双5",
                "cellphone": "18569881477,15896338522",
                "certificateNo": "423333198805125693",
                "gender": "男",
                "addressInHz": "杭州市西湖区余杭塘路866号-19号楼103",
                "photo": "照片",
                "birthPlace": "新疆乌鲁木齐草场",
                "dangerTag":'打防控违法人员,重点人口',
                "commonTag":'娱乐场所从业人员,无业游民',
                "maritalStatus":1, // 婚姻状况,"未婚":1,"已婚":2,"离异":3
                "specialProfessions":'打劫的',
                riskLevel:2,
                nick:'328',
                shopAuthName:'328'
            },
            {
                "birthday": 1449042206649,
                "enName": "Warriors",
                "nationality": "藏族",
                "nativePlace": "新疆乌鲁木齐草场",
                "cnName": "无双5",
                "cellphone": "18569881477,15896338522",
                "certificateNo": "423333198805125693",
                "gender": "男",
                "addressInHz": "杭州市西湖区余杭塘路866号-19号楼103",
                "photo": "照片",
                "birthPlace": "新疆乌鲁木齐草场",
                "dangerTag":'打防控违法人员,重点人口',
                "commonTag":'娱乐场所从业人员,无业游民',
                "maritalStatus":1, // 婚姻状况,"未婚":1,"已婚":2,"离异":3
                "specialProfessions":'打劫的',
                nick:'329',
                shopAuthName:'329'
            },
            {
                "birthday": 1449042206649,
                "enName": "Warriors",
                "nationality": "藏族",
                "nativePlace": "新疆乌鲁木齐草场",
                "cnName": "无双3",
                "cellphone": "18569881477,15896338522",
                "certificateNo": "423333198805125693",
                "gender": "男",
                "addressInHz": "杭州市西湖区余杭塘路866号-19号楼103",
                "photo": "照片",
                "birthPlace": "新疆乌鲁木齐草场",
                "dangerTag":'打防控违法人员,重点人口',
                "commonTag":'娱乐场所从业人员,无业游民',
                "maritalStatus":1, // 婚姻状况,"未婚":1,"已婚":2,"离异":3
                "specialProfessions":'打劫的',
                nick:'330',
                shopAuthName:'330'
            },
            {
                "birthday": 1449042206649,
                "enName": "Warriors",
                "nationality": "藏族",
                "nativePlace": "新疆乌鲁木齐草场",
                "cnName": "无双44",
                "cellphone": "18569881477,15896338522",
                "certificateNo": "423333198805125693",
                "gender": "男",
                "addressInHz": "杭州市西湖区余杭塘路866号-19号楼103",
                "photo": "照片",
                "birthPlace": "新疆乌鲁木齐草场",
                "dangerTag":'打防控违法人员,重点人口',
                "commonTag":'娱乐场所从业人员,无业游民',
                "maritalStatus":1, // 婚姻状况,"未婚":1,"已婚":2,"离异":3
                "specialProfessions":'打劫的',
                nick:'331',
                shopAuthName:'331'
            }],
        code:200
    },
    //支付宝基本信息表
    payData: merge(commonData, {
        "data": [{
                "remittanceCcount": "乌鲁木齐",
                "commonlyUsedOn": "乌鲁木齐",
                "alipayRegisteredCity": "乌鲁木齐",
                "havanaId": "435565665656566663",
                "alipayNumber": "1435465645546",
                "alipayRegisteredTime": 1449042659584,
                "alipayPhoto": "照片"
            },
            {
                "remittanceCcount": "浙江-杭州市",
                "commonlyUsedOn": "杭州市余杭区",
                "alipayRegisteredCity": "浙江-杭州市",
                "havanaId": "56461314864613541",
                "alipayNumber": "89465131321",
                "alipayRegisteredTime": 232312021000,
                "alipayPhoto": "照片"
            }]
    }),
    //自然人信息弹出详情
    naturalDetailData: {
        "data":[
            {
              	"tagName": "拘留所人员",
              	"data": [{
              		  "入所原因": "入所拘留",
              	    "入所日期":"2013-04-10",
                    "违法性质":'扰乱单位秩序',
                    "拘留天数":'5',
                    "出所原因": "拘留期满1",
              	    "出所日期":"2013-04-15",
                    "职业":'实际哦啊',
              		  "入所原因": "入所拘留1",
                    "入所日期":"2013-04-10",
                    "违法性质":'扰乱单位秩序',
                    "拘留天数":'5',
                    "出所原因": "拘留期满1",
                    "出所日期":"2013-04-15",
                    "职业":'实际哦啊',
                    "入所原因": "入所拘留1",
              	    "入所日期":"2013-04-10"
              	},
              	{
              		  "出所原因": "拘留期满",
              	    "出所日期":"2013-04-15",
                    "出所原因": "拘留期满",
              	    "出所日期":"2013-04-15",
                    "出所原因": "拘留期满1",
              	    "出所日期":"2013-04-15",
                    "职业":'实际哦啊',
              		  "入所原因": "入所拘留1",
              	    "入所日期":"2013-04-10","出所原因": "拘留期满1",
              	    "出所日期":"2013-04-15",
                    "职业":'实际哦啊',
              		  "入所原因": "入所拘留1",
              	    "入所日期":"2013-04-10"
              	}]
            },
            {
              tagName:'打防控违法人员',
              data:[
                {
                    "职业":'实际哦啊',
              		  "入所原因": "入所拘留1",
              	    "入所日期":"2013-04-10",
                    "出所原因": "拘留期满",
                    "出所日期":"2013-04-15",
                    "出所原因": "拘留期满1",
                    "出所日期":"2013-04-15",
                    "职业":'实际哦啊',
                    "入所原因": "入所拘留1",
                    "入所日期":"2013-04-10","出所原因": "拘留期满1",
                    "出所日期":"2013-04-15"
              	},
              	{
              		  "出所原因": "拘留期满1",
              	    "出所日期":"2013-04-15",
                    "职业":'实际哦啊',
              		  "入所原因": "入所拘留1",
              	    "入所日期":"2013-04-10"
              	}
                ]
            },
            {
                tagName:'打防控违法人员3',
                data:[
                    {
                        "职业":'实际哦啊',
                        "入所原因": "入所拘留1",
                        "入所日期":"2013-04-10",
                        "出所原因": "拘留期满",
                        "出所日期":"2013-04-15",
                        "出所原因": "拘留期满1",
                        "出所日期":"2013-04-15",
                        "职业":'实际哦啊',
                        "入所原因": "入所拘留1",
                        "入所日期":"2013-04-10","出所原因": "拘留期满1",
                        "出所日期":"2013-04-15"
                    },
                    {
                        "出所原因": "拘留期满1",
                        "出所日期":"2013-04-15",
                        "职业":'实际哦啊',
                        "入所原因": "入所拘留1",
                        "入所日期":"2013-04-10"
                    }
                ]
            },
            {
              	"tagName": "拘留所人员2",
              	"data": [{
              		  "入所原因": "入所拘留",
              	    "入所日期":"2013-04-10",
                    "违法性质":'扰乱单位秩序',
                    "拘留天数":'5',
                    "出所原因": "拘留期满1",
              	    "出所日期":"2013-04-15",
                    "职业":'实际哦啊',
              		  "入所原因": "入所拘留1",
                    "入所日期":"2013-04-10",
                    "违法性质":'扰乱单位秩序',
                    "拘留天数":'5',
                    "出所原因": "拘留期满1",
                    "出所日期":"2013-04-15",
                    "职业":'实际哦啊',
                    "入所原因": "入所拘留1",
              	    "入所日期":"2013-04-10"
              	},
              	{
              		  "出所原因": "拘留期满",
              	    "出所日期":"2013-04-15",
                    "出所原因": "拘留期满",
              	    "出所日期":"2013-04-15",
                    "出所原因": "拘留期满1",
              	    "出所日期":"2013-04-15",
                    "职业":'实际哦啊',
              		  "入所原因": "入所拘留1",
              	    "入所日期":"2013-04-10","出所原因": "拘留期满1",
              	    "出所日期":"2013-04-15",
                    "职业":'实际哦啊',
              		  "入所原因": "入所拘留1",
              	    "入所日期":"2013-04-10"
              	}]
            }
        ],
        code:'200'
    }

};
