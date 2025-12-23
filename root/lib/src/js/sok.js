document.addEventListener('DOMContentLoaded', () => {
    const f = document.getElementById('sq'); // f = Form
    const ti = document.getElementById('q'); // ti = Text Input
    const fi = document.getElementById('qim'); // fi = File Input
    const mb = document.getElementById('mb'); // mb = Menu Button
    const mdd = document.getElementById('mdd'); // mdd = Menu Drop Down
    const mbs = document.querySelectorAll('#mdd button'); // mbs = Mode Buttons

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
            a: 'https://google.com/searchbyimage/upload',
            ph: 'Upload an image...',
            m: 'POST',
            e: 'multipart/form-data',
            ii: true
        }
    };

    // Toggle Menu
    mb.addEventListener('click', (e) => {
        e.stopPropagation();
        const ie = mb.getAttribute('aria-expanded') === 'true';
        mb.setAttribute('aria-expanded', !ie);
        mdd.classList.toggle('show'); // Toggles the CSS 'show' class which sets display: block
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
            ti.classList.add('hidden'); // Using CSS utility class
            ti.disabled = true;
            
            fi.classList.remove('hidden'); // Using CSS utility class
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
    }
});
