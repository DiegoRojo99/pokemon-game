
const draggleImage = new Image()
draggleImage.src = './img/draggleSprite.png'

const embyImage = new Image()
embyImage.src = './img/embySprite.png'

const monsters = {
    Emby:{
        position: {
            x: 280,
            y: 325
        }, image: embyImage,
        frames:{
            max: 4, hold: 30
        },
        animate: true,
        name: 'Emby'
    },
    Draggle:{
        position: {
            x: 0800,
            y: 100
        }, image: draggleImage,
        frames:{
            max: 4, hold: 30
        },
        animate: true,
        isEnemy: true,
        name: 'Draggle'
    }
}