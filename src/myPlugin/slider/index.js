import CaSliderPc from './ca-slider-pc.vue'

const install = function(Vue) {
    if (typeof window !== 'undefined' && window.Vue) {
        Vue = window.Vue
    }
    Vue.component('ca-slider-pc', CaSliderPc)
}

const VueCaSlider = {
    install
}

export default VueCaSlider
export { CaSliderPc }