document.addEventListener('DOMContentLoaded', () => {
    const f = document.getElementById('sq'); // f = Form
    const ti = document.getElementById('q'); // ti = Text Input
    const fi = document.getElementById('qim'); // fi = File Input
    const mb = document.getElementById('mb'); // mb = Menu Button
    const mdd = document.getElementById('mdd'); // mdd = Menu Drop Down
    const mbs = document.querySelectorAll('#mdd button'); // mbs = Mode Buttons

    // State to track current mode and recognition instance
    let currentMode = 'web';
    let recognition = null;

    // Inject hidden input for 'image_url' required by Google's endpoint
    if (f && !f.querySelector('input[name="image_url"]')) {
        const hiddenUrl = document.createElement('input');
        hiddenUrl.type = 'hidden';
        hiddenUrl.name = 'image_url';
        f.appendChild(hiddenUrl);
    }

    // Mode Configuration
    const ms = {
        store: {
            a: 'https://store.swedishstudiosgames.com/search',
            ph: 'Search the store...',
            m: 'POST',
            e: 'application/x-www-form-urlencoded',
            ii: false,
            isSpeech: false
        },
        web: {
            a: 'https://search.swedishstudiosgames.com/search',
            ph: 'Search the internet...',
            m: 'POST',
            e: 'application/x-www-form-urlencoded',
            ii: false,
            isSpeech: false
        },
        image: {
            a: 'https://images.google.com/searchbyimage/upload',
            ph: 'Upload an image...',
            m: 'GET',
            e: 'multipart/form-data',
            ii: true,
            isSpeech: false
        },
        speech: {
            a: 'https://search.swedishstudiosgames.com/search',
            ph: 'Speak to search...',
            m: 'POST',
            e: 'application/x-www-form-urlencoded',
            ii: false,
            isSpeech: true
        }
    };

    // Toggle Menu
    mb.addEventListener('click', (e) => {
        e.stopPropagation();
        const ie = mb.getAttribute('aria-expanded') === 'true';
        mb.setAttribute('aria-expanded', !ie);
        mdd.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mdd.contains(e.target) && !mb.contains(e.target)) {
            mdd.classList.remove('show');
            mb.setAttribute('aria-expanded', 'false');
        }
    });

    // Handle Mode Selection
    mbs.forEach(b => {
        b.addEventListener('click', () => {
            const mk = b.getAttribute('data-mode');
            sm(mk);
            
            mbs.forEach(btn => btn.classList.remove('active'));
            b.classList.add('active');
            
            mdd.classList.remove('show');
            mb.setAttribute('aria-expanded', 'false');
        });
    });

    // Helper: Stop active recognition if any
    function stopRecognition() {
        if (recognition) {
            // Important: clear the onend handler to prevent it from resetting the UI 
            // if we are immediately starting a new session or switching modes.
            recognition.onend = null;
            try {
                recognition.stop();
            } catch (e) {
                // Ignore if already stopped
            }
            recognition = null;
        }
    }

    function sm(k) {
        currentMode = k;
        const c = ms[k];

        // Stop any ongoing speech recognition when changing modes
        stopRecognition();

        // Update Form Attributes
        f.action = c.a;
        f.method = c.m;
        f.enctype = c.e;

        if (c.ii) {
            // Image Mode
            ti.classList.add('hidden');
            ti.disabled = true;
            fi.classList.remove('hidden');
            fi.disabled = false;
        } else {
            // Text/Speech Mode
            fi.classList.add('hidden');
            fi.disabled = true;
            ti.classList.remove('hidden');
            ti.disabled = false;
            ti.placeholder = c.ph;
            ti.focus();
        }

        if (c.isSpeech) {
            startDictation();
        }
    }

    function startDictation() {
        // "Rely on Google's feature": Chrome uses Google's servers for Web Speech API.
        // This check ensures we use the correct prefixed version.
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Speech to text is not supported in this browser.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        stopRecognition(); // Ensure fresh instance
        recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = function() {
            ti.placeholder = "Listening... (Speak now)";
        };

        recognition.onresult = function(e) {
            if (e.results.length > 0) {
                ti.value = e.results[0][0].transcript;
                // Optional: Automatically submit form after speech
                // f.submit(); 
            }
        };

        recognition.onerror = function(e) {
            console.error("Speech error:", e);
            let msg = "Error occurred.";
            if (e.error === 'not-allowed') {
                msg = "Microphone blocked. Check permissions.";
            } else if (e.error === 'no-speech') {
                msg = "No speech detected. Try again.";
            }
            ti.placeholder = msg;
        };

        recognition.onend = function() {
            recognition = null;
            // Only reset placeholder if it still has the "Listening" or error state and no value
            if (!ti.value && (ti.placeholder.includes("Listening") || ti.placeholder.includes("Error"))) {
                ti.placeholder = "Click here to speak again...";
            }
        };

        try {
            recognition.start();
        } catch (e) {
            console.error("Failed to start recognition:", e);
        }
    }
    
    // Allow restarting dictation by clicking the input if in speech mode
    ti.addEventListener('click', () => {
        if (currentMode === 'speech' && !recognition) {
             startDictation();
        }
    });
});
