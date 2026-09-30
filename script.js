/* ==========================================================================
   MINITA WEDDING - LUXURY DIGITAL WEDDING INVITATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------------------
    // 1. Envelope Opening & Ambient Audio Setup
    // ------------------------------------------------------------------------
    const envelopeOverlay = document.getElementById('envelope-overlay');
    const sealBtn = document.getElementById('seal-btn');
    const musicBtn = document.getElementById('music-toggle-btn');

    const bgAudio = document.getElementById('bg-music');

    let isAudioPlaying = false;
    let audioCtx = null;
    let synthInterval = null;
    let currentNoteIndex = 0;

    // Romantic Canon in D / Wedding Melody sequence for Web Audio fallback
    const romanticMelody = [
        { freq: 293.66, dur: 0.6 }, { freq: 369.99, dur: 0.4 }, { freq: 440.00, dur: 0.8 }, { freq: 587.33, dur: 1.0 },
        { freq: 220.00, dur: 0.6 }, { freq: 277.18, dur: 0.4 }, { freq: 329.63, dur: 0.8 }, { freq: 440.00, dur: 1.0 },
        { freq: 246.94, dur: 0.6 }, { freq: 293.66, dur: 0.4 }, { freq: 369.99, dur: 0.8 }, { freq: 493.88, dur: 1.0 },
        { freq: 185.00, dur: 0.6 }, { freq: 220.00, dur: 0.4 }, { freq: 277.18, dur: 0.8 }, { freq: 369.99, dur: 1.0 },
        { freq: 196.00, dur: 0.6 }, { freq: 246.94, dur: 0.4 }, { freq: 293.66, dur: 0.8 }, { freq: 392.00, dur: 1.0 },
        { freq: 293.66, dur: 0.6 }, { freq: 369.99, dur: 0.4 }, { freq: 440.00, dur: 0.8 }, { freq: 587.33, dur: 1.0 }
    ];

    function playNextMelodyNote() {
        if (!audioCtx || !isAudioPlaying) return;
        const note = romanticMelody[currentNoteIndex];
        currentNoteIndex = (currentNoteIndex + 1) % romanticMelody.length;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + note.dur + 0.8);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + note.dur + 0.9);
    }

    function startSynthAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        isAudioPlaying = true;
        musicBtn.classList.add('playing');
        musicBtn.setAttribute('title', 'Pause Audio');
        playNextMelodyNote();
        if (synthInterval) clearInterval(synthInterval);
        synthInterval = setInterval(playNextMelodyNote, 480);
    }

    function playAudio() {
        if (bgAudio) {
            bgAudio.play().then(() => {
                isAudioPlaying = true;
                musicBtn.classList.add('playing');
                musicBtn.setAttribute('title', 'Pause Audio');
            }).catch((err) => {
                console.log('HTML5 Audio play deferred, falling back to Web Audio Synth', err);
                startSynthAudio();
            });
        } else {
            startSynthAudio();
        }
    }

    function pauseAudio() {
        if (bgAudio && !bgAudio.paused) {
            bgAudio.pause();
        }
        if (synthInterval) {
            clearInterval(synthInterval);
        }
        isAudioPlaying = false;
        musicBtn.classList.remove('playing');
        musicBtn.setAttribute('title', 'Play Audio');
    }

    function toggleAudio() {
        if (isAudioPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    }

    musicBtn.addEventListener('click', toggleAudio);

    // Wooden Door Opening Action
    function openWoodenDoor(e) {
        if (e) e.stopPropagation();
        if (envelopeOverlay.classList.contains('opened')) return;
        envelopeOverlay.classList.add('opened');
        playAudio(); // Autoplay music on tap to open

        setTimeout(() => {
            envelopeOverlay.classList.add('hidden');
        }, 1300);
    }

    if (sealBtn) sealBtn.addEventListener('click', openWoodenDoor);

    const doorLeft = document.getElementById('door-panel-left');
    const doorRight = document.getElementById('door-panel-right');
    if (doorLeft) doorLeft.addEventListener('click', openWoodenDoor);
    if (doorRight) doorRight.addEventListener('click', openWoodenDoor);

    // ------------------------------------------------------------------------
    // 2. Interactive HTML5 Canvas "Scratch to Reveal" Card
    // ------------------------------------------------------------------------
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d');
    let isScratching = false;
    let scratchedPixels = 0;
    let totalPixels = 0;
    let isRevealed = false;

    function initScratchCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        totalPixels = canvas.width * canvas.height;

        // Create Metallic Light Green & Gold Foil Gradient Background
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#98C9A3');
        grad.addColorStop(0.5, '#528E6B');
        grad.addColorStop(1, '#264F38');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Gold Speckles & Glitter Texture
        for (let i = 0; i < 180; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const r = Math.random() * 2 + 0.5;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = Math.random() > 0.5 ? '#D4AF37' : '#FAF4FA';
            ctx.globalAlpha = Math.random() * 0.6 + 0.2;
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        // Draw Decorative Inner Gold Border
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        // Add Instructional Overlay Text
        ctx.fillStyle = '#FAF4FA';
        ctx.font = '600 13px Montserrat';
        ctx.textAlign = 'center';
        ctx.fillText('✨ SCRATCH HERE TO REVEAL DATE ✨', canvas.width / 2, canvas.height / 2 + 5);

        ctx.fillStyle = '#D4AF37';
        ctx.font = 'italic 12px Cormorant Garamond';
        ctx.fillText('(Use finger or mouse)', canvas.width / 2, canvas.height / 2 + 25);
    }

    function getScratchPos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    function scratch(e) {
        if (!isScratching || isRevealed) return;
        e.preventDefault();

        const pos = getScratchPos(e);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 24, 0, Math.PI * 2);
        ctx.fill();

        checkScratchPercentage();
    }

    function checkScratchPercentage() {
        if (isRevealed) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentCount = 0;

        for (let i = 3; i < pixels.length; i += 64) {
            if (pixels[i] === 0) {
                transparentCount++;
            }
        }

        const sampleTotal = pixels.length / 64;
        const ratio = transparentCount / sampleTotal;

        if (ratio > 0.35) {
            isRevealed = true;
            canvas.style.transition = 'opacity 0.6s ease-out';
            canvas.style.opacity = '0';
            setTimeout(() => {
                canvas.style.display = 'none';
            }, 600);
        }
    }

    canvas.addEventListener('mousedown', (e) => { isScratching = true; scratch(e); });
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', () => { isScratching = false; });

    canvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); }, { passive: false });
    canvas.addEventListener('touchmove', scratch, { passive: false });
    window.addEventListener('touchend', () => { isScratching = false; });

    setTimeout(initScratchCanvas, 100);
    window.addEventListener('resize', initScratchCanvas);

    // ------------------------------------------------------------------------
    // 3. Save The Date (.ics Calendar Download)
    // ------------------------------------------------------------------------
    const saveDateBtn = document.getElementById('save-date-btn');
    saveDateBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Minita Wedding//Digital Invitation//EN',
            'BEGIN:VEVENT',
            'SUMMARY:Wedding Ceremony - Minitanithya & Rayagan',
            'DESCRIPTION:Join us to celebrate the wedding ceremony of Minitanithya & Rayagan!',
            'LOCATION:Mary Mother of God Church & S.F.S. School Ground, Kodani, Honnavar',
            'DTSTART:20261122T100000Z',
            'DTEND:20261122T160000Z',
            'STATUS:CONFIRMED',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'Wedding_Minitanithya_and_Rayagan.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // ------------------------------------------------------------------------
    // 4. Photo Gallery Carousel Logic
    // ------------------------------------------------------------------------
    const track = document.getElementById('carousel-track');
    const slides = Array.from(track.children);
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsNav = document.getElementById('carousel-dots');

    let currentIndex = 0;

    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsNav.appendChild(dot);
    });

    const dots = Array.from(dotsNav.children);

    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 4500);

    // ------------------------------------------------------------------------
    // 5. Live Countdown Timer (Target: November 22, 2026 10:00 AM)
    // ------------------------------------------------------------------------
    const targetDate = new Date('November 22, 2026 10:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.getElementById('days').innerText = '00';
            document.getElementById('hours').innerText = '00';
            document.getElementById('minutes').innerText = '00';
            document.getElementById('seconds').innerText = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ------------------------------------------------------------------------
    // 6. Interactive RSVP Form Submission
    // ------------------------------------------------------------------------
    const rsvpForm = document.getElementById('rsvp-form');
    const toastMsg = document.getElementById('toast-msg');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const guestNameInput = document.getElementById('guest-name');
            const guestName = guestNameInput ? guestNameInput.value : '';

            if (toastMsg) {
                toastMsg.style.display = 'block';
                toastMsg.innerText = `✨ Thank you ${guestName}! Your RSVP has been confirmed. We look forward to celebrating with you at Kodani! ✨`;
            }

            rsvpForm.reset();

            setTimeout(() => {
                if (toastMsg) toastMsg.style.display = 'none';
            }, 6000);
        });
    }

    // ------------------------------------------------------------------------
    // 7. Smooth Falling Rose / Roce Petals Animation
    // ------------------------------------------------------------------------
    const petalsCanvas = document.getElementById('rose-petals-canvas');
    if (petalsCanvas) {
        const pCtx = petalsCanvas.getContext('2d');
        let width = petalsCanvas.width = window.innerWidth;
        let height = petalsCanvas.height = window.innerHeight;

        const petalCount = 45;
        const petals = [];

        // Rich Roce / Rose color palettes (Crimson, Rose Gold, Ruby, Burgundy)
        const petalPalettes = [
            { top: '#E53935', mid: '#C62828', bot: '#8E0000' }, // Deep Rose Red
            { top: '#FF5252', mid: '#D32F2F', bot: '#7B1FA2' }, // Romantic Ruby
            { top: '#FF80AB', mid: '#E91E63', bot: '#AD1457' }, // Soft Rose Pink
            { top: '#FFB74D', mid: '#D4AF37', bot: '#B71C1C' }, // Gold-touched Velvet Rose
            { top: '#D81B60', mid: '#B71C1C', bot: '#4A148C' }  // Royal Crimson
        ];

        function createPetal() {
            const size = 11 + Math.random() * 11;
            return {
                x: Math.random() * width,
                y: Math.random() * (height + 100) - 100,
                size: size,
                length: size * (1.3 + Math.random() * 0.4),
                speedY: 0.25 + Math.random() * 0.45, // Slow gentle downward fall
                swaySpeed: 0.008 + Math.random() * 0.012,
                swayAmp: 0.8 + Math.random() * 1.4,
                phase: Math.random() * Math.PI * 2,
                angle: Math.random() * Math.PI * 2,
                spinSpeed: (Math.random() - 0.5) * 0.012, // Slow romantic rotation
                flipPhase: Math.random() * Math.PI * 2,
                flipSpeed: 0.008 + Math.random() * 0.015, // Gentle 3D flip
                opacity: 0.65 + Math.random() * 0.3,
                colors: petalPalettes[Math.floor(Math.random() * petalPalettes.length)]
            };
        }

        for (let i = 0; i < petalCount; i++) {
            petals.push(createPetal());
        }

        function drawPetalShape(ctx, p) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            const flip = Math.sin(p.flipPhase);
            ctx.scale(flip, 1);
            ctx.globalAlpha = p.opacity;

            const w = p.size;
            const h = p.length;

            ctx.beginPath();
            ctx.moveTo(0, -h / 2);
            // Organic curved rose petal path
            ctx.bezierCurveTo(w * 0.8, -h * 0.2, w * 0.7, h * 0.4, 0, h / 2);
            ctx.bezierCurveTo(-w * 0.7, h * 0.4, -w * 0.8, -h * 0.2, 0, -h / 2);

            const grad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
            grad.addColorStop(0, p.colors.top);
            grad.addColorStop(0.5, p.colors.mid);
            grad.addColorStop(1, p.colors.bot);
            ctx.fillStyle = grad;
            ctx.fill();

            // Central petal fold highlight line
            ctx.beginPath();
            ctx.moveTo(0, -h * 0.4);
            ctx.quadraticCurveTo(w * 0.1, 0, 0, h * 0.4);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.lineWidth = 0.8;
            ctx.stroke();

            ctx.restore();
        }

        let frameTime = 0;
        function animatePetals() {
            pCtx.clearRect(0, 0, width, height);
            frameTime += 1;

            petals.forEach(p => {
                p.y += p.speedY;
                p.x += Math.sin(frameTime * p.swaySpeed + p.phase) * p.swayAmp * 0.5;
                p.angle += p.spinSpeed;
                p.flipPhase += p.flipSpeed;

                // Reset to top once it reaches bottom of viewport
                if (p.y > height + 30) {
                    p.y = -30;
                    p.x = Math.random() * width;
                    p.phase = Math.random() * Math.PI * 2;
                }

                drawPetalShape(pCtx, p);
            });

            requestAnimationFrame(animatePetals);
        }

        animatePetals();

        window.addEventListener('resize', () => {
            width = petalsCanvas.width = window.innerWidth;
            height = petalsCanvas.height = window.innerHeight;
        });
    }
});
