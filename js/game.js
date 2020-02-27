"use strict";

//used to calculate screen pixels
let moveSpeed = 20;

let playerData = {
    health: 100,
    lvl: 1,
    attackPower: 10,
    defense: 0,
    score: 0,
    chance: 5,
    position: {
        x: 1,
        y: 1
    },
    GfxPosition: {
        x: 20,
        y: 20
    },
    fov: {
        x: 6,
        h: 6
    },
}

let isDead = 0;

let enemyData = function (health, y, x) {
    this.health = health;
    this.attackPower = 2;
    this.y = y;
    this.x = x;
    this.chance = 6;
}

//0 is player turn and 1 is enemy
let fightState = 0;


const tileType = {
    floor: 0,
    wall: 1,
    enemy: 2,
    player: 3,
    healthPotion: 4
};


const map = [
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 2, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1],
    [0, 1, 1, 0, 0, 4, 4, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 1, 2, 1, 1, 0, 0, 0, 4, 0, 0, 1, 0, 0, 0, 0],
    [1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [1, 2, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1]


];

//find max map size
const mapX = map[0].length;
const mapY = map.length;


const entMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let returnPos = function (posY, posX) {
    return map[posY][posX];
}


let movePlayer = function (nextY, nextX) {
    let currentX;
    let currentY;

    currentX = playerData.position.x;
    currentY = playerData.position.y;

    map[currentY][currentX] = 0;
    map[nextY][nextX] = 3;
}

let fight = function (y, x) {
    if (fightState == 0) {
        //player turn
        addLine("Player attacked Orc.");
        entMap[y][x].health -= playerData.attackPower;
        fightState = 1;
        if (entMap[y][x].health <= 0) {
            addLine("Player killed Orc.");
            playerData.score = playerData.score + 10;
            entMap[y][x] = "";
            map[y][x] = 0;
            clearMap();
            drawMap();
        }
    } else {
        //enemy turn
        addLine("Orc attacked Player.");
        playerData.health -= 8;
        updateUi();
        if (playerData.health <= 0) {
            let cookie = getCookie("highScore");
            addLine("Orc killed Player.");
            //set newhigh score if score is higher then existing highscore
            if (playerData.score > cookie) {
                addLine("High score: " + playerData.score);
            } else {
                addLine("Score: " + playerData.score);
            }
            if (playerData.score > cookie) {
                document.cookie = "highScore=" + playerData.score;
            }
            isDead = 1;
        }
        fightState = 0;
    }
}

//update player stats on ui
let updateUi = function () {
    let healthUi = document.querySelector('#healthHtml');
    if (playerData.health < 0) {
        playerData.health = 0;
    }
    healthUi.innerHTML = playerData.health;
}

//function to retrieve specific cookie data
//modified w3 school example https://www.w3schools.com/js/js_cookies.asp
let getCookie = function (cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//gets cookie and sets highscore if cookie exists
let loadCookie = function () {
    let cookie = getCookie("highScore");
    let outputCookie = document.querySelector("#highScoreHtml");

    outputCookie.innerHTML = cookie;
}

//append msg to output console
let addLine = function (inputT) {
    let inputText = inputT
    let textLine = document.createElement('P');
    textLine.innerHTML = inputText;
    document.querySelector('#txtOut').appendChild(textLine);

    //auto scroll output console
    document.querySelector('#txtOut').scrollTop = document.querySelector('#txtOut').scrollHeight;
}


let nextPosY;
let nextPosX;


let handelInput = function (event) {
    if (event.key == "s" || event.charCode == "40" || event.originalTarget.id == "btnDown") {
        //down
        if (isDead == 0) {
            nextPosY = playerData.position.y + 1;
            nextPosX = playerData.position.x;

            if (nextPosY >= 0 && nextPosY <= mapY && nextPosX >= 0 && nextPosX <= mapX) {
                //collision detection
                if (map[nextPosY][nextPosX] == 1) {
                    //hit wall
                } else if (map[nextPosY][nextPosX] == 0) {
                    movePlayer(nextPosY, nextPosX)
                    playerData.position.y = nextPosY;

                    playerData.GfxPosition.y = playerData.GfxPosition.y + moveSpeed;
                    document.getElementById("player").style.top = playerData.GfxPosition.y + 'px';
                } else if (map[nextPosY][nextPosX] == 2) {
                    //fight
                    fight(nextPosY, nextPosX);
                } else if (map[nextPosY][nextPosX] == 4) {
                    //potion
                    playerData.health = playerData.health + 25;
                    updateUi();
                    movePlayer(nextPosY, nextPosX)
                    playerData.position.y = nextPosY;
                    map[nextPosY][nextPosX] = 3;
                    playerData.GfxPosition.y = playerData.GfxPosition.y + moveSpeed;
                    document.getElementById("player").style.top = playerData.GfxPosition.y + 'px';
                    clearMap();
                    drawMap();
                }

            }
        }
    } else if (event.key == "q" || event.originalTarget.id == "btnLeft") {
        //left
        if (isDead == 0) {

            nextPosY = playerData.position.y;
            nextPosX = playerData.position.x - 1;

            if (nextPosY >= 0 && nextPosY <= mapY && nextPosX >= 0 && nextPosX <= mapX) {
                if (map[nextPosY][nextPosX] == 1) {
                    //hit wall
                } else if (map[nextPosY][nextPosX] == 0) {
                    //free space
                    movePlayer(nextPosY, nextPosX)
                    playerData.position.x = nextPosX;

                    playerData.GfxPosition.x = playerData.GfxPosition.x - moveSpeed;
                    document.getElementById("player").style.left = playerData.GfxPosition.x + 'px';

                } else if (map[nextPosY][nextPosX] == 2) {
                    //enemy
                    fight(nextPosY, nextPosX);
                } else if (map[nextPosY][nextPosX] == 4) {
                    //potion
                    playerData.health = playerData.health + 25;
                    updateUi();
                    movePlayer(nextPosY, nextPosX)
                    playerData.position.x = nextPosX;
                    map[nextPosY][nextPosX] = 3;
                    playerData.GfxPosition.x = playerData.GfxPosition.x - moveSpeed;
                    document.getElementById("player").style.left = playerData.GfxPosition.x + 'px';
                    clearMap();
                    drawMap();
                }

            }
        }
    } else if (event.key == "d" || event.originalTarget.id == "btnRight") {
        //right
        if (isDead == 0) {

            nextPosY = playerData.position.y;
            nextPosX = playerData.position.x + 1;

            if (nextPosY >= 0 && nextPosY <= mapY && nextPosX >= 0 && nextPosX <= mapX) {

                if (map[nextPosY][nextPosX] == 1) {
                    //hit wall
                } else if (map[nextPosY][nextPosX] == 0) {
                    movePlayer(nextPosY, nextPosX)
                    playerData.position.x = nextPosX;

                    playerData.GfxPosition.x = playerData.GfxPosition.x + moveSpeed;
                    document.getElementById("player").style.left = playerData.GfxPosition.x + 'px';
                } else if (map[nextPosY][nextPosX] == 2) {
                    //fight
                    fight(nextPosY, nextPosX);
                } else if (map[nextPosY][nextPosX] == 4) {
                    //potion
                    playerData.health = playerData.health + 25;
                    updateUi();
                    movePlayer(nextPosY, nextPosX)
                    playerData.position.x = nextPosX;
                    map[nextPosY][nextPosX] = 3;
                    playerData.GfxPosition.x = playerData.GfxPosition.x + moveSpeed;
                    document.getElementById("player").style.left = playerData.GfxPosition.x + 'px';
                    clearMap();
                    drawMap();
                }
            }
        }
    } else if (event.key == "z" || event.originalTarget.id == "btnUp") {
        //up
        if (isDead == 0) {
            nextPosY = playerData.position.y - 1;
            nextPosX = playerData.position.x;

            if (nextPosY >= 0 && nextPosY <= mapY && nextPosX >= 0 && nextPosX <= mapX) {

                if (map[nextPosY][nextPosX] == 1) {
                    //hit wall
                } else if (map[nextPosY][nextPosX] == 0) {
                    movePlayer(nextPosY, nextPosX)
                    playerData.position.y = nextPosY;

                    playerData.GfxPosition.y = playerData.GfxPosition.y - moveSpeed;
                    document.getElementById("player").style.top = playerData.GfxPosition.y + 'px';
                } else if (map[nextPosY][nextPosX] == 2) {
                    //fight
                    fight(nextPosY, nextPosX);
                } else if (map[nextPosY][nextPosX] == 4) {
                    //potion
                    playerData.health = playerData.health + 25;
                    updateUi();
                    movePlayer(nextPosY, nextPosX)
                    playerData.position.y = nextPosY;
                    map[nextPosY][nextPosX] = 3;
                    playerData.GfxPosition.y = playerData.GfxPosition.y - moveSpeed;
                    document.getElementById("player").style.top = playerData.GfxPosition.y + 'px';
                    clearMap();
                    drawMap();
                }
            }
        }
    }

}

//handel user input via keyboard
document.addEventListener("keypress", function onPress(event) {
    handelInput(event);
});


//clears map so we can redraw it
let clearMap = function () {
    let elem = document.querySelector('#gameWindow');
    elem.parentNode.removeChild(elem)

    let createWindow = document.createElement('div');
    createWindow.setAttribute('id', 'gameWindow');
    document.querySelector('body').appendChild(createWindow);

}

let drawMap = function () {

    for (let drawY = 0; drawY < mapY; drawY++) {
        for (let drawX = 0; drawX < mapX; drawX++) {
            if (map[drawY][drawX] == 3) {
                //draw player
                let tile_X = playerData.position.x * moveSpeed;
                let tile_Y = playerData.position.y * moveSpeed;

                let drawPlayer = document.createElement('section');
                drawPlayer.setAttribute('id', 'player');
                drawPlayer.innerHTML = '@';
                drawPlayer.style.top = tile_Y + 'px';
                drawPlayer.style.left = tile_X + 'px';
                document.querySelector('#gameWindow').appendChild(drawPlayer);

            } else if (map[drawY][drawX] == 1) {
                //draw wall
                let tile_X = drawX * moveSpeed;
                let tile_Y = drawY * moveSpeed;

                let drawWall = document.createElement('section');
                drawWall.setAttribute('class', 'wall');
                drawWall.innerHTML = '#';
                drawWall.style.top = tile_Y + 'px';
                drawWall.style.left = tile_X + 'px';
                document.querySelector('#gameWindow').appendChild(drawWall);
            } else if (map[drawY][drawX] == 0) {
                //draw empty cell
            } else if (map[drawY][drawX] == 2) {
                //draw enemy
                let tile_X = drawX * moveSpeed;
                let tile_Y = drawY * moveSpeed;

                entMap[drawY][drawX] = new enemyData(100, drawY, drawX);
                let drawEnemy = document.createElement('section');
                drawEnemy.setAttribute('class', 'enemy');
                drawEnemy.innerHTML = '>';
                drawEnemy.style.top = tile_Y + 'px';
                drawEnemy.style.left = tile_X + 'px';
                document.querySelector('#gameWindow').appendChild(drawEnemy);
            } else if (map[drawY][drawX] == 4) {
                //draw health potion
                let tile_X = drawX * moveSpeed;
                let tile_Y = drawY * moveSpeed;

                let drawHealthPotion = document.createElement('section');
                drawHealthPotion.setAttribute('class', 'healthPotion');
                drawHealthPotion.innerHTML = '+';
                drawHealthPotion.style.top = tile_Y + 'px';
                drawHealthPotion.style.left = tile_X + 'px';
                document.querySelector('#gameWindow').appendChild(drawHealthPotion);

            }
        }
    }
}

drawMap();

loadCookie();


//handel user input for mobile devices
let btnDown = document.querySelector("#btnDown");

btnDown.addEventListener('click', function (event) {
    //down
    handelInput(event);
});


let btnLeft = document.querySelector("#btnLeft");

btnLeft.addEventListener('click', function () {
    //left
    handelInput(event);

});

let btnRight = document.querySelector("#btnRight");

btnRight.addEventListener('click', function () {
    //right
    handelInput(event);

});

let btnUp = document.querySelector("#btnUp");
btnUp.addEventListener('click', function () {
    //up
    handelInput(event);
});

