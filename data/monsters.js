
const monsters = {
    Skull:{
        position: {
            x: 800,
            y: 100
        }, image: {
            src: './img/monsters/skullFront.png'
        },backImage: {
            src: './img/monsters/skullFront.png'
        },
        frames:{
            max: 4, hold: 30
        },
        animate: true,
        name: 'Skull Crasher',
        type: 'Ghost',
        attacks: [attacks.Tackle, attacks.RockWrecker]
    },
    Emby:{
        position: {
            x: 280,
            y: 325
        }, image: {
            src: './img/monsters/embySprite.png'
        },backImage: {
            src: './img/monsters/embySprite.png'
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
        isEnemy: true,
        name: 'Draggle',
        type: 'Plant',
        attacks: [attacks.Tackle, attacks.PowerWhip]
    }
}