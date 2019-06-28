import Vue from 'vue';

declare module 'vue/types/vue' {
    interface Vue {
        $TRADS: any,
        $locale: string
    }
}