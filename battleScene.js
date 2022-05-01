
const battleBattlegroundImage = new Image()
battleBattlegroundImage.src = './img/bg/battleBackground.png'
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

    skull = new Monster(monsters.Skull)
    okto = new Monster(monsters.Okto)
    draggle = new Monster(monsters.Draggle)
    emby = new Monster(monsters.Emby)
    enemy= okto
    enemy.isEnemy = true

    document.querySelector('#enemyName').innerHTML=enemy.name

    renderedSprites = [enemy, emby]
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
                recipient: enemy,
                renderedSprites
            })

            if(enemy.health <= 0){
                queue.push(() => {
                    enemy.faint()
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
            const randomAttack = enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)]

            queue.push(() => {
                enemy.attack({ 
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


    renderedSprites.forEach((sprite) => {
        if(sprite.isEnemy!==null){
            if(sprite.isEnemy===true){
                sprite.drawBack()
            }else{
                sprite.draw()
            }
        }else{
            sprite.draw()
        }
    })
}

function getBattle(){
    initBattle()
    animateBattle()
}


//animate()
getBattle()

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if(queue.length > 0){
        queue[0]()
        queue.shift()
    }else{
        e.currentTarget.style.display='none'
    }

})

function checkEfectiveness(attackType, recipientType){

    switch(recipientType){
        case 'Fire':
            switch(attackType){
                case 'Water':
                    return 2
                case 'Rock':
                    return 2
                case 'Plant':
                    return 0.5
                case 'Fire':
                    return 0.5
                case 'Ice':
                    return 0.5
                case 'Rock':
                    return 2
                case 'Fairy':
                    return 0.5
                case 'Steel':
                    return 0.5
                case 'Bug':
                    return 0.5
                case 'Ground':
                    return 2
                default:
                    return 1
            }
        case 'Water':
            switch(attackType){
                case 'Water':
                    return 0.5
                case 'Plant':
                    return 2
                case 'Fire':
                    return 0.5
                default:
                    return 1
            }
        case 'Plant':
            switch(attackType){
                case 'Fire':
                    return 2
                case 'Water':
                    return 0.5
                case 'Plant':
                    return 0.5
                case 'Electric':
                    return 0.5
                case 'Flying':
                    return 2
                case 'Ice':
                    return 2
                case 'Bug':
                    return 2
                case 'Poison':
                    return 2
                case 'Ground':
                    return 0.5
                default:
                    return 1
            }
        default:
            return 1
    }

    return 1

}