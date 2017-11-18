<template>
  <div class="modal" v-bind:class="{'is-active': isActive}" id="quiz-error" @click="closeModal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="notification is-danger">
        <button class="delete"></button>
          <p>{{messageError}}</p>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close"></button>
  </div>
</template>

<script>
export default {
  name: 'ModalError',
  props: ['errorContent', 'activeError'],
  data () {
    return {
      isActive: this.activeError,
      messageError: 'Une erreur est survenue durant la mise en place du quiz. Merci de réessayer ultérieurement.'
    }
  },
  watch: {
    activeError: function(){
      this.isActive = this.activeError;
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

