const deployStatusSelect = [{ "id": 1, "name": "撤消发布" }, { "id": 2, "name": "已发布" }, { "id": 3, "name": "草稿" }, { "id": 4, "name": "不通过" }, { "id": 5, "name": "已提交" }];

const componentStatus = [
    { id: 0, name: '未发布' },
    { id: 1, name: '撤回发布' },
    { id: 2, name: '已发布' },
    { id: 3, name: '草稿' },
    { id: 4, name: '不通过' },
    { id: 5, name: '已提交' }
]
const componentStatusMini = [
    { id: 0, name: '未发布' },
    { id: 1, name: '撤回发布' },
    { id: 2, name: '已发布' }
]
const componentTypes = [
    { id: 13, name: '良品' },
    { id: 14, name: '良食' },
    { id: 15, name: '良店' },
    { id: 20, name: '360解决方案' },
    { id: 21, name: '专家文章' },
    { id: 22, name: '良品导购文' },
    { id: 23, name: '良店文章' },
    { id: 24, name: '视频列表' },
    { id: 26, name: '活动文章' },
    { id: 27, name: '商品' },
    { id: 28, name: 'h5活动' },
]
const componentTypesForFence = [
    { id: 13, name: '良品' },
    { id: 14, name: '良食' },
    { id: 15, name: '良店' },
    { id: 20, name: '360解决方案' },
    { id: 21, name: '大咖说文章' },
    { id: 22, name: '良品导购文' },
    { id: 23, name: '良店文章' },
    { id: 24, name: '视频列表' },
    { id: 26, name: '活动文章' },
    { id: 27, name: '商品' },
]
export default global = {
    deployStatusSelect,
    componentStatus,
    componentTypes,
    componentStatusMini,
    componentTypesForFence,
}

// 11-栏目
// 12-大咖
// 13-良品
// 14-良食
// 15-良店
// 16-良言（爱分享）
// 17-行动与食谱
// 18-3分钟视频
// 19-3分钟视频图文解说文
// 20-360解决方案
// 21-大咖文章
// 22-良品导购文
// 23-良店导购文
// 24-视频列表
// 25-活动专题
// 26-活动文章27-闪购商品
// 28-h5活动
// 29-banner管理
// 30-美食视频
// 31-活动模板
// 32-首页活动
// 33-栏目
// 34-头条
// 35-广告