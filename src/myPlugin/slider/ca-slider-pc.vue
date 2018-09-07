<template>
    <div id="ca-slider-pc" @mouseover="showBtn = true" @mouseout="showBtn = false">
        <div class="ca-slider-container" ref="container" @mousedown.stop="mouseStart" @mouseup.stop="mouseEnd" @mouseenter="clearTimer()" @mouseleave="setTimer()">
            <div v-if="hasBtn" v-show="showBtn" :class="{'ca-slider-btn-disable': !this.loop && this.index === 0}" class="ca-slider-left-btn iconfont icon-arrow_left" @click="prev()"></div>
            <div v-if="hasBtn" v-show="showBtn" :class="{'ca-slider-btn-disable': !this.loop && this.index === this.max}" class="ca-slider-right-btn iconfont icon-arrow_right" @click="next()"></div>
            <ul class="clearfix ca-slider-list" :style="{
						'transform': 'translateX('+translateX+'px)',
                        '-ms-transform': 'translateX('+translateX+'px)',
                        '-webkit-transform': 'translateX('+translateX+'px)',
		                'width': ul_w + 'px'
					}">
                <li class="ca-slider-item" v-for="(item, index) in list" :key="index" :style="{backgroundImage: 'url('+ item +')', width: li_w + 'px', marginRight: spaceBetween + 'px'}">
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ca-slider-pc',
    props: {
        dataList: {
            // 轮播图片链接，必填
            type: Array,
            default: []
        },
        options: {
            index: {
                // 轮播起始位置
                type: Number,
                default: 0
            },
            perView: {
                // 一屏多少个图片
                type: Number,
                default: 1
            },
            spaceBetween: {
                // 图片的间距
                type: Number,
                default: 0
            },
            autoPlay: {
                // 是否自动播放，需要先开启无缝滚动
                type: Boolean,
                default: false
            },
            loop: {
                // 是否开启无缝滚动
                type: Boolean,
                default: false
            },
            slideGroup: {
                // 是否全屏滚动，针对于一屏有多个图片
                type: Boolean,
                default: false
            },
            drag: {
                // 是否鼠标可拖动
                type: Boolean,
                default: false
            },
            autoSpeed: {
                // 自动播放的时间间隔
                type: Number,
                default: 0
            }
        }
    },
    data() {
        return {
            list: this.dataList,
            index: this.options.index || 0,
            perView: this.options.perView || 1,
            spaceBetween: this.options.spaceBetween || 0,
            autoPlay: this.options.autoPlay,
            loop: this.options.loop,
            slideGroup: this.options.slideGroup || false,
            drag: this.options.drag,
            IEVersion: null, // 浏览器版本
            translateX: 0, // ul的x轴偏移量
            ul_w: 0, // ul的宽度
            li_w: 0, // li的宽度
            parentWidth: 0, // slider容器的宽度
            perWidth: 0, // 轮播一次的距离
            timer: null, // 用于存放自动播放的定时器
            startX: 0, // 每次拖动的起始x轴坐标
            startY: 0, // 每次拖动的起始y轴坐标
            moveDistance: 0, // 鼠标拖动的总距离
            hasBtn: true,
            showBtn: false,
            groupLength: 0,
            max: 0, // index的最大值
            span: 0, // 重置ul位置时的跨度
            startPosition: 0 // ul重置的位置
        }
    },
    mounted() {
        // this.IEVersion = this.getIEVersion()
        this.init()
    },
    watch: {},
    methods: {
        init() {
            // 判断li个数
            if (this.dataList.length <= this.perView) {
                this.list = this.dataList
                this.hasBtn = false
                // 计算ul、li宽度
                var length = this.dataList.length
                this.parentWidth = this.$el.offsetWidth
                var perView = this.perView
                var marginWidth = (perView - 1) * this.spaceBetween
                this.li_w = (this.parentWidth - marginWidth) / perView
                this.ul_w = (this.li_w + this.spaceBetween) * length

                return false
            }

            // 整屏滚动
            if (this.perView > 1 && this.slideGroup) {
                var length = this.dataList.length
                var perView = this.perView
                var diff = this.perView - length % perView
                for (var i = 0; i < diff; i++) {
                    this.list.push('')
                }
                this.list = this.list.concat()
                this.groupLength = Math.ceil(length / this.perView)
            }

            // 无缝循环
            if (this.loop) {
                // 判断是否为全屏滚动
                var dataList = this.groupLength > 0 ? this.list : this.dataList

                // 右侧补足
                var arr_R = dataList.slice(0, this.perView)
                this.list = this.list.concat(arr_R)

                // 左侧补足
                var arr_L = dataList.slice(-1 * this.perView)
                this.list = arr_L.concat(this.list)

                // 重置index
                if (this.groupLength > 0) {
                    this.index = this.index + 1
                } else {
                    this.index = this.index + this.perView
                }
            }

            // 计算ul、li宽度
            var length = this.list.length
            this.parentWidth = this.$el.offsetWidth
            var perView = this.perView
            var marginWidth = (perView - 1) * this.spaceBetween
            this.li_w = (this.parentWidth - marginWidth) / perView
            this.ul_w = (this.li_w + this.spaceBetween) * length

            // 计算滚动一次的距离
            this.perWidth =
                this.groupLength > 0
                    ? (this.li_w + this.spaceBetween) * this.perView
                    : this.li_w + this.spaceBetween

            // 计算index的最大值，跨度
            this.startPosition = this.groupLength > 0 ? 1 : this.perView
            this.max =
                this.groupLength > 0
                    ? this.loop ? this.groupLength + 1 : this.groupLength - 1
                    : this.list.length - this.perView
            this.span =
                this.groupLength > 0 ? this.groupLength : this.dataList.length

            // 计算初始位置
            this.translateX = -1 * this.perWidth * this.index

            // 自动播放
            this.setTimer(this.timer)
        },
        getIEVersion() {
            var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
            var isIE =
                userAgent.indexOf('compatible') > -1 &&
                userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
            var isEdge = userAgent.indexOf('Edge') > -1 && !isIE // 判断是否IE的Edge浏览器
            var isIE11 =
                userAgent.indexOf('Trident') > -1 &&
                userAgent.indexOf('rv:11.0') > -1
            if (isIE) {
                var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
                reIE.test(userAgent)
                var fIEVersion = parseFloat(RegExp['$1'])
                if (fIEVersion == 7) {
                    return 7
                } else if (fIEVersion == 8) {
                    return 8
                } else if (fIEVersion == 9) {
                    return 9
                } else if (fIEVersion == 10) {
                    return 10
                } else {
                    return 6 // IE版本<=7
                }
            } else if (isEdge) {
                return 'edge' //edge
            } else if (isIE11) {
                return 11 // IE11
            } else {
                return -1 // 不是ie浏览器
            }
        },
        next() {
            this.showBtn = true
            // var max = this.list.length - this.perView
            // 无缝连接，此处解决运动还未结束，用户就点击下一页，重置ul位置
            if (this.index === this.max && this.loop) {
                this.index = this.startPosition
                this.translateX = this.translateX + this.span * this.perWidth
            }
            if (this.index < this.max) {
                this.index++
                var finalValue = -1 * this.index * this.perWidth
                this.move('translateX', 20, finalValue)
            } else {
                var finalValue = -1 * this.index * this.perWidth
                this.move('translateX', 20, finalValue)
            }
        },
        prev() {
            // 无缝连接，此处解决运动还未结束，用户就点击上一页，重置ul位置
            if (this.index === 0 && this.loop) {
                this.index = this.span
                this.translateX = this.translateX - this.span * this.perWidth
            }
            if (this.index > 0) {
                this.index--
                var finalValue = -1 * this.index * this.perWidth
                this.move('translateX', 20, finalValue)
            } else {
                var finalValue = -1 * this.index * this.perWidth
                this.move('translateX', 20, finalValue)
            }
        },
        /**
         * attr: string, 不要改变的属性
         * speed: number, 运动的速度
         * finalValue: number, 运动的终值
         */
        move(attr, speed, finalValue) {
            clearInterval(timer)
            var timer = null

            timer = setInterval(() => {
                var finalValue = -1 * this.index * this.perWidth
                var distance = this[attr] - finalValue
                var sudu = distance / 8
                if (Math.abs(sudu) < 3) {
                    if (distance > 0) {
                        sudu = 3
                    } else {
                        sudu = -3
                    }
                }

                if (Math.abs(distance) <= 3) {
                    this[attr] = finalValue
                    clearInterval(timer)

                    // 无缝连接，鼠标拖动到最后一页，重置ul位置
                    // var max = this.list.length - this.perView
                    if (this.index === this.max && this.loop) {
                        this.index = this.startPosition
                        this.translateX =
                            this.translateX + this.span * this.perWidth
                    }
                    if (this.index === 0 && this.loop) {
                        this.index = this.span
                        this.translateX =
                            this.translateX - this.span * this.perWidth
                    }
                } else {
                    this[attr] = this[attr] - sudu
                }
            }, 1000 / 60)
        },
        setTimer() {
            if (this.autoPlay && this.loop) {
                var that = this

                let speed =
                    this.options.autoSpeed > 0 ? this.options.autoSpeed : 3000

                this.timer = setInterval(function() {
                    that.next()
                }, speed)
            }
        },
        clearTimer() {
            clearInterval(this.timer)
        },
        mouseStart(event) {
            if (!this.drag) {
                return false
            }

            // 无缝连接，重置ul位置
            // var max = this.list.length - this.perView
            if (this.index === this.max && this.loop) {
                this.index = this.startPosition
                this.translateX = this.translateX + this.span * this.perWidth
            }
            if (this.index === 0 && this.loop) {
                this.index = this.span
                this.translateX = this.translateX - this.span * this.perWidth
            }

            // 是否为左键
            if (event.button !== 0) {
                return false
            }

            this.startX = event.x || event.pageX
            this.startY = event.y || event.pageY

            this.$refs.container.addEventListener(
                'mousemove',
                this.mouseMove,
                false
            )
        },
        mouseMove(event) {
            var x = event.x || event.pageX
            var y = event.y || event.pageY

            var distanceX = x - this.startX
            var distanceY = y - this.startY

            // 判断鼠标运动方向，若y轴方向运动距离大于x轴方向则不滑动
            if (Math.abs(distanceX) < Math.abs(distanceY)) {
                return false
            }

            this.translateX = this.translateX + distanceX * 0.4

            this.startX = x
            this.startY = y
            this.moveDistance += distanceX
        },
        mouseEnd(event) {
            if (!this.drag) {
                return false
            }

            this.$refs.container.removeEventListener(
                'mousemove',
                this.mouseMove
            )
            if (Math.abs(this.moveDistance) > this.perWidth / 2) {
                if (this.moveDistance > 0) {
                    this.prev()
                } else {
                    this.next()
                }
            } else {
                var finalValue = -1 * this.index * this.perWidth
                this.move('translateX', 20, finalValue)
            }

            this.moveDistance = 0
        }
    }
}
</script>

<style lang="less" scoped>
* {
    margin: 0;
    padding: 0;
}
ul {
    list-style: none;
}

li {
    list-style: none;
}

#ca-slider-pc {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;

    .ca-slider-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;

        .ca-slider-left-btn {
            width: 40px;
            height: 60px;
            position: absolute;
            top: 50%;
            left: 0;
            margin-top: -30px;
            z-index: 100;
            cursor: pointer;
            font-size: 45px;
            line-height: 60px;
        }

        .ca-slider-right-btn {
            width: 40px;
            height: 60px;
            position: absolute;
            top: 50%;
            right: 0;
            margin-top: -30px;
            font-size: 45px;
            line-height: 60px;
            z-index: 100;
            cursor: pointer;
        }

        .ca-slider-btn-disable {
            cursor: not-allowed;
        }

        ul {
            width: auto;
            height: 100%;

            .ca-slider-item {
                float: left;
                height: 100%;

                background-position: center center;
                background-repeat: no-repeat;
                background-size: cover;
            }
        }
    }
}
</style>
