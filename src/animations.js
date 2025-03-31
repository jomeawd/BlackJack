// animations.js - Bibliothèque d'animations avancées pour le jeu de Blackjack
import { gsap } from 'gsap';

// Sons du jeu (à implémenter avec une bibliothèque comme Howler.js)
export const playCardSound = () => {
  try {
    const audio = new Audio('/assets/sounds/card-flip.mp3');
    audio.volume = 0.5;
    // Jouer le son uniquement après une interaction utilisateur
    const playPromise = audio.play();
    
    // Gérer proprement le rejet de la promesse si l'autoplay est bloqué
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.log('Autoplay prevented, need user interaction first');
      });
    }
  } catch (e) {
    console.log('Sound playback error:', e);
  }
};

export const playStartSound = () => {
  try {
    const audio = new Audio('/assets/sounds/start.mp3');
    audio.volume = 0.5;
    // Jouer le son uniquement après une interaction utilisateur
    const playPromise = audio.play();
    
    // Gérer proprement le rejet de la promesse si l'autoplay est bloqué
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.log('Autoplay prevented, need user interaction first');
      });
    }
  } catch (e) {
    console.log('Sound playback error:', e);
  }
};

export const playWinSound = () => {
  try {
    const audio = new Audio('/assets/sounds/win.mp3');
    audio.volume = 0.5;
    // Jouer le son uniquement après une interaction utilisateur
    const playPromise = audio.play();
    
    // Gérer proprement le rejet de la promesse si l'autoplay est bloqué
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.log('Autoplay prevented, need user interaction first');
      });
    }
  } catch (e) {
    console.log('Sound playback error:', e);
  }
};

export const playLoseSound = () => {
  try {
    const audio = new Audio('/assets/sounds/lose.mp3');
    audio.volume = 0.5;
    // Jouer le son uniquement après une interaction utilisateur
    const playPromise = audio.play();
    
    // Gérer proprement le rejet de la promesse si l'autoplay est bloqué
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.log('Autoplay prevented, need user interaction first');
      });
    }
  } catch (e) {
    console.log('Sound playback error:', e);
  }
};

/**
 * Animation avancée de distribution des cartes avec effet cascade
 * @param {HTMLElement} node - L'élément DOM à animer
 * @param {Object} params - Paramètres d'animation
 */
export function dealCardAnimation(node, params = {}) {
  const index = params.index || 0;
  const isDealer = params.isDealer || false;
  const totalCards = params.totalCards || 1;
  
  // Position de départ hors écran (différente pour dealer et joueur)
  const startY = isDealer ? -200 : 200;
  const startRotation = (Math.random() * 20) - 10;
  
  // Configuration initiale
  gsap.set(node, {
    y: startY,
    x: 200,
    rotation: startRotation,
    opacity: 0,
    scale: 0.8,
    transformOrigin: "center center"
  });
  
  // Timing en cascade
  const staggerDelay = 0.15;
  const delay = index * staggerDelay;
  
  // Créer une timeline GSAP
  const timeline = gsap.timeline();
  
  // Animation d'entrée
  timeline
    .to(node, {
      duration: 0.6,
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      rotation: 0,
      delay: delay,
      ease: "power2.out",
      onStart: () => {
        // Jouer le son de carte
        if (typeof window !== 'undefined') {
          playCardSound();
        }
      }
    })
    .to(node, {
      duration: 0.2,
      y: -5,
      ease: "power1.out"
    })
    .to(node, {
      duration: 0.2,
      y: 0,
      ease: "bounce.out"
    });
  
  return {
    destroy() {
      // Animation de sortie lorsque la carte est retirée du DOM
      gsap.to(node, {
        duration: 0.3,
        opacity: 0,
        scale: 0.8,
        y: isDealer ? -100 : 100,
        ease: "power1.in"
      });
    }
  };
}

/**
 * Animation spéciale pour un Blackjack
 * @param {Array<HTMLElement>} cardNodes - Les éléments DOM représentant les cartes
 */
export function blackjackAnimation(cardNodes) {
  // Jouer le son de victoire
  if (typeof window !== 'undefined') {
    playWinSound();
  }
  
  // Animation pour chaque carte
  cardNodes.forEach((node, index) => {
    gsap.timeline()
      .to(node, {
        duration: 0.1,
        y: -20,
        scale: 1.1,
        boxShadow: "0 0 20px 5px rgba(255, 215, 0, 0.7)",
        delay: index * 0.1
      })
      .to(node, {
        duration: 0.1,
        y: 0,
        scale: 1,
        ease: "bounce.out"
      })
      .to(node, {
        duration: 0.3,
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
        ease: "power1.out"
      });
  });
  
  // Ajouter des particules d'or autour des cartes (via une bibliothèque de particules)
  // Cette partie serait implémentée avec une bibliothèque comme tsParticles
}

/**
 * Animation pour indiquer un "bust" (dépassement de 21)
 * @param {Array<HTMLElement>} cardNodes - Les éléments DOM représentant les cartes
 */
export function bustAnimation(cardNodes) {
  // Jouer le son de défaite
  if (typeof window !== 'undefined') {
    playLoseSound();
  }
  
  // Effet de secousse pour les cartes
  cardNodes.forEach((node, index) => {
    gsap.to(node, {
      duration: 0.1,
      x: "+=10",
      rotation: 5,
      repeat: 5,
      yoyo: true,
      ease: "power1.inOut",
      delay: index * 0.05,
      onComplete: () => {
        gsap.to(node, {
          duration: 0.3,
          opacity: 0.6,
          filter: "grayscale(70%)",
          boxShadow: "0 5px 15px rgba(220, 20, 60, 0.5)",
        });
      }
    });
  });
}

/**
 * Animation pour célébrer une victoire
 * @param {HTMLElement} container - L'élément conteneur pour les effets
 * @param {Boolean} isBlackjack - Si la victoire est un blackjack
 */
export function victoryAnimation(container, isBlackjack = false) {
  // Jouer le son de victoire
  if (typeof window !== 'undefined') {
    playWinSound();
  }
  
  // Créer des éléments pour les confettis
  const colors = ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c', '#9b59b6'];
  const confettiCount = 100;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    // Style du confetti
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = `${Math.random() * 10 + 5}px`;
    confetti.style.height = `${Math.random() * 6 + 3}px`;
    confetti.style.opacity = Math.random() + 0.5;
    confetti.style.position = 'absolute';
    confetti.style.zIndex = '1000';
    
    // Ajouter au conteneur
    container.appendChild(confetti);
    
    // Animation du confetti
    gsap.fromTo(
      confetti,
      {
        x: container.clientWidth / 2,
        y: container.clientHeight / 2,
        scale: 0
      },
      {
        duration: Math.random() * 2 + 1,
        x: Math.random() * container.clientWidth,
        y: Math.random() * container.clientHeight,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.8 + 0.2,
        ease: "power1.out",
        onComplete: () => {
          // Supprimer les confettis après l'animation
          gsap.to(confetti, {
            duration: 0.5,
            opacity: 0,
            delay: Math.random() * 0.5,
            onComplete: () => confetti.remove()
          });
        }
      }
    );
  }
}

/**
 * Animation pour retourner une carte
 * @param {HTMLElement} node - L'élément DOM à animer
 * @param {Boolean} faceUp - Si la carte doit être face visible
 */
export function flipCardAnimation(node, faceUp = true) {
  const timeline = gsap.timeline();
  
  if (typeof window !== 'undefined') {
    playCardSound();
  }
  
  timeline
    .to(node, {
      duration: 0.15,
      scaleX: 0,
      ease: "power1.in"
    })
    .set(node, {
      zIndex: faceUp ? 2 : 1
    })
    .to(node, {
      duration: 0.15,
      scaleX: 1,
      ease: "power1.out"
    });
  
  return timeline;
}

/**
 * Animation des boutons au survol
 * @param {HTMLElement} node - L'élément bouton à animer
 */
export function buttonHoverAnimation(node) {
  const enter = () => {
    gsap.to(node, {
      duration: 0.3,
      y: -3,
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
      ease: "power2.out"
    });
  };
  
  const leave = () => {
    gsap.to(node, {
      duration: 0.3,
      y: 0,
      scale: 1,
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      ease: "power2.out"
    });
  };
  
  node.addEventListener('mouseenter', enter);
  node.addEventListener('mouseleave', leave);
  
  return {
    destroy() {
      node.removeEventListener('mouseenter', enter);
      node.removeEventListener('mouseleave', leave);
    }
  };
}

/**
 * Animation du compteur de score
 * @param {HTMLElement} node - L'élément affichant le score
 * @param {Number} newValue - La nouvelle valeur du score
 * @param {Number} oldValue - L'ancienne valeur du score
 */
export function scoreUpdateAnimation(node, newValue, oldValue) {
  const timeline = gsap.timeline();
  
  if (newValue > oldValue) {
    timeline
      .to(node, {
        duration: 0.1,
        scale: 1.2,
        color: newValue > 21 ? "#e74c3c" : "#f1c40f",
        ease: "power1.out"
      })
      .to(node, {
        duration: 0.2,
        scale: 1,
        color: newValue > 21 ? "#e74c3c" : "white",
        ease: "bounce.out"
      });
  }
  
  return timeline;
}

/**
 * Animation de la table de jeu (effet d'éclairage)
 * @param {HTMLElement} tableElement - L'élément de la table de jeu
 */
export function tableLightingEffect(tableElement) {
  // Créer un élément pour la lumière
  const light = document.createElement('div');
  light.className = 'table-light';
  light.style.position = 'absolute';
  light.style.top = '0';
  light.style.left = '0';
  light.style.width = '100%';
  light.style.height = '100%';
  light.style.background = 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 60%)';
  light.style.pointerEvents = 'none';
  
  tableElement.appendChild(light);
  
  // Animation de la lumière qui suit la souris
  tableElement.addEventListener('mousemove', (e) => {
    const rect = tableElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    light.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.07) 0%, rgba(0,0,0,0) 60%)`;
  });
}