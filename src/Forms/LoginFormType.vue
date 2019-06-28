<template>
    <div>
        <div class="col s12 m4 offset-m4 error">
            <p>{{ adfsError }}</p>
            <p>{{ adfsErrorDesc }}</p>
        </div>
        <form class="login-form" @submit.prevent="loginAction">
            <div class="col s12 m4 offset-m4">
                <p class="center"><i class="large material-icons">person</i></p>
                <h5 class="center">Connexion</h5>
            </div>
            <div class="col s12 m4 offset-m4">
                <br>
                <button type="button" @click="redirectADFS"
                        class="waves-effect waves-light btn btn--blue btn--full-width">
                    Se connecter <i class="material-icons right">send</i>
                </button>
            </div>
        </form>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';

    export default {
        name: 'LoginFormType',
        components: {},
        props: {},
        data() {
            return {
                username: '',
                password: '',
                adfsError: '',
                adfsErrorDesc: '',
                adfs_get_security_token: {
                    grant_type: configuration.GRANT_TYPE,
                    client_id: configuration.CLIENT_ID,
                    redirect_uri: configuration.REDIRECT_URI,
                    resource: configuration.RESOURCE,
                },
                adfs_access_token: ''
            }
        },
        computed: {
            ...mapGetters([
                'getLastVisitedPage',
            ])
        },
        mounted() {
            console.log("route :", this.$route);
            if (this.$route.query.error) {
                this.adfsError = this.$route.query.error;
                this.$store.dispatch("toastText", [false, this.adfsError]);
            }
            if (this.$route.query.error_description) {
                this.adfsErrorDesc = this.$route.query.error_description;
                this.$store.dispatch("toastText",[false, this.adfsErrorDesc]);
            }
            if (this.$route.query.code) {
                this.adfs_get_security_token.code = this.$route.query.code;
                if (configuration.DEBUG === true) {
                    this.$store.dispatch("toastText",[true, "Code de sécurité ADFS reçu."]);
                }
                this.getSecurityToken();
            }

            // If AUTOLOGIN is set to true
            if (configuration.AUTOLOGIN === true) {
                // If no query at all execture directly the SSO process
                if (Object.keys(this.$route.query).length === 0) {
                    this.redirectADFS();
                }
            }
        },
        methods: {
            ...mapActions([
                'toastText',
                'getClaims',
                'checkCookie'
            ]),
            redirectADFS() {
                window.location.href = configuration.ADFS_URL;
            },
            getSecurityToken() {
                let that = this;
                axios.post(configuration.SERIALIZATION_BACK_URL + '/adfs/token',
                    that.adfs_get_security_token)
                    .then((resp) => {
                        if (resp.data.access_token) {

                            if (configuration.DEBUG === true) {
                                that.toastText([true, "Access Token ADFS reçu."]);
                            }

                            that.adfs_access_token = resp.data.access_token;
                            that.getClaims(
                                {token: resp.data.access_token, isLoginProcess: true}
                            )
                                .then(() => {
                                    let routeTo = that.getLastVisitedPage;
                                    this.$router.push(routeTo);
                                }).catch((resp) => {
                                console.log(resp);
                            });
                        }
                    })
                    .catch((error) => {
                        that.toastText([false, error.response.status + " : " + error.response.data.error_description]);
                    })
            }
        }
    };
</script>