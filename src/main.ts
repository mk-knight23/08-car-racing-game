import './style.css';

const Score = document.querySelector('.Score') as HTMLElement;
const StartScreen = document.querySelector('.StartScreen') as HTMLElement;
const GameArea = document.querySelector('.GameArea') as HTMLElement;

StartScreen.addEventListener('click', Start);

let Player: any = { speed: 6, Score: 0 };
let keys: any = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);

function keydown(e: KeyboardEvent) {
    if (keys[e.key] !== undefined) {
        e.preventDefault();
        keys[e.key] = true;
    }
}

function keyup(e: KeyboardEvent) {
    if (keys[e.key] !== undefined) {
        e.preventDefault();
        keys[e.key] = false;
    }
}

function iscollide(a: HTMLElement, b: HTMLElement) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
    return !((aRect.top < bRect.top) || (aRect.top > bRect.bottom) || (aRect.right < bRect.left) || (aRect.left > bRect.right));
}

function movelines() {
    let lines = document.querySelectorAll('.lines') as NodeListOf<HTMLElement>;
    lines.forEach(function (item: any) {
        if (item.y >= 700) {
            item.y -= 750;
        }
        item.y += Player.speed;
        item.style.top = item.y + "px";
    });
}

function endgame() {
    Player.Start = false;
    StartScreen.classList.remove('hide');
    StartScreen.innerHTML = " GAME OVER <br> YOUR FINAL SCORE IS " + Player.Score
        + " <br> PRESS HERE TO START AGAIN.";
}

function moveenemy(car: HTMLElement) {
    let enemy = document.querySelectorAll('.enemy') as NodeListOf<HTMLElement>;

    enemy.forEach(function (item: any) {
        if (iscollide(car, item)) {
            console.log('BOOM HIT');
            endgame();
        }
        if (item.y >= 700) {
            item.y -= 750;
            item.style.left = Math.floor(Math.random() * 300) + "px";
        }
        item.y += Player.speed;
        item.style.top = item.y + "px";
    });
}

function GamePlay() {
    let car = document.querySelector('.car') as HTMLElement;
    let road = GameArea.getBoundingClientRect();

    if (Player.Start) {
        movelines();
        moveenemy(car);

        if (keys.ArrowUp && Player.y > (road.top + 120)) { Player.y -= Player.speed; }
        if (keys.ArrowDown && Player.y < (road.bottom - 110)) { Player.y += Player.speed; }
        if (keys.ArrowLeft && Player.x > 0) { Player.x -= Player.speed; }
        if (keys.ArrowRight && Player.x < (road.width - 100)) { Player.x += Player.speed; }

        car.style.top = Player.y + "px";
        car.style.left = Player.x + "px";
        window.requestAnimationFrame(GamePlay);

        // console.log(Player.Score++); 
        // Fixed: Incremented score is messy in original code, simplifying
        Player.Score++;
        let ps = Player.Score - 2;
        if (ps < 0) ps = 0;
        Score.innerHTML = "Score : " + ps;
    }
}

function Start() {
    StartScreen.classList.add('hide');
    GameArea.innerHTML = "";

    Player.Start = true;
    Player.Score = 0;
    window.requestAnimationFrame(GamePlay);

    for (let x = 0; x < 5; x++) {
        let roadline = document.createElement('div') as any;
        roadline.setAttribute('class', 'lines');
        roadline.y = (x * 150);
        roadline.style.top = roadline.y + "px";
        GameArea.appendChild(roadline);
    }

    let car = document.createElement('div');
    car.setAttribute('class', 'car');
    GameArea.appendChild(car);

    Player.x = car.offsetLeft;
    Player.y = car.offsetTop;

    for (let x = 0; x < 3; x++) {
        let enemycar = document.createElement('div') as any;
        enemycar.setAttribute('class', 'enemy');
        enemycar.y = ((x + 1) * 300) * -1;
        enemycar.style.top = enemycar.y + "px";
        enemycar.style.backgroundColor = randomColor();
        enemycar.style.left = Math.floor(Math.random() * 300) + "px";
        GameArea.appendChild(enemycar);
    }
}

function randomColor() {
    function c() {
        let hex = Math.floor(Math.random() * 256).toString(16);
        return ("0" + String(hex)).substr(-2);
    }
    return "#" + c() + c() + c();
}
