// components/container/index.js
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     */
    properties: {
        hideHeader: {
            type: Boolean,
            value: true,
        },
        headerBg: {
            type: String,
            value: '#ffffff',
        },
        footerBg: {
            type: String,
            value: '#ffffff',
        },
        padding: {
            type: Boolean,
            value: true,
        },
        textColor: {
            type: String,
            value: '',
        },
        title: {
            type: String,
            value: '',
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        headerHeight: (() => {
            const { model } = wx.getSystemInfoSync();
            if (/iphone\s{0,}x/i.test(model)) {
                return 180;
            }
            return 130;
        })(),
        iphonex: (() => {
            const { model } = wx.getSystemInfoSync();
            if (/iphone\s{0,}x/i.test(model)) {
                return true;
            }
            return false;
        })(),
        showBackBtn: false,
    },

    ready() {
        // 设置初始文字和信息栏颜色值
        const background = this.isColorDarkOrLight(this.data.headerBg);
        let firstTextColor;
        let backgroundTextStyle = 'dark';
        if (this.data.textColor) {
            firstTextColor = this.data.textColor;
        } else {
            if (background === 'dark') {
                // 深色
                firstTextColor = '#ffffff';
                backgroundTextStyle = 'light';
            }
            // 浅色
            firstTextColor = '#000000';
            backgroundTextStyle = 'dark';
        }

        const pages = getCurrentPages();
        this.setData({ textColor: firstTextColor, showBackBtn: pages.length > 1 });
        wx.setNavigationBarColor({
            frontColor: firstTextColor,
            backgroundColor: firstTextColor,
        });

        // 设置背景颜色和标题栏颜色一致
        wx.setBackgroundColor({
            backgroundColor: this.data.headerBg,
        });
        wx.setBackgroundTextStyle({
            textStyle: backgroundTextStyle, // 下拉背景字体、loading 图的样式
        });

        // 绑定滚动时的事件
        wx.createIntersectionObserver(this, {
            thresholds: [0, 0.2, 0.4, 0.6, 0.8, 1],
        }).relativeTo('.target-block').relativeToViewport().observe('.comp-header', (res) => {
            if (res.boundingClientRect.top < 0) return;
            let lastTextColor;
            if (background === 'dark') {
                // 深色
                lastTextColor = '#ffffff';
            } else {
                // 浅色
                lastTextColor = '#000000';
            }
            this.setData({
                headerOpacity: res.intersectionRatio,
            });
            if (res.intersectionRatio >= 0.6) {
                wx.setNavigationBarColor({
                    frontColor: lastTextColor,
                    backgroundColor: lastTextColor,
                });
                this.setData({
                    textColor: lastTextColor,
                });
            } else {
                wx.setNavigationBarColor({
                    frontColor: firstTextColor,
                    backgroundColor: firstTextColor,
                });
                this.setData({
                    textColor: firstTextColor,
                });
            }
        });
    },
    /**
     * 组件的方法列表
     */
    methods: {
        parseRGB(str) {
            const REG_HEX = /(^#?[0-9A-F]{6}$)|(^#?[0-9A-F]{3}$)/i;
            if (typeof str === 'string' && REG_HEX.test(str)) {
                str = str.replace('#', '');
                let arr;
                if (str.length === 3) {
                    arr = str.split('').map(c => (c + c));
                } else if (str.length === 6) {
                    arr = str.match(/[a-zA-Z0-9]{2}/g);
                } else {
                    throw new Error('wrong color format');
                }
                return arr.map((c) => parseInt(c, 16));
            }
            throw new Error('color should be string');
        },
        rgbToHsl(rgbStr) {
            let [r, g, b] = this.parseRGB(rgbStr);
            r /= 255, g /= 255, b /= 255;
            let max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max == min) {
                h = s = 0; // achromatic
            } else {
                let d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return [h, s, l];
        },
        /**
         * 判断颜色深浅
         */
        isColorDarkOrLight(rgbStr) {
            let [h, s, l] = this.rgbToHsl(rgbStr);
            return (l > 0.5) ? 'light' : 'dark';
        },
        onBack() {
            wx.navigateBack({
                delta: 1
            });
        },
    },
});
