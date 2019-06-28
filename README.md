#Installation / Build projet

Installer le projet et builder le code

    git clone <this project> folder-name
    cd folder-name
    yarn install
    npm run build

Lancer un serveur de dev (serve) cf: https://www.npmjs.com/package/serve

    yarn serve

Visiter :
 - Local:  <a href="https://localhost:5000">https://localhost:5000</a>
 
 - Sur Réseau Interne (remplacez par votre IP machine): http://xxx.xx.xx.xxx:5000

###Utiliser l'appli sur serveur

#### Avec Docker

Builder l'image Docker :

    docker build --tag observable .
    
Lancer l'image Docker (Exemple: port 1000 pour une image appelée Observable)

    docker run -d --name appObservable -p 1000:80 observable
    
L'appli est accessible à ces addresses (selon votre installation Docker)

Docker For Desktop (Windows / MacOs) / Docker Native (Linux): 
- <a href="http://127.0.0.1:1000">http://127.0.0.1:1000</a>

Docker Toolbox (VM Boot2Docker) : 
- <a href="http://192.168.99.100:1000">http://192.168.99.100:1000</a>

#### Sans Docker

Extension Chrome Wevb Server (légère et pratique)
https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb/related

Serveur Apache.. 

Serveru Nginx...

#Objectif

Évaluer l'apport des extensions réactives de Javascript : La librairie RxJs

Documentation : https://rxjs-dev.firebaseapp.com/

###Projet de test

Une application front-end sous VueJs (2.6).

L'application complète utilise Typescript et la syntaxe Ts / ES6.

Le projet est buildé avec le compilateur typescript de Babel (depuis ses dernières versions Babel emporte un compilateur Typescript, 
ce qui facilite la vie et permet de s'affranchir du ts-loader, incompatible avec certaines particularités de Vue (mais c'est un autre sujet.)

Le projet s'installe très facilement pour peu d'avoir node sur sa machine et de quoi délivrer du contenu web 
(Serveur web embarqué type node / python... (cf : Django) ou serveur installé de type Apache / nginx, ou Docker)

####Fonctionnalité testée

Les apports et inconvénients des Observables de RxJs par rapport à la Promise classique ES5.
Son implémentation dans un projet Vue (dans le store par exemple).

A noter, la promise peut avoir un callback finally (façon Java) pour peu d'ajouter cette fonctionnalité au prototype Promise ES5 (lib.es5 et dans notre cas typée Typescript avec lib.es5.d.ts)
Comment ajouter cette fonctionnalité, ajouter simplement ce code dans un endpoint Typescript par exemple :

    import promiseFinally from 'promise.prototype.finally';
    promiseFinally.shim();

Ce code ajoute la fonctionnalité bien tuile finally à la Promise ES5.

Pour la suite, voyons la comparaison entre cette Promise, et les particularités Observables.

#Approche Promise

Dans le cas de VueJs et de l'utilisation du Store VueX (qui peut être intégralement repensé voire supprimé au profit d'unqieu Observables... A vous de voir) voici une approche parmis tant d'autres pour exploiter une simple Promise ES5 :

Dans le store (store.ts), ajouter une action :

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

Ce code définit une simple action de store, qui va exécuter des opérations, des tests, des appels d'API ou autre et retourner un résultat d'éxécution, et seulement ça !

De cette manière, l'on peut appeler cette méthode, et utiliser les 3 callback classiques d'une Promise à savoir :
- pending : en cours d'exécution
- then : la Promise est achevée selon des conditions particulières : Obtention de donnée réussie, traitemnt réussi..)
- catch : La Promise à rejeté une erreur, technique ou suite à un test à vous de décider.

Appelons cette méthode depuis un composant Vue (Typescript) :
(A noter l'utilisation d'Énumération bien plus pratique que de taper à la amin partout le nom de l'action de store à appeler)

L'action EnumActions.TOAST_TEXT affiche à l'écran une notification avec du contenu. True = Bleue, False = Rouge, le deuxième argument passé en paramètre du tableau est son contenu.
        
        testPromise() {
                    this.$store.dispatch(EnumActions.TEST_PROMISE)
                        .then((response) => {
                            this.$store.dispatch(EnumActions.TOAST_TEXT, [true, response]);
                        })
                        .catch((e) => {
                            this.$store.dispatch(EnumActions.TOAST_TEXT, [true, e]);
                    })
        }

Le résultat est donné. Voici une manière d'utiliser les Promise et de traiter des cas d'erreurs au sein d'une application Vue.

#Approche Observable

L'approche Observable est différente, elle ne s'appuie pas sur le principe d'un déclenchement d'une action pour attendre son résultat (asynchrone).

Le principe se rapproche plus d'un raisonnement par flux (Flux de message, File...).

L'observable est définie commme un objet opérant sur des fonctions, et étant cappable de donner des éléments sur le déroulement des opérations dans ces fonctions.

Elle est définie immuable, là ou la Promise peut être vue comme un "outil à exécuter" permettant l'organisation et la gestion des traitements asynchrones, l'Observable est un Objet qui agit sur des fonctions et des valeurs, se rappochant plus d'une vision de type programmation fonctionnelle.

Comme un Observable n'est pas géré de la même manière, et qu'elle doit être définie comme un Objet auquel accéder, sa place n'est plus dans les actions du store mais dans les getters du store (ou tout autre partie du code Ne relevant pas des actions du store).

Ici, un choix à été fait, celui d'accorder à l'Observable le statut de Getter.

Exemple dans Store/index.ts (dans ce cas, à ajouter au getters mais tout est faisable autrement, ce n'est qu'un choix):

        
        return new Observable((observer) => {

            console.log("une opération...");
            observer.next("Première opération faite !!");

            console.log("une autre...");
            observer.next("Deuxième opération faite !!");

            observer.complete();
        });

    }
    
L'Observable déclaré est défini comme un Objet, agissant sur une ou plusieurs fonctions ou opérations (ici de simples logs),
 pour lesquelles l'Observable est cappable de rendre compte du déroulement de chacune d'elles.
 
De cette manière, il est possible de rendre compte plusieurs fois pour une m^me action voulue.

A noter : Bien que la Promise puisse aussi rendre des données via resolve() et reject(), elle ne peut le faire qu'une fois ! La nuance est la...

Pour interroger cet Observable, il faut y souscrire (notion de flux, file de message encore ici) de cette manière par exemple, dans notre composant Vue (Typescript) :

        testObservable() {
             let toto: Observable<any> = this.$store.getters[EnumGetters.TEST_OBSERVABLE];
 
             let store = this.$store;
 
             toto.subscribe({
                 next(value){
                     store.dispatch(EnumActions.TOAST_TEXT, [true, value]);
                 },
                 error(err) { console.error('OUPS: ' + err); },
                 complete(){
                     store.dispatch(EnumActions.TOAST_TEXT, [true, "Teminé"]);
                 }
             });
         }
         
Ici, l'Observable est récuppéré depuis le store sous la variable toto.

Il est donc possible de s'inscire à toto, un inscription à toto permet :
- De lancer l'excécution des opérations contenues dans l'Observable
- De récupérer l'avancement, le déroulement pour chaque next() donné.
- De poursuivre une exécution ou un traitement une fois ce processus terminé via le complete().

Le code ci -dessus peut être optimisé pour ne pas avoir à déclarer de variable "store", cet objet étant assez lourd, même par référence il est possible de le supprimer, en optant pour une syntaxe plus appropriée :


        testObservable(){
        
            (<Observable<any>>this.$store.getters[EnumGetters.TEST_OBSERVABLE])
                .subscribe({
                    next: (value) => {
                        this.$store.dispatch(EnumActions.TOAST_TEXT, [true, value]);
                    },
                    error : (err) => { console.error('OUPS: ' + err); },
                    complete: () => {
                        this.$store.dispatch(EnumActions.TOAST_TEXT, [true, "Terminé"]);
                    }
                });
                
        }


La syntaxe ne change rien mais permet moins de déclaration de variable, pouvant être couteuses dans certains cas (gros Objets, très grandes listes...).



# Au final

Cette petite analyse est rapide et personnelle :

- Si l'on souhaite pouvoir découper un processus en plusieurs et rendre compte du déroulement, l'Observable prends son sens.
- Si l'on souhaite pouvoir Définir plusieurs suscribers au même moment, pour le même déroulement d'une action, c'est possible aussi.
- Si l'on souhaite tirer parti de Rxjs, idem.

- L'observable ne déclenche que si l'on y souscrit ! Ce qui n'est pas le cas de la Promise qui déclenche dès instanciation.
- Un Observable peut être interrompu sans pour autant avoir à jeter un catch (qui pour rappel découle de l'erreur syntaxiquement).



