<template>
  <header class="hero is-primary is-fullheight" id="landing-area">
    <div class="hero-body has-text-centered">
      <div class="container">
        <p class="title is-1">
          C'est l'heure du quiz !
        </p>
        <p>Lancez une série de 10 questions portant sur différents sujets et répondez du mieux que vous pouvez.</p>
        <div>
          <a class="button is-primary is-inverted is-large" @click="getThemaQuiz(all.thema)">{{all.text}}</a>
        </div>
        <h2 class="subtitle">
           Hop pop pop ! Je veux choisir mon thème.
        </h2>
        <div class="field is-grouped is-grouped-multiline is-grouped-centered">
         <p class="control" v-for="theme in themes" >
           <a class="button is-primary is-inverted is-outlined" @click="getThemaQuiz(theme.thema)">{{theme.text}}</a>
         </p>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'LandingPage',
  data () {
    return {
      all:{
        text : 'Allons-y Alonso !',
        thema: 'all'
      },
      themes:[
        {
          text : 'Littérature',
          thema: 'book'
        },
        {
          text : 'Musique',
          thema: 'music'
        },
        {
          text : 'Cinéma',
          thema: 'movie'
        },
        {
          text : 'Histoire',
          thema: 'history'
        },
        {
          text : 'Géographie',
          thema: 'geography'
        },
        {
          text : 'Science et vie',
          thema: 'science'
        }
      ]
    }
  },
  methods: {
    getThemaQuiz : function (value) {
      let url;
      switch(value){
        case 'all':
          url = 'https://opentdb.com/api.php?amount=10';
          break;
        case 'book':
          url = 'https://opentdb.com/api.php?amount=10&category=10';
          break;
        case 'music':
          url = 'https://opentdb.com/api.php?amount=10&category=12';
          break;
        case 'movie':
          url = 'https://opentdb.com/api.php?amount=10&category=11';
          break;
        case 'history':
          url = 'https://opentdb.com/api.php?amount=10&category=23';
          break;
        case 'geography':
          url = 'https://opentdb.com/api.php?amount=10&category=22';
          break;
        case 'nature':
          url = 'https://opentdb.com/api.php?amount=10&category=17';
          break;
        default:
          url = 'https://opentdb.com/api.php?amount=10';
          break;
      }
      // Retourne au parent l'url à utiliser pour appeler les informations du quiz
      this.$emit('getUrl', url);
    }
  }
}
</script>

