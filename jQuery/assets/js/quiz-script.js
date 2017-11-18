/*

    ###            #     #       #            ##      #                   #       #
     #                   #                     #                          #
     #    # ##    ##    ####    ##     ###     #     ##     ###    ###   ####    ##     ###   # ##
     #    ##  #    #     #       #        #    #      #    #          #   #       #    #   #  ##  #
     #    #   #    #     #       #     ####    #      #     ###    ####   #       #    #   #  #   #
     #    #   #    #     #  #    #    #   #    #      #        #  #   #   #  #    #    #   #  #   #
    ###   #   #   ###     ##    ###    ####   ###    ###   ####    ####    ##    ###    ###   #   #


*/

$('#quiz-area').hide();

$('#quiz-area .container').hide();

$("#quiz-result").on('click', function() {
   $("#quiz-result").removeClass("is-active");
});

$("#quiz-error").on('click', function() {
   $("#quiz-error").removeClass("is-active");
});





/*

   #####                        #       #                                    #                                #
   #                            #                                            #
   #       ###   # ##    ###   ####    ##     ###   # ##    ###           ## #  #   #          ## #  #   #   ##    #####
   ####   #   #  ##  #  #   #   #       #    #   #  ##  #  #             #  ##  #   #         #  ##  #   #    #       #
   #      #   #  #   #  #       #       #    #   #  #   #   ###          #   #  #   #         #  ##  #   #    #      #
   #      #   #  #   #  #   #   #  #    #    #   #  #   #      #         #  ##  #  ##          ## #  #  ##    #     #
   #       ###   #   #   ###     ##    ###    ###   #   #  ####           ## #   ## #             #   ## #   ###   #####
                                                                                                  #
                                                                                                  #
*/

// Génère une clé aléatoire composée de lettres et de chiffres
function generateKey(){
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


// Mélange les différentes entrées d'un tableau
function shuffle(array) {
  var j, x, i;
  for (i = array.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = array[i - 1];
    array[i - 1] = array[j];
    array[j] = x;
  }
  return array;
}

// Exécute un requête ajax et traite les données retournées ou affiche un message d'erreur
function callQuiz(url) {
  var ajaxCall = $.ajax({
    url: url, // server url
    type: 'GET', //POST or GET 
    datatype: 'json'
  });
  ajaxCall.done(function(data){
    //Détruit le spinner quand la requête est effectuée
    $.LoadingOverlay("hide");

    //Traite les données du quiz reçues
    outputQuizData(data);
  });
  ajaxCall.fail(function(){
    $('#error-message').text('Une erreur s\'est produite durant la récupération du quizz. Merci de retenter l\'opération.');
    $('#quiz-error').addClass('is-active');
  })
}

// Traite les donnée du quiz
function setQuiz(array){
  var arrayQuiz = []; //Le tableau qui va contenir les données formatées

  for (var i = 0; i < array.length; i++) //Boucle à travers chaque "étape" du quiz qui a été récupérée
  {
    var options = []; //Instancie le tableau qui va contenir les différentes options possibles
    var correct = {'text' : array[i].correct_answer, 'key': generateKey()}; //Formate la bonne réponse et lui attribue une clé aléatoire
    options.splice(0,0, correct); //Insère la réponse dans le tableau des options

    for(var j = 0; j < array[i].incorrect_answers.length; j++) //Boucle à travers les autres réponses pour les formater et les insérer dans le tableau d'options
    { 
      var option = {'text' : array[i].incorrect_answers[j], 'key': generateKey()};
      options.push(option);
    }
    //Chaque "étape" du quiz est formaté de la même façon
    var quizStep = {
      'question' : array[i].question,
      'options' : shuffle(options), //Mélange le tableau d'option pour éviter que la bonne réponse soit toujours au même endroit
      'response': correct,
    };
    arrayQuiz.push(quizStep);
  }
  return arrayQuiz;
}

// Affiche l'étape en cours du quiz
function displayQuizStep(content){
  var question = he.decode(content.question); // Utilise le plugin he.js pour décoder en texte courant le texte reçu
  $('#quiz-question').text(question); // Affiche la question
  var options = content.options; 

  for (var i = 0; i < options.length; i++)// Affiche chaque option sous la forme d'un bouton
  {
    var button = '<a class="button is-info is-large option" data-key="'+options[i].key+'">'+he.decode(options[i].text)+'</a>';
    $('#quiz-options').append(button);
  }
}

// Vérifie la réponse donnée par l'utilisateur
function checkAnswer(button, solution, step, length){
  $('#quiz-options .option').removeClass('option'); //Désactive les boutons d'options pour éviter un clic supplémentaire

  // Vérifie l'étape actuelle pour délivrer un bouton "question suivante avec le bon message"
  if (step === length-1) {
    var next = '<a class="button is-info is-warning is-large nextQuestion">Terminer le quiz</a>';
  }
  else if (step === length-2) {
    var next = '<a class="button is-info is-warning is-large  nextQuestion">Dernière question</a>';
  }
  else{
    var next = '<a class="button is-info is-warning is-large  nextQuestion">Question suivante</a>';
  }
  $('#quiz-next').append(next);

  var answer = $(button).data('key'); // Stoke la clé de la réponse utilisateur

  if (answer == solution) {
    // Si la clé de la réponse correspond à a la clé de la solution, colore le bouton en vert et retourne TRUE
    $(button).addClass('is-success').removeClass('is-info');
    return true;
  }
  else{
    // Si la réponse est fausse, colore le bouton en rouge, change la bonne répons en vert, et retourne FALSE
    $(button).addClass('is-danger').removeClass('is-secondary');
    var correct = $('a[data-key='+solution+']'); // Cible l'option avec la bonne clé
    $(correct).addClass('is-success').removeClass('is-secondary');
    return false;
  }
}


// Gestion de la  fin d'une partie
function endGame(finalScore, length){

  // Défini le message à afficher selon le score final
  if (finalScore <= 3) {
    var message ='C\'est pas top...';
    var style = 'has-text-danger';
    var image = 'shame.gif';
  }else if (finalScore >= 4 && finalScore < 7) {
    var message ='Pas mal, pas mal...';
    var style = 'has-text-info';
    var image = 'notbad.gif';
  }else if (finalScore >= 7 && finalScore < 10) {
    var message ='Hey, on s\'approche de la perfection !';
    var style = 'has-text-success';
    var image = 'yas.gif';
  }
  else{
    var message ='Que dire... parfait !';
    var style = 'has-text-success';
    var image = 'magic.gif';
  }
  var finalResult = finalScore+'/'+length;
  var boxResult = '<div class="box"><div class="media">'
                + '<div class="media-left"><figure><img src="assets/images/'+image+'" alt="Résultat du quiz"></figure></div>'
                + '<div class="media-content"><div class="content">'
                + '<p class="has-text-centered title is-1 '+style+'">'+finalResult+'</p>'
                + '<p class="has-text-centered">'+message+'</p>'
                + '</div></div>'
                + '</div></div>';

  $('#quiz-result .modal-content').html(boxResult);
  $('#quiz-area').hide();
  $('#quiz-area .container').hide();
  $('#landing-area').show();
  $('#quiz-result').addClass('is-active');
}


function outputQuizData(data){
  // Instancie les variables de contrôle du quiz
  var step = 1,
    state = 0,
    score = 0;

  // Stocke et formate les données du quiz
  var quizContent = setQuiz(data.results);
  var quizLength = quizContent.length; // Définit la taille du quiz

  $('#quiz-step p').text(step+'/'+quizLength); // Affiche l'étape actuelle
  $('#quiz-score p').html(score); // Affiche le score actuel


  // Initialise la première question du quiz
  if (state === 0) {
    $('#quiz-area .container').show();
    displayQuizStep(quizContent[state]);
  }

  // Détache l'événement "click" des options pour éviter l'effet de propagation si ce n'est pas le premier quiz de la "session"
  $('#quiz-options').off('click', '.option');
  $('#quiz-options').on('click', '.option', function(){
    var check = checkAnswer($(this), quizContent[state].response.key, state, quizLength); //Contrôle la réponse
    if (check) {
      score += 1;
      $('#quiz-score p').text(score);
    }
    step += 1;
  });

  $('#quiz-next').off('click', '.nextQuestion');
  $('#quiz-next').on('click', '.nextQuestion', function(){
    $('#quiz-step p').text(step+'/'+quizLength); // Mets à jours l'étape actuelle
    $('#quiz-options a').remove(); // Supprime les réponses possibles
    $('#quiz-next .nextQuestion').remove(); // Supprime le bouton de question suivante
    state += 1; // Mets à jours l'état du quiz

    if(state === quizLength){
      // Si la variable state est égale à la taille du quiz, c'est que toutes les questions ont été posées
      endGame(score, quizLength);
      
      // Réinitialise les variables de contrôle
      step = 1;
      state = 0;
      score = 0;
    }
    else{
      // Si il y a toujours des questions disponibles, passe à l'étape suivante
      displayQuizStep(quizContent[state]);
    }
  });
}






/*

     #            #       #                   #       #
    # #           #                           #
   #   #   ###   ####    ##    #   #   ###   ####    ##     ###   # ##
   #   #  #   #   #       #    #   #      #   #       #    #   #  ##  #
   #####  #       #       #     # #    ####   #       #    #   #  #   #
   #   #  #   #   #  #    #     # #   #   #   #  #    #    #   #  #   #
   #   #   ###     ##    ###     #     ####    ##    ###    ###   #   #


*/

$('#landing-area').off('click', '.start-quiz');
$('#landing-area').on('click', '.start-quiz', function(){

  //Active un loader
  $.LoadingOverlay("show", {
    image       : "",
    fontawesome : "fa fa-spinner fa-spin"
  });

  $('#landing-area').hide();
  $('#quiz-area').show();

  var thema = $(this).data('thema');

  //Défini la bonne url a contacter
  switch(thema){
    case 'all':
      var url = 'https://opentdb.com/api.php?amount=10';
      break;
    case 'book':
      var url = 'https://opentdb.com/api.php?amount=10&category=10';
      break;
    case 'music':
      var url = 'https://opentdb.com/api.php?amount=10&category=12';
      break;
    case 'movie':
      var url = 'https://opentdb.com/api.php?amount=10&category=11';
      break;
    case 'history':
      var url = 'https://opentdb.com/api.php?amount=10&category=23';
      break;
    case 'geography':
      var url = 'https://opentdb.com/api.php?amount=10&category=22';
      break;
    case 'nature':
      var url = 'https://opentdb.com/api.php?amount=10&category=17';
      break;
    default:
      var url = 'https://opentdb.com/api.php?amount=10';
      break;
  }

  // Lance une requête Ajax pour récupérer le contenu du quiz
  callQuiz(url);
})