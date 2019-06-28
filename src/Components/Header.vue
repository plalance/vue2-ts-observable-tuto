<template>
    <div>
        <nav>
            <div class="nav-wrapper">
                <ul class="left">
                    <li v-if="!isDesktop">
                        <a href="#" data-target="slide-out" @click="openSideNav"><i
                                class="material-icons">menu</i></a>
                    </li>
                    <li v-else="">
                        <a href="#" data-target="slide-out" @click="collapseSideNav"><i
                                class="material-icons">menu</i></a>
                    </li>
                    <!--<li>-->
                    <!--<router-link v-if="$route.name !== 'home'" to="/">-->
                    <!--<i class="medium material-icons">dashboard</i>-->
                    <!--</router-link>-->
                    <!--</li>-->
                    <li class="ariane">
                        {{ $t('routes.'+$route.name) }}
                    </li>
                </ul>
                <ul class="right">
                    <!--<li v-if="authenticatedUser">-->
                    <!--<span>{{ $t('interface.logged_as') }} {{ authenticatedUser.display_name }}</span>-->
                    <!--</li>-->
                    <router-link v-if="!isAuthenticated" to="/login">
                        <!--{{ $t('routes.login') }}-->
                        <i class="material-icons left">person</i>
                    </router-link>
                    <li v-else="">
                        <a href="#" data-target="slide-out" @click="logoutAction">{{ $t('routes.logout') }} <i
                                class="material-icons left">power_settings_new</i></a>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script lang="ts">
    import {Vue, Prop, Component, Watch} from 'vue-property-decorator'
    import {mapGetters, mapActions} from 'vuex';
    import * as $ from 'jquery';
    import {MaterializeUtils} from "../utils/MaterializeUtils";

    @Component({
        name: 'Header',
        computed: {
            ...mapGetters({
                'authenticatedUser': 'authenticatedUser',
                'isAuthenticated': 'isAuthenticated',
                'sideNavActive': 'sideNavActive',
            }),
        },
        methods: {
            ...mapActions([
                'toggleSideNav'
            ])
        }
    })
    export default class Header extends Vue {
        /** mapGetters **/
        authenticatedUser !: any;
        isAuthenticated !: any;

        /** mapActions **/
        toggleSideNav !: any;

        /** Properties **/
        isDesktop: boolean = true;

        mounted() {
            let that = this;

            MaterializeUtils.initSideNav('.sidenav',
                {
                    onCloseEnd: () => {
                        this.$store.dispatch("toggleSideNav", false);
                    }
                }
            );

            $(window).on('resize', function () {
                that.isDesktopAction()
            });
        }


        openSideNav() {
            MaterializeUtils.openSideNav('.sidenav');
            this.$store.dispatch("toggleSideNav", true);
        }

        collapseSideNav(){
            this.$store.dispatch("collapseSideNav", !this.$store.getters.sideNavCollapsed);
        }


        isDesktopAction() {
            let that = this;
            if ($(window).width() > 700) {
                that.isDesktop = true;
            } else {
                that.isDesktop = false;
            }
        }

        logoutAction() {
            this.$store.dispatch('authLogout')
                .then((resp) => {
                    console.log(resp);
                    this.$router.push('/')
                }).catch((err) => {
                console.log(err);
            })
        }

        @Watch("sideNavActive")
        sideNavActiveHandler(value) {
            if (value === false) {
                MaterializeUtils.closeSideNav('.sidenav');
            }
        }
    };
</script>