import he from 'he';

// Génère une clé aléatoire composée de lettres et de chiffres
export function generateKey(){
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


// Mélange les différentes entrées d'un tableau
export function shuffle(array) {
  let j, x, i;
  for (i = array.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = array[i - 1];
    array[i - 1] = array[j];
    array[j] = x;
  }
  return array;
}

// // Traite les donnée du quiz
export function setQuiz(array){
  let arrayQuiz = []; //Le tableau qui va contenir les données formatées

  for (let i = 0; i < array.length; i++) //Boucle à travers chaque "étape" du quiz qui a été récupérée
  {
    let options = [], //Instancie le tableau qui va contenir les différentes options possibles
        correct = {'text' : he.decode(array[i].correct_answer), 'key': generateKey()}; //Formate la bonne réponse et lui attribue une clé aléatoire
    options.splice(0,0, correct); //Insère la réponse dans le tableau des options

    for(let j = 0; j < array[i].incorrect_answers.length; j++) //Boucle à travers les autres réponses pour les formater et les insérer dans le tableau d'options
    { 
      let option = {'text' : he.decode(array[i].incorrect_answers[j]), 'key': generateKey()};
      options.push(option);
    }
    //Chaque "étape" du quiz est formaté de la même façon
    let quizStep = {
      'question' : he.decode(array[i].question),
      'options' : shuffle(options), //Mélange le tableau d'option pour éviter que la bonne réponse soit toujours au même endroit
      'response': correct,
    };
    arrayQuiz.push(quizStep);
  }
  return arrayQuiz;
}