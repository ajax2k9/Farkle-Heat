let dice = [];
let scoreSlots = [];
let currRank = -1;
let currTurn = 0;
let timeStep = 4;
let button;
let submitButton;
let score = 0;
let roundScore = 0;
let farkle = false;
let scoreBoard;
let newGame = false;
let gameOverWindow;
let helpWindow;
let helpButton;
let myFont;

const Round={
    START: 0,
    ROLLING: 1,
    FARKLE_CHECK: 2,
    SCORING: 3,
    OVER: 4,
    FARKLE: 5,
    GAME_OVER: 6
}
let currRound = Round.START;
function setup(){
     textFont(myFont);
     createCanvas(800,640);
     let spacing = 68;
     let x = 40;
     let y = 100;
     dice.push(new D6(x,y));
     x+=spacing;
     dice.push(new D6(x,y));
     x+=spacing;
     dice.push(new D6(x,y));
     x-=spacing*2;
     y+=spacing;
     dice.push(new D6(x,y));
     x+=spacing;
     dice.push(new D6(x,y));
     x+=spacing;
     dice.push(new D6(x,y));

     for(let i = 0; i< 6; i++){
        let slots = [];
        for(let j = 0; j< 6-i; j++){
            slots.push(new ScoreSlot(j*spacing+40,600 - i*spacing));
        }
        scoreSlots.push(slots);
     }

     button = new Button(40,25,60,30,"roll");
     submitButton = new SubmitButton(110,25,65,30);
     helpButton = new HelpButton(width - 25,25);
     scoreBoard = new Scoreboard();
     gameOverWindow = new GameOverWindow(400,320);
     helpWindow = new HelpWindow(400,320);
     helpWindow.active = true;

}
function preload() {
  myFont = loadFont('assets/junegull.ttf');
}

function mousePressed() {
    if(mouseX < 0 || mouseX > width){
        return;
    }

    if(mouseY < 0 || mouseY > height){
        return;
    }

    dice.forEach(d=>{d.checkClick();});
    
    if(currRound == Round.SCORING){
        scoreSlots.forEach(s=>{s.forEach(slot=>{
            slot.checkClick();
        });});
    }
    submitButton.checkClick();
    button.checkClick();
    helpButton.checkClick();
    if(gameOverWindow.active){
        gameOverWindow.button.checkClick();
    }
    if(helpWindow.active){
        helpWindow.button.checkClick();
    }
}

function draw(){
    background(0,50,0);
    rectMode(CENTER)
    textAlign(CENTER,CENTER)
    textSize(30)
    fill(110, 47, 27);
    rect(width/2,25,width,50,0,0,5,5)
    fill(255,255,255)

    textFont("Arial")
    text("🔥",width/2 - 100,25)
    text("🔥",width/2 + 105,25)
    textFont(myFont)
    text("FARKLE HEAT",width/2,25);
    fill(255,200,100)
    text(" + 100",250,395);
    fill(255,100,100)
    text(" + 500",180,330);
    fill(255,00,50)
    text(" + 1000",120,260);
    gameControl();
    fill(255,255,255);
    textSize(12);
    
    scoreSlots.forEach(s=>{s.forEach(d=>{d.draw();});});
    dice.forEach(d=>{d.draw();});
    submitButton.draw();
    scoreBoard.draw();
    button.draw();
    gameOverWindow.draw();
    helpWindow.draw();
    helpButton.draw();
    fill(200,255,200)
    text("(c)2023 Alex Mendelsberg",width - 125, height - 20)
}

function gameControl(){
    if(currRound == Round.GAME_OVER){
        gameOverWindow.show();
        if(newGame){
            currRound = 0;
            currTurn = 0;
            currRank = 0;
            scoreBoard.reset();
            ResetBoard();
            gameOverWindow.hide();
            newGame = false;
        } else {
            return;
        }
    }

    if(currRound == Round.FARKLE){
        roundScore = 0;
        score = 0;
        button.name = "FARKLE";
        button.show(); 
        submitButton.hide();
    }

    if(currRound == Round.FARKLE_CHECK){
        checkFarkle();
    }

    if(currRound == Round.ROLLING){
        rolling();
    }

    if(currRound == Round.SCORING){
        if(score > 0 && validRoll){
            button.show();
        } else {
            button.hide();
        }

        if((roundScore + score) >= 300 && validRoll){
            submitButton.show();
        } else {
            submitButton.hide();
        }
    }

    if(currRound == Round.GAME_OVER){
        gameOverWindow.active = true;
        if(newGame){
            currRound = Round.START;
            score = 0;
            scoreBoard.b
        }
    }

    if(button.pressed == false && submitButton.pressed == false) return;
    
    if(currRound == Round.FARKLE){
        scoreBoard.scores[currTurn] = "FARKLE";
        ResetBoard();
        IncrementTurn();
    }

    if(currRound == Round.START){
        performRoll();
    }
    if(currRound == Round.SCORING){
        if(score > 0 && validRoll){
            if(checkAllDice()){
                ResetBoard();
                performRoll();
                roundScore += score;
                score = 0;
            } else {
                button.name = "roll";
                roundScore += score;
                score = 0;
                performRoll();
            }
        }
    }

    button.pressed = false;
    submitButton.pressed = false;
}

function checkFarkle(){
    let values = [];
            
    dice.forEach(e => {
        values.push(e.value);
    });

    let sum = CheckScore(values);

    if(sum == 0){
        currRound = Round.FARKLE;
    } else {
        currRound = Round.SCORING;
        button.name = "roll";
    }
}

function checkAllDice(){
    let allDice = true;
    dice.forEach(d=>{
        if(d.value > 0) allDice = false;
    });

    return allDice;
}

function performRoll(){
    currRank += 1;
    currRound = Round.ROLLING;
    rollTimer = 360;
    button.hide();
    dice.forEach(d=>{
        if(d.canRoll)d.value = floor(random(6)+1);
    });
}

function IncrementTurn(){
    currTurn+=1;
    if(currTurn >= 10){
        currRound = Round.GAME_OVER;
        currTurn  = 0;
    }
}

function ResetBoard(){
    currRound = Round.START;
    currRank = -1;
    dice.forEach(d=>{
        d.canRoll = true;
        d.value = 0;
    });

    scoreSlots.forEach(s=>{s.forEach(slot=>{slot.value = 0;});});
    submitButton.hide();
}

function rolling(){
    if(currRound == Round.ROLLING){
        if(rollTimer > 0){
           rollTimer-=timeStep;
        }else {
            currRound = Round.FARKLE_CHECK;
            rollTimer = 0;
        }
    }
}