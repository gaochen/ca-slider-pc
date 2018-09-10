# ca-slider-pc

A vue plugin for slider, include IE9

# Install

#### NPM

```bash
npm install ca-slider-pc --save
```

### Mount

#### mount with global

```javascript
// main.js
import CaSliderPc from 'ca-slider-pc'
Vue.use(CaSliderPc)
```

#### mount with component

```javascript
import { CaSliderPc } from 'ca-slider-pc'

export default {
  components: {
    CaSliderPc
  }
}
```

### SPA

```vue
<template>
  <div class="hello">
    <div class="slider-demo">
      <ca-slider-pc :options="options" :dataList="urlList">
      </ca-slider-pc>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      urlList: [
        'https://m.hexiehealth.com/abwx_cms/up_load/20180329095447_573.jpg',
        'https://m.hexiehealth.com/abwx_cms/up_load/20180522165547_637.jpg',
        'https://m.hexiehealth.com/abwx_cms/up_load/20180511105015_386.jpg',
        'https://m.hexiehealth.com/abwx_cms/up_load/20171211093006_832.jpg',
        'https://m.hexiehealth.com/abwx_cms/up_load/1250122_index.jpg'
      ],
      options: {
        perView: 1, // 一屏多少个图片
        spaceBetween: 0, // 图片的间距
        index: 0, // 轮播起始位置
        autoPlay: true, // 是否自动播放，需要先开启无缝滚动,
        autoSpeed: 2500, // 自动播放的时间间隔
        loop: true, // 无缝滚动
        drag: true, // 是否鼠标可拖动
        slideGroup: false // 是否全屏滚动，针对于一屏有多个图片
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 通过定义外层div的宽高来控制轮播组件尺寸
.slider-demo {
  width: 1400px;
  height: 500px;
  border: 1px solid #e5e5e5;
  margin: 0 auto;
  background-color: #fff;
}
</style>
```

# Author

[gaochen](https://github.com/gaochen)
