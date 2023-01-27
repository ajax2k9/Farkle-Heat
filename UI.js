class Button{
    constructor(_x,_y,_w,_h,_name){
        this.x=_x;
        this.y=_y;
        this.w=_w;
        this.h=_h;
        this.name= _name;
        this.active = true;
        this.pressed = false;
    }

    show(){
        this.active = true;
    }
    
    hide(){
        this.active = false;
    }

    clickFunction(){
        this.pressed= true;
    }

    checkClick(){
        if(this.active == false) return;
        if(mouseX< this.x - this.w / 2 || mouseX> this.x + this.w / 2) return;
        if(mouseY< this.y - this.h / 2 || mouseY> this.y + this.h / 2) return;
    
        this.clickFunction();
    }

    draw(){
        rectMode(CENTER)
        if(this.active == false) return;
        fill(0,255,0);
        noStroke();
        textSize(20)
        rect(this.x,this.y,this.w,this.h,5);
        textAlign(CENTER,CENTER);
        fill(0,0,0)
        text(this.name,this.x,this.y-1);
    }
}

class SubmitButton extends Button{
    constructor(_x,_y,_w,_h){
        super(_x,_y,_w,_h,"submit");
        this.active = false;
    }
    
    clickFunction(){
        if(validRoll == false) return;
        roundScore += score;
        scoreBoard.scores[currTurn] = roundScore;
        score = 0;
        roundScore = 0;
        ResetBoard();
        IncrementTurn();
    }

    draw(){
        rectMode(CENTER)
        if(this.active == false) return;
        fill(255,255,0);
        noStroke();
        rect(this.x,this.y,this.w,this.h,5);
        textAlign(CENTER,CENTER);
        fill(0,0,0)
        textSize(20)
        text(this.name,this.x,this.y-1);
    }
}

class Scoreboard{
    constructor(){
        this.x = 630;
        this.y = 90;
        this.total = 0;

        this.scores = [0,0,0,0,0,0,0,0,0,0];
        
    }

    reset(){
        this.scores = [0,0,0,0,0,0,0,0,0,0];
    }

    draw(){
        rectMode(CORNER)
        fill(20,30,20)
        rect(this.x-40,this.y-15,200,360,10)
        fill(50,30,50)
        rect(this.x-40,this.y-15,80,360,10,0,0,10)

        fill(255,255,255);
        let x = this.x+60;
        let y = this.y;

        let index = 0;
        this.total = 0;
        textSize(20)
        textAlign(RIGHT,CENTER);
        text("Risk",x-30,y);
        textAlign(LEFT,CENTER);
        text(roundScore + score,x - 10,y);
        y+=30;
        this.scores.forEach(s=>{
            index +=1;
            textAlign(RIGHT,CENTER);
            text(index,x-30,y);
            textAlign(LEFT,CENTER);
            text(s,x-10,y);
            y += 30;

            if(s != "FARKLE"){
                this.total +=s;
            }
        });

        textAlign(RIGHT,CENTER);
        text("total",x-30,y);
        textAlign(LEFT,CENTER);
        text(this.total,x-10,y);

    }
}

class OkButton extends Button{
    constructor(_x,_y,_callback){
        super(_x,_y,50,20,"OK");
        this.active = false;
        this.callback = _callback;
    }
    
    clickFunction(){
        if(this.callback != undefined){
            this.callback();
        }
    }

    draw(){
        if(this.active == false) return;
        fill(0,255,0);
        noStroke();
        rectMode(CENTER);
        rect(this.x,this.y,this.w,this.h,5);
        textAlign(CENTER,CENTER);
        fill(0,0,0)
        textSize(16)
        text(this.name,this.x,this.y);
    }
}

class HelpButton extends Button{
    constructor(_x,_y,_callback){
        super(_x,_y,50,20,"help");
        this.callback = _callback;
    }
    
    clickFunction(){
        helpWindow.show();
    }

    draw(){
        textSize(20);
        textFont("Arial")
        text("❔",this.x,this.y);
        textFont(myFont)
    }
}

class GameOverWindow{
    constructor(_x,_y){
        this.button = new OkButton(_x,_y + 40,()=>{newGame = true;});
        this.x=_x;
        this.y=_y;
        this.active = false;
    }

    show(){
        this.active = true;
    }

    hide(){
        this.active = false;
    }

    draw(){
        this.button.active = this.active;
        if(!this.active) return;
        fill(0,100,0);
        stroke(255,255,255);
        strokeWeight(1);
        rect(this.x,this.y,300,110,5);
        textAlign(CENTER,CENTER);
        noStroke();
        fill(255,255,255);
        
        text("GAME OVER! \nYour final score was:",this.x,this.y-30);
        textSize(30);
        text(scoreBoard.total,this.x,this.y+10);
        this.button.draw();
    }
}

class HelpWindow{
    constructor(_x,_y){
        this.button = new OkButton(_x,_y + 200,()=>{this.active = false;});
        this.x=_x;
        this.y=_y;
        this.active = false;
    }

    show(){
        this.active = true;
    }

    hide(){
        this.active = false;
    }

    draw(){
        this.button.active = this.active;
        if(!this.active) return;
        fill(0,100,0);
        stroke(255,255,255);
        strokeWeight(1);
        rect(this.x,this.y,620,450,5);
        noStroke();
        fill(255,255,255);
        textAlign(CENTER,TOP);
        textSize(16)
        text("HOW TO PLAY",this.x,this.y - 220)
        textAlign(LEFT,TOP);
        let helpStr = "1) roll the dice\n"+
                      "2) make any scoring combination(shown below)\n"+
                      "3) roll again, or submit your round score if its over 300pts\n"+
                      "4) if no scoring rolls can be made , you score 0 points that turn (FARKLE)\n"+
                      "5) if you use all dice in one round, you can roll all six again and accumulate more points!\n"+
                      "6) in this version of Farkle, you score bonus points if you make 4 or more rolls per round\n\n";
        let scoreStr = "Ones : 100 pts each\n"+
                      "Fives : 50 pts each\n"+
                      "1 1 1 : 300\n"+
                      "x x x : 100 * x  for x > 1\n"+
                      "three pairs: 1500\n"+
                      "double triples: 2500\n"+
                      "four of a kind: 1000\n"+
                      "four of a kind with a pair: 1500\n"+
                      "four of a kind with a pair: 1500\n"+
                      "five of a kind: 2000\n"+
                      "six of a kind: 3000\n"+
                      "straight: 1500\n"

        text(helpStr,this.x+10,this.y- 190,600);

        textAlign(CENTER,TOP);
        text("SCORING ROLLS",this.x,this.y - 40);
        textAlign(LEFT,TOP);
        text(scoreStr,this.x+10,this.y-20,600);
       
        this.button.draw();
    }
}