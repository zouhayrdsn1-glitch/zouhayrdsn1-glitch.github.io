document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. ANIMATIONS AU DÉFILEMENT (SÉCURISÉ NATIVES) ---
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // L'animation ne se joue qu'une fois pour plus d'élégance
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    });

    // On observe tous les éléments avec la classe .fade-up
    document.querySelectorAll('.fade-up').forEach((el) => {
        observer.observe(el);
    });

    // --- 1b. COMPTEURS ANIMÉS (STATS HERO) ---
    const counters = document.querySelectorAll('.stat .number[data-count]');
    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1600;
            const start = performance.now();

            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                el.textContent = Math.floor(eased * target) + suffix;
                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = target + suffix;
                }
            };
            requestAnimationFrame(tick);
            obs.unobserve(el);
        });
    }, { threshold: 0.6 });

    counters.forEach((el) => counterObserver.observe(el));

    // --- 1c. BOUTONS MAGNÉTIQUES (micro-interaction premium) ---
    const magneticBtns = document.querySelectorAll('.btn');
    magneticBtns.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.35}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // --- 2. CHANGEMENT DU FOND DE LA NAVBAR AU SCROLL ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(10, 10, 10, 0.98)";
            navbar.style.borderBottom = "1px solid var(--gold)";
            navbar.style.padding = "0"; // Micro-interaction
        } else {
            navbar.style.background = "rgba(10, 10, 10, 0.9)";
            navbar.style.borderBottom = "1px solid var(--border-color)";
            navbar.style.padding = "10px 0"; 
        }
    });

    // --- 3. MENU MOBILE (HAMBURGER) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        if (navLinks.style.display === "flex") {
            navLinks.style.display = "none";
        } else {
            navLinks.style.display = "flex";
            navLinks.style.flexDirection = "column";
            navLinks.style.position = "absolute";
            navLinks.style.top = "80px";
            navLinks.style.left = "0";
            navLinks.style.width = "100%";
            navLinks.style.background = "var(--bg-dark)";
            navLinks.style.padding = "20px";
        }
    });

    // --- 4. CHATBOT ASSISTANT LOGIC ---
    const chatbotToggler = document.getElementById('chatbot-toggler');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatbot = document.getElementById('close-chatbot');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chatbot-messages');

    // Ouvrir / Fermer le chatbot
    chatbotToggler.addEventListener('click', () => {
        chatbotWindow.classList.add('active');
    });

    closeChatbot.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });

    // Envoyer un message
    const sendMessage = () => {
        const message = chatInput.value.trim();
        if (message === "") return;

        appendMessage(message, 'user');
        chatInput.value = '';

        setTimeout(() => {
            const botReply = generateBotResponse(message.toLowerCase());
            appendMessage(botReply, 'bot');
        }, 1000);
    };

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll en bas
    }

    function generateBotResponse(input) {
        if (input.includes('prix') || input.includes('tarif') || input.includes('combien')) {
            return "Nos programmes sont sur-mesure. Le meilleur moyen de connaître le tarif exact adapté à ton profil est de réserver un appel gratuit !";
        } else if (input.includes('programme') || input.includes('entrainement')) {
            return "Nous avons 4 chemins : Bulk, Cut, Elite Warrior et le Protocole. Quel est ton objectif principal (perte de poids, masse, force) ?";
        } else if (input.includes('bonjour') || input.includes('salut')) {
            return "Salut ! Comment puis-je t'aider à forger ta légende aujourd'hui ?";
        } else if (input.includes('contact') || input.includes('appel')) {
            return "Tu peux réserver un appel stratégique gratuit de 15 min en cliquant sur le bouton rouge en haut du site !";
        } else {
            return "C'est noté. Laisse-nous tes coordonnées via le formulaire de contact ou réserve un appel pour qu'un coach te réponde de vive voix !";
        }
    }
});


// Custom Video Player Logic
document.addEventListener('DOMContentLoaded', () => {
    const presVideo = document.getElementById('presentation-video');
    const videoWrapper = document.getElementById('video-wrapper');
    const playBtn = document.getElementById('custom-play-btn');

    if (presVideo && videoWrapper) {
        const togglePlay = (e) => {
            // Prevent double-triggering if clicking directly on the play button
            e.stopPropagation();

            if (presVideo.paused) {
                presVideo.play().then(() => {
                    videoWrapper.classList.add('playing');
                }).catch((error) => {
                    console.error("Video play error:", error);
                    alert("Could not play video. Please check if the file path and filename are correct.");
                });
            } else {
                presVideo.pause();
                videoWrapper.classList.remove('playing');
            }
        };

        // Event listeners for both wrapper and button
        videoWrapper.addEventListener('click', togglePlay);
        if (playBtn) playBtn.addEventListener('click', togglePlay);

        // Reset button when video ends
        presVideo.addEventListener('ended', () => {
            videoWrapper.classList.remove('playing');
        });
    }
});