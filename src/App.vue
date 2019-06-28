<template>
    <div id="app">
        <vheader></vheader>
        <div class="app__content">
            <action-loader v-if="actionLoaderStore"></action-loader>
            <div v-if="isAuthenticated" :class="{'app__sidenav':true, 'app__sidenav--collapsed':sideNavCollapsed}">
                <ul id="slide-out" class="sidenav">
                    <li class="user-view__container">
                        <div class="user-view">
                            <div class="background"></div>
                            <a href="#" class="user-view__picto"><img class="circle"
                                                                      src="/images/logo-cerp-transparent.png"></a>
                            <a href="#" class="user-view__login"><span v-if="authenticatedUser" class="white-text name">{{ authenticatedUser.display_name }} {{ getProfile }}</span></a>
                            <div class="user-account">
                                <select-group-admin v-if="isAdmin"
                                                    v-bind:companyId.sync="companyId"></select-group-admin>
                                <select-group-generic v-else=""
                                                      v-bind:companyId.sync="companyId"></select-group-generic>
                            </div>
                        </div>
                    </li>
                    <li v-for="route in routes" v-if="displayRoute(route)">
                        <router-link :to="route.path">
                            <i class="material-icons">{{ route.meta.icon }}</i>
                            {{ $t("routes['"+route.name+"']") }}
                        </router-link>
                    </li>
                </ul>
                <div class="app__version">
                    <p>Version <span v-if="version !== null">{{ version.GIT_TAG_NAME }}</span><span v-else="">LOCAL / DEV</span>
                    </p>
                </div>
            </div>

            <div class="app__wrapper">
                <div class="container app__page">
                    <transition name="slide">
                        <router-view :key="$route.fullPath"></router-view>
                    </transition>
                </div>
                <div class="app__loader" v-if="appLoader">
                    <app-loader></app-loader>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import Header from './Components/Header';
    import AppLoader from './Components/AppLoader';
    import ActionLoader from './Components/ActionLoader';

    import SelectGroupAdmin from './Components/SelectGroupAdmin'
    import SelectGroupGeneric from './Components/SelectGroupGeneric'

    import {routes} from "./Router";
    import {MaterializeUtils} from './utils/MaterializeUtils'

    export default {
        name: 'App',
        components: {
            vheader: Header,
            AppLoader: AppLoader,
            ActionLoader: ActionLoader,
            SelectGroupAdmin: SelectGroupAdmin,
            SelectGroupGeneric: SelectGroupGeneric,
        },
        data() {
            return {
                routes: routes,
                companyId: "null",
                version: null
            }
        },
        computed: {
            ...mapGetters({
                'appLoader': 'appLoader',
                'actionLoaderStore': 'actionLoader',
                'isAuthenticated': 'isAuthenticated',
                'authenticatedUser': 'authenticatedUser',
                'sideNavCollapsed': 'sideNavCollapsed'
            }),
            isAdmin() {
                console.log("<--- Admin verification --->");
                let is = false;
                let length = this.authenticatedUser.group.length;
                for(let i = 0; i < length; i++){
                    if (this.authenticatedUser.group[i] === configuration.PROJECT_ADMIN_GROUP_ID) {
                        is = true;
                    }
                }
                console.log("User is Admin :", is);
                console.log("<--- End Admin verification --->");
                return is;
            },
            getProfile() {
                let profile = "(Utilisateur)";
                if (this.isAdmin) {
                    profile = "(Administrateur)"
                }
                return profile;
            }
        },
        mounted() {
            let that = this;

            let options = {
                onCloseEnd: function () {
                    that.toggleSideNav(false);
                }
            };

            MaterializeUtils.initSideNav('.sidenav', options);

            this.updateCompanyId();

            this.loadVersion();
        },
        methods: {
            ...mapActions([
                'toggleSideNav',
                'toggleAppLoader',
                'setSelectedApiType',
                'checkCookie',
                'getClaims'
            ]),
            displayRoute(route) {
                return !!route.meta.visible;
            },
            updateCompanyId() {
                if (this.isAuthenticated) {
                    // If lastCompany Id is still in localstorage
                    if (window.localStorage.getItem('companyId')) {
                        this.companyId = window.localStorage.getItem('companyId');
                    } else {
                        this.companyId = this.authenticatedUser.company_id;
                    }
                }
            },
            loadVersion() {
                let url = "/VERSION";
                axios.get(url).then((response) => {
                    this.version = response.data;
                    if (typeof this.version !== "object") {
                        this.version = null;
                    }
                }).catch((error) => {
                    this.version = null;
                    console.log(error);
                });
            }
        },
        watch: {
            /**
             * Close SideNav on route change
             * */
            '$route': function () {
                this.toggleSideNav(false);
            },
            'companyId': function (value) {
                this.$store.commit('SET_COMPANY_ID', value);
                window.localStorage.setItem('companyId', value);
            },
            'authenticatedUser': function () {
                this.updateCompanyId();
            },
        },
    };
</script>