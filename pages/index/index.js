//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        list: [
        ]
    },

    onLoad() {
        setTimeout(() => {
            this.setData({
                list: [
                    {
                        image: '',
                        mainT: '111111',
                        subT: '2222222',
                    }
                ]
            });
        }, 2000);
        wx.getFileSystemManager().writeFile({
            filePath: wx.env.USER_DATA_PATH + '/test.js',
            data: 'abc',
            success: (r) => {
                wx.getFileSystemManager().readFile({
                    filePath: wx.env.USER_DATA_PATH + '/test.js',
                    encoding: 'utf-8',
                    success: (d) => {
                        console.log(d);
                    },
                    fail: (e) => {
                        console.log(e);
                    }
                })
            },
            fail: (e) => {
                console.log(e);
            }
        })
        // wx.createSelectorQuery().select('.card').boundingClientRect(function (rect) {
        //     rect.id      // 节点的ID
        //     rect.dataset // 节点的dataset
        //     rect.left    // 节点的左边界坐标
        //     rect.right   // 节点的右边界坐标
        //     rect.top     // 节点的上边界坐标
        //     rect.bottom  // 节点的下边界坐标
        //     rect.width   // 节点的宽度
        //     rect.height  // 节点的高度
        //     console.log(rect);
        // }).exec()
    },

    onPullDownRefresh() {
        setTimeout(() => wx.stopPullDownRefresh(), 1000);
    },
    onGoto() {
        wx.navigateTo({
            url: '/pages/home/home',
        })
    }
})
