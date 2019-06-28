<template>
    <div>
        <select v-if="isDualDLSAccount"
                ref="selecteur"
                class="browser-default"
                name="sub_account"
                id="sub_account"
                :value="companyId"
                @change="synchronize">
            <option v-for="option in optionsDLS" :value="option.code">{{ option.code }} - {{ option.libelle }}</option>
        </select>

        <select v-else=""
                ref="selecteur"
                class="browser-default"
                name="sub_account"
                id="sub_account"
                :value="companyId"
                @change="synchronize">
            <option v-for="option in options" :value="option.code">{{ option.code }} - {{ option.libelle }}</option>
        </select>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';

    export default {
        name: "SelectGroupAdmin",
        props: ['companyId'],
        data() {
            return {
                options: [
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
                ],

                optionsDLS: [
                    {code: "03", libelle: "Dijon"},
                    {code: "030", libelle: "DLS"},
                ]
            }
        },
        computed: {
            ...mapGetters([
                'authenticatedUser',
                'isDualDLSAccount'
            ])
        },
        methods: {
            synchronize() {
                if(this.$DEBUG){
                    console.log("Changement de groupe :" + this.$refs.selecteur.value);
                }
                this.$emit('update:companyId', this.$refs.selecteur.value);
            }
        }
    }
</script>