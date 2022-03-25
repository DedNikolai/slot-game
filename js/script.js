const game = {
    reels: 4,
    images: ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '1.png', '2.png', '3.png', '4.png'],
    slots: [],
    speed: 100,
};

class Slot {
    intervalId;

    constructor(id, name, position, speed) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.speed = speed;
    };

    move() {
        this.intervalId = setInterval(() => {
            if (this.position < 1000) {
                this.position += 100;
            } else {
                this.position = -100;
            }

            document.getElementById(`${this.id}`).style.top = this.position + 'px';
        }, this.speed)
    }

    stop() {
        clearInterval(this.intervalId);
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
            div.style.transitionDuration = game.speed - 20 + 'ms';
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
        game.speed += 10;
    }
};

document.querySelector('#start').addEventListener('click', event => {
    game.slots.forEach(slot => slot.move());
    document.querySelector('#start').setAttribute('disabled', true);
    document.querySelector('#refresh').setAttribute('disabled', true);
});

document.querySelector('#stop').addEventListener('click', event => {
    game.slots.forEach(slot => slot.stop())
    document.querySelector('#refresh').removeAttribute('disabled');
    checkSlots();
});

document.querySelector('#refresh').addEventListener('click', event => {
    game.slots = [];
    document.querySelector('.field').innerHTML = '';
    game.speed = 100;
    initialGame();
    document.querySelector('#start').removeAttribute('disabled');
});

function checkSlots() {
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
                map.get(key).forEach(slot => {
                    document.getElementById(`${slot.id}`).style.backgroundColor = '#006400'
                })
            }
        }
    }
}