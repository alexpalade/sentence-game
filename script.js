var view = {
  update: function (imagePath, sentence, answer, options) {
    var imageElement = document.getElementById('image');
    imageElement.src = imagePath;

    var questionPosition = sentence.indexOf('?');
    
    var sentenceFirstPart = sentence.substr(0, questionPosition);
    var sentenceSecondPart = sentence.substr(questionPosition + 1);

    var sentenceFirstPartSpan = document.createElement('span');
    sentenceFirstPartSpan.textContent = sentenceFirstPart + ' _______ ';
    var sentenceSecondPartSpan = document.createElement('span');
    sentenceSecondPartSpan.textContent = sentenceSecondPart;
    
    var sentenceElement = document.getElementById('sentence');
    sentenceElement.innerHTML = '';
    sentenceElement.appendChild(sentenceFirstPartSpan);
    
    sentenceElement.appendChild(sentenceSecondPartSpan);

    var choicesListElement = document.getElementById('choicesList');
    choicesListElement.innerHTML = '';
    options.forEach(function(item) {
      var choiceLi = document.createElement('li');
      var choiceButton = document.createElement('button');
      choiceButton.textContent = item;
      choiceButton.onclick = handlers.onChoiceClicked;
      choiceLi.appendChild(choiceButton);
      choicesListElement.appendChild(choiceLi);
    });
    
  },
  displayCorrect: function(sentence) {
    var choicesListElement = document.getElementById('choicesList');
    
    var sentenceElement = document.getElementById('sentence');
    sentenceElement.textContent = sentence;
    
    var messageElement = document.getElementById('message');
    messageElement.innerHTML = '';
    var nextButton = document.createElement('button');
    nextButton.className = 'nextLevelButton';
    nextButton.onclick = handlers.onNextClicked;

    nextButton.textContent = '👍 Correct! →';
//    messageElement.textContent = 'Correct!';
    messageElement.appendChild(nextButton);
  },
  
  displayWrong: function() {
    this.resetMessage();
    
    var messageElement = document.getElementById('message');

    var span = document.createElement('div');
    span.textContent = 'Try again. :)';
    span.className = 'tryAgain';

    messageElement.innerHTML = '';
    messageElement.appendChild(span);
  },
  resetMessage: function() {
    var messageElement = document.getElementById('message');
    var span = document.createElement('div');
    span.textContent = '\xa0';
    span.className = 'tryAgain';
    messageElement.innerHTML = '';
    messageElement.appendChild(span);
  },
  updateLevelList: function(levelList, currentLevel) {
    var levelListElement = document.getElementById('levelList');
    levelListElement.innerHTML = '';
    var levelListUl = document.createElement('ul');
    levelList.forEach(function(level, position) {
      var levelLi = document.createElement('li');
      if (position === currentLevel) {
	levelLi.className = 'selected';
      }
      var levelLiUrl = document.createElement('a')
      levelLiUrl.textContent = level;
      levelLiUrl.href = '#';
      levelLiUrl.onclick = function() {
	handlers.onLevelClicked(position);
      }
      levelLi.appendChild(levelLiUrl);
      
      levelListUl.appendChild(levelLi);
    });
    levelListElement.appendChild(levelListUl);
  },
}

var handlers = {
  onChoiceClicked: function(event) {
    var value = event.target.textContent;
    game.checkAnswer(value);
  },
  onNextClicked: function() {
    view.resetMessage();
    game.nextLevel();
  },
  onLevelClicked: function(position) {
    game.loadLevel(position);
  }
}

var game = {
  correct: undefined,
  currentLevel: 0,
  loadLevel: function(levelNumber) {
    this.currentLevel = levelNumber;
    levelData = levels[levelNumber];
    imagePath = 'assets/' + levelData.image;
    sentenceText = levelData.sentence;
    this.correct = levelData.correct;
    var options = [];
    Array.prototype.push.apply(options, levelData.wrong);
    options.push(levelData.correct);
    shuffleArray(options);

    view.update(imagePath, sentenceText, levelData.correct, options);
    
    if (levelData.completed) {
      view.displayCorrect(this.computeCorrectSentence());
    }

    var levelList = [];
    levels.forEach(function(item, position) {
      if (item.completed) {
	levelList.push(item.name + ' ✔');
      } else {
	levelList.push(item.name);
      }
    });
      
    view.updateLevelList(levelList, this.currentLevel);
    view.resetMessage();
  },
  computeCorrectSentence: function() {
      var sentence = levels[this.currentLevel].sentence;
      var correct = levels[this.currentLevel].correct;
      return sentence.replace('?', correct);
  },
  checkAnswer: function(value) {
    if (value === this.correct) {

      levels[this.currentLevel].completed = true;

      var correctSentence = this.computeCorrectSentence();
      view.displayCorrect(correctSentence);
    } else {
      view.displayWrong();
    }
  },
  nextLevel: function() {
    if (this.currentLevel === levels.length-1) {
      this.currentLevel = 0;
    } else {
      this.currentLevel++;
    }
    this.loadLevel(this.currentLevel);
  }
}

function swap(array, i, j) {
  let tmp = array[i];
  array[i] = array[j];
  array[j] = tmp;
}

function shuffleArray(array) {
  for (var i = 0; i < array.length; i++) {
    swap(array, i, getRandomInt(i, array.length - 1));
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

game.loadLevel(0);
