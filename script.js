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

    initQuiz(level);
    document.getElementById('submit').addEventListener('click', () => evaluateQuiz(level));
}

function initQuiz(level) {
    const selectedQuestions = shuffleArray(questions).slice(0, QUIZ_SIZE);
    userAnswers = {};
    const quizDiv = document.getElementById('quiz');
    quizDiv.innerHTML = '';

    selectedQuestions.forEach((q, i) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'question';
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
            };
            optionsDiv.appendChild(optDiv);
        });

        qDiv.appendChild(optionsDiv);
        quizDiv.appendChild(qDiv);
    });
}

function evaluateQuiz(level) {
    const answered = Object.keys(userAnswers).length;
    if (answered < QUIZ_SIZE) {
        alert('Veuillez répondre à toutes les questions !');
        return;
    }

    let score = 0;
    const allOptions = document.querySelectorAll('.option');
    allOptions.forEach(opt => {
        opt.classList.remove('correct', 'incorrect', 'selected');
    });

    document.querySelectorAll('.question').forEach((q, i) => {
        const selected = userAnswers[i];
        const correct = questions.find(qq => qq.question === q.querySelector('h3').textContent.slice(3)).answer;
        q.querySelectorAll('.option').forEach(opt => {
            if (opt.textContent === correct) opt.classList.add('correct');
            if (opt.textContent === selected && selected !== correct) opt.classList.add('incorrect');
        });
        if (selected === correct) score++;
    });

    scores[level] = score;

    document.getElementById('result').innerHTML = `
        <h2>Votre score : ${score} / 10</h2>
        <p><strong>${(score / 10 * 100).toFixed(0)}%</strong> de bonnes réponses</p>
        <button id="continue-btn">Continuer vers le niveau suivant</button>
    `;

    document.getElementById('submit').style.display = 'none';

    if (level < 3) {
        document.getElementById('continue-btn').onclick = () => {
            if (level === 1) {
                document.getElementById('level2').classList.remove('disabled');
            }
            startLevel(level + 1);
        };
    } else {
        document.getElementById('continue-btn').textContent = 'Voir le récapitulatif final';
        document.getElementById('continue-btn').onclick = showRecap;
    }
}

function showRecap() {
    document.getElementById('quiz-container').innerHTML = `
        <div class="quiz-screen active" style="text-align:center; padding:80px;">
            <h2>Récapitulatif final</h2>
            <p style="font-size:2rem; margin:40px 0;">Score Level 1 : <strong>${scores[1] || 0}/10</strong></p>
            <p style="font-size:2rem; margin:40px 0;">Score Level 2 : <strong>${scores[2] || 0}/10</strong></p>
            <p style="font-size:1.6rem; margin:40px 0;">
                Score total : <strong>${(scores[1] || 0) + (scores[2] || 0)} / 20</strong>
            </p>
            <button id="reset-btn">Recommencer le quiz</button>
        </div>
    `;
    document.getElementById('reset-btn').onclick = () => location.reload();
}

document.getElementById('back-btn').addEventListener('click', () => {
    document.getElementById('quiz-container').innerHTML = '';
    document.getElementById('levels-screen').style.display = 'flex';
    document.getElementById('back-btn').style.display = 'none';
});

document.getElementById('level1').addEventListener('click', () => {
    if (!document.getElementById('level1').classList.contains('disabled')) {
        startLevel(1);
    }
});

document.getElementById('level2').addEventListener('click', () => {
    if (!document.getElementById('level2').classList.contains('disabled')) {
        startLevel(2);
    }
});