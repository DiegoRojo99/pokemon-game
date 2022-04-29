
const monsters = {
    Emby:{
        position: {
            x: 280,
            y: 325
        }, image: {
            src: './img/embySprite.png'
        },backImage: {
            src: './img/embySprite.png'
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
            src: './img/embySprite.png'
        },backImage: {
            src: './img/draggleSprite.png'
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