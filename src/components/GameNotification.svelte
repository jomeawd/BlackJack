<script>
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    import { fade, fly, scale } from 'svelte/transition';
    import { elasticOut, backOut } from 'svelte/easing';
    import { gsap } from 'gsap';
    
    // Props
    export let type = "info"; // info, success, error, warning, blackjack, bust
    export let message = "";
    export let title = "";
    export let duration = 3000;
    export let showCloseButton = true;
    export let autoDismiss = true;
    export let position = "center"; // top, center, bottom
    
    // État interne
    let visible = true;
    let notificationElement;
    let progressBar;
    let progressBarWidth = 100;
    let closeTimeout;
    
    const dispatch = createEventDispatcher();
    
    // Types de notifications et leurs configurations
    const notificationTypes = {
      info: { 
        icon: "fa-info-circle",
        color: "#3498db"
      },
      success: { 
        icon: "fa-check-circle",
        color: "#2ecc71" 
      },
      error: { 
        icon: "fa-times-circle",
        color: "#e74c3c" 
      },
      warning: { 
        icon: "fa-exclamation-triangle",
        color: "#f39c12" 
      },
      blackjack: { 
        icon: "fa-crown",
        color: "#f1c40f" 
      },
      bust: { 
        icon: "fa-skull",
        color: "#e74c3c" 
      }
    };
    
    $: config = notificationTypes[type] || notificationTypes.info;
    
    // Fermer la notification
    function close() {
      visible = false;
      clearTimeout(closeTimeout);
      dispatch('close');
    }
    
    // Animer la barre de progression
    function animateProgressBar() {
      if (!progressBar || !autoDismiss) return;
      
      gsap.to(progressBar, {
        width: "0%",
        duration: duration / 1000,
        ease: "linear"
      });
      
      if (autoDismiss) {
        closeTimeout = setTimeout(close, duration);
      }
    }
    
    // Animation d'entrée pour la notification
    function enterAnimation(node) {
      let y = 0;
      
      if (position === "top") y = -100;
      if (position === "bottom") y = 100;
      
      return {
        duration: 500,
        css: t => {
          const eased = elasticOut(t);
          return `
            transform: scale(${eased}) translateY(${(1-eased) * y}px);
            opacity: ${t};
          `;
        }
      };
    }
    
    // Animation des icônes spéciales
    function animateIcon(node) {
      if (type === "blackjack") {
        gsap.to(node, {
          rotationY: 360,
          duration: 1.5,
          ease: "elastic.out(1, 0.3)",
          repeat: -1,
          repeatDelay: 2
        });
      } else if (type === "bust") {
        gsap.to(node, {
          rotation: 15,
          duration: 0.2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
      } else if (type === "success") {
        gsap.from(node, {
          scale: 0,
          rotation: -30,
          duration: 0.5,
          ease: "back.out(1.7)"
        });
      }
    }
    
    onMount(() => {
      animateProgressBar();
    });
    
    onDestroy(() => {
      clearTimeout(closeTimeout);
    });
  </script>
  
  {#if visible}
    <div 
      class="notification-wrapper {position}" 
      transition:fade={{ duration: 300 }}
    >
      <div 
        class="notification {type}" 
        bind:this={notificationElement}
        in:enterAnimation
        out:scale={{ duration: 200, start: 1, opacity: 0 }}
      >
        <!-- Icône -->
        <div class="notification-icon" use:animateIcon>
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
        {#if showCloseButton}
          <button class="close-button" on:click={close}>
            <i class="fas fa-times"></i>
          </button>
        {/if}
        
        <!-- Barre de progression -->
        {#if autoDismiss}
          <div class="progress-container">
            <div class="progress-bar" bind:this={progressBar}></div>
          </div>
        {/if}
        
        <!-- Effet de bordure lumineuse -->
        <div class="notification-glow"></div>
      </div>
    </div>
  {/if}
  
  <style>
    .notification-wrapper {
      position: fixed;
      z-index: 1000;
      pointer-events: none;
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 20px;
      box-sizing: border-box;
    }
    
    .notification-wrapper.top {
      top: 30px;
    }
    
    .notification-wrapper.center {
      top: 50%;
      transform: translateY(-50%);
    }
    
    .notification-wrapper.bottom {
      bottom: 30px;
    }
    
    .notification {
      position: relative;
      background: rgba(20, 20, 35, 0.95);
      border-radius: 15px;
      padding: 20px 25px;
      display: flex;
      align-items: center;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
      color: white;
      overflow: hidden;
      pointer-events: auto;
      max-width: 500px;
      min-width: 320px;
      transform: translateZ(0);
    }
    
    .notification-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 20px;
      font-size: 20px;
      background: rgba(255, 255, 255, 0.15);
      flex-shrink: 0;
    }
    
    .notification.info .notification-icon {
      color: #3498db;
    }
    
    .notification.success .notification-icon {
      color: #2ecc71;
    }
    
    .notification.error .notification-icon {
      color: #e74c3c;
    }
    
    .notification.warning .notification-icon {
      color: #f39c12;
    }
    
    .notification.blackjack .notification-icon {
      color: #f1c40f;
    }
    
    .notification.bust .notification-icon {
      color: #e74c3c;
    }
    
    .notification-content {
      flex: 1;
    }
    
    .notification-content h3 {
      margin: 0 0 5px 0;
      font-size: 18px;
      font-weight: 600;
    }
    
    .notification-content p {
      margin: 0;
      font-size: 14px;
      opacity: 0.9;
      line-height: 1.4;
    }
    
    .close-button {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      margin-left: 10px;
      transition: all 0.2s ease;
      border-radius: 50%;
      width: 24px;
      height: 24px;
    }
    
    .close-button:hover {
      background: rgba(255, 255, 255, 0.15);
      color: white;
    }
    
    .progress-container {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: rgba(0, 0, 0, 0.2);
    }
    
    .notification.info .progress-bar {
      background: #3498db;
    }
    
    .notification.success .progress-bar {
      background: #2ecc71;
    }
    
    .notification.error .progress-bar {
      background: #e74c3c;
    }
    
    .notification.warning .progress-bar {
      background: #f39c12;
    }
    
    .notification.blackjack .progress-bar {
      background: #f1c40f;
    }
    
    .notification.bust .progress-bar {
      background: #e74c3c;
    }
    
    .progress-bar {
      height: 100%;
      width: 100%;
    }
    
    .notification-glow {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      z-index: 0;
    }
    
    .notification.info .notification-glow {
      box-shadow: 0 0 10px 1px rgba(52, 152, 219, 0.5);
      background: #3498db;
    }
    
    .notification.success .notification-glow {
      box-shadow: 0 0 10px 1px rgba(46, 204, 113, 0.5);
      background: #2ecc71;
    }
    
    .notification.error .notification-glow {
      box-shadow: 0 0 10px 1px rgba(231, 76, 60, 0.5);
      background: #e74c3c;
    }
    
    .notification.warning .notification-glow {
      box-shadow: 0 0 10px 1px rgba(241, 196, 15, 0.5);
      background: #f39c12;
    }
    
    .notification.blackjack .notification-glow {
      box-shadow: 0 0 10px 1px rgba(241, 196, 15, 0.7);
      background: #f1c40f;
    }
    
    .notification.bust .notification-glow {
      box-shadow: 0 0 10px 1px rgba(231, 76, 60, 0.7);
      background: #e74c3c;
    }
    
    /* Responsive */
    @media (max-width: 600px) {
      .notification {
        min-width: auto;
        width: 90%;
        padding: 15px 20px;
      }
      
      .notification-icon {
        width: 30px;
        height: 30px;
        font-size: 16px;
        margin-right: 15px;
      }
      
      .notification-content h3 {
        font-size: 16px;
      }
      
      .notification-content p {
        font-size: 13px;
      }
    }
  </style>