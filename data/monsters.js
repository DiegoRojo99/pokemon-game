
const monsters = {
    Skull:{
        position: {
            x: 800,
            y: 100
        }, image: {
            src: './img/monsters/skullBack.png'
        },backImage: {
            src: './img/monsters/skullFront.png'
        },
        frames:{
            max: 4, hold: 30
        },
        animate: true,
        name: 'Skull Crasher',
        type: 'Ghost',
        attacks: [attacks.Tackle, attacks.Tackle]
    },
    Emby:{
        position: {
            x: 280,
            y: 325
        }, image: {
            src: './img/monsters/embyBack.png'
        },backImage: {
            src: './img/monsters/embyFront.png'
        },
        frames:{
            max: 4, hold: 30
        },
        animate: true,
        name: 'Emby',
        type: 'Fire',
        attacks: [attacks.Tackle, attacks.Fireball]
    },
    Draggle:{
        position: {
            x: 800,
            y: 100
        }, image: {
            src: './img/monsters/draggleSprite.png'
        },backImage: {
            src: './img/monsters/draggleSprite.png'
        },
        frames:{
            max: 4, hold: 30
        },
        animate: true,
        name: 'Draggle',
        type: 'Plant',
        attacks: [attacks.Tackle, attacks.PowerWhip]
    }
}