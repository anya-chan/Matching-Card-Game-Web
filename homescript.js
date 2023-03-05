var submit = document.getElementById("submit_cardnum");
var inputvalue = document.getElementsByClassName("input-value")[0];
var card_container = document.getElementsByClassName("card-container")[0];
var win_container = document.getElementsByClassName("win")[0];
var input_container = document.getElementsByClassName("input-container")[0];
var score = document.getElementsByClassName("score-value")[0];
var msg = document.getElementById("warning-msg");

var myCardArr = []; //card array to store three cards that selected by users
var canFlip = true; 
var cards, card_back, card_front;
var win = false;
var matched = 0;

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("instruction");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//add card function
function addCard(cardnum)
{
    card_container.innerHTML = "";
    for(i = 0; i< cardnum; i++){
        cards = document.createElement("div");
        cards.classList.add("card"); //cards classname = "card"
        card_back = document.createElement("div");
        card_back.classList.add("card-back"); //card_back classname = "card-back"
        card_back.classList.add("card-face");
        card_front = document.createElement("div");
        card_front.classList.add("card-front"); //card_front classname = "card-front"
        card_front.classList.add("card-face");

        var img = new Image(); //create an image object
        img.src = "https://cdn.dribbble.com/users/508142/screenshots/16826165/media/07afbd412056374080d3b1896cf324b5.jpg?compress=1&resize=1600x1200&vertical=top";
        img.width = "90";
        img.height = "80";
        card_back.append(img);

        let node = document.createTextNode(Math.floor(i/3)); //create card with same number for every 3 cards
        card_front.appendChild(node);
        cards.appendChild(card_back); 
        cards.appendChild(card_front); //add front and back card under cards block
        card_container.appendChild(cards); //add cards under card container
    }
}

function flipCard(eachCard) {
    eachCard.classList.add('visible'); //add a class name called visible to match the css
}

function restart(){
    matched = 0; //reset the matched count
    input_container.style.display = "flex"; //show the input container
}

function endGame(){
    card_container.innerHTML = ""; //to invisible the card container
    win_container.style.display = "flex"; //visible the winning message
    restart();
}

function flipback(){
    for(let j = 0; j < 3; j++){
        myCardArr[j].classList.remove('visible'); //remove visible class to flip the card back
        myCardArr[j].classList.remove("clicked"); //remove clicked class to allow clickable action
    }
    myCardArr = []; //reset the card array
}

function misMatched(){
    if(parseInt(score.innerText) >= 1) //if score larger or equal to 1 score, then minus 1 score
        score.innerText = parseInt(score.innerText) - 1; 
    flipback();
}

async function isMatched(userinput){

    const result = await new Promise(resolve => { //wait for 0.5s
        setTimeout(()=>{
            resolve('resolved');
        }, 500);
    })

    let myCardValueArr = [];
    for(let o = 0 ; o < 3; o++){
        myCardValueArr.push(myCardArr[o].innerText); //store the card number
    }

    let set = new Set(myCardValueArr);

    if(set.size === 1){ //if set size = 1, three card numbers are the same, a pair matched
        for(var i = 0; i < myCardArr.length; i++){
            myCardArr[i].style.border = "1.5px solid green"; //set border to green
        }
        const result = await new Promise(resolve => { //wait for 0.2s
            setTimeout(()=>{
                resolve('resolved');
            }, 200);
        })
        matched = matched + 1; //record how much pairs matched
        score.innerText = parseInt(score.innerText) + 1; //update score
        if(matched == userinput/3) { //if all matched, win
            win = true;
            endGame();
        }
        myCardArr = [];
    }
    else {
        misMatched(); //not matched
    }
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    let myInterval = setInterval(function () {
        if(win) clearInterval(myInterval);
        else if(--timer == 0) { //if timer = 0, game over
            clearInterval(myInterval);
            card_container.innerHTML = "GAME OVER";
            input_container.style.display = "flex";
        }
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

    }, 1000);
    
}

function shuffle(array){
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); //draw a random index number
        const temp = array[i].innerHTML;

        // Swap current card and drawed index number card
        array[i].innerHTML = array[j].innerHTML;
        array[j].innerHTML = temp;
    }
    return array;
}

submit.addEventListener('click', (event) => {
    //reset all the condition
    win_container.style.display = "none";
    score.innerText = "0";
    var userinput = inputvalue.value;
    win = false;
    msg.innerHTML = "";

    if(userinput != 0 && userinput % 3 == 0){ //if input is valid
        input_container.style.display = "none";
        var time = 5*userinput + 1;
        var display = document.getElementsByClassName("time-value")[0];
        startTimer(time, display);

        addCard(userinput);
        
        var created_cards = document.getElementsByClassName("card");
        created_cards = shuffle(created_cards);

        for (let i = 0; i < created_cards.length; i++) {

            function buttonFunc(index){
                var eachCard = created_cards[index];
                eachCard.addEventListener('click', ()=>{
                    if(myCardArr.length < 3 && canFlip && !eachCard.classList.contains('clicked')){
                        flipCard(eachCard);
                        myCardArr.push(eachCard);
                        eachCard.classList.add("clicked");
                    }
                    if(myCardArr.length === 3 && canFlip){
                        canFlip = false;
                        isMatched(userinput);
                        canFlip = true;
                    }
                }, true)
            }
            buttonFunc(i);
        }

    }
    else{
        msg.innerHTML = "Input should be a multiple of 3, e.g. 3, 6, 9...";
    }
    
});

