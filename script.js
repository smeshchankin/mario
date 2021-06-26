kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true
});

loadRoot('https://i.imgur.com/');
loadSprite('player', 'Wb1qfhK.png');
loadSprite('block', 'M6rwarW.png');

scene('game', () => {
    layers(['bg', 'obj', 'ui'], 'obj');

    const map = [
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '==================================  ===='
    ];

    const config = {
        width: 20,
        height: 20,
        '=': [sprite('block'), solid()]
    };
    const gameLevel = addLevel(map, config);
});

start('game');
