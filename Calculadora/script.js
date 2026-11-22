const display = document.getElementById('display');
const COR_NORMAL = 'linear-gradient(gray, black)';   
const COR_DESTAQUE = 'linear-gradient(gray, red)'; 
let expression = '';

function updateDisplay(texto) {
    display.textContent = texto;
}

function pressed(valor) {
    expression += valor;
    updateDisplay(expression);
}

function clearAll() {
    expression = '';
    updateDisplay('');
}

function backspace() {
    expression = expression.slice(0, -1);
    updateDisplay(expression);
}

function calculate() {
    if (expression === '') return;

    try {
        if (expression.includes('**')) throw new Error('expressão inválida');
        const limpa = expression.replace(/(^|[^\d.])0+(?=\d)/g, '$1');

        const resultado = eval(limpa);

        if (typeof resultado !== 'number' || !isFinite(resultado)) {
            throw new Error('resultado inválido');
        }

        expression = String(Number(resultado.toPrecision(12)));
        updateDisplay(expression);
    } catch (erro) {
        expression = '';
        updateDisplay('Erro');
    }
}

function acender(botao) {
    if (botao) botao.style.backgroundImage = COR_DESTAQUE;
}

function apagar(botao) {
    if (botao) botao.style.backgroundImage = COR_NORMAL;
}

document.querySelectorAll('.btn').forEach(function (botao) {
    botao.addEventListener('pointerdown', function () { acender(botao); });
    botao.addEventListener('pointerup', function () { apagar(botao); });
    botao.addEventListener('pointerleave', function () { apagar(botao); });
    botao.addEventListener('pointercancel', function () { apagar(botao); });

    botao.addEventListener('click', function () { botao.blur(); });
});

function botaoDe(chamada) {
    return document.querySelector('button[onclick="' + chamada + '"]');
}

function botaoDaTecla(tecla) {
    if ('0123456789.+-*/'.includes(tecla) && tecla.length === 1) {
        return botaoDe("pressed('" + tecla + "')");
    }
    if (tecla === 'Backspace') return botaoDe('backspace()');
    if (tecla === 'Enter') return botaoDe('calculate()');
    if (tecla === 'Escape') return botaoDe('clearAll()');   // desafio extra
    return null;
}

const teclasAtivas = {};

document.addEventListener('keydown', function (e) {
    const botao = botaoDaTecla(e.key);
    if (!botao) return;

    e.preventDefault();

    if (e.repeat) return;

    teclasAtivas[e.code] = botao;
    acender(botao);
    botao.click();
});

document.addEventListener('keyup', function (e) {
    const botao = teclasAtivas[e.code];
    if (botao) {
        apagar(botao);
        delete teclasAtivas[e.code];
    }
});

window.addEventListener('blur', function () {
    Object.keys(teclasAtivas).forEach(function (code) {
        apagar(teclasAtivas[code]);
        delete teclasAtivas[code];
    });
});