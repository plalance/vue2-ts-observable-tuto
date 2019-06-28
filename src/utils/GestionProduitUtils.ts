/**
 * Méthodes de controle de changement de gestion.
 *
 * Code AS400 d'ou sont issues ces règles (qui sont exécutées les unes à la suite des autres dans le process AS400) :
 *
 * Si ART0100.Blocage gestion == 1 (blocage en GESTION) & type de gestion saisi == 2 (REAPPRO)
 *      Blocage 1 type gestion 2 interdit
 *      Message : Article bloqué en gestion. Type gestion Réappro interdit.
 * Finsi
 *
 *
 * Si ART0100.Blocage gestion == 2 (blocage en REAPPRO) & type de gestion saisi == 1 (GESTION)
 *      Si code nature <> 94 (non pharmat)
 *          Si code établissement <> 03 (+16)
 *          Sinon
 *              Blocage 2 type gestion 1 interdit
 *              Message : Article bloqué en réappro. Type gestion Gestion interdit.
 * Finsi
 *
 *
 *
 * Si type de gestion saisi == 2 (REAPPRO)
 *      Si code nature <> 94
 *          Si code établisement = 03 (+16)
 *              Type gestion 1 obligatoire
 *              Message : Type gestion Gestion obligatoire au M.G.
 * Finsi
 *
 *
 *
 *
 * Si type de gestion saisi == 2 (REAPPRO)
 *      Si Quantité REAPPRO == zero
 *          Message : Qté REAPPRO obligatoire
 *      Finsi
 *
 *      Si seuil de REAPPRO >= quantité REAPPRO
 *          Message : La quantité réappro. doit être strictement supérieure au seuil de reappro.
 *      finsi
 *
 *      si code nature <> 94
 *          si quantité REAPPRO >= 25
 *              Message : La quantité réappro est limitée à 24 pour CERP.
 *          Finsi
 *
 *          Si seuil REAPPRO >= 10
 *              Message : Le seuil de réappro. est limité à 10 pour CERP.
 *          finsi
 *      finsi
 * sinon
 *      quantité REAPPRO = zero
 *      seuil REAPPRO = zero
 * Finsi
 */
export const GestionProduitUtils = {

    /**
     * Retourne le libellé du blocage DMG pour une valeur de blocage donnée.
     * @param blocageDmg
     */
    getBlocageDmgAsString: function (blocageDmg: string) {

        if (parseInt(blocageDmg) == 1) {
            return "GESTION";
        }

        if (parseInt(blocageDmg) == 2) {
            return "REAPPRO";
        }

        return null;
    },


    /**
     * Retourne la possibilité de passer un produit en gestion.
     *
     * @param blocageDmg
     * @param typeGestionNouveau
     * @param codeNature
     * @param codeEtb
     */
    isGestionAutorised: function (blocageDmg, typeGestionNouveau, codeNature, codeEtb) {
        blocageDmg = parseInt(blocageDmg);
        typeGestionNouveau = parseInt(typeGestionNouveau);

        let obj = {
            authorized: true,
            reason: 'OK'
        };

        console.log('blocageDmg ',blocageDmg ,'typeGestionNouveau ',typeGestionNouveau ,'codeNature ',codeNature, 'codeEtb', codeEtb);

        if(blocageDmg == 2 && typeGestionNouveau == 1){
            if (codeNature != '94' && codeEtb != '03') {
                obj.authorized= false;
                obj.reason = "Article bloqué en réappro. Type gestion Gestion interdit.";
            }
        }

        return obj;
    },

    /**
     * Retourne la possibilité de passer un produit en réappro.
     * @param blocageDmg
     * @param typeGestionNouveau
     * @param codeNature
     * @param codeEtb
     */
    isReapproAutorised: function (blocageDmg, typeGestionNouveau, codeNature, codeEtb) {

        blocageDmg = parseInt(blocageDmg);
        typeGestionNouveau = parseInt(typeGestionNouveau);

        let obj = {
            authorized: true,
            reason: 'OK'
        };

        console.log('blocageDmg ',blocageDmg ,'typeGestionNouveau ',typeGestionNouveau ,'codeNature ',codeNature, 'codeEtb', codeEtb);

        if (blocageDmg == 1 && typeGestionNouveau == 2) {
                obj.authorized = false;
                obj.reason = "Article bloqué en gestion. Type gestion Réappro interdit. ";
            if(codeNature !== "94" && codeEtb !== "03") {
                obj.authorized = false;
                obj.reason = "Type gestion Gestion obligatoire au M.G."
            }
        }

        return obj;
    },

    /**
     * Retourne le résultat des contrôles sur les quantités.
     *
     * @param typeGestionNouveau
     * @param qtReappro
     * @param seuiLReappro
     * @param codeNature
     */
    controleQuantity(typeGestionNouveau, qtReappro, seuiLReappro, codeNature) {

        typeGestionNouveau = parseInt(typeGestionNouveau);

        if (typeGestionNouveau == 2) {
            if (qtReappro == 0)
                return false;

            if (seuiLReappro > qtReappro)
                return false;

            if (codeNature !== 94) {
                if (qtReappro > 24)
                    return false;

                if (seuiLReappro >= 10)
                    return false;
            }
        }

        return true;
    }
};