<template>
    <div>
        <form class="login-form" @submit.prevent="connectFakeUser">
            <div class="input-field col s6">
                <p>1. Quel type de rôle ?</p>
                <p>
                    <label>
                        <input class="with-gap" name="group1" type="radio" value="Utilisateur" v-model="role"/>
                        <span>Utilisateur simple</span>
                    </label>
                </p>
                <p>
                    <label>
                        <input class="with-gap" name="group1" type="radio" value="Dls" v-model="role"/>
                        <span>Compte DLS / DIJON</span>
                    </label>
                </p>
                <p>
                    <label>
                        <input class="with-gap" name="group1" type="radio" value="Administrateur" v-model="role"/>
                        <span>Administrateur</span>
                    </label>
                </p>
            </div>
            <div class="input-field col s6">
                <p>2. Quel établissement rattaché (boite_postale) ?</p>
                <p v-if="role =='Dls'">Pour le type de compte Dls / Dijon , la valeur de boite postale vaut toujours "03-030", c'est un compte particulier.</p>
                <select v-if="role === 'Utilisateur' || role === 'Administrateur'"
                        ref="selecteur"
                        class="browser-default"
                        name="sub_account"
                        id="sub_account"
                        v-model="etb">
                    <option v-for="option in options" :value="option.code">{{ option.code }} - {{ option.libelle }}
                    </option>
                </select>
                <p>3. Token</p>
                <input type="password" v-model="token">
            </div>
            <div class="input-field col s12">
                <button v-if="isTokenValid" type="button" @click="connectFakeUser"
                        class="waves-effect waves-light btn btn--blue">
                    Connecter un {{ role }} (Établissement: {{ etb }})<i class="material-icons right">send</i>
                </button>
                <button v-else="isTokenValid" type="button" class="waves-effect waves-light btn btn--blue" disabled>
                    Connecter un {{ role }} (Établissement: {{ etb }})<i class="material-icons right">send</i>
                </button>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
    import {Vue, Prop, Component, Watch} from 'vue-property-decorator';
    import {mapActions, mapGetters} from 'vuex';
    import * as moment from 'moment';

    import {CryptoUtils} from '../utils/CryptoUtils';
    import {EnumActions} from "../Store/enumActions";

    @Component({
        name: 'LoginFakeFormType',

    })
    export default class LoginFakeFormType extends Vue {

        role: string = "Utilisateur";

        etb: string = "00";

        token: string = null;

        part2Encoded: string = "U2FsdGVkX1+9UJGiu8gDnhJK5wMNcOAEBv0G0TVkX4Q=";

        options: Array<Object> = [
            {code: "00", libelle: "Siege"},
            {code: "01", libelle: "Besancon"},
            {code: "02", libelle: "Colmar"},
            {code: "03", libelle: "Dijon"},
            {code: "030", libelle: "DLS"},
            {code: "04", libelle: "Mulhouse"},
            {code: "05", libelle: "Strasbourg"},
            {code: "06", libelle: "Lons le saunier"},
            {code: "07", libelle: "Belfort"},
            {code: "08", libelle: "Chalon / Saône"},
            {code: "10", libelle: "Lyon"},
            {code: "12", libelle: "Annecy"},
            {code: "13", libelle: "Grenoble"},
            {code: "15", libelle: "Valence"},
            {code: "16", libelle: "Montelimar"},
            {code: "17", libelle: "Metz"},
            {code: "18", libelle: "Avignon"},
            {code: "20", libelle: "Pharmat Montpellier"},
            {code: "21", libelle: "Nimes"},
            {code: "22", libelle: "Montpellier"},
            {code: "23", libelle: "Béziers"},
            {code: "24", libelle: "Aix en provence"},
            {code: "25", libelle: "Cannes"},
            {code: "26", libelle: "Marseille"},
            {code: "27", libelle: "Sens"},
            {code: "28", libelle: "Clermont-Ferrand"},
            {code: "29", libelle: "Toulon"}
        ];

        optionsDLS: Array<Object> = [
            {code: "03", libelle: "Dijon"},
            {code: "030", libelle: "DLS"},
        ];

        @Watch("role")
        roleHandler(role) {
            switch (role) {
                case "Utilisateur":
                    this.etb = "00";
                    break;
                case "Administrateur":
                    this.etb = "00";
                    break;
                case "Dls":
                    this.etb = "03-030";
            }
        }

        get isTokenValid(){
            var isValid = false;
            let password = "pass";

            let dayname =  moment(new Date()).locale("fr").format('dddd');

            let part1CorrectEnc = CryptoUtils.aesEncrypt(dayname, password);
            let completeClear = CryptoUtils.aesDecrpyt(part1CorrectEnc, password) + CryptoUtils.aesDecrpyt(this.part2Encoded, password);

            if(completeClear === this.token){
                isValid = true;
            }
            return isValid;
        }

        connectFakeUser() {
            if(this.isTokenValid){
                // Default group is user group for user / dls roles.
                let group = (<any>window).configuration.PROJECT_GROUP_ID;
                let companyId = this.etb;

                // Role admin means user is in admin serialization group.
                if(this.role == 'Administrateur'){
                    group = (<any>window).configuration.PROJECT_ADMIN_GROUP_ID
                }

                // Role admin means user is in admin serialization group.
                if(this.role == 'Administrateur'){
                    group = (<any>window).configuration.PROJECT_ADMIN_GROUP_ID
                }

                localStorage.setItem("fake_group", group);
                localStorage.setItem("fake_companyId", companyId);

                this.$store.dispatch(EnumActions.FAKE_LOGIN, {group: group, companyId: companyId}).then(() => {
                    this.$router.push('/');
                });
            }
        }
    };
</script>