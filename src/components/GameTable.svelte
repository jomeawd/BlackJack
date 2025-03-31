<script>
    import { onMount } from 'svelte';
    import { tableLightingEffect } from '../animations';
    
    let tableElement;
    
    onMount(() => {
      // Ajouter l'effet d'éclairage dynamique
      tableLightingEffect(tableElement);
    });
  </script>
  
  <div class="game-table" bind:this={tableElement}>
    <div class="table-decoration left"></div>
    <div class="table-decoration right"></div>
    
    <!-- Texture de feutre améliorée -->
    <div class="felt-texture"></div>
    
    <!-- Séparateurs de zone -->
    <div class="table-divider top"></div>
    <div class="table-divider bottom"></div>
    
    <div class="dealer-position">
      <!-- Mot "DEALER" supprimé -->
      <slot name="dealer"></slot>
    </div>
    
    <div class="center-area">
      <slot name="center"></slot>
    </div>
    
    <div class="player-position">
      <slot name="player"></slot>
      <!-- Mot "JOUEUR" conservé car il est en bas -->
      <div class="position-marker">JOUEUR</div>
    </div>
  </div>
  
  <style>
    .game-table {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100vh;
      width: 100%;
      background: #0a3a1c;
      overflow: hidden;
    }
    
    /* Texture de feutre améliorée */
    .felt-texture {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath fill='%23ffffff' fill-opacity='0.03' d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3Cpath fill='%23000000' fill-opacity='0.15' d='M4 0h4v4H4V0zm0 4H0v4h4V4z'/%3E%3C/svg%3E"),
                       linear-gradient(135deg, rgba(8, 47, 22, 0.9) 0%, rgba(10, 58, 28, 0.9) 100%);
      z-index: 0;
      pointer-events: none;
    }
    
    /* Décorations de la table */
    .table-decoration {
      position: absolute;
      height: 100%;
      width: 40px;
      background: linear-gradient(90deg, #072a14 0%, #0a3a1c 100%);
      box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.5);
      z-index: 1;
    }
    
    .table-decoration.left {
      left: 0;
      border-right: 2px solid #0e5c2c;
    }
    
    .table-decoration.right {
      right: 0;
      background: linear-gradient(270deg, #072a14 0%, #0a3a1c 100%);
      border-left: 2px solid #0e5c2c;
    }
    
    /* Séparateurs de zone */
    .table-divider {
      position: absolute;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, 
        rgba(14, 92, 44, 0) 0%, 
        rgba(14, 92, 44, 0.7) 20%, 
        rgba(14, 92, 44, 0.8) 50%, 
        rgba(14, 92, 44, 0.7) 80%, 
        rgba(14, 92, 44, 0) 100%);
      z-index: 1;
    }
    
    .table-divider.top {
      top: 33%;
    }
    
    .table-divider.bottom {
      bottom: 33%;
    }
    
    /* Zones de jeu */
    .dealer-position, .player-position, .center-area {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      width: 100%;
    }
    
    .dealer-position {
      flex: 0.8; /* Réduit un peu pour gagner de l'espace vertical */
      padding-top: 1rem; /* Réduit le padding */
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
    }
    
    .player-position {
      flex: 0.8; /* Réduit un peu pour gagner de l'espace vertical */
      padding-bottom: 1rem; /* Réduit le padding */
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
    }
    
    .center-area {
      flex: 0.6; /* Réduit pour donner plus d'espace aux zones joueur/dealer */
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    /* Marqueurs de position */
    .position-marker {
      color: rgba(255, 255, 255, 0.7);
      background: rgba(0, 0, 0, 0.4);
      padding: 0.3rem 1rem;
      border-radius: 5px;
      font-size: 0.75rem;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin: 0.5rem 0;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

  </style>