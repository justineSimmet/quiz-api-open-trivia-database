# Vous avez dit "quiz" ?

Réalisation d'un système de quiz basé sur l'API d'[Open Trivia Database](https://opentdb.com/) et utilisant le framework CSS [Bulma](http://bulma.io/).

L'objectif était de réaliser le même quiz de trois façon différentes :

* en javascript pur ;
* en me servant de la librairie [jQuery](http://jquery.com/) ;
* et en adaptant le système au framework javascript [Vue.js](https://vuejs.org/).

Chaque version est visible en ligne :

* [version javascript](https://www.justine-simmet.rocks/demo/quiz/javascript/index.html) ;
* [version jQuery](https://www.justine-simmet.rocks/demo/quiz/jQuery/index.html) ;
* [version Vue.js](https://www.justine-simmet.rocks/demo/quiz/vue.js/index.html) ;

## Fonctionnement
Le quiz se lance une fois qu'une thématique a été choisie. L'utilisateur doit alors répondre à chaque question, 10 au total, au fur et à mesure. Il voit en temps réel son score et sa positions dans les étapes du quiz.
Une fois le quiz entièrement complété, il a droit à un message d'erreur "personnalisé" selon son score.

## Divers
Pour la version jQuery, j'ai fait appel au plugin jquery [LoadingOverlay](https://gasparesganga.com/labs/jquery-loading-overlay/) de Gaspare Sganga afin de mettre en place rapidement un loader au chargement du quiz.
J'ai également [he.js](https://github.com/mathiasbynens/he) afin de traiter les données envoyées par l'API.
Et concernant la version Vue.js, j'ai utilisé la librairie [Axios](https://github.com/axios/axios) afin de gérer la requête GET vers l'API.
