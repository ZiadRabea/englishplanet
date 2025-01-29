// Toggle Menu 
let state = "closed";
let audio = null; // Initialize audio object
let speaking = false; // Track speaking state
let br_timing = 0; // Timing for "br" type
let am_timing = 0; // Timing for "am" type

function toggleMenu() {
    const menu = document.querySelector('.hamburger-menu');
    menu.classList.toggle('open');
    
    const menuElement = document.getElementById('menu');
    
    if (state == "closed") {
        menuElement.style.left = "0";
        menuElement.style.width = "100%";
        state = "open";  // Update state to "open"
    } else {
        menuElement.style.left = "-110%";
        state = "closed";  // Update state to "closed"
    }
}

// Read Aloud Function (placeholder)
function readAloud(file, type) {
    if (speaking) {
        console.log('Pausing audio');
        speaking = false;
        if (type === "br") {
            br_timing = audio.currentTime;
            console.log(`BR Timing paused at: ${br_timing}`);
        } else {
            am_timing = audio.currentTime;
            console.log(`AM Timing paused at: ${am_timing}`);
        }
        audio.pause();
    } else {
        console.log('Playing audio');
        audio = new Audio(file);

        // Reset timing to the appropriate variable
        if (type === "br") {
            audio.currentTime = br_timing;
            am_timing = 0;
        } else {
            audio.currentTime = am_timing;
            br_timing = 0;
        }

        speaking = true;

        // Reset timing when audio ends
        audio.onended = function () {
            console.log('Audio ended');
            if (type === "br") {
                br_timing = 0; // Reset timing
                console.log('BR Timing reset to 0');
            } else {
                am_timing = 0; // Reset timing
                console.log('AM Timing reset to 0');
            }
            speaking = false; // Ensure speaking is set to false
        };

        audio.play();
    }
}


function toggleCategory(element) {
    const subcategories = element.nextElementSibling;  // Get the next sibling (subcategories div)
    const icon = element.querySelector('i');  // Get the icon inside the category div

    // Toggle visibility of subcategories
    if (subcategories.style.display === 'none' || subcategories.style.display === '') {
        subcategories.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        subcategories.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

function select(selectedRadio) {
    // Get all radio buttons for this question
    const questionName = selectedRadio.name;
    const radios = document.getElementsByName(questionName);

    // Deselect any previously selected radio buttons and clear old classes
    radios.forEach((radio) => {
        const label = radio.nextElementSibling;
        label.classList.remove('selected', 'right', 'wrong');
    });

    // Add the 'selected' class to the clicked label
    const label = selectedRadio.nextElementSibling;
    label.classList.add('selected');
}

// Add event listener to all radio buttons
document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
        select(event.target);  // Call select function on change
    });
});

// Evaluate the score as a percentage
function evaluateScore() {
    const form = document.getElementById('quiz-form');
    let score = 0;
    const allQuestions = form.querySelectorAll('.question-group');
    const totalQuestions = allQuestions.length; // Total number of questions

    // Loop through all radio buttons and calculate score
    form.querySelectorAll('input[type="radio"]:checked').forEach((radio) => {
        // Check if the selected answer has the 'right' class
        //const label = radio.nextElementSibling;
        if (radio.classList.contains('right')) {
            score += 1;  // Increment score for correct answer
        }
    });

    // Calculate the score as a percentage
    const percentage = (score / totalQuestions) * 100;

    // Display result
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = `Your score is: ${percentage}%`;
    
    // Show the correct/incorrect feedback
    showFeedback(allQuestions);
}

function showFeedback(allQuestions) {
    // For each question, highlight correct and incorrect answers
    allQuestions.forEach((question) => {
        const selectedRadio = question.querySelector('input[type="radio"]:checked');
        const radios = question.querySelectorAll('input[type="radio"]');

        radios.forEach((radio) => {
            const label = radio.nextElementSibling;
            if (radio.classList.contains('right')) {
                label.classList.add('right');
            } else if (radio.classList.contains('wrong')) {
                label.classList.add('wrong');
            }
        });
    });
}
