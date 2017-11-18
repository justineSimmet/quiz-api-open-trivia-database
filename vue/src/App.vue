<template>
  <div id="app">
    <div id="loading" v-show="load">
      <span class="fa fa-spinner fa-pulse fa-3x fa-fw"></span>
    </div>
    <modal-result 
      v-if="endQuiz"
      @closeModal="resetData"
      :result="finalResult" :message="resultMessage" :image="resultImage" :scoreStyle="resultStyle" :endGame="endQuiz"
    />
    <modal-error
      v-if="hasError"
      @closeModal="resetData"
      :errorContent="errors" :activeError="hasError"
    />
    <component-active v-bind:is="currentView"
      @getUrl="ajaxCall"
      @nextStep="initializeQuiz"
      :quizPart="quizData" :currentStep="step" :currentScore="score" :currentLength="length"
    />
  </div>
</template>

<script>
//Librairie de gestion des requêtes HTTP
import axios from 'axios';

import ModalResult from './components/ModalResult';
import ModalError from './components/ModalError';
import LandingPage from './components/LandingPage';
import QuizPage from './components/QuizPage';
import * as basic from './assets/quiz.js';

export default {
  data() {
    return {
      load: false,
      currentView : 'landing',
      endQuiz: false,
      step:0,
      score:0,
      length:0,
      quizGlobal: [],
      quizData: [],
      errors: [],
      hasError: false,
      finalResult: '',
      resultMessage: '',
      resultImage: '',
      resultStyle: ''
    }
  },
  name: 'app',
  components: {
    ModalResult,
    ModalError,
    //Permet d'appeler dynamiquement les vm 
    landing : LandingPage,
    quiz: QuizPage
  },
  methods:{
    ajaxCall : function (value){
      //active le loader FA
      this.load = true;

      //lance la requête GET avec axios et l'url renvoyée par landingPage
      axios.get(value).then(response =>{
        let responseData = response.data.results,
            quizFormated = basic.setQuiz(responseData);
        this.quizGlobal = quizFormated;
        this.length = this.quizGlobal.length;
        this.initializeQuiz(this.step, this.score);
      }).catch(e => {
        this.errors.push(e);
        this.hasError = true;
      });
    },
    initializeQuiz: function (step, score){
      // Display les données du quiz
      this.score = score;
      step++;
      if (step <= this.length) {
        // Si toutes les questions n'ont pas été posées
        // va définir la vm sur quizPage et récupère le contenu (question - options - réponse)
        // de l'étape en cours
        this.currentView       = 'quiz';
        this.quizData          = [];
        this.quizData.question = this.quizGlobal[step-1].question;
        this.quizData.options  = this.quizGlobal[step-1].options;
        this.quizData.response = this.quizGlobal[step-1].response;
        this.step              = step;
        this.load = false;
      }
      else{
        // Si toutes les questions ont été posées
        // active le endGame et revient sur la landingPage
        this.endGame();
        this.currentView = 'landing';
      }
    },
    endGame: function(){
      // Initialise les données de rendue de fin de jeu selon le score du joueur
      this.finalResult = this.score+'/'+this.length;

      if (this.score <= 3) {
        this.resultMessage ='C\'est pas top...';
        this.resultStyle   = 'has-text-danger';
        this.resultImage   = 'static/images/shame.gif';
      }else if (this.score >= 4 && this.score < 7) {
        this.resultMessage ='Pas mal, pas mal...';
        this.resultStyle   = 'has-text-info';
        this.resultImage   = 'static/images/notbad.gif';
      }else if (this.score >= 7 && this.score < 10) {
        this.resultMessage ='Hey, on s\'approche de la perfection !';
        this.resultStyle   = 'has-text-success';
        this.resultImage   = 'static/images/yas.gif';
      }
      else{
        this.resultMessage ='Que dire... parfait !';
        this.resultStyle   = 'has-text-success';
        this.resultImage   = 'static/images/magic.gif';
      }

      // Passe endQuiz pour afficher la modal de résultat
      this.endQuiz = true;
    },
    resetData: function(){
      // Réinitialise toutes les données de contrôle de l'app
      this.endQuiz      = false;
      this.step          = 0;
      this.score         = 0;
      this.length        = 0;
      this.quizGlobal    = [];
      this.quizData      = [];
      this.errors        = [];
      this.hasError      = false;
      this.finalResult   = '';
      this.resultMessage = '';
      this.resultImage   = '';
      this.resultStyle   = '';
    }
  }
}
</script>
