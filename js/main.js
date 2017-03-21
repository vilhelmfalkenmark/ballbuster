/*
VÄLKOMMEN HIT! Kul att du vill kolla in vår kod!
Har du några frågor eller funderingar är du/ni varmt välkommen att höra av er till
Fredrik: fFr3drik.L@gmail.com
Vilhelm: vilhelmfalkenmark@gmail.com
*/


//Plockar in canvas elementet
var playField = document.getElementById("playField").getContext("2d");
var redColor = "#E74C3C";
var greenColor = "#1BBC9B";

var gameContainer = document.getElementById("game-container"); // Diven som hela spelet ligger i.
gameContainer.style.display ="none";

var introContainer = document.getElementById("intro-container");
document.getElementById("startGame").addEventListener("click",startGame);

/**
 * Storleken på canvas
 */
var playfieldHeight = document.getElementById("playField").height;
var playfieldWidth = document.getElementById("playField").width;

/**
 * Alla element som har med spelinfo containern att göra
 */
var infoContainer = document.getElementById('infoContainer');
var levelCounter = document.getElementById("level");
var accuracy = document.getElementById("accuracy");
var totalShotsFired = document.getElementById("totalShotsFired");
var specialShotsFired = document.getElementById("specialShotsFired");
var collisionCounter = document.getElementById("collisionCounter");
var button = document.getElementById('buttonSelector');
var buttonText = document.getElementById('buttonText');

var levelInfo = document.getElementById("levelInfo");
var highscoreSignUpContainer = document.getElementById("highscoreSignUpContainer");

var accuracyHS = document.getElementById("accuracyHS");
var totalShotsFiredHS = document.getElementById("totalShotsFiredHS");
var pistolShotsFiredHS = document.getElementById("pistolShotsFiredHS");
var specialShotsFiredHS = document.getElementById("specialShotsFiredHS");
var collisionCounterHS = document.getElementById("collisionCounterHS");


var hiddenAccuracy = document.getElementById("hiddenAccuracy");
var hiddenTotalShotsFired = document.getElementById("hiddenTotalShotsFired");
var hiddenSpecialShotsFired = document.getElementById("hiddenSpecialShotsFired");
var hiddenPistolShotsFired = document.getElementById("hiddenPistolShotsFired");


/**
 * Alla element som visar statusen på tid / ammo och hälsa
 */
var healthBar = document.getElementById("health-bar");
var healthCounter = document.getElementById("health");
var timer = document.getElementById("timer");
var ammoSelect = document.getElementById('ammoSelect');
var ammoSelectColor = document.getElementById("ammoSelectColor");
var displayAmmo = document.getElementById("ammo-info");
var ammoImage = document.getElementById("ammoImage");
var powerAmmoImage = document.getElementById("powerAmmoImage");
var specialAmmoSelectColor = document.getElementById("specialAmmoSelectColor");
var displayPowerAmmo = document.getElementById("power-ammo-info");

powerAmmoImage.style.display = "none";
ammoImage.style.display = "none";

/**
 * Element för info under utveklingsfasen
 */
var ballCounter = document.getElementById("ballCounter");
var ammoCounter = document.getElementById("ammoCounter");
var powerShotsCounter = document.getElementById("powerShotsCounter");
var frame = document.getElementById("frame");

/**
 * Variabler med bilder
 */
var backGrounds = ["pixelBG2.jpg", "fantasy.png", "forest.png", "desert.png"];
var playFieldBackground = document.getElementById("playField");
var shotsFired = document.getElementById("shotsFired");
var healthImage = document.getElementById("healthImage");
var shotImage = document.getElementById("shotImage");
var specialShotImage = document.getElementById("specialShotImage");

/**
 * Skott Variabler
 */
var shotList = {};
var powerShotList = {};
var powerShotAvailabe = 0;
var typeOfShot = "pistol";
var ammoLeft = 10;

/**
 * Boll variabler
 */
var bigBallRadius = 60;
var mediumBallRadius = 40;
var smallBallRadius = 20;
var bouncingBalls = {};

/**
 * Boolean variabler
 */
var powerUp = false;
var restart = false;
var lockPlayer = false;
var levelComplete = false;

/**
 * Variabler som ändras när man klarar en bana!
 */
var ballSpeed = 0.2;
var healthGenerate = 12;
var ammoGenerate = 9;
var specialAmmoGenerate = 13;

/**
 * Variabler som kontrolerar timing / spawnfrekvens / level
 */
var hitPerLevel = 0;
var time = 0;
var frameCount = 0;
var groundHeight = 32; // Höjden på marken i bilden.
var level = 1;
var j = 0; //variabel för att begränsa hur många bollar som genereras per bana
var strafeX = 260;

/**
 * Sounds
 */
var soundCounter = 0;
var soundController = document.getElementById("soundController"); // Själva knappen för att stänga på/av ljud
var toggleSoundText = document.getElementById("toggleSoundText"); // Texten i ljud på/av knappen


var pop = new Audio();
pop.src = "sound/popSound.mp3";
var shotSound = new Audio();
shotSound.src = "sound/pistolShot.mp3";
var specialShotSound = new Audio();
specialShotSound.src = "sound/shotgunShot.mp3";
var reload = new Audio();
reload.src = "sound/reload.wav";
var healthSound = new Audio();
healthSound.src = "sound/getHealth.wav";
var damageSound = new Audio();
damageSound.src = "sound/damageSound.wav";
var shotgunAmmo = new Audio();
shotgunAmmo.src = "sound/shotgunreload.wav";

var levelCompleteSound = new Audio();
levelCompleteSound.src = "sound/nicework.wav";

var gameOverSound = new Audio();
gameOverSound.src = "sound/boo.mp3";

var gameCompleteSound = new Audio();
gameCompleteSound.src = "sound/gameComplete.mp3";

/**
 * Döljer element från DOM:et
 */
ammoSelect.style.backgroundColor = greenColor;
healthImage.style.display ="none";
shotImage.style.display ="none";
specialShotImage.style.display ="none";

/**
 * Skapar spelaren med dess startvärden
 */
var player = new Image();
player.src = "images/villeSprite4.png"; 
player.left = false;
player.right = false;
player.health = 100;
player.height = 75;
player.width = 65; //
player.PositionValueX = 100;
player.PositionValueY = playfieldHeight - 75 - groundHeight;
player.animateX = (player.width) - 25;
player.animateY = player.height;

function startGame() {
    introContainer.style.display ="none";
    gameContainer.style.display ="block";

playFieldBackground.style.background = 'url("images/' + backGrounds[level-1] + '")';

    /**
     *
     *<======= Kolla Ljud =======>
     *
     */
    soundController.addEventListener("click",toggleSound);

    function toggleSound()
    {
        soundCounter++;

        if(soundCounter%2==0)
        {
            soundController.className ="soundOnButton";
            toggleSoundText.innerHTML = "Sound On";
        }
        else
        {
            soundController.className ="soundOffButton";
            toggleSoundText.innerHTML = "Sound Off";
        }
    }


    /**
     *
     *<======= STARTA TIMERS! =======>
     *
     */
    function updateTime() {
        time++;
        document.getElementById("timer").innerHTML = time;
        if (time % 10 === 0) {
            ammoLeft += 2; // Man får alltid två skott var tionde sekund
        }
        return time;
    }

    function updateFrameCount() {
        frameCount++;
        frame.innerHTML = frameCount;
        return frameCount;
    }

    setInterval(function () {
        hit = false;
    }, 400);
    function playerHit(hit) {
        if (hit) {
            if(soundCounter%2==0) {
                damageSound.play();
                healthBar.className = "";
            }
            player.health--;
            checkHealth(player.health);
        }
    }
    /* FLYTTAR PÅ SPELAREN */
    document.onkeydown = function (keyPress) {
        if (keyPress.keyCode === 37 && lockPlayer === false) {
            // Move left
            player.left = true;
        }
        if (keyPress.keyCode === 39 && lockPlayer === false) {
            // Move right
            player.right = true;

        }
        if (player.right === false && player.left === false) {

            if(typeOfShot === "pistol")
            {
             strafeX = 260;
            }
            else
            {
                strafeX = 845;
            }
        }
        // Shoot spacebar
        if (keyPress.keyCode === 32 && lockPlayer === false) {
          shoot(typeOfShot);
            if(typeOfShot === "pistol")
            {
                strafeX = 260;
            }
            else
            {
                strafeX = 845;
            }
        }
        // Shoot selector uparrow
        if (keyPress.keyCode === 38) {

          typeOfShot === "pistol" ?

          (typeOfShot = "shotgun",
           ammoSelect.style.backgroundColor = "#fff",
           ammoSelectColor.style.color =greenColor,
           specialAmmoSelect.style.backgroundColor = greenColor,
           specialAmmoSelectColor.style.color = "#fff"
          )
              :
           (typeOfShot = "pistol",
               ammoSelectColor.style.color = "#fff",

            ammoSelect.style.backgroundColor = greenColor,
            specialAmmoSelect.style.backgroundColor = "#fff",
            specialAmmoSelectColor.style.color = greenColor
           );
        }
    };
    document.onkeyup = function (keyPress) {
        if (keyPress.keyCode === 37) {
            // Move left
            player.left = false;

            if(typeOfShot == "pistol")
            {
            strafeX = 260;
            }
            else
            {
                strafeX = 845;
            }
        }
        if (keyPress.keyCode === 39) {
            // Move right
            player.right = false;
            if(typeOfShot == "pistol")
            {
                strafeX = 260;
            }
            else
            {
                strafeX = 845;
            }
        }
    };
    function playerPosition() {
        if (player.left) {
            player.PositionValueX -= 10; //fart på spelaren

            if(typeOfShot == "shotgun")
            {
                strafeX = (65*frameCount)+585;

                if(frameCount>4)
                {
                    frameCount = 0;
                }
            }
            else
            {
                strafeX = 65*frameCount;

                if(frameCount>=4)
                {
                    frameCount = 0;
                }
            }
        }
        if (player.right) {
            player.PositionValueX += 10; //fart på spelaren

            if(typeOfShot == "shotgun")
            {
                strafeX = (65*frameCount)+845;

                if(frameCount>4)
                {
                    frameCount = 0;
                }
            }
            else
            {
                strafeX = (65*frameCount)+260;
                if(frameCount>=4)
                {
                    frameCount = 0;
                }
            }
        }
        // Spelaren kan inte röra sig utanför spelplane
        if (player.PositionValueX < 0) {
            player.PositionValueX = 0;
        }
        if (player.PositionValueX > playfieldWidth - player.width) {
            player.PositionValueX = playfieldWidth - player.width;
        }
    }

    /**
     *
     *<======= ALLTING SOM HAR MED BOLLARNA ATT GÖRA =======>
     *
     */
    var numberOfCollisions = 0;
    var ballColors = ["#3D4A5D","#1E824C","#D35400"];
    //document.getElementById("startGame").addEventListener("click", startGame);

    function bouncingBall(ballSize, startX, startY,speedX,color) {

        this.ballRadius = ballSize;
        this.PositionValueX = startX;
        this.PositionValueY = startY;
        this.speedXAxis = speedX;
        this.speedYAxis = Math.round((Math.random() * ballSpeed) + 1);
        this.hexColorCode = ballColors[color];
    }

    var i = 0;

    function addBalls(sizeofHitBall, startX, startY,speedX,color) {
        bouncingBalls["ball" + i] = new bouncingBall(sizeofHitBall, startX, startY,speedX,color);
        i++;
    }

    function updateEntity(ball) {
        ball.PositionValueX += ball.speedXAxis;
        ball.PositionValueY += ball.speedYAxis;

        playField.beginPath();
        playField.fillStyle = ball.hexColorCode;
        playField.arc(ball.PositionValueX, ball.PositionValueY, ball.ballRadius, 0, Math.PI * 2, true);
        playField.closePath();
        playField.fill();

        var bounceBordersX = ball.PositionValueX < ball.ballRadius || ball.PositionValueX > playfieldWidth - ball.ballRadius;
        var bounceBordersY = ball.PositionValueY < ball.ballRadius || ball.PositionValueY > playfieldHeight - ball.ballRadius - groundHeight;
        var playerGetsHit = (ball.PositionValueY > playfieldHeight - player.height - ball.ballRadius && ((player.PositionValueX + player.width / 2) > ball.PositionValueX - ball.ballRadius && (player.PositionValueX + player.width / 2) < ball.PositionValueX + ball.ballRadius));

            if (bounceBordersX) {
                ball.speedXAxis = -ball.speedXAxis;
            }
            if (bounceBordersY) {
                ball.speedYAxis = -ball.speedYAxis;
            }

                if(playerGetsHit)
                {
                    hit = true;
                    playerHit(hit);
                }
    }
    function getDistanceBetweenEntity(shot, ball) {     //return distance (number)
        var vx = shot.PositionValueX - ball.PositionValueX;
        var vy = shot.PositionValueY - ball.PositionValueY;
        return Math.sqrt(vx * vx + vy * vy);
    }
    function testCollisionEntity(shot, ball) {  //return if colliding (true/false)
        var distance = getDistanceBetweenEntity(shot, ball);
        return distance < ball.ballRadius;
    }
    /**
     *
     *<======= ALLTING SOM HAR MED SKOTTEN ATT GÖRA =======>
     *
     */
     function shoot(type){
       if(type === "pistol"){
         if (ammoLeft > 0) {
             generateShot(player.PositionValueX);
             ammoLeft--;

             if(soundCounter%2==0)
             {
                 shotSound.play();
                 shotSound.currentTime=0;
             }
             strafeX = 260+(65*5)
         }
       }
       else if(type === "shotgun"){
         if (powerShotAvailabe > 0) {
             generatePowerShot(player.PositionValueX);
             powerShotAvailabe--;


             if(soundCounter%2==0)
             {
             specialShotSound.play();
             specialShotSound.currentTime=0;
             }


             strafeX = 260+(65*6)
            // powerShotsCounter.innerHTML = powerShotAvailabe;
         }
       }
     }
    var shotNr = 0;
    function generateShot(playerX) {
        var shot =
        {
            PositionValueX: playerX + 11,
            PositionValueY: playfieldHeight - groundHeight-player.height-10,
            width: 12,
            height: 20,
            color: "black",
            img: shotImage
        };
        shotList["shot" + shotNr] = shot;
        if(player.health>0)
        {
        shotNr++;
        shotsFired.innerHTML = shotNr;
        }
        countTotal()
    }
    var PowershotNr = 0;
    function generatePowerShot(playerX) {
        var powerShot1 = {
            id: 1,
            PositionValueX: playerX+20,
            PositionValueY: playfieldHeight - groundHeight-player.height,
            width: 10,
            height: 10,
            img: specialShotImage
        };
        var powerShot2 = {
            id: 2,
            PositionValueX: playerX+10,
            PositionValueY: playfieldHeight - groundHeight-player.height,
            width: 10,
            height: 10,
            img: specialShotImage
        };
        var powerShot3 = {
            id: 3,
            PositionValueX: playerX+15,
            PositionValueY: playfieldHeight - groundHeight-player.height,
            width: 10,
            height: 10,
            //color: "black"
            img: specialShotImage
        };
        powerShotList["PowerShot" + PowershotNr] = powerShot1;
        PowershotNr++;

        powerShotList["PowerShot" + PowershotNr] = powerShot2;
        PowershotNr++;
        powerShotList["PowerShot" + PowershotNr] = powerShot3;
        PowershotNr++;
        specialShotsFired.innerHTML = (PowershotNr/3);
        countTotal()
    }

    function countTotal()
    {
        totalShotsFired.innerHTML = parseInt(specialShotsFired.innerHTML)+parseInt(shotsFired.innerHTML);
    }

    // Förflyttar skotten i y-axeln och om det går utanför y axeln så tas de bort ur objektet
    function animateShots(object) {
        object.PositionValueY -= 22; //fart på skotten
        if (object.id == 1) {
            object.PositionValueX -= 5;
        }
        if (object.id == 2) {
            object.PositionValueX += 5;
        }
    }
    function TestShotHits(list, object) {
        for (var key in object) {

            updateEntity(object[key]);

            // KOLLAR OM SKOTTEN TRÄFFAR
            for (var k in list) {
                var isColliding = testCollisionEntity(list[k], object[key]);
                if (isColliding) {

                    if(soundCounter%2==0) {
                        pop.play();
                        pop.currentTime = 0;
                    }
                    if (object[key].ballRadius == 60) {
                        addBalls(mediumBallRadius, object[key].PositionValueX + 20, object[key].PositionValueY, (Math.random() * object[key].speedXAxis) + 1, 1);
                        addBalls(mediumBallRadius, object[key].PositionValueX - 20, object[key].PositionValueY, ((Math.random() * object[key].speedXAxis) + 1) * -1,1);
                    }
                    if (object[key].ballRadius == 40) {
                        addBalls(smallBallRadius, object[key].PositionValueX + 10, object[key].PositionValueY, (Math.random() * object[key].speedXAxis) + 1,2);
                        addBalls(smallBallRadius, object[key].PositionValueX - 10, object[key].PositionValueY, ((Math.random() * object[key].speedXAxis) + 1)* -1,2);
                    }
                    delete object[key]; // Tar bort bollen som träffar texten!
                    delete list[k]; // Tar bort bollen som träffar texten!EB974E
                    numberOfCollisions++;
                    hitPerLevel++;
                }
                else if (list[k].PositionValueY < 0) {
                    delete list[k]; // Tar bort bollen som träffas!
                }
            }
        }
    }
    /**
     *
     *<======= ALLTING SOM HAR MED UPPGRADERINGAR ATT GÖRA =======>
     *
     */
    // Math.floor(Math.random()*(max-min+1)+min);
    function upgrade(width, height, type,img) {
        this.width = width;
        this.height = height;
        this.type = type;
        this.img = img;
        this.PositionValueX = Math.floor(Math.random() * (((playfieldWidth-30) - this.width) - this.width)) + this.width; // Talet 30 är marginal Så att den alltid hamnar så att spelaren kan ta den.
        this.PositionValueY = playfieldHeight - this.height - groundHeight;
    }
    var upgrades = {};
    var upgradeCounter = 0;

    function addUpgrades(width, height, type, img) {
        upgrades["upgrade" + upgradeCounter] = new upgrade(width, height, type, img);
        upgradeCounter++;
    }
    function deleteUpgrades() {
        upgrades = {};// console.log(upgrades)
    }
    /**
     *
     *<======= RITA UT SKOTT, PLAYER & UPPGRADERING =======>
     *
     */
    function drawObject(object) {
        playField.fillStyle = object.color;
        playField.fillRect(object.PositionValueX, object.PositionValueY, object.width, object.height);
    }
     function drawImages(item)
     {
     playField.drawImage(item.img, item.PositionValueX,item.PositionValueY);
     }
    /**
     *
     *<======= UPPDATERING SOM KÖRS VAR 20 millisekund =======>
     *
     */

    function update() {

        ballCounter.innerHTML = Object.keys(bouncingBalls).length; // Kollar hur många bollar som är på planen för att avgöra när man klarat en bana!
        playField.clearRect(0, 0, playfieldWidth, playfieldHeight);
        //Kontrolerar så att hälsan inte kan bli mer än 100
        if(player.health > 100){
          player.health = 100;
        }
        //Uppdaterar hälsan

        healthBar.style.width = player.health + "%";
        collisionCounter.innerHTML = numberOfCollisions;
        var accuracyCounter = ((collisionCounter.innerHTML)/(totalShotsFired.innerHTML)*100).toFixed(0);

        if(shotNr == 0 && PowershotNr == 0)
        {
            accuracy.innerHTML = 0;
        }
        else if(accuracyCounter<=100)
        {
            accuracy.innerHTML = accuracyCounter
        }
        else if(accuracyCounter>100)
        {
            accuracy.innerHTML = 100;
        }
        var accuracyCounter = ((collisionCounter.innerHTML)/(totalShotsFired.innerHTML)*100).toFixed(0);

        if(shotNr == 0 && PowershotNr == 0)
        {
            accuracy.innerHTML = 0;
        }
        else if(accuracyCounter<=100)
        {
        accuracy.innerHTML = accuracyCounter
        }
        else if(accuracyCounter>100)
        {
            accuracy.innerHTML = 100;
        }
        ammoCounter.innerHTML = ammoLeft;
        powerShotsCounter.innerHTML = powerShotAvailabe;
        displayAmmo.innerHTML = ammoLeft;
        displayPowerAmmo.innerHTML = powerShotAvailabe;
        healthCounter.innerHTML = player.health;
        levelCounter.innerHTML = level;

        for (var upgrade in upgrades)
        {
            drawImages(upgrades[upgrade]);
        }
       // drawImages(shot);
        playerPosition(); //updaterar spelaren
        playField.drawImage(player,strafeX,0,player.width,player.height,player.PositionValueX,player.PositionValueY,player.width,player.height);
        for(var item in upgrades) {

            var distanceBetweenPlayerAndUpgrade = (playfieldWidth-player.PositionValueX)-(playfieldWidth-upgrades[item].PositionValueX);
            var marginal = 10; //
            if(distanceBetweenPlayerAndUpgrade>-marginal && distanceBetweenPlayerAndUpgrade<marginal && upgrades[item].type === "Ammo")
            {
               // console.log("AMMO!");
                ammoLeft += 10;
                if(soundCounter%2==0) {

                    reload.play();
                    reload.currentTime = 0;
                }
                delete upgrades[item];
            }
            else if(distanceBetweenPlayerAndUpgrade>-marginal && distanceBetweenPlayerAndUpgrade<marginal && upgrades[item].type === "Health")
            {
                healthBar.className = "smoothTrans";
               // console.log("Health!");
                player.health += 30;
                if(soundCounter%2==0) {
                healthSound.play();
                healthSound.currentTime=0;
                }
                delete upgrades[item];
            }
            else if(distanceBetweenPlayerAndUpgrade>-marginal && distanceBetweenPlayerAndUpgrade<marginal && upgrades[item].type === "PowerShot")
            {
               // console.log("PowerShot!");
                powerShotAvailabe += 8; // HUR MÅNGA POWERSHOTS MAN FÅR VID UPPGRADERING!
                if(soundCounter%2==0) {
                    shotgunAmmo.play();
                    shotgunAmmo.currentTime = 0;
                }
                delete upgrades[item];
                hitPerLevel = 0;

            }
        }
        //UPPDATERAR SKOTTPOSITIONEN FÖR VARJE SKOTT I OBJEKTET
        for(var shot in shotList){
            animateShots(shotList[shot]);
        }
        // RITA UT SKOTTEN
        for(var key in shotList){
            drawImages(shotList[key]);
        }
        for(var power in powerShotList){
            animateShots(powerShotList[power]);
        }
        // RITA UT SKOTTEN
        for(var powerS in powerShotList){
            drawImages(powerShotList[powerS]);
        }
        // RITA UT BOLLARNA SAMT KOLLAR OM SKOTTEN TRÄFFAR
        TestShotHits(shotList,bouncingBalls);
        TestShotHits(powerShotList,bouncingBalls);

          // Kontrolerar om banan är avklarad
          if(Object.keys(bouncingBalls).length === 0 && levelComplete === true){
            infoContainer.style.display = "block";
            statusText.innerHTML = "Level complete!";
            infoContainer.style.backgroundColor = greenColor;
            buttonText.innerHTML = "Next Level";
            lockPlayer = true;
          }
        TestShotHits(shotList,bouncingBalls);
        TestShotHits(powerShotList,bouncingBalls);
        /* KLARAT SPELET */
        if(level > 4){
            if(soundCounter%2==0) {

                gameCompleteSound.play();
            }
            gameCompleteSound.currentTime = 0;
              clearInterval(startUpdate);
              clearInterval(startTime);

            if(accuracyCounter>100)
            {
                accuracyCounter = 100;
            }
            accuracyHS.innerHTML = accuracyCounter;
            totalShotsFiredHS.innerHTML = totalShotsFired.innerHTML;
            pistolShotsFiredHS.innerHTML = shotsFired.innerHTML;
            specialShotsFiredHS.innerHTML = specialShotsFired.innerHTML;
            collisionCounterHS.innerHTML = collisionCounter.innerHTML;

            hiddenAccuracy.value=accuracyCounter;
            hiddenTotalShotsFired.value = totalShotsFired.innerHTML;
            hiddenPistolShotsFired.value=shotsFired.innerHTML;
            hiddenSpecialShotsFired.value=specialShotsFired.innerHTML;

            levelInfo.style.display="none";
            infoContainer.style.display ="block";
            highscoreSignUpContainer.style.display="block";


          lockPlayer = true;
          restart = true;
        }
    }
    function checkHealth(health)
    {
        if(health <= 0)
        {   if(soundCounter%2==0) {

            gameOverSound.play();
            gameOverSound.currentTime = 0;
        }

            clearInterval(startUpdate);
            clearInterval(startTime);
            infoContainer.style.display = "block";

            button.className ="gameOverButton";
            statusText.innerHTML = "You died!";
            infoContainer.style.backgroundColor = redColor;
            buttonText.innerHTML = "Restart";
            restart = true;
            lockPlayer = true;
        }
    }
    var startUpdate = setInterval(update, 20);
    var startTime = setInterval(function(){
        if(updateTime() === 1)
        {
          for(var l = 0; l < level; l++){
            addBalls(bigBallRadius, (Math.floor(Math.random() * 9) + 1) *100, 100, ballSpeed,0);
          }
        }
        if(timer.innerHTML % 10 === 0 && j <= level)
        {
            addBalls(bigBallRadius, (Math.floor(Math.random() * 9) + 1) *100, 100, ballSpeed,0);
            j++;
        }
        else if(timer.innerHTML % ammoGenerate === 0 && levelComplete != true)
        {
            addUpgrades(50, 50, "Ammo", ammoImage);
        }
        else if(timer.innerHTML % healthGenerate === 0 && player.health < 100 && levelComplete != true)
        {
            addUpgrades(50, 50, "Health", healthImage);
        }
        if(timer.innerHTML % specialAmmoGenerate === 0 && levelComplete != true && hitPerLevel>8)
        {
            addUpgrades(50, 50, "PowerShot", powerAmmoImage);
        }
        else if(timer.innerHTML % 10 === 0)
        {
           deleteUpgrades();
        }
        else if(j === level + 1 && Object.keys(bouncingBalls).length === 0){
          levelComplete = true;
        }
    },1000);
    setInterval(function(){
        updateFrameCount();
    },100);
}
button.addEventListener("click", function(){
  if(restart === true){
    location.reload();
  }
  else{

      if(soundCounter%2==0) {
      levelCompleteSound.play();
      levelCompleteSound.currentTime = 0;
        }
      level++;
    bouncingBalls = {};
    time = 0;
    j = 0;
    levelComplete = false;
    infoContainer.style.display = "none";
    ballSpeed += 0.6;
    healthGenerate+=2;
    ammoGenerate+=2;
    specialAmmoGenerate +=2;
      if (level == 4)
      {
          healthGenerate = 14;
          ammoGenerate = 15;
          specialAmmoGenerate = 16;
      }

    lockPlayer = false;
    playFieldBackground.style.background = 'url("images/' + backGrounds[level-1] + '")';
      if(level == 5)
      {
          playFieldBackground.style.background = 'url("images/' + backGrounds[3] + '")';
      }
  }
});
