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
        <span v-else="">{{ options[companyId] }}</span>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';

    export default {
        name: "SelectGroupGeneric",
        props: ['companyId'],
        data() {
            return {
                options: {
                    "00": "Siege",
                    "01": "Besancon",
                    "02": "Colmar",
                    "03": "Dijon",
                    "030": "DLS",
                    "04": "Mulhouse",
                    "05": "Strasbourg",
                    "06": "Lons le saunier",
                    "07": "Belfort",
                    "08": "Chalon / Saône",
                    "10": "Lyon",
                    "12": "Annecy",
                    "13": "Grenoble",
                    "15": "Valence",
                    "16": "Montelimar",
                    "17": "Metz",
                    "18": "Avignon",
                    "20": "Pharmat Montpellier",
                    "21": "Nimes",
                    "22": "Montpellier",
                    "23": "Béziers",
                    "24": "Aix en provence",
                    "25": "Cannes",
                    "26": "Marseille",
                    "27": "Sens",
                    "28": "Clermont-Ferrand",
                    "29": "Toulon"
                },

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