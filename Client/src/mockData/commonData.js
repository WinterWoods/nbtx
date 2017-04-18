var commonData =
{
    "code": 200, // 后台接口返回状态
    "data": {
        "charId": 1, // 图表ID
        "title": "", // 图表标题
        "subtitle": "", // 图表副标题，{{}}之间的是变量占位符，用来替换数据
        "type": "PIE", // 指标的图表类型，目前有：PIE(轮播饼图)，MAP(地图)
        "inds": [] // 该图所含的指标列表
    }
};

module.exports = commonData;