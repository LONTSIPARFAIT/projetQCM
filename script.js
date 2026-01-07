const questions = [
    { question: "Quelle est la capitale de l'Espagne ?", options: ["Berlin", "Madrid", "Lisbonne", "Rome"], answer: "Madrid" },
    { question: "Quelle est la couleur du ciel par temps clair ?", options: ["Rouge", "Bleu", "Vert", "Jaune"], answer: "Bleu" },
    { question: "Quel est le symbole chimique de l'eau ?", options: ["O2", "H2O", "CO2", "NaCl"], answer: "H2O" },
    { question: "Quelle est la plus grande planète du système solaire ?", options: ["Terre", "Mars", "Jupiter", "Saturne"], answer: "Jupiter" },
    { question: "Quel langage gère l'interactivité sur une page web ?", options: ["HTML", "CSS", "JavaScript", "PHP"], answer: "JavaScript" },
    { question: "Quel langage stylise les pages web ?", options: ["HTML", "JavaScript", "CSS", "Python"], answer: "CSS" },
    { question: "Quel est le plus grand pays du monde en superficie ?", options: ["Canada", "Russie", "Chine", "États-Unis"], answer: "Russie" },
    { question: "En quelle année est tombé le mur de Berlin ?", options: ["1987", "1991", "1989", "1993"], answer: "1989" },
    { question: "Combien y a-t-il de continents sur Terre ?", options: ["5", "6", "7", "8"], answer: "7" },
    { question: "Quel pays a remporté la Coupe du monde 2018 ?", options: ["Brésil", "Angleterre", "France", "Argentine"], answer: "France" },
    { question: "Qui a découvert l'Amérique en 1492 ?", options: ["Magellan", "Christophe Colomb", "Vasco de Gama", "Marco Polo"], answer: "Christophe Colomb" },
    { question: "Quel est le plus long fleuve d'Afrique ?", options: ["Congo", "Nil", "Niger", "Zambeze"], answer: "Nil" },
    { question: "Quel est le plus grand mammifère terrestre ?", options: ["Girafe", "Éléphant", "Rhinocéros", "Hippopotame"], answer: "Éléphant" },
    { question: "Quel est le plus grand lac d'Afrique ?", options: ["Lac Tanganyika", "Lac Malawi", "Lac Victoria", "Lac Tchad"], answer: "Lac Victoria" },
    { question: "Quel protocole transfère des fichiers sur Internet ?", options: ["HTTP", "DNS", "FTP", "SMTP"], answer: "FTP" },
    { question: "Quelle particule a une charge positive ?", options: ["Électron", "Proton", "Neutron", "Photon"], answer: "Proton" },
    { question: "Quelle molécule est essentielle à la photosynthèse ?", options: ["Hémoglobine", "ADN", "Chlorophylle", "ARN"], answer: "Chlorophylle" }
];

const QUIZ_SIZE = 10;
let currentLevel = 1;
let scores = { 1: null, 2: null };
let selectedQuestions = [];
let userAnswers = {};

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function startLevel(level) {
    currentLevel = level;
    document.getElementById('levels-screen').style.display = 'none';
    document.getElementById('back-btn').style.display = 'block';

    selectedQuestions = shuffleArray(questions).slice(0, QUIZ_SIZE);
    userAnswers = {};

    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class="quiz-screen active">
            <div class="progress-info">Level ${level} • 10 questions • 1 point par bonne réponse</div>
            <div id="quiz"></div>
            <div class="actions">
                <button id="submit">Vérifier mes réponses</button>
            </div>
            <div id="result"></div>
        </div>
    `;

    renderQuiz();
    document.getElementById('submit').addEventListener('click', checkAnswers);
}

function renderQuiz() {
    const quizDiv = document.getElementById('quiz');
    quizDiv.innerHTML = '';

    selectedQuestions.forEach((q, i) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'question';
        qDiv.id = `q-${i}`;
        qDiv.innerHTML = `<h3>${i + 1}. ${q.question}</h3>`;

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';

        q.options.forEach(opt => {
            const optDiv = document.createElement('div');
            optDiv.className = 'option';
            optDiv.textContent = opt;
            optDiv.onclick = () => {
                optionsDiv.querySelectorAll('.option').forEach(el => el.classList.remove('selected'));
                optDiv.classList.add('selected');
                userAnswers[i] = opt;
                qDiv.classList.remove('missing');
            };
            optionsDiv.appendChild(optDiv);
        });

        qDiv.appendChild(optionsDiv);
        quizDiv.appendChild(qDiv);
    });
}

function checkAnswers() {
    // Réinitialiser les styles
    document.querySelectorAll('.question').forEach(q => q.classList.remove('missing'));
    document.getElementById('result').innerHTML = '';

    const missing = [];
    for (let i = 0; i < QUIZ_SIZE; i++) {
        if (userAnswers[i] === undefined) {
            missing.push(i + 1);
            document.getElementById(`q-${i}`).classList.add('missing');
        }
    }

    if (missing.length > 0) {
        const last = missing.pop();
        let msg = `<div class="warning-message">
            ⚠️ Vous n'avez pas répondu à la${missing.length > 0 ? 's' : ''} question${missing.length > 1 ? 's' : ''} :
            <strong>${missing.length > 0 ? missing.join(', ') + ' et ' : ''}${last}</strong>
        </div>`;
        document.getElementById('result').innerHTML = msg;
        return;
    }

    // Toutes les réponses sont données → correction
    let score = 0;
    selectedQuestions.forEach((q, i) => {
        const userChoice = userAnswers[i];
        const options = document.querySelectorAll(`#q-${i} .option`);
        options.forEach(opt => {
            opt.classList.remove('selected');
            if (opt.textContent === q.answer) opt.classList.add('correct');
            if (opt.textContent === userChoice && userChoice !== q.answer) opt.classList.add('incorrect');
        });
        if (userChoice === q.answer) score++;
    });

    scores[currentLevel] = score;

    let nextBtnText = currentLevel === 1 ? "Passer au Level 2" : "Voir le récapitulatif final";
    let nextAction = currentLevel === 1 ? () => startLevel(2) : showFinalRecap;

    document.getElementById('result').innerHTML = `
        <div style="background:white; padding:40px; border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
            <h2>Votre score Level ${currentLevel}</h2>
            <p style="font-size:3rem; margin:30px 0; font-weight:800;">${score} / 10 points</p>
            <p style="font-size:1.4rem; color:#555;">${(score * 10)}% de bonnes réponses</p>
            <div class="actions" style="margin-top:40px;">
                <button id="next-level">${nextBtnText}</button>
                <button class="secondary" onclick="location.reload()">Recommencer</button>
            </div>
        </div>
    `;

    document.getElementById('next-level').onclick = () => {
        if (currentLevel === 1) {
            document.getElementById('level2').classList.remove('disabled');
        }
        nextAction();
    };

    document.getElementById('submit').style.display = 'none';
}

function showFinalRecap() {
    document.getElementById('quiz-container').innerHTML = `
        <div class="quiz-screen active" style="text-align:center; padding:80px;">
            <h2 style="font-size:2.8rem; margin-bottom:40px;">Récapitulatif final</h2>
            <p style="font-size:2.2rem; margin:40px 0;">
                Level 1 : <strong>${scores[1] || 0}/10</strong> points
            </p>
            <p style="font-size:2.2rem; margin:40px 0;">
                Level 2 : <strong>${scores[2] || 0}/10</strong> points
            </p>
            <p style="font-size:2.8rem; margin:60px 0; font-weight:800;">
                Score total : <strong>${(scores[1] || 0) + (scores[2] || 0)} / 20</strong>
            </p>
            <div class="actions">
                <button onclick="location.reload()">Rejouer le quiz</button>
            </div>
        </div>
    `;
}

// Navigation
document.getElementById('back-btn').addEventListener('click', () => {
    document.getElementById('quiz-container').innerHTML = '';
    document.getElementById('levels-screen').style.display = 'flex';
    document.getElementById('back-btn').style.display = 'none';
});

document.getElementById('level1').addEventListener('click', () => startLevel(1));

document.getElementById('level2').addEventListener('click', () => {
    if (!document.getElementById('level2').classList.contains('disabled')) {
        startLevel(2);
    }
});

document.getElementById('level3').addEventListener('click', () => {
    if (scores[1] !== null && scores[2] !== null) {
        showFinalRecap();
    }
});