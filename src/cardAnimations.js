// cardAnimations.js
import { gsap } from 'gsap';

/**
 * Animation de distribution des cartes
 * @param {HTMLElement} node - L'élément DOM à animer
 * @param {Object} params - Paramètres d'animation optionnels
 */
export function dealCardAnimation(node, params = {}) {
  // Position de départ (hors écran au centre supérieur)
  const startY = params.startY || -300;
  const startX = params.startX || 0;
  const startRotation = params.startRotation || Math.random() * 10 - 5;
  const duration = params.duration || 0.8;
  const delay = params.delay || 0;
  
  // Configuration initiale
  gsap.set(node, {
    y: startY,
    x: startX,
    rotation: startRotation,
    opacity: 0,
    scale: 0.7
  });
  
  // Animation de l'entrée de la carte
  const timeline = gsap.timeline();
  
  timeline.to(node, {
    duration: duration,
    y: 0,
    x: 0,
    opacity: 1,
    scale: 1,
    rotation: 0,
    delay: delay,
    ease: "power3.out",
    clearProps: "scale"
  });
  
  return {
    destroy() {
      // Animation de sortie lorsque la carte est retirée du DOM
      gsap.to(node, {
        duration: 0.3,
        opacity: 0,
        y: 100,
        scale: 0.8,
        ease: "power1.in"
      });
    }
  };
}

/**
 * Animation de retournement de carte
 * @param {HTMLElement} node - L'élément DOM à animer
 */
export function flipCardAnimation(node) {
  const frontImage = node.querySelector('.card-front');
  const backImage = node.querySelector('.card-back');
  
  // Animation de retournement 3D
  const timeline = gsap.timeline();
  
  // État initial
  gsap.set(backImage, { rotationY: -180 });
  gsap.set([frontImage, backImage], { backfaceVisibility: 'hidden' });
  gsap.set(node, { perspective: 1000 });
  
  // Exécuter le retournement
  timeline
    .to(node, { 
      duration: 0.4, 
      rotationY: 90, 
      ease: "power1.in",
      onComplete: () => {
        // Basculer la visibilité à mi-chemin
        frontImage.style.visibility = 'hidden';
        backImage.style.visibility = 'visible';
      }
    })
    .to(node, { 
      duration: 0.4, 
      rotationY: 0, 
      ease: "power1.out" 
    });
  
  return {
    update(isFlipped) {
      if (isFlipped) {
        frontImage.style.visibility = 'hidden';
        backImage.style.visibility = 'visible';
      } else {
        frontImage.style.visibility = 'visible';
        backImage.style.visibility = 'hidden';
      }
    }
  };
}

/**
 * Animation de surbrillance lors d'une victoire
 * @param {HTMLElement} node - L'élément DOM à animer
 */
export function winningCardAnimation(node) {
  const timeline = gsap.timeline({
    repeat: 2,
    repeatDelay: 0.3
  });
  
  timeline
    .to(node, {
      duration: 0.2,
      boxShadow: '0 0 20px 5px rgba(46, 204, 113, 0.8)',
      scale: 1.05,
      ease: "power1.inOut"
    })
    .to(node, {
      duration: 0.2,
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
      scale: 1,
      ease: "power1.inOut"
    });
}

/**
 * Animation de secouement pour les erreurs
 * @param {HTMLElement} node - L'élément DOM à animer
 */
export function shakeAnimation(node) {
  gsap.to(node, {
    duration: 0.1,
    x: -10,
    ease: "power1.inOut",
    repeat: 5,
    yoyo: true,
    onComplete: () => gsap.set(node, {x: 0})
  });
}

/**
 * Animation du bouton au survol
 * @param {HTMLElement} node - L'élément DOM à animer
 */
export function buttonHoverAnimation(node) {
  const enter = () => {
    gsap.to(node, {
      duration: 0.3,
      y: -3,
      scale: 1.05,
      boxShadow: '0 8px 15px rgba(0, 0, 0, 0.3)',
      ease: "power2.out"
    });
  };
  
  const leave = () => {
    gsap.to(node, {
      duration: 0.3,
      y: 0,
      scale: 1,
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
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