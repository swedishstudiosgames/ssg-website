document.addEventListener('DOMContentLoaded', () => {
    const f = document.getElementById('sq'); // f = Form
    const ti = document.getElementById('q'); // ti = Text Input
    const fi = document.getElementById('qim'); // fi = File Input
    const mb = document.getElementById('mb'); // mb = Menu Button
    const mdd = document.getElementById('mdd'); // mdd = Menu Drop Down
    const mbs = document.querySelectorAll('#mdd button'); // mbs = Mode Buttons

    // Inject hidden input for 'image_url' required by Google's endpoint
    // Google expects this field to exist (even if empty) when uploading a file.
    if (f) {
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
            ii: false
        },
        web: {
            a: 'https://search.swedishstudiosgames.com/search',
            ph: 'Search the internet...',
            m: 'POST',
            e: 'application/x-www-form-urlencoded',
            ii: false
        },
        image: {
            // Updated to images.google.com for better reliability
            a: 'https://images.google.com/searchbyimage/upload',
            ph: 'Upload an image...',
            m: 'POST',
            e: 'multipart/form-data',
            ii: true
        },
        speech: {
            a: 'https://search.swedishstudiosgames.com/search', // Default to web search
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
            
            // Remove 'active' class from all buttons
            mbs.forEach(btn => btn.classList.remove('active'));
            
            // Add 'active' class to clicked button
            b.classList.add('active');
            
            // Close menu
            mdd.classList.remove('show');
            mb.setAttribute('aria-expanded', 'false');
        });
    });

    function sm(k) {
        const c = ms[k];

        // Update Form Attributes
        f.action = c.a;
        f.method = c.m;
        f.enctype = c.e;

        if (c.ii) {
            // Image Mode
            ti.classList.add('hidden');
            ti.disabled = true; // IMPORTANT: Disable text input so it's not sent
            
            fi.classList.remove('hidden');
            fi.disabled = false;
        } else {
            // Text Mode
            fi.classList.add('hidden');
            fi.disabled = true;

            ti.classList.remove('hidden');
            ti.disabled = false;
            ti.placeholder = c.ph;
            ti.focus();
        }

        // Trigger Speech Recognition if Speech Mode
        if (c.isSpeech) {
            startDictation();
        }
    }

    function startDictation() {
        if (window.webkitSpeechRecognition || window.SpeechRecognition) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = "en-US";
            
            // Visual cue that listening has started
            ti.placeholder = "Listening...";
            
            recognition.start();

            recognition.onresult = function(e) {
                if (e.results.length > 0) {
                    ti.value = e.results[0][0].transcript;
                }
                recognition.stop();
            };
            
            recognition.onerror = function(e) {
                console.error("Speech recognition error", e);
                ti.placeholder = "Error. Please type...";
                recognition.stop();
            }
            
            recognition.onend = function() {
                // Restore placeholder if empty
                if (!ti.value) {
                    ti.placeholder = "Speak to search...";
                }
            }
        } else {
            console.warn("Speech to text is not supported in this browser.");
            ti.placeholder = "Speech not supported.";
        }
    }
});
