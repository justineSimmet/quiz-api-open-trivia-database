<template>
  <div class="modal" v-bind:class="{'is-active': isActive}" id="quiz-result" @click="closeModal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <div class="media">
          <div class="media-left">
            <figure>
              <img :src="endImage" alt="Illustration du résultat en gif">
            </figure>
          </div>
          <div class="media-content">
            <div class="content">
              <p class="has-text-centered title is-1" id="resultScore">
                <span v-bind:class="endStyle">{{endResult}}</span>
              </p>
              <p class="has-text-centered" id="resultMessage">
                {{endMessage}}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close"></button>
  </div>
</template>

<script>
export default {
  name: 'ModalResult',
  props: ['result', 'message', 'scoreStyle', 'image', 'endGame'],
  data () {
    return {
      isActive : this.endGame,
      endResult: this.result,
      endMessage: this.message,
      endStyle: this.scoreStyle,
      endImage: this.image
    }
  },
  watch:{
    endGame: function(){
      this.isActive = this.endGame;
    },
    result: function(){
      this.endResult = this.result;
    },
    message: function(){
      this.endMessage = this.message;
    },
    scoreStyle: function(){
      this.endStyle = this.scoreStyle;
    },
    image: function(){
      this.endImage = this.image;
    }
  },
  methods:{
    closeModal: function(){
      this.isActive = false;
      this.$emit('closeModal');
    }
  }
}
</script>

