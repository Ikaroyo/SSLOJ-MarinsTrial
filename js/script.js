function agregarEventListeners() {
    const questions = document.querySelectorAll(".question");

    questions.forEach((question) => {
        question.addEventListener("click", () => {
            const answer = question.nextElementSibling;
            answer.style.display = answer.style.display === "block" ? "none" : "block";
        });
    });

    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    searchBtn.addEventListener("click", filterQuestions);
    searchInput.addEventListener("input", filterQuestions);

    const collapseBtn = document.getElementById("collapse-btn");
    const collapseIcon = collapseBtn.querySelector("img");
    let isCollapsed = true;

    collapseBtn.addEventListener("click", toggleAnswers);

    function filterQuestions() {
        const query = searchInput.value.toLowerCase();

        questions.forEach((question) => {
            const answer = question.nextElementSibling;
            const questionText = question.textContent.toLowerCase();
            const answerText = answer.textContent.toLowerCase();

            if (questionText.includes(query) || answerText.includes(query)) {
                question.style.display = "block";
                answer.style.display = isCollapsed ? "none" : "block";
            } else {
                question.style.display = "none";
                answer.style.display = "none";
            }
        });
    }

    function toggleAnswers() {
        const answerDisplay = isCollapsed ? "block" : "none";

        questions.forEach((question) => {
            const answer = question.nextElementSibling;
            answer.style.display = answerDisplay;
        });

        collapseIcon.src = isCollapsed ? "img/colapsar.png" : "img/expandir.png";
        isCollapsed = !isCollapsed;
        filterQuestions();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const questions = document.querySelectorAll('.question');
    const answers = document.querySelectorAll('.answer');

    // Collapse the answers by default
    answers.forEach((answer) => {
        answer.style.display = 'none';
    });

    const idiomas = {
        es: 'lang/es.json',
        en: 'lang/en.json',
        fr: 'lang/fr.json',
        pt: 'lang/pt.json'
    };

    const selectIdioma = document.getElementById('idioma');

    // Obtener el idioma guardado en localStorage (si existe)
    const idiomaGuardado = localStorage.getItem('idioma');
    if (idiomaGuardado) {
        selectIdioma.value = idiomaGuardado;
    }

    // Cargar el FAQ correspondiente al idioma guardado (o al primer idioma por defecto)
    const idiomaSeleccionado = selectIdioma.value;
    cargarFaq(idiomaSeleccionado);

    // Guardar el idioma seleccionado en localStorage al cambiar la selección
    selectIdioma.addEventListener('change', () => {
        const idioma = selectIdioma.value;
        cargarFaq(idioma);
        localStorage.setItem('idioma', idioma);
    });

    agregarEventListeners(); // Agregar los event listeners al cargar la página

    function cargarFaq(idioma) {
        const url = idiomas[idioma];
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const preguntas = data;
                const faqDiv = document.getElementById('faq');
                faqDiv.innerHTML = '';

                preguntas.forEach(pregunta => {
                    const preguntaDiv = document.createElement('div');
                    preguntaDiv.classList.add('question');
                    preguntaDiv.textContent = pregunta.question;
                    faqDiv.appendChild(preguntaDiv);

                    const respuestaDiv = document.createElement('div');
                    respuestaDiv.classList.add('answer');
                    const respuestas = [
                        pregunta['answer valid'],
                        pregunta['answer invalid 1'],
                        pregunta['answer invalid 2'],
                        pregunta['answer invalid 3']
                    ];
                    respuestas.forEach((respuesta, index) => {
                        const respuestaLi = document.createElement('li');
                        respuestaLi.classList.add('list-group-item');
                        respuestaLi.textContent = respuesta;
                        respuestaDiv.appendChild(respuestaLi);
                        if (index === 0) {
                            respuestaLi.classList.add('valid');
                        }
                    });
                    faqDiv.appendChild(respuestaDiv);
                });
                agregarEventListeners(); // Agregar los event listeners después de cargar el nuevo contenido
            })
            .catch(error => {
                console.error('Error al cargar el archivo JSON:', error);
            });
    }
});
