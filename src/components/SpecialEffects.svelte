<script>
    import { onMount, createEventDispatcher, onDestroy } from 'svelte';
    import { fade, fly, scale } from 'svelte/transition';
    import { backOut, elasticOut } from 'svelte/easing';
    import { gsap } from 'gsap';
    
    // Props
    export let effect = ""; // blackjack, bust, win, lose, draw, none
    export let duration = 3000;
    
    // Référence au conteneur
    let effectsContainer;
    
    // Effets préconfigurés
    const effects = {
      blackjack: {
        color: "#f1c40f",
        emojis: ["👑", "💰", "🃏", "🎰"],
        message: "BLACKJACK",
        animationClass: "blackjack-animation"
      },
      bust: {
        color: "#e74c3c",
        emojis: ["💥", "😵", "❌"],
        message: "BUST",
        animationClass: "bust-animation"
      },
      win: {
        color: "#2ecc71",
        emojis: ["🎉", "🎊", "💰", "✨"],
        message: "VICTOIRE",
        animationClass: "win-animation"
      },
      lose: {
        color: "#e74c3c",
        emojis: ["😢", "💸"],
        message: "DÉFAITE",
        animationClass: "lose-animation"
      },
      draw: {
        color: "#3498db",
        emojis: ["🤝", "⚖️"],
        message: "ÉGALITÉ",
        animationClass: "draw-animation"
      }
    };
    
    // Pour la gestion des animations
    let animationId = null;
    let animationTimelines = [];
    let isActive = false;
    
    // Configuration actuelle
    $: config = effects[effect] || { color: "#fff", emojis: [], message: "", animationClass: "" };
    
    // Fonction pour arrêter et nettoyer toutes les animations
    function cleanupAnimations() {
      if (animationId) {
        clearTimeout(animationId);
        animationId = null;
      }
      
      // Arrêter toutes les timelines GSAP en cours
      animationTimelines.forEach(timeline => {
        if (timeline && timeline.isActive()) {
          timeline.kill();
        }
      });
      animationTimelines = [];
      
      // Vider le conteneur
      if (effectsContainer) {
        effectsContainer.innerHTML = '';
      }
      
      isActive = false;
    }
    
    // Création des effets visuels
    function createVisualEffects() {
      if (!effectsContainer || effect === "none" || effect === "" || isActive) return;
      
      isActive = true;
      cleanupAnimations();
      
      // Ajouter le message immédiatement avec sa propre animation
      if (config.message) {
        const messageElement = document.createElement('div');
        messageElement.className = `effect-message ${config.animationClass}`;
        messageElement.textContent = config.message;
        messageElement.style.color = config.color;
        messageElement.style.opacity = "0"; // Commencer invisible
        effectsContainer.appendChild(messageElement);
        
        // Animer le message avec séquence entrée/sortie
        const messageTimeline = gsap.timeline();
        animationTimelines.push(messageTimeline);
        
        messageTimeline
          .to(messageElement, {
            opacity: 1,
            scale: 1, 
            duration: 0.6,
            ease: "back.out(1.7)"
          })
          .to(messageElement, {
            opacity: 0,
            y: -30,
            scale: 1.1,
            duration: 0.5,
            delay: (duration / 1000) - 1,
            ease: "power2.in"
          });
      }
      
      // Si c'est un blackjack ou une victoire, ajouter des confettis plus contrôlés
      if (effect === 'blackjack' || effect === 'win') {
        addControlledConfetti();
      }
      
      // Ajouter des emojis flottants de manière plus contrôlée
      if (config.emojis.length > 0) {
        addControlledEmojis();
      }
      
      // Animation spéciale pour "Bust"
      if (effect === 'bust') {
        const shakeTimeline = gsap.timeline();
        animationTimelines.push(shakeTimeline);
        
        shakeTimeline
          .to(effectsContainer, {
            x: -8,
            duration: 0.08,
            repeat: 4,
            yoyo: true
          })
          .to(effectsContainer, {
            x: 0,
            duration: 0.1
          });
      }
      
      // Planifier le nettoyage final
      animationId = setTimeout(() => {
        cleanupAnimations();
      }, duration);
    }
    
    // Ajouter des confettis de manière contrôlée
    function addControlledConfetti() {
      const confettiContainer = document.createElement('div');
      confettiContainer.className = 'confetti-container';
      effectsContainer.appendChild(confettiContainer);
      
      const colors = ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c', '#9b59b6', '#1abc9c'];
      const confettiCount = 80; // Réduit le nombre de confettis
      
      const confettiTimeline = gsap.timeline();
      animationTimelines.push(confettiTimeline);
      
      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        
        // Forme aléatoire avec probabilité contrôlée
        const shapes = ['square', 'circle', 'rect'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        confetti.classList.add(shape);
        
        // Couleur aléatoire
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Taille plus petite et plus uniforme
        const size = Math.random() * 6 + 4; // Entre 4px et 10px
        confetti.style.width = `${size}px`;
        confetti.style.height = shape === 'rect' ? `${size / 2}px` : `${size}px`;
        
        // Position initiale plus centrale
        confetti.style.left = `${50 + (Math.random() * 40 - 20)}%`;
        confetti.style.top = `${effect === 'win' ? 70 : 50}%`;
        
        // Ajouter au conteneur
        confettiContainer.appendChild(confetti);
        
        // Animation plus contrôlée
        confettiTimeline.to(confetti, {
          x: `random(-120, 120, 5)`, // Valeurs plus petites et incréments plus grands
          y: `random(-200, -50, 10)`, // Principalement vers le haut
          rotation: `random(-180, 180, 15)`, // Rotation limitée
          duration: Math.random() * 1.5 + 1,
          opacity: 0,
          ease: "power1.out",
          delay: Math.random() * 0.3
        }, 0); // Démarrer toutes les animations en même temps
      }
    }
    
    // Ajouter des emojis de manière contrôlée
    function addControlledEmojis() {
      const emojiContainer = document.createElement('div');
      emojiContainer.className = 'emoji-container';
      effectsContainer.appendChild(emojiContainer);
      
      const emojiTimeline = gsap.timeline();
      animationTimelines.push(emojiTimeline);
      
      // Définir des positions de départ spécifiques
      const startPositions = [
        { x: 30, y: 60 }, { x: 40, y: 55 }, { x: 50, y: 60 }, { x: 60, y: 55 }, { x: 70, y: 60 },
        { x: 35, y: 50 }, { x: 45, y: 45 }, { x: 55, y: 45 }, { x: 65, y: 50 }
      ];
      
      // Limiter le nombre d'emojis
      const emojiCount = Math.min(startPositions.length, 9);
      
      for (let i = 0; i < emojiCount; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        
        // Emoji aléatoire mais sans doublons rapprochés si possible
        const emojiIndex = i % config.emojis.length;
        emoji.textContent = config.emojis[emojiIndex];
        
        // Position contrôlée
        const pos = startPositions[i];
        emoji.style.left = `${pos.x}%`;
        emoji.style.top = `${pos.y}%`;
        
        // Taille plus uniforme
        emoji.style.fontSize = `${Math.random() * 10 + 20}px`; // Entre 20px et 30px
        emoji.style.opacity = "0"; // Commencer invisible
        
        // Ajouter au conteneur
        emojiContainer.appendChild(emoji);
        
        // Animation contrôlée
        emojiTimeline
          .to(emoji, {
            opacity: 1,
            duration: 0.3,
            delay: i * 0.05 // Légère cascade
          }, 0)
          .to(emoji, {
            y: -50 - (Math.random() * 30), // Légère variation
            x: (Math.random() * 20) - 10, // Légère dérive horizontale
            rotation: (Math.random() * 30) - 15, // Légère rotation
            duration: 1.5,
            ease: "power1.out"
          }, 0.3 + (i * 0.05))
          .to(emoji, {
            opacity: 0,
            duration: 0.5,
            delay: 1
          }, 1.3 + (i * 0.05));
      }
    }
    
    // Réagir aux changements d'effet
    $: if (effect) {
      setTimeout(() => {
        createVisualEffects();
      }, 50); // Un léger délai pour s'assurer que tout est prêt
    }
    
    // Nettoyage à la destruction du composant
    onDestroy(() => {
      cleanupAnimations();
    });
  </script>
  
  <div class="special-effects-container" bind:this={effectsContainer}></div>
  
  <style>
    .special-effects-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
      z-index: 1000;
    }
    
    :global(.confetti-container),
    :global(.emoji-container) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    
    :global(.confetti-piece) {
      position: absolute;
      z-index: 1000;
      pointer-events: none;
    }
    
    :global(.confetti-piece.square) {
      border-radius: 0;
    }
    
    :global(.confetti-piece.circle) {
      border-radius: 50%;
    }
    
    :global(.confetti-piece.rect) {
      border-radius: 2px;
    }
    
    :global(.floating-emoji) {
      position: absolute;
      z-index: 1001;
      pointer-events: none;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    :global(.effect-message) {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 5rem;
      font-weight: 800;
      text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
      z-index: 1002;
      letter-spacing: 5px;
      pointer-events: none;
      text-align: center;
      width: 100%;
    }
    
    :global(.blackjack-animation) {
      font-size: 6rem;
      letter-spacing: 8px;
      color: #f1c40f;
      text-shadow: 
        0 0 10px rgba(241, 196, 15, 0.8),
        0 0 20px rgba(241, 196, 15, 0.5),
        0 0 30px rgba(241, 196, 15, 0.3);
    }
    
    :global(.bust-animation) {
      color: #e74c3c;
      text-shadow: 
        0 0 10px rgba(231, 76, 60, 0.8),
        0 0 20px rgba(231, 76, 60, 0.5),
        0 0 30px rgba(231, 76, 60, 0.3);
    }
    
    :global(.win-animation) {
      color: #2ecc71;
      text-shadow: 
        0 0 10px rgba(46, 204, 113, 0.8),
        0 0 20px rgba(46, 204, 113, 0.5),
        0 0 30px rgba(46, 204, 113, 0.3);
    }
    
    :global(.lose-animation) {
      color: #e74c3c;
      text-shadow: 
        0 0 10px rgba(231, 76, 60, 0.8),
        0 0 20px rgba(231, 76, 60, 0.5),
        0 0 30px rgba(231, 76, 60, 0.3);
    }
    
    :global(.draw-animation) {
      color: #3498db;
      text-shadow: 
        0 0 10px rgba(52, 152, 219, 0.8),
        0 0 20px rgba(52, 152, 219, 0.5),
        0 0 30px rgba(52, 152, 219, 0.3);
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      :global(.effect-message) {
        font-size: 3rem;
      }
      
      :global(.blackjack-animation) {
        font-size: 3.5rem;
      }
    }
  </style>