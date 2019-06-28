/** Vue + Vuex **/
import {Vue} from 'vue-property-decorator'
import Vuex, {Module} from 'vuex'

import * as VueCookie from 'vue-cookie';
import axios from 'axios'
import * as VueAxios from 'vue-axios';

import {JwtManager} from "../utils/JwtManager";
import {} from "../global";


import {observable, Observable} from 'rxjs';

Vue.use(Vuex);
(<any>Vue).use(VueAxios, axios);

const mutationsTypes = {
    TOGGLE_SIDENAV: 'TOGGLE_SIDENAV',
    COLLAPSE_SIDENAV: 'COLLAPSE_SIDENAV',
    TOGGLE_APP_LOADER: 'TOGGLE_APP_LOADER',
    TOGGLE_ACTION_LOADER: 'TOGGLE_ACTION_LOADER',
    SET_USER: 'SET_USER',
    SET_TOKEN: 'SET_TOKEN',
    AUTH_LOGOUT: 'AUTH_LOGOUT'
};

const state = {
    sideNavActive: false,                          // Is mobile sideNav active or not
    sideNavCollapsed: false,
    appLoader: false,                          // App Loader is shown or not
    actionLoader: false,                          // Action Loader is shown or not
    debugMode: configuration.DEBUG,       // App Debug Mode = Display console.log()

    cookieToken: VueCookie.get('token') || null,        // JWT Auth Token stored in cookies
    user: null,                                         // User authenticated = JWT claims
    companyId: '00'                                    // Company ID used for API requests
};

const mutations = {
    TOGGLE_SIDENAV: (state, value) => {
        state.sideNavActive = value;
    },
    COLLAPSE_SIDENAV: (state, value) => {
        state.sideNavCollapsed = value;
    },
    TOGGLE_APP_LOADER: (state, value) => {
        state.appLoader = value;
    },
    TOGGLE_ACTION_LOADER: (state, value) => {
        state.actionLoader = value;
    },
    SET_USER(state, user) {
        state.user = user;
    },
    SET_TOKEN(state, params) {

        state.cookieToken = params.token;

        // If configuration specifies TOKEN_DURATION, cookie token will expire in config value
        // Else token will expire at ADFS expiration date (current + 1 hour)

        if ((<any>window).configuration.DEBUG === true) console.log((<any>window).configuration.TOKEN_DURATION);

        if (((<any>window).configuration.TOKEN_DURATION !== 0)) {
            let dateExp = new Date();
            dateExp.setSeconds(dateExp.getSeconds() + (<any>window).configuration.TOKEN_DURATION);
            VueCookie.set('token', params.token, {expires: dateExp});
            console.log('New ADFS Token created, expires on :', dateExp);
        } else {
            let dateExp = new Date(params.expiration);
            VueCookie.set('token', params.token, {expires: dateExp});
            console.log('New ADFS Token created, expires on :', dateExp);
        }
    },
    AUTH_LOGOUT(state) {
        state.token = null;
        state.user = null;
        state.cookieToken = null;

        // delete eventual fake JWT token in local storage...
        JwtManager.deleteJwtFromLocalStorage('token');
        JwtManager.deleteJwtFromLocalStorage('fake_group');
        JwtManager.deleteJwtFromLocalStorage('fake_companyId');

        // Remove token from cookies
        VueCookie.delete('token');
    },
    SET_COMPANY_ID: (state, value) => {
        state.companyId = value;
        console.log("<--- Changement de companyId --->");
        console.log("CompanyId :", value);
        console.log("<--- End Changement de companyId --->");
    }
};

const getters = {
    sideNavActive: (state) => state.sideNavActive,
    sideNavCollapsed: (state) => state.sideNavCollapsed,
    appLoader: (state) => state.appLoader,
    actionLoader: (state) => state.actionLoader,
    selectedApiType: (state) => state.selectedApiType,
    isAuthenticated: (state) => {
        return state.cookieToken != null;
    },
    authenticatedUser: (state) => state.user,
    adfsCode: (state) => state.adfsCode,
    debugMode: (state) => state.debugMode,
    getLastVisitedPage: () => {
        if (window.localStorage.getItem('lastVisitedPage')) {
            return window.localStorage.getItem('lastVisitedPage');
        } else {
            return '/';
        }
    },
    companyId: (state) => state.companyId,
    isDualDLSAccount: (state) => {
        return state.user ? state.user.isDualDLSAccount : false;
    },

    testObservable: () : Observable<any> => {

        return new Observable((observer) => {

            console.log("une opération...");
            observer.next("Première opération faite !!");

            console.log("une autre...");
            observer.next("Deuxième opération faite !!");

            observer.complete();
        });

    }
};

export const store = new Vuex.Store({
    state: state,
    mutations: mutations,
    getters: getters,
    actions: {
        toggleSideNav: (store, value) => {
            store.commit(mutationsTypes.TOGGLE_SIDENAV, value);
        },
        collapseSideNav: (store, value) => {
            store.commit(mutationsTypes.COLLAPSE_SIDENAV, value);
        },
        toggleAppLoader: (store, value) => {
            store.commit(mutationsTypes.TOGGLE_APP_LOADER, value);
        },
        toggleActionLoader: (store, value) => {
            store.commit(mutationsTypes.TOGGLE_ACTION_LOADER, value);
        },
        toastText: (store, params) => {
            let classname = params[0] ? "toast-success" : 'toast-error';
            let html = "<span>" + params[1] + "</span>";
            (<any>window).M.toast({
                html: html,
                classes: classname,
                displayLength: 4000
            });
            store.dispatch('toggleActionLoader', false);
        },
        /**
         * Test whether cookie token is set or not.
         * */
        checkCookie: (store) => {
            return new Promise((resolve, reject) => {
                if (VueCookie.get('token')) {
                    resolve();
                } else {
                    store.dispatch('authLogoutForce');
                    reject();
                }
            });
        },
        /**
         * Method : getClaims()
         * @param store Store
         * @param token (JWT Encoded token)
         * @param isLoginProcess (Boolean)
         * */
        getClaims: (store, {token, isLoginProcess = false}) => {

            let params = {
                token: token
            };

            return new Promise((resolve, reject) => {
                (<any>window).axios.get((<any>window).configuration.SERIALIZATION_BACK_URL + '/adfs/claims', {
                    params: params
                })
                    .then((resp) => {

                        store.commit(mutationsTypes.SET_USER, resp.data);

                        if (isLoginProcess) {

                            if ((<any>window).configuration.DEBUG === true) {
                                store.dispatch('toastText', [true, "Signature du Token ADFS vérifiée."]);
                            } else {
                                store.dispatch('toastText', [true, "Authentification sécurisée réussie."]);
                            }

                            // Params for token set commit
                            let params = {
                                token: token,
                                expiration: resp.data.expiration_date
                            };
                            store.commit(mutationsTypes.SET_TOKEN, params);
                        }

                        resolve(resp.data);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            })
        },
        setLastVisitedPage(store, value) {
            if (!value) {
                value = '/';
            }
            window.localStorage.setItem('lastVisitedPage', value);
        },
        /**
         * Store Action
         * Return Promise
         * Commit AUTH_LOGOUT (set user + token to null)
         * Notify User that log out is successful.
         * */
        authLogout: ({commit, dispatch}) => {
            return new Promise((resolve) => {
                commit('AUTH_LOGOUT');
                // Send Error login notif
                dispatch('toastText', [true, 'Déconnection réussie.']);
                resolve();
            })
        },
        /**
         * Store Action
         * Return Promise
         * Delog user because his token has expired / is wrong...
         * No promise
         * */
        authLogoutForce: (store) => {

            if ((<any>window).configuration.DEBUG === true) console.log(store.getters.authenticatedUser);

            if (store.getters.authenticatedUser) {
                store.dispatch('toastText', [false, "Le token est expiré. Vous êtes déconnecté."])
            }
            window.localStorage.removeItem('companyId');
            store.commit(mutationsTypes.AUTH_LOGOUT);
        },
        /**
         * Load Fake Jwt in cookies / Store Instance for tests purpose
         */
        connectFakeUser: (store, fakeConfig) => {

            console.log("<---- connectFakeUser ------>");

            let jm = new JwtManager();

            jm.addHeaderProperty("alg", "HS256");
            jm.addHeaderProperty("typ", "JWT");

            jm.addDataProperty("id", "1337");
            jm.addDataProperty("firstname", "Paul (Fake)");
            jm.addDataProperty("display_name", "Paul Lalance (Fake)");
            jm.addDataProperty("lastname", "Lalance (Fake)");
            jm.addDataProperty("email", "fake@cerp-rrm.com");
            jm.addDataProperty("company_name", "Siège");


            if (!fakeConfig) {
                jm.addDataProperty("company_id", "00");
                jm.addArrayDataProperty("group", ["S-1-5-21-1898398884-2118664892-1232828436-9129", "group2"]);
            } else {
                jm.addArrayDataProperty("group", [fakeConfig.group]);
                if (fakeConfig.companyId == "03-030") {
                    jm.addDataProperty("isDualDLSAccount", "true");
                    jm.addDataProperty("company_id", "03");
                } else {
                    jm.addDataProperty("company_id", fakeConfig.companyId);
                }
            }


            jm.setSecret("Super secret !!!");
            jm.setJwtLocaStorageName("token");

            jm.generateEncodedJwt();
            jm.addJwtToLocalStorage();

            console.log(jm.getClearJwt());
            console.log(jm.getEncodedJwt());

            console.log("<---- end connectFakeUser ------>");

            // Load JWT User
            store.commit(mutationsTypes.SET_USER, jm.getBody());

            // Now expiration
            let expiration = new Date();
            // Expires in 1 hour = 3600 seconds
            expiration.setSeconds(expiration.getSeconds() + 3600);
            let params = {
                token: jm.getEncodedJwt(),
                expiration: expiration
            };
            store.commit(mutationsTypes.SET_TOKEN, params);
            store.dispatch("toastText", [true, "Profil bypass Ok..."]);
        },


        testPromise: (store) : Promise<any> => {

            let isResolved = true;

            return new Promise((resolve, reject) => {
                if (isResolved) {
                    resolve("Promise Resolved");
                }
                else {
                    let error = new Error("Promise Reject");
                    reject(error);
                }
            })

        }
    }
});