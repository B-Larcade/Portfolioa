document.addEventListener('DOMContentLoaded', () => {
    const codeBreaker = {
        secretCode: [],
        attempts: 0,
        maxAttempts: 10,
        feedbackEl: document.getElementById('feedback'),
        attemptsEl: document.getElementById('attempts'),
        input: document.getElementById('guess-input'),
        submitBtn: document.getElementById('submit-guess'),
        newGameBtn: document.getElementById('new-game')
    };

    function generateCode() {
        const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        digits.sort(() => Math.random() - 0.5);
        codeBreaker.secretCode = digits.slice(0, 4);
    }

    function checkGuess(guess) {
        if (guess.length !== 4 || isNaN(guess)) {
            codeBreaker.feedbackEl.classList.add('shake');
            setTimeout(() => codeBreaker.feedbackEl.classList.remove('shake'), 500);
            return "Enter exactly 4 digits!";
        }

        let correctPos = 0;
        let correctNum = 0;

        for (let i = 0; i < 4; i++) {
            if (parseInt(guess[i]) === codeBreaker.secretCode[i]) {
                correctPos++;
            } else if (codeBreaker.secretCode.includes(parseInt(guess[i]))) {
                correctNum++;
            }
        }

        codeBreaker.attempts++;
        codeBreaker.attemptsEl.textContent = `Attempts: ${codeBreaker.attempts} / ${codeBreaker.maxAttempts}`;

        if (correctPos === 4) {
            codeBreaker.feedbackEl.classList.add('win-pulse');
            setTimeout(() => codeBreaker.feedbackEl.classList.remove('win-pulse'), 1500);
            return `Correct! Code cracked: ${codeBreaker.secretCode.join('')} in ${codeBreaker.attempts} tries! 🎉`;
        }

        if (codeBreaker.attempts >= codeBreaker.maxAttempts) {
            return `Game over! The code was ${codeBreaker.secretCode.join('')}.`;
        }

        return `${correctPos} correct position, ${correctNum} correct number but wrong position`;
    }

    function startNewGame() {
        generateCode();
        codeBreaker.attempts = 0;
        codeBreaker.attemptsEl.textContent = `Attempts: 0 / ${codeBreaker.maxAttempts}`;
        codeBreaker.feedbackEl.textContent = "New game started – guess the 4-digit code!";
        codeBreaker.input.value = '';
        codeBreaker.input.focus();
        codeBreaker.feedbackEl.className = 'feedback'; // reset classes
    }

    codeBreaker.submitBtn.addEventListener('click', () => {
        const guess = codeBreaker.input.value.trim();
        if (guess) {
            const result = checkGuess(guess);
            codeBreaker.feedbackEl.textContent = result;
            codeBreaker.input.value = '';
        }
    });

    codeBreaker.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            codeBreaker.submitBtn.click();
        }
    });

    codeBreaker.newGameBtn.addEventListener('click', startNewGame);

    startNewGame();
});