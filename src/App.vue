<template>
  <div id="app">
    <div class="slider-demo">
      <slider :options="options" :dataList="urlList"></slider>
    </div>
  </div>
</template>

<script>
import slider from './myPlugin/slider/ca-slider-pc.vue'
export default {
    name: 'app',
    components: {
        slider
    },
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
            urlList: [
                'https://m.hexiehealth.com/abwx_cms/up_load/20180329095447_573.jpg',
                'https://m.hexiehealth.com/abwx_cms/up_load/20180522165547_637.jpg',
                'https://m.hexiehealth.com/abwx_cms/up_load/20180511105015_386.jpg',
                'https://m.hexiehealth.com/abwx_cms/up_load/20171211093006_832.jpg',
                'https://m.hexiehealth.com/abwx_cms/up_load/1250122_index.jpg'
            ],
            options: {
                perView: 3, // 一屏多少个图片
                spaceBetween: 20, // 图片的间距
                index: 0, // 轮播起始位置
                autoPlay: false, // 是否自动播放，需要先看起无缝滚动,
                autoSpeed: 2500, // 自动播放的时间间隔
                loop: true, // 无缝滚动
                drag: false, // 是否鼠标可拖动
                slideGroup: false // 是否全屏滚动，针对于一屏有多个图片
            }
        }
    }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

.slider-demo {
    width: 1400px;
    height: 500px;
    margin: 0 auto;
    background-color: #fff;
}

h1,
h2 {
    font-weight: normal;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
