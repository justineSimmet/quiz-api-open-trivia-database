<template>
  <section class="hero is-light is-fullheight" id="quiz-area">
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column">
            <p class="title is-2 has-text-centered" id="quiz-question">
              {{quizQuestion}}
            </p>
          </div>
        </div>

        <div class="columns reverse-order">
          <div class="column is-light is-one-quarter" id="quiz-info">
            <div class="has-text-centered" id="quiz-score">
              <p class="title is-1">{{score}}</p>
            </div>
            <div class="has-text-centered" id="quiz-step">
              <p>{{checkStep}}</p>
            </div>
          </div>
          <div class="column">
            
          </div>
          <div class="column is-two-thirds" id="quiz-options">
            <div v-for="option in quizOptions" >
              <input type="radio" :id="option.key" :value="option.key" v-bind:key="option.key" v-on:click="checkAnswer($event.target.value)" >
              <label :for="option.key" :data-key="option.key" :key="option.key" class="button is-large is-info">{{option.text}}</label>
            </div>
          </div>
        </div>
        <div class="columns has-text-centered" id="quiz-next">
            <a class="button is-info is-warning is-large nextQuestion" v-on:click="goNext" v-show="showNext">{{nextMessage}}</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'QuizPage',
  props: ['currentScore', 'currentStep', 'currentLength', 'quizPart'],
  data () {
    return {
      item: this.quizPart,
      step: this.currentStep,
      score: this.currentScore,
      size: this.currentLength,
      showNext: false,
      nextMessage: '',
    }
  },
  watch: {
    currentStep: function(){
      this.step = this.currentStep;
    },
    currentLength: function(){
      this.size = this.currentLength;
    },
    currentScore: function(){
      this.score = this.currentScore;
    },
    quizPart: function(){
      this.item = this.quizPart;
    }
  },
  computed: {
    quizQuestion: function(){
      return this.item.question;
    },
    quizOptions: function(){
      return this.item.options;
    },
    checkStep: function(){
      return this.step+'/'+this.size;
    }
  },
  methods: {
    checkAnswer: function(value){
      console.log('done');
      // Lorsqu'une option est choisie par le joueur, va vérifier son statut par rapport à la solution
      // let answer récupère le label correspondant à la réponse du joueur
      let answer = document.querySelectorAll('[data-key="'+value+'"]'),
          solution = this.item.response.key;
      if(value == solution){
        // Si le joueur a la bonne réponse, modifie l'état du label qui a été cliqué et augmente le score
        answer[0].classList.add('is-success');
        answer[0].classList.remove('is-info');
        this.score ++;
      }
      else{
        // Si le joueur a la mauvaise réponse, modifie l'état du label qui a été cliqué
        // et recherche le label correspondant a la solution pour le mettre en avant
        answer[0].classList.add('is-danger');
        answer[0].classList.remove('is-info');
        let rightAnswer = document.querySelectorAll('[data-key="'+solution+'"]');
        rightAnswer[0].classList.add('is-success');
        rightAnswer[0].classList.remove('is-info');
      }
      
      //Désactive les inputs existants afin d'éviter que le joueur continue de valider des réponses
      let input =  document.getElementsByTagName('input');
      for (let i = input.length - 1; i >= 0; i--) {
        input[i].disabled = true;
      }
      
      // Affiche un bouton pour passer à l'étape suivante avec un message correspond à la position du joueur dans le quiz
      if (this.step === this.size) {
        this.nextMessage = 'Terminer le quiz';
      }
      else if (this.step === this.size-1) {
        this.nextMessage = 'Dernière question';
      }
      else{
        this.nextMessage = 'Question suivante';
      }

      this.showNext = true;
    },
    goNext: function (){

      // Masque le bouton pour passer à l'étape suivante 
      this.showNext = false;

      // Retourne au parent l'étape et le score actuel pour réinitialiser une question
      this.$emit('nextStep',this.step, this.score);
    }
  }
}

</script>

