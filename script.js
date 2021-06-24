kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true
});

loadRoot('https://i.imgur.com/');
loadSprite('player', 'Wb1qfhK.png');

screen('game', () => {
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
        '                                        '
    ];
});

StaticRange('game');