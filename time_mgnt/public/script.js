let timer;
let isRunning = false;
let isBreak = false;
let studyHistory = [];

// Event Listeners for Sign Up and Sign In Forms
document.getElementById('signupForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    // Store user data in local storage
    localStorage.setItem('user', JSON.stringify({ name, email, password }));
    document.getElementById('signupModal').style.display = 'none';
    alert('Sign Up successful. You can now log in.');
});

document.getElementById('signinForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email === email && user.password === password) {
        document.getElementById('signinModal').style.display = 'none';
        document.getElementById('account').innerText = `Welcome, ${user.name}`;
        alert('Login successful.');
    } else {
        alert('Invalid email or password.');
    }
});

// Event Listeners for Modals
document.getElementById('signUp').addEventListener('click', () => {
    document.getElementById('signupModal').style.display = 'block';
});

document.getElementById('logIn').addEventListener('click', () => {
    document.getElementById('signinModal').style.display = 'block';
});

document.getElementById('closeSignup').addEventListener('click', () => {
    document.getElementById('signupModal').style.display = 'none';
});

document.getElementById('closeSignin').addEventListener('click', () => {
    document.getElementById('signinModal').style.display = 'none';
});

// Event Listeners for Timer Controls
document.getElementById('startBtn').addEventListener('click', () => {
    if (!isRunning) {
        startTimer();
        document.getElementById('goodLuckMessage').innerText = "Good luck with your study session!";
        isRunning = true;
    }
});

document.getElementById('resetBtn').addEventListener('click', resetTimer);

document.getElementById('historyBtn').addEventListener('click', () => {
    displayHistory();
    document.getElementById('historyModal').style.display = "block";
});

document.getElementById('calendarBtn').addEventListener('click', () => {
    document.getElementById('calendarModal').style.display = "block";
});

document.getElementById('spotifyBtn').addEventListener('click', () => {
    window.open('https://open.spotify.com/', '_blank');
});

document.getElementById('settingsBtn').addEventListener('click', () => {
    document.getElementById('settingsModal').style.display = "block";
});

document.getElementById('closeHistory').addEventListener('click', () => {
    document.getElementById('historyModal').style.display = "none";
});

document.getElementById('closeCalendar').addEventListener('click', () => {
    document.getElementById('calendarModal').style.display = "none";
});

document.getElementById('closeSettings').addEventListener('click', () => {
    document.getElementById('settingsModal').style.display = "none";
});

document.getElementById('saveNoteBtn').addEventListener('click', saveNote);

// Event Listeners for Mode Buttons
document.getElementById('pomodoro').addEventListener('click', () => {
    if (!isRunning) {
        setMode('pomodoro');
    }
});

document.getElementById('shortBreak').addEventListener('click', () => {
    if (!isRunning) {
        setMode('shortBreak');
    }
});

document.getElementById('longBreak').addEventListener('click', () => {
    if (!isRunning) {
        setMode('longBreak');
    }
});

// Function to set the mode of the timer
function setMode(mode) {
    isBreak = mode !== 'pomodoro';
    resetTimer();
    let duration = mode === 'pomodoro' ? 25 * 60 : (mode === 'shortBreak' ? 5 * 60 : 15 * 60);
    document.getElementById('timer').setAttribute('data-duration', duration);
    document.getElementById('timer').innerText = formatTime(duration);
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(mode).classList.add('active');
}

// Function to start the timer
function startTimer() {
    let duration = parseInt(document.getElementById('timer').getAttribute('data-duration'));
    timer = setInterval(() => {
        duration--;
        document.getElementById('timer').innerText = formatTime(duration);
        if (duration <= 0) {
            clearInterval(timer);
            isRunning = false;
            studyHistory.push(new Date().toLocaleString());
            document.getElementById('goodLuckMessage').innerText = isBreak ? 'Break time is up!' : 'Time is up! Take a break or start another session.';
            alert(isBreak ? 'Break time is up!' : 'Time is up! Take a break or start another session.');
            ringBell();
        }
        document.getElementById('timer').setAttribute('data-duration', duration);
    }, 1000);
}

// Function to format time in MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Function to reset the timer
function resetTimer() {
    clearInterval(timer);
    document.getElementById('timer').innerText = formatTime(document.getElementById('timer').getAttribute('data-duration'));
    document.getElementById('goodLuckMessage').innerText = '';
    isRunning = false;
}

// Function to display study history
function displayHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    studyHistory.forEach((record, index) => {
        const listItem = document.createElement('li');
        listItem.innerText = `Session ${index + 1}: ${record}`;
        historyList.appendChild(listItem);
    });
}

// Function to save notes
function saveNote() {
    const noteDate = document.getElementById('noteDate').value;
    const noteText = document.getElementById('noteText').value;
    if (noteDate && noteText) {
        const noteList = document.getElementById('noteList');
        const noteItem = document.createElement('li');
        noteItem.innerText = `${noteDate}: ${noteText}`;
        noteList.appendChild(noteItem);
        document.getElementById('noteDate').value = '';
        document.getElementById('noteText').value = '';
    } else {
        alert('Please enter both a date and a note.');
    }
}

// Function to play a ring sound
function ringBell() {
    const audio = new Audio('bell.mp3'); // Ensure you have a bell.mp3 file in your project directory
    audio.play();
}

// Check user status on page load
window.addEventListener('load', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('account').innerText = `Welcome, ${user.name}`;
    }
});
