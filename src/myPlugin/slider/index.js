import slider from './slider.vue'

const CaSliderPC = {
    install: function(vue) {
        if (typeof window !== 'undefined' && window.Vue) {
            Vue = window.Vue
        }
        Vue.component('CaSliderPC', slider)
    }
}

export default CaSliderPC