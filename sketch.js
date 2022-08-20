var bg, bgImage1, bgImage2, bgImage3, bgImage4;
var player, playerImage;
var ground;
var leftWall, reightWall;
var ground;
var bulletGroup;
var bulletImage;
var bulletSound;
var bulletCock;
var zombieWorldStartScore = 40;
var walking;
var germ1, germ1Image;
var playButtonImage, playButton;
var germsGroup;
var zombieGroup;
var b = 35;
var flag = 0;
let sprWalker;
var score;
var secondSprite, secondSpriteImage;
var dettolHandwash, dettolHandwashImage;
var dettolSanitizer, dettolSanitizerImage;
var dettolSoap, dettolSoapImage, explode_sprite_sheet;
var germ, germImage;
var walking;
var GRAVITY = 0.3;
var x1 = 0;
var x2;
var x3;
var x4;
var score = 0;
var count = 0;
var isGrounded = false;
var powerUps = 'Normal';
var canShoot = true;
var powerup1;
var powerup2;
var powerup3;
var bulletCount;
var health = 100;
var gamestate = "instructions";
var gameOver;
var restart;
var button1;
var button2;
var button3;
var isPowerUp1Enabled = false;
var isPowerUp2Enabled = false;
var isPowerUp3Enabled = false;
var healthCollectible;
var burstShotCollectible;
var canReload = true;
var germ2, germ2Image, germ3Image;
var zombie;
var background2Image;
var background1Image;
var zombieWorld = false;
var shield;
var shieldImage;
var isShieldActive = false;
var shieldCollectible;
var showLevelText = false;
var instructionsImage;
var soldier_sprite_sheet;

function preload() {

    background1Image = loadImage('./background.jpg')
    bgImage1 = bgImage2 = background1Image;
    bulletImage = loadImage("./bullet.png")
    bulletSound = loadSound("./shot.mp3")
    bulletCock = loadSound("./gunCock.mp3")
    walking = loadSound("./walking.mp3")
    germ1Image = loadImage("./germ1.png")
    secondSpriteImage = loadImage("./secondSprite.png")
    dettolHandwash = loadImage("./dettolhandwash.webp")
    dettol1 = loadImage("liquidhandwash.png")
    explode_sprite_sheet = loadSpriteSheet('./explosion1024_768.png', 128, 128, 48);
    player_sprite_sheet = loadSpriteSheet('./player.png', 59, 66, 10);
    soldier_sprite_sheet = loadSpriteSheet('./gangsterMain.png', 68.1666667, 99, 6);
    gameOverImage = loadImage("Game_oversprite.png")
    germ2Image = loadImage("germ2.png")
    germ3Image = loadImage("germ3.png")
    zombie = loadAnimation('./zombie1.png', './zombie2.png', './zombie3.png', './zombie4.png', './zombie5.png')
    background2Image = loadImage("background2.jpg")
    shieldImage = loadImage("shield.png")
    instructionsImage = loadImage("screenshot.png")
    playButtonImage = loadImage("./playButton.png");

}

function setup() {
    createCanvas(windowWidth, windowHeight);
    button1 = createButton('BURSTSHOT');
    button1.position(windowWidth - 350, 650);
    button1.mousePressed(ActivatePowerup1);
    button1.style('background-color', "red")
    button1.style('height', "50px")
    button1.style('width', "100px")
    button1.style('display', "none")

    x2 = width;
    player = createSprite(80, (windowHeight / 2), 59, 66);
    player.scale = 2;
    player.addAnimation('running', player_sprite_sheet);
    player.animation.frameDelay = 7;
    player.animation.looping = true;
    // player.addImage(playerImage);

    ground = createSprite(windowWidth / 2, windowHeight * .92, windowWidth, 10);
    leftWall = createSprite(-50, windowHeight / 2, 10, windowHeight);
    rightWall = cameOver = createSprite(windowWidth + 50, windowHeight / 2, 10, windowHeight);
    gameOver = createSprite(windowWidth / 2, windowHeight / 3)
    gameOver.addImage(gameOverImage)
    ground.visible = false;

    bulletGroup = new Group();
    germsGroup = new Group();
    zombieGroup = new Group();

    bulletCount = 20;
    gameOver.visible = false;
    instruction = createSprite(windowWidth / 2, windowHeight / 2.5, 1, 1);
    playButton = createSprite(windowWidth / 2, windowHeight - (windowHeight / 10), 10, 10);
    playButton.addImage(playButtonImage);
    instruction.addImage(instructionsImage);
    //playButton.scale = 2;
    instruction.scale = .35;
}


function BackgroundMovement() {
    if (bgImage1) {
        image(bgImage1, x1, 0, width, windowHeight);
        image(bgImage2, x2, 0, width, windowHeight);
    }
    if (bgImage3) {
        image(bgImage3, x3, 0, width, windowHeight);
        image(bgImage4, x4, 0, width, windowHeight);
    }
    x1 -= 1.5;
    x2 -= 1.5;
    x3 -= 1.5;
    x4 -= 1.5;


    if (x1 < -width) {
        x1 = width;
    }

    if (x2 < -width) {
        x2 = width;

    }

    if (x3 < -width) {
        x3 = width;

    }
    if (x4 < -width) {
        x4 = width;

    }

}

function PlayerControls() {
    if (keyWentDown("CTRL") && canShoot && bulletCount > 0) {
        spawnBullets();
        canShoot = false;
        setTimeout(() => { canShoot = true; }, 150);
        bulletCount = bulletCount - 1;
    }
    if (keyWentDown("R") && canReload) {
        bulletCount = 20;
        canReload = false;
        powerUps = "Normal"
        setTimeout(() => { canReload = true; }, 10000);
    }
    if (isShieldActive && shield == null) {
        shield = createSprite(player.position.x + 30, player.position.y);
        shield.addImage(shieldImage)
        shield.scale = 0.15;

    }
    if (isShieldActive) {
        shield.position.x = player.position.x + 30
        shield.position.y = player.position.y
    }


    if ((keyDown(UP_ARROW) || keyWentDown("w") || keyWentDown("space")) && isGrounded) {
        player.velocity.y = -12;
    }

}

function ApplyGravity() {
    player.velocity.y += GRAVITY;
    if (ground.overlap(player)) {
        player.velocity.y = 0;
        isGrounded = true;
    } else {
        isGrounded = false;
    }
    for (var i = 0; i < zombieGroup.length; i++) {
        zombieGroup.get(i).velocity.y += GRAVITY;
    }
    zombieGroup.overlap(ground, (a, b) => {
        a.velocity.y = 0;
        b.velocity.y = 0;
    })
}


function GameOverConditions() {}

function ZombieControl() {
    if (frameCount % 120 === 0) {
        for (var i = 0; i < zombieGroup.length; i++) {
            if (random(0, 10) < 8) {
                zombieGroup.get(i).velocity.y -= random(11, 15);
            }
        }
    }
}

function HealthController() {
    germsGroup.overlap(player, (a, b) => {
        a.remove();
        health = health - 25;
        if (health == 0) {
            player.remove();
            gamestate = "end";
        }
    })
    zombieGroup.overlap(player, (a, b) => {
        a.remove();
        health = health - 50;
        if (health == 0) {
            player.remove();
            gamestate = "end";
        }
    })
}

function ActivatePowerup1() {
    if (isPowerUp1Enabled) {
        powerUps = "BurstShot"
        button1.style('display', "none")
    }
}

function ActivatePowerup2() {
    if (isPowerUp2Enabled) {
        health = 100;
    }
}

function ActivatePowerup3() {}

function AddScore(increase) {
    score = score + increase;
    if (score % zombieWorldStartScore == 0 && zombieWorld === false) {
        showLevelText = true;
        zombieWorldStartScore = 25;
        setTimeout(() => {
            SpawnZombielogic();
            bgImage3 = background2Image;
            bgImage4 = background2Image;
            x3 = width;
            x4 = width * 2;
            zombieWorld = true;
            showLevelText = false;
        }, 3000)
    }
    if (score % 10 == 0) {
        isPowerUp1Enabled = true;
        SpawnHealthCollectible();
        button1.style('display', "block")
    }
    if (score % 8 == 0) {
        var y = random(windowHeight * .7, windowHeight * .5)
        SpawnshieldCollectible(windowWidth, y);

    }

}


function draw() {

    switch (gamestate) {
        case 'instructions':
            BackgroundMovement();
            ApplyGravity();
            if (mouseIsPressed) {
                if (playButton.overlapPixel(mouseX, mouseY)) {
                    playButton.remove();
                    instruction.remove();
                    gamestate = 'play';
                }

            }


            break;
        case 'play':
            BackgroundMovement();
            ApplyGravity()
            PlayerControls();
            HealthController();
            GameOverConditions();
            ZombieControl();
            germsGroup.overlap(leftWall, (a, b) => {
                a.remove();
            })
            zombieGroup.overlap(leftWall, (a, b) => {
                a.remove();
            })
            bulletGroup.overlap(rightWall, (a, b) => {
                a.remove();
            })
            if (healthCollectible) {
                player.overlap(healthCollectible, (a, b) => {
                    b.remove();
                    health = 100;
                })
            }

            if (shieldCollectible) {
                shieldCollectible.overlap(player, (a, b) => {
                    a.remove();
                    shieldCollectible = null;
                    isShieldActive = true;
                })
            }
            if (isShieldActive && shield) {
                shield.overlap(germsGroup, (a, b) => {
                    a.remove();
                    b.remove();
                    isShieldActive = false;
                    shield = null;
                })
            }
            if (isShieldActive && shield) {
                shield.overlap(zombieGroup, (a, b) => {
                    a.remove();
                    b.remove();
                    isShieldActive = false;
                    shield = null;
                })

            }

            if (showLevelText) {
                strokeWeight(10)
                textStyle(BOLD)
                textSize(48);
                text("Your protests worked. The world is a better place!", (windowWidth / 2 - 520), windowHeight / 2 - 200)

            }






            bulletGroup.overlap(germsGroup, (a, b) => {
                a.remove();
                b.remove();
                sprWalker = createSprite(b.position.x, b.position.y, 60, 60);
                sprWalker.scale = .4;
                sprWalker.addAnimation('explode', explode_sprite_sheet);
                sprWalker.scale = .4;
                sprWalker.animation.frameDelay = 1;
                sprWalker.animation.looping = false;
                AddScore(1);
            });

            zombieGroup.overlap(bulletGroup, (a, b) => {
                a.health--;
                sprWalker = createSprite(b.position.x, b.position.y, 60, 60);
                sprWalker.addAnimation('explode', explode_sprite_sheet);
                sprWalker.scale = .1;
                sprWalker.animation.frameDelay = 1;
                sprWalker.animation.looping = false;
                b.remove();
                if (a.health == 0) {
                    SpawnshieldCollectible(a.position.x, a.position.y);
                    a.remove();
                    AddScore(1);
                    sprWalker = createSprite(a.position.x, a.position.y, 60, 60);
                    sprWalker.addAnimation('explode', explode_sprite_sheet);
                    sprWalker.scale = 1.2;
                    sprWalker.animation.frameDelay = 1;
                    sprWalker.animation.looping = false;
                }
                if (zombieGroup.length == 0) {

                    zombieWorld = false;
                    bgImage3 = null;
                    // bgImage = background1Image;
                }
            })

            spawnGerms();

            textSize(25);
            textStyle(NORMAL)
            fill(0)
            text(" Score  " + score, windowWidth - 207, 80)
            text("Bullets Left  " + bulletCount, windowWidth - 200, 50);
            text("Health  " + health, windowWidth - 200, 110)
            break;
        case "end":
            gameOver.visible = true;
            if (healthCollectible) {
                healthCollectible.remove();
            }
            for (var i = 0; i < zombieGroup.length; i++) {
                zombieGroup.get(0).remove();
            }
            for (i = 0; i < germsGroup.length; i++) {
                var removableGerm = germsGroup.get(0);
                removableGerm.remove();
            }
            for (i = 0; i < bulletGroup.length; i++) {
                var removableBullets = bulletGroup.get(0);
                removableBullets.remove();
            }
            break;
    }

    drawSprites();


}

function spawnBullets() {
    switch (powerUps) {
        case 'Normal':
            var bullet = createSprite(player.position.x + 60, player.position.y - 33);
            bullet.addImage(bulletImage);
            bulletSound.play();
            bullet.setSpeed(5);
            bullet.lifetime = 20;
            bullet.scale = 0.1;
            bulletGroup.add(bullet);
            break;
        case 'BurstShot':
            var bullet = createSprite(player.position.x + 60, player.position.y - 33);
            bullet.addImage(bulletImage);
            bulletSound.play();
            bullet.setSpeed(5);
            bullet.lifetime = 20;
            bullet.scale = 0.1;
            bulletGroup.add(bullet);

            bullet = createSprite(player.position.x + 60, player.position.y - 33);
            bullet.addImage(bulletImage);
            bulletSound.play();
            bullet.setSpeed(5, 30);
            bullet.lifetime = 20;
            bullet.scale = 0.1;
            bulletGroup.add(bullet);

            bullet = createSprite(player.position.x + 60, player.position.y - 33);
            bullet.addImage(bulletImage);
            bulletSound.play();
            bullet.setSpeed(5, -30);
            bullet.lifetime = 20;
            bullet.scale = 0.1;
            bulletGroup.add(bullet);

            bullet = createSprite(player.position.x + 60, player.position.y - 33);
            bullet.addImage(bulletImage);
            bulletSound.play();
            bullet.setSpeed(5, 15);
            bullet.lifetime = 20;
            bullet.scale = 0.1;
            bulletGroup.add(bullet);

            bullet = createSprite(player.position.x + 60, player.position.y - 33);
            bullet.addImage(bulletImage);
            bulletSound.play();
            bullet.setSpeed(5, -15);
            bullet.lifetime = 20;
            bullet.scale = 0.1;
            bulletGroup.add(bullet);

            break;
    }
}

function spawnGerms() {
    if (frameCount % 100 === 0 && zombieWorld == false) {
        var germ = createSprite(windowWidth, windowHeight * .7);
        germ.addImage(germ1Image);
        germ.position.y = Math.round(random(windowHeight * .7, windowHeight * .5));
        germ.setSpeed(-5);
        germ.lifetime = 100;
        germ.scale = 0.25;
        germsGroup.add(germ);
    }
    if (frameCount % 201 === 0 && score > 15) {
        var germ = createSprite(windowWidth, windowHeight * .7);
        germ.addImage(germ2Image);
        germ.position.y = Math.round(random(windowHeight * .7, windowHeight * .5));
        germ.setSpeed(-5);
        germ.lifetime = 100;
        germ.scale = 0.2;
        germsGroup.add(germ);
    }
    if (frameCount % 250 === 0 && score > 1) {
        var germ = createSprite(windowWidth, windowHeight * .7);
        germ.addImage(germ3Image);
        germ.position.y = Math.round(random(windowHeight * .7, windowHeight * .5));
        germ.setSpeed(-5);
        germ.lifetime = 100;
        germ.scale = 0.2;
        germsGroup.add(germ);
    }

}

function SpawnHealthCollectible() {

    healthCollectible = createSprite(windowWidth, windowHeight * .7);
    healthCollectible.addImage(dettolHandwash);
    healthCollectible.position.y = Math.round(random(windowHeight * .7, windowHeight * .5));
    healthCollectible.setSpeed(-5);
    healthCollectible.lifetime = 100;
    healthCollectible.scale = 0.15;


}

function SpawnZombie() {
    x2 = width;

    var zombieEnemy = createSprite(80, (windowHeight / 2), 68.166667, 99);
    healthCollectible.addImage(dettolHandwash);
    zombieEnemy.scale = 0.2;
    zombieEnemy.setSpeed(-.5);
    zombieEnemy.health = 10;
    zombieGroup.add(zombieEnemy);
}

function SpawnZombielogic() {
    setTimeout(() => {
        SpawnZombie();
    }, random(0, 5000));
    setTimeout(() => {
        SpawnZombie();
    }, random(6000, 11000));
    setTimeout(() => {
        SpawnZombie();
    }, random(12000, 17000));
}

function SpawnshieldCollectible(x, y) {

    shieldCollectible = createSprite(x, y);
    shieldCollectible.addImage(dettol1);
    shieldCollectible.position.y = Math.round(random(windowHeight * .7, windowHeight * .5));
    shieldCollectible.setSpeed(-5);
    shieldCollectible.lifetime = 100;
    shieldCollectible.scale = 0.30;

}