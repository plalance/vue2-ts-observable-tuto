<template>
    <div>
        <div class="row">
            <div class="dashboard">
                <h1>Accueil 233</h1>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Inject} from 'vue-property-decorator'
    import {mapGetters, mapActions} from 'vuex';
    import {EnumActions} from "../Store/enumActions";
    import {Observable} from "rxjs";
    import {EnumGetters} from "../Store/enumGetters";

    @Component({
        computed: {
            ...mapGetters([
                'isAuthenticated'
            ])
        },
        methods: {
            ...mapActions([]),
        },
        components: {}
    })
    export default class Home extends Vue {

        logoutAction() {
            this.$store.dispatch('authLogout')
                .then((resp) => {
                    console.log(resp);
                    this.$router.push('/')
                }).catch((err) => {
                console.log(err);
            })
        }

        mounted() {
            this.testPromise();
            this.testObservable();
        }

        testPromise() {
            this.$store.dispatch(EnumActions.TEST_PROMISE)
                .then((response) => {
                    this.$store.dispatch(EnumActions.TOAST_TEXT, [true, response]);
                })
                .catch((e) => {
                    this.$store.dispatch(EnumActions.TOAST_TEXT, [true, e]);
                })
        }


        testObservable(){
            (<Observable<any>>this.$store.getters[EnumGetters.TEST_OBSERVABLE])
                .subscribe({
                    next: (value) => {
                        this.$store.dispatch(EnumActions.TOAST_TEXT, [true, value]);
                    },
                    complete: () => {
                        this.$store.dispatch(EnumActions.TOAST_TEXT, [true, "Terminé"]);
                    }
                });
        }
    };
</script>