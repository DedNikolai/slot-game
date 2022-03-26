const game = {
    reels: 4,
    images: ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '1.png', '2.png', '3.png', '4.png'],
    slots: [],
    speed: 7,
    intervals: [],
    clickAudio: new Audio('./music/click.mp3'),
    looseAudio: new Audio('./music/loose.mp3'),
    winAudio: new Audio('./music/win.mp3'),
};

class Slot {

    constructor(id, name, position) {
        this.id = id;
        this.name = name;
        this.position = position;
    };

    move() {
        if (this.position < 1090) {
            this.position += 10;
        } else {
            this.position = -100;
        }

        document.getElementById(`${this.id}`).style.top = this.position + 'px';
    }

    stop() {

        if (this.position % 100 != 0) {
            if (this.position > 0) {
                if (this.position > 1000) {
                    this.position = -100;
                } else {
                    this.position = Math.floor(this.position/100)*100 + 100;
                }
            }

            if (this.position < 0 && this.position > -100) {
                this.position = 0;
            }
            document.getElementById(`${this.id}`).style.top = this.position + 'px';
        }
    }
}

initialGame();

function initialGame() {
    for (let i = 0; i < game.reels; i++) {
        let position = -100;
        for (let j = 0; j < game.images.length; j++) {
            let id = i*game.images.length + j + 1;
            let div = document.createElement('div');
            div.setAttribute('id', id);
            div.className = 'slot';
            div.style.left = i*100 + 'px';
            div.style.top = position + 'px';
            let img = document.createElement('img');
            img.className = 'slot-image';
            let image = game.images[Math.ceil(Math.random()*game.images.length - 1)];
            img.src = `./img/${image}`;
            document.querySelector('.field').append(div);
            div.append(img);
            let name = image.split('.')[0];
            game.slots.push(new Slot(id, name, position, game.speed));
            position +=100;
        }
    }
};

document.querySelector('.buttons').addEventListener('click', () => game.clickAudio.play());

document.querySelector('#start').addEventListener('click', event => {
    let startTime = 200;
    for (let i = 0; i < game.reels; i++) {
        let start = i*game.slots.length/game.reels;
        let end = i*game.slots.length/game.reels + game.slots.length/game.reels;
        setTimeout(() => {
            let intervalId = setInterval(() => {
                game.slots.slice(start, end).forEach(slot => {
                    slot.move();
                })
            }, game.speed);
            game.intervals.push(intervalId);
        }, startTime);
        startTime += 200;
    }
    document.querySelector('#start').setAttribute('disabled', true);
    document.querySelector('#refresh').setAttribute('disabled', true);
});

document.querySelector('#stop').addEventListener('click', event => {
    let endTime = 200;
    for (let i = 0; i < game.reels; i++) {
        let start = i*game.slots.length/game.reels;
        let end = i*game.slots.length/game.reels + game.slots.length/game.reels;
        setTimeout(() => {
            clearInterval(game.intervals[i]);
            game.slots.slice(start, end).forEach(slot => {
                slot.stop()
            })
        }, endTime);
        endTime += 200;
    }
    setTimeout(() => {
        document.querySelector('#refresh').removeAttribute('disabled');
        checkSlots();
    }, endTime);

});

document.querySelector('#refresh').addEventListener('click', event => {
    game.slots = [];
    game.intervals = [];
    document.querySelector('.field').innerHTML = '';
    game.speed = 7;
    initialGame();
    document.querySelector('#start').removeAttribute('disabled');
});

function checkSlots() {
    let win = false;
    for (let i = 0; i < 3; i++) {
        let arr = game.slots.filter(slot => slot.position === i*100);
        let map = new Map();
        arr.forEach(slot => {
            if (!map.has(slot.name)) {
                let temp = [slot];
                map.set(slot.name, temp);
            } else {
                map.get(slot.name).push(slot);
            }
        });
        
        for (let key of map.keys()) {
            if (map.get(key).length >= 3) {
                game.winAudio.play();
                win = true;
                map.get(key).forEach(slot => {
                    document.getElementById(`${slot.id}`).style.backgroundColor = '#006400'
                })
            }
        }
    }

    if (!win) {
        game.looseAudio.play();
    }
}