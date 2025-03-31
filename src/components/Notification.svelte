<script>
    import { onMount } from 'svelte';
    import { fade, fly, scale } from 'svelte/transition';
    import { elasticOut, backOut } from 'svelte/easing';
    import { gsap } from 'gsap';
  
    // Props
    export let title = '';
    export let message = '';
    export let type = 'info'; // 'info', 'success', 'error', 'warning'
    export let duration = 3000; // durée en ms avant disparition automatique
    export let autoDismiss = true;
    
    // État du composant
    let visible = true;
    let progressBar;
    let notificationElement;
    
    // Fonction pour fermer la notification
    export function close() {
      visible = false;
    }
    
    // Animation de la barre de progression
    function animateProgress() {
      if (progressBar && autoDismiss) {
        gsap.to(progressBar, {
          width: '0%',
          duration: duration / 1000,
          ease: 'linear'
        });
      }
    }
    
    // Animation d'entrée
    function animateEnter(node) {
      gsap.fromTo(node, 
        { 
          y: -50, 
          opacity: 0, 
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)'
        }
      );
    }
    
    onMount(() => {
      // Animer l'élément à son apparition
      if (notificationElement) {
        animateEnter(notificationElement);
      }
      
      // Démarrer la barre de progression
      animateProgress();
      
      // Fermer automatiquement après la durée spécifiée
      if (autoDismiss) {
        const timer = setTimeout(() => {
          close();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    });
    
    // Mapper le type à une couleur et une icône
    const typeConfig = {
      info: { icon: 'fa-info-circle', color: '#3498db' },
      success: { icon: 'fa-check-circle', color: '#2ecc71' },
      error: { icon: 'fa-times-circle', color: '#e74c3c' },
      warning: { icon: 'fa-exclamation-triangle', color: '#f39c12' }
    };
    
    // Obtenir la configuration pour le type actuel
    $: config = typeConfig[type] || typeConfig.info;
  </script>
  
  {#if visible}
    <div 
      class="notification-wrapper"
      out:fade={{ duration: 300 }}
    >
      <div 
        class="notification {type}"
        bind:this={notificationElement}
      >
        <!-- Icône -->
        <div class="notification-icon">
          <i class="fas {config.icon}"></i>
        </div>
        
        <!-- Contenu -->
        <div class="notification-content">
          {#if title}
            <h3>{title}</h3>
          {/if}
          <p>{message}</p>
        </div>
        
        <!-- Bouton de fermeture -->
        <button class="close-button" on:click={close}>
          <i class="fas fa-times"></i>
        </button>
        
        <!-- Barre de progression -->
        {#if autoDismiss}
          <div class="progress-container">
            <div class="progress-bar" bind:this={progressBar}></div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
  
  <style>
    .notification-wrapper {
      position: fixed;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      max-width: 90%;
      width: 400px;
      perspective: 1000px;
    }
    
    .notification {
      background: rgba(20, 20, 35, 0.95);
      border-radius: 12px;
      padding: 15px 20px;
      display: flex;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 
                  0 1px 3px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      color: white;
      border-left: 4px solid var(--accent-color);
    }
    
    .notification.info {
      --accent-color: #3498db;
    }
    
    .notification.success {
      --accent-color: #2ecc71;
    }
    
    .notification.error {
      --accent-color: #e74c3c;
    }
    
    .notification.warning {
      --accent-color: #f39c12;
    }
    
    .notification-icon {
      color: var(--accent-color);
      font-size: 24px;
      margin-right: 15px;
      display: flex;
      align-items: center;
    }
    
    .notification-content {
      flex: 1;
    }
    
    .notification-content h3 {
      margin: 0 0 5px 0;
      font-size: 16px;
      font-weight: 600;
    }
    
    .notification-content p {
      margin: 0;
      font-size: 14px;
      opacity: 0.9;
    }
    
    .close-button {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      font-size: 14px;
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      transition: all 0.2s ease;
    }
    
    .close-button:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
    
    .progress-container {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: rgba(255, 255, 255, 0.1);
    }
    
    .progress-bar {
      height: 100%;
      width: 100%;
      background: var(--accent-color);
    }
    
    /* Responsive */
    @media (max-width: 480px) {
      .notification-wrapper {
        width: 90%;
      }
      
      .notification {
        padding: 12px 15px;
      }
      
      .notification-icon {
        font-size: 20px;
        margin-right: 10px;
      }
    }
  </style>