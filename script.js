kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1]
});

loadRoot('https://i.imgur.com/');
loadSprite('player', 'Wb1qfhK.png');
loadSprite('ground', 'M6rwarW.png');
loadSprite('block', 'pogC9x5.png');
loadSprite('surprise', 'gesQ1KP.png');
loadSprite('noprise', 'bdrlpi6.png');
loadSprite('coin', 'wbKxhcd.png');
loadSprite('mushroom', '0wMd92p.png');

scene('game', () => {
    layers(['bg', 'obj', 'ui'], 'obj');

    const map = [
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                      %                 ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                %   #*#%#               ',
        '                                        ',
        '                                        ',
        '                                        ',
        '========================================',
        '========================================'
    ];

    const MOVE_SPEED = 120;
    const JUMP_FORCE = 480;
    const config = {
        width: 20,
        height: 20,
        '=': [sprite('ground'), solid()],
        '#': [sprite('block'), solid()],
        '%': [sprite('surprise'), solid(), 'coin-surprise'],
        '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
        '$': [sprite('coin')],
        '^': [sprite('mushroom'), solid()]
    };
    const gameLevel = addLevel(map, config);
    const player = add([
        sprite('player'),
        solid(),
        pos(30, 0),
        body(),
        origin('bot')
    ]);

    keyDown('left', () => player.move(-MOVE_SPEED, 0));
    keyDown('right', () => player.move(MOVE_SPEED, 0));
    keyPress('space', () => {
        if (player.grounded()) {
            player.jump(JUMP_FORCE);
        }
    });
});

start('game');
