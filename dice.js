let validDice = [];
let validRoll = false;
let rollTimer = 0;

class D6{
    constructor(_x,_y){
        this.x = _x;
        this.y = _y;
        this.value = 0;
        this.r = 8;
        this.pipDist = 20;
        this.angle = 0;
        this.canRoll=true;
    }

    drawOne(){
        circle(0,0,this.r);
    }

    drawTwo(){
        circle(-this.pipDist,-this.pipDist,this.r);
        circle( this.pipDist, this.pipDist,this.r);
    }

    drawThree(){
        circle(-this.pipDist,-this.pipDist,this.r);
        circle( this.pipDist, this.pipDist,this.r);
        circle(0,0,this.r);
    }

    drawFour(){
        circle(-this.pipDist,-this.pipDist,this.r);
        circle( this.pipDist, this.pipDist,this.r);
        circle(-this.pipDist, this.pipDist,this.r);
        circle( this.pipDist,-this.pipDist,this.r);
    }

    drawFive(){
        circle(-this.pipDist,-this.pipDist,this.r);
        circle( this.pipDist, this.pipDist,this.r);
        circle(-this.pipDist, this.pipDist,this.r);
        circle( this.pipDist,-this.pipDist,this.r);
        circle(0,0,this.r);
    }

    drawSix(){
        circle(-this.pipDist,-this.pipDist,this.r);
        circle( this.pipDist, this.pipDist,this.r);
        circle(-this.pipDist, this.pipDist,this.r);
        circle( this.pipDist,-this.pipDist,this.r);
        circle( this.pipDist,0,this.r);
        circle(-this.pipDist,0,this.r);
    }

    checkClick(){
        if(currRound != Round.SCORING) return;
        if(this.value<1 || this.value>6) return;
        if(mouseX< this.x - 32 || mouseX> this.x + 32) return;
        if(mouseY< this.y - 32 || mouseY> this.y + 32) return;
        this.sendToScore();
    }

    sendToScore(){
        this.setDice(scoreSlots[currRank]);
        this.canRoll = false;
    }

    setDice(obj){
        let foundDice = false;
        let die;
        obj.forEach(d=>{
            if(d.value == 0 && !foundDice){
                d.value = this.value;
                foundDice = true;
                die = d;
            }
        });

        this.value = 0;
        this.overlay = false;
        let values = [];
            
        scoreSlots[currRank].forEach(e => {
            values.push(e.value);
        });

        score = CheckScore(values);

        let extraScore = 0;
            if(currRank == 3)extraScore = 100;
            if(currRank == 4)extraScore = 500;
            if(currRank == 5)extraScore = 1000;
            score += extraScore;
        checkValid();
        return die;
    }

    draw(){
        if(this.canRoll && this.value > 0 && currRound == Round.ROLLING){
            this.angle+=timeStep;
            if(this.angle%60 == 0){
                this.value = floor(random(6)+1);

            }
        } else {
            this.angle = 0;
        }

        rectMode(CENTER);
        push();
        translate(this.x,this.y);
        rotate(this.angle * PI / 180);
        if(this.value > 0 && this.value <= 6){
            fill(255,255,255);
            rect(0,0,64,64,10);
            fill(0,0,0);

            switch(this.value){
                case 1:
                    this.drawOne();
                    break;
                case 2:
                    this.drawTwo();
                    break;
                case 3:
                    this.drawThree();
                    break;
                case 4:
                    this.drawFour();
                    break;
                case 5:
                    this.drawFive();
                    break;
                case 6:
                    this.drawSix();
                    break;
                default:
                    noFill();
                    break;
            }
        } else {
            fill(255,255,255,50)
            rect(0,0,64,64,10);
        }

        pop();
    }
}


class ScoreSlot extends D6{
    constructor(_x,_y){
        super(_x,_y);
        this.canRoll=false;
        this.value = 0;
        this.overlay = false;
    }

    checkClick(){
        if(this.value<1 || this.value>6) return;
        if(mouseX< this.x - 32 || mouseX> this.x + 32) return;
        if(mouseY< this.y - 32 || mouseY> this.y + 32) return;
        this.sendBack();
    }

    sendBack(){
        this.overlay = false;
        let d = this.setDice(dice);
        if(d != undefined) d.canRoll = true;

        let extraScore = 0;
            if(currRank == 3)extraScore = 100;
            if(currRank == 4)extraScore = 500;
            if(currRank == 5)extraScore = 1000;
            score -= extraScore;
    }

    draw(){
        super.draw();
        if(this.overlay){
            fill(0,0,0,100);
            rect(this.x,this.y,64,64,10);
        }
    }
}

function CheckScore(values){
    if(values.length == 0 || values == undefined) return -1;
    
    let counts = [[],[],[],[],[],[]];
    validDice.length = 0;

    for(let i = 0; i < values.length; i++){
        if(values[i] > 0 ){
            counts[values[i] - 1].push(i);
        }
        validDice.push(0);
    }

    let straight = true;
    let sextuple = -1;
    let quintuple = -1;
    let quadruple = -1;
    let triples = [];
    let pairs = [];
    let ones = counts[0];
    let fives = counts[4];
    

    for(let i = 0; i < counts.length; i++){
        let c = counts[i];

        if(c.length != 1) straight = false;
        
        if(c.length == 6){
            sextuple = i;
            break;
        }

        if(c.length == 5){
            quintuple = i;
            break;
        }
        
        if(c.length == 4){
            quadruple = i;
        }
        
        if(c.length == 3){
            triples.push(i);
        }

        if(c.length == 2){
            pairs.push(i);
        }
    }

    let sum = 0;

    //double triple
    if(triples.length == 2){
        validDice = [1,1,1,1,1,1];
        return 2500;
    }

    //sextuple
    if(sextuple >= 0){
        validDice = [1,1,1,1,1,1];
        return 3000;
    }

    if(quintuple >= 0){
        counts[quintuple].forEach(v=>{
            validDice[v] = 1;
        });

        sum = 2000;
    }

    //straight
    if(straight){
        validDice = [1,1,1,1,1,1];
        return 1500;
    }

    if(pairs.length == 3){
        validDice = [1,1,1,1,1,1];
        return 1500;
    }

    if(quadruple >= 0){
        if(pairs.length > 0){
            validDice = [1,1,1,1,1,1];
            return 1500;
        }

        counts[quadruple].forEach(v=>{
            validDice[v] = 1;
        });
        sum = 1000;
    }
    

    if(triples.length == 1){
        counts[triples[0]].forEach(v=>{
            validDice[v] = 1;
            
        });

        diceUsed = 3;

        if(triples[0] > 0) 
        {
            sum = 100 * (triples[0]+1);
        } else {
            sum = 300;
        } 
    }

    if(ones.length > 0 && ones.length < 3){
        counts[0].forEach(v=>{
            validDice[v] = 1;
        });
        sum+=ones.length * 100;
    }

    if(fives.length > 0 && fives.length < 3){
        counts[4].forEach(v=>{
            validDice[v] = 1;
        });
        sum+=fives.length * 50;
    }

    return sum;
}

function checkValid(){
    validRoll = true;
    for (let index = 0; index < validDice.length; index++) {
        const v = validDice[index];
        if(v == 0 && scoreSlots[currRank][index].value > 0){
            scoreSlots[currRank][index].overlay = true;
            validRoll = false;
        }
        if(v == 1){
            scoreSlots[currRank][index].overlay = false;
        }
    }
}