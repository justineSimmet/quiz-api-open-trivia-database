/*

    ###            #     #       #            ##      #                   #       #
     #                   #                     #                          #
     #    # ##    ##    ####    ##     ###     #     ##     ###    ###   ####    ##     ###   # ##
     #    ##  #    #     #       #        #    #      #    #          #   #       #    #   #  ##  #
     #    #   #    #     #       #     ####    #      #     ###    ####   #       #    #   #  #   #
     #    #   #    #     #  #    #    #   #    #      #        #  #   #   #  #    #    #   #  #   #
    ###   #   #   ###     ##    ###    ####   ###    ###   ####    ####    ##    ###    ###   #   #


*/

let quizArea = document.getElementById('quiz-area'),
    quizAreaContainer = quizArea.querySelector('.container'),
    modalResult = document.getElementById('quiz-result'),
    modalError = document.getElementById('quiz-error'),
    landingArea = document.getElementById('landing-area'),
    optionsContainer = document.getElementById('quiz-options'),
    nextContainer = document.getElementById('quiz-next'),
    loadingItem = document.getElementById('loading');

loadingItem.style.display = 'none';
quizArea.style.display = 'none';
quizAreaContainer.style.display = 'none';

function hideModal(target){
  target.classList.remove('is-active');
  location.reload();
}

modalResult.removeEventListener('click', function(e){});
modalResult.addEventListener('click', function(e){
  if(e.target.classList.contains('modal-background') || e.target.classList.contains('modal-close') || e.target.classList.contains('delete')){
    hideModal(modalResult);
  }
});

modalError.removeEventListener('click', function(e){});
modalError.addEventListener('click', function(e){
  if(e.target.classList.contains('modal-background') || e.target.classList.contains('modal-close') || e.target.classList.contains('delete')){
    hideModal(modalError);
  }
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
  let j, x, i;
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
  let request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.send(null);
  request.onload = function(){
    if( request.status >= 200 && request.status <400 ){
      let data = JSON.parse(request.responseText);
      loadingItem.style.display = 'none';
      outputQuizData(data);
    }
    else{
      let errorMessageArea = document.getElementById('error-message');
      errorMessageArea.textContent = 'Une erreur s\'est produite durant la récupération du quizz. Merci de retenter l\'opération.';
      modalError.classList.add('is-active');
    }
  }
}
// // Traite les donnée du quiz
function setQuiz(array){
  let arrayQuiz = []; //Le tableau qui va contenir les données formatées

  for (let i = 0; i < array.length; i++) //Boucle à travers chaque "étape" du quiz qui a été récupérée
  {
    let options = [], //Instancie le tableau qui va contenir les différentes options possibles
        correct = {'text' : array[i].correct_answer, 'key': generateKey()}; //Formate la bonne réponse et lui attribue une clé aléatoire
    options.splice(0,0, correct); //Insère la réponse dans le tableau des options

    for(let j = 0; j < array[i].incorrect_answers.length; j++) //Boucle à travers les autres réponses pour les formater et les insérer dans le tableau d'options
    { 
      let option = {'text' : array[i].incorrect_answers[j], 'key': generateKey()};
      options.push(option);
    }
    //Chaque "étape" du quiz est formaté de la même façon
    let quizStep = {
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
  let question = he.decode(content.question),
      questionContainer = document.getElementById('quiz-question'),
      options = content.options;
  questionContainer.textContent = question;

  for (let i = 0; i < options.length; i++)// Affiche chaque option sous la forme d'un bouton
  {
    let optionKey = options[i].key,
        optionText = he.decode(options[i].text)
        button = document.createElement('a');

    button.append(optionText);
    button.className = 'button is-info is-large option';
    button.dataset.key = optionKey;
    optionsContainer.appendChild(button);
  }
}

// Vérifie la réponse donnée par l'utilisateur
function checkAnswer(button, solution, step, length){
  //Désactive les boutons d'options pour éviter un clic supplémentaire
  let optionsItem = optionsContainer.getElementsByClassName('option');
  while(optionsItem.length)
    optionsItem[0].classList.remove('option');

  // Vérifie l'étape actuelle pour délivrer un bouton "question suivante avec le bon message"
  let next;
  if (step === length-1) {
    next = document.createElement('a');
    next.append('Terminer le quiz');
    next.className = 'button is-info is-warning is-large nextQuestion';
  }
  else if (step === length-2) {
    next = document.createElement('a');
    next.append('Dernière question');
    next.className = 'button is-info is-warning is-large nextQuestion';
  }
  else{
    next = document.createElement('a');
    next.append('Question suivante');
    next.className = 'button is-info is-warning is-large nextQuestion';
  }
  nextContainer.appendChild(next);

  let answer = button.dataset.key;
  if (answer == solution) {
    // Si la clé de la réponse correspond à a la clé de la solution, colore le bouton en vert et retourne TRUE
    button.classList.add('is-success');
    button.classList.remove('is-info');
    return true;
  }
  else{
    // Si la réponse est fausse, colore le bouton en rouge, change la bonne répons en vert, et retourne FALSE
    button.classList.add('is-danger');
    button.classList.remove('is-info');
    let rightAnswer = document.querySelectorAll('[data-key="'+solution+'"]'); // Cible l'option avec la bonne clé
    rightAnswer[0].classList.add('is-success');
    rightAnswer[0].classList.remove('is-info');
    return false;
  }
}


// Gestion de la  fin d'une partie
function endGame(finalScore, length){
  let message,
      style,
      image;

  // Défini le message à afficher selon le score final
  if (finalScore <= 3) {
    message ='C\'est pas top...';
    style = 'has-text-danger';
    image = 'assets/images/shame.gif';
  }else if (finalScore >= 4 && finalScore < 7) {
    message ='Pas mal, pas mal...';
    style = 'has-text-info';
    image = 'assets/images/notbad.gif';
  }else if (finalScore >= 7 && finalScore < 10) {
    message ='Hey, on s\'approche de la perfection !';
    style = 'has-text-success';
    image = 'assets/images/yas.gif';
  }
  else{
    message ='Que dire... parfait !';
    style = 'has-text-success';
    image = 'assets/images/magic.gif';
  }
  let finalResult = finalScore+'/'+length,
      resultFigure = modalResult.getElementsByTagName('figure'),
      resultScore = document.getElementById('resultScore'),
      resultMessage = document.getElementById('resultMessage');

  resultScore.textContent = finalResult;
  resultScore.classList.add(style);
  resultMessage.textContent = message;

  let resultImage = document.createElement("img");
  resultImage.src = image;
  resultFigure[0].appendChild(resultImage);

  quizArea.style.display = 'none';
  quizAreaContainer.style.display = 'none';          
  landingArea.style.display = '';
  modalResult.classList.add('is-active');
}


function outputQuizData(data){
  // Instancie les variables de contrôle du quiz
  let step = 1,
      score = 0;

  // Stocke et formate les données du quiz    
  let quizContent = setQuiz(data.results),
      quizLength = quizContent.length, // Définit la taille du quiz
      quizStepDocument = document.getElementById('quiz-step').querySelector('p'),
      quizScoreDocument = document.getElementById('quiz-score').querySelector('p')
  quizStepDocument.textContent = step+'/'+quizLength;
  quizScoreDocument.textContent = score;

  // Initialise la première question du quiz
  if (step-1 === 0) {
    quizAreaContainer.style.display = '';
    displayQuizStep(quizContent[step-1]);
  }

  // Va contrôler la réponse de l'utilisateur
  optionsContainer.removeEventListener('click',function(e){});
  optionsContainer.addEventListener('click', function(e){
    if (e.target.classList.contains('option')) {
      
      let check = checkAnswer(e.target, quizContent[step-1].response.key, step-1, quizLength);
      if(check){
        score += 1;
        quizScoreDocument.textContent = score;
      }
      step +=1;
    }
  })

  nextContainer.removeEventListener('click',function(e){});
  nextContainer.addEventListener('click', function(e){
    if(e.target.classList.contains('nextQuestion')){
      quizStepDocument.textContent = step+'/'+quizLength;
      optionsContainer.innerHTML = '';
      e.target.remove();

      if(step-1 == quizLength){
        endGame(score, quizLength);
        step = 1;
        score = 0;
        quizContent= [];
        return;
      }
      else{
        displayQuizStep(quizContent[step-1]);
      }
    }
  })
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
landingArea.removeEventListener('click',function(e){});
landingArea.addEventListener('click', function(e){
  if (e.target.classList.contains('start-quiz')) {
    loadingItem.style.display = '';

    let thema = e.target.dataset.thema,
        url;

    switch(thema){
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

    landingArea.style.display = 'none';
    quizArea.style.display = '';
    callQuiz(url);
  }
})
