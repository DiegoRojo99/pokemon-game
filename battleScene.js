
const battleBattlegroundImage = new Image()
battleBattlegroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    }, image: battleBattlegroundImage
})

let draggle
let emby
let renderedSprites
let battleAnimationId
let queue

function initBattle(){
    document.querySelector('#healthBars').style.display = 'block'
    document.querySelector('#dialogueBox').style.display = 'none'
    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#playerHealthBar').style.width = '100%'
    document.querySelector('#attacksBox').replaceChildren()

    draggle = new Monster(monsters.Draggle)
    emby = new Monster(monsters.Emby)
    renderedSprites = [draggle, emby]
    queue = []
    
    emby.attacks.forEach(attack => {
        const button = document.createElement('button')
        button.innerHTML = attack.shown
        document.querySelector('#attacksBox').append(button)
    })

    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (e) => {
            let attackShownName=e.currentTarget.innerHTML
            attackShownName=attackShownName.replace(" ","")
            const selectedAttack= attacks[attackShownName]
            emby.attack({ 
                attack: selectedAttack, 
                recipient: draggle,
                renderedSprites
            })

            if(draggle.health <= 0){
                queue.push(() => {
                    draggle.faint()
                })
                queue.push(() => {
                    //Fade back to black
                    gsap.to('#overlappingDiv',{
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId)
                            animate(),
                            document.querySelector('#healthBars').style.display='none'
                            gsap.to('#overlappingDiv',{
                                opacity: 0
                            })
                            
                            battle.initiated = false
                        }
                    })
                })
            }

            //Enemy attacks
            const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]

            queue.push(() => {
                draggle.attack({ 
                    attack: randomAttack, 
                    recipient: emby,
                    renderedSprites
                })

                if(emby.health <= 0){
                    queue.push(() => {
                        emby.faint()
                    })
                    queue.push(() => {
                        //Fade back to black
                        gsap.to('#overlappingDiv',{
                            opacity: 1,
                            onComplete: () => {
                                cancelAnimationFrame(battleAnimationId)
                                animate(),
                                document.querySelector('#healthBars').style.display='none'
                                gsap.to('#overlappingDiv',{
                                    opacity: 0
                                })

                                battle.initiated = false
                            }
                        })
                    })
                }
            })
        })
            button.addEventListener('mouseenter', (e) => {
                
                let attackShownName=e.currentTarget.innerHTML
                attackShownName=attackShownName.replace(" ","")
                const selectedAttack = attacks[attackShownName]
                document.querySelector('#attackType').innerHTML = selectedAttack.type
                document.querySelector('#attackType').style.color = selectedAttack.color
            })
    })
}

function animateBattle(){    
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()
    draggle.draw()
    emby.draw()

    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}

function getBattle(){
    initBattle()
    animateBattle()
}


animate()
//getBattle()

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if(queue.length > 0){
        queue[0]()
        queue.shift()
    }else{
        e.currentTarget.style.display='none'
    }

})