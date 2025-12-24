document.addEventListener('DOMContentLoaded', () => {
    const f = document.getElementById('sq'); // f = Form
    const ti = document.getElementById('q'); // ti = Text Input
    const fi = document.getElementById('qim'); // fi = File Input
    const mb = document.getElementById('mb'); // mb = Menu Button
    const mdd = document.getElementById('mdd'); // mdd = Menu Drop Down
    const mbs = document.querySelectorAll('#mdd button'); // mbs = Mode Buttons

    let recognition = null;

    // Inject hidden input for 'image_url' required by Google's endpoint
    if (f && !f.querySelector('input[name="image_url"]')) {
        const h = document.createElement('input');
        h.type = 'hidden';
        h.name = 'image_url';
        f.appendChild(h);
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
            // Using the legacy Google upload endpoint which is most robust for forms
            a: 'https://www.google.com/searchbyimage/upload',
            ph: 'Upload an image...',
            m: 'POST',
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
        const ex = mb.getAttribute('aria-expanded') === 'true';
        mb.setAttribute('aria-expanded', !ex);
        mdd.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mdd && !mdd.contains(e.target) && !mb.contains(e.target)) {
            mdd.classList.remove('show');
            mb.setAttribute('aria-expanded', 'false');
        }
    });

    // Helper: Stop recognition cleanly
    const stopRec = () => {
        if (recognition) {
            recognition.onend = null;
            try { recognition.stop(); } catch (e) {}
            recognition = null;
        }
    };

    // Handle Mode Selection
    mbs.forEach(b => {
        b.addEventListener('click', () => {
            const mk = b.getAttribute('data-mode');
            const c = ms[mk];
            
            stopRec();

            // Update UI Active State
            mbs.forEach(btn => btn.classList.remove('active'));
            b.classList.add('active');
            mdd.classList.remove('show');
            mb.setAttribute('aria-expanded', 'false');

            // Update Form Attributes
            f.action = c.a;
            f.method = c.m;
            f.enctype = c.e;

            // Toggle Inputs
            if (c.ii) {
                ti.classList.add('hidden');
                ti.disabled = true; // Disable text so it's not sent
                fi.classList.remove('hidden');
                fi.disabled = false;
            } else {
                fi.classList.add('hidden');
                fi.disabled = true;
                ti.classList.remove('hidden');
                ti.disabled = false;
                ti.placeholder = c.ph;
                ti.focus();
            }

            // Start Speech
            if (c.isSpeech) {
                if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                    alert("Speech not supported.");
                    return;
                }
                const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
                recognition = new SR();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = "en-US";
                
                recognition.onstart = () => { ti.placeholder = "Listening..."; };
                recognition.onresult = (e) => { 
                    if(e.results.length > 0) ti.value = e.results[0][0].transcript; 
                };
                recognition.onerror = () => { ti.placeholder = "Error. Try again."; };
                recognition.onend = () => { recognition = null; };
                
                try { recognition.start(); } catch(e) {}
            }
        });
    });
    
    // Restart speech on click if in speech mode
    ti.addEventListener('click', () => {
        if (document.querySelector('button[data-mode="speech"].active') && !recognition) {
             // Logic to restart would go here, effectively selecting speech mode again
             document.querySelector('button[data-mode="speech"]').click();
        }
    });
});