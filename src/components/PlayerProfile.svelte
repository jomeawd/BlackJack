<script>
    // Props
    export let name = "";
    export let wins = 0;
    export let losses = 0;
    export let isDealer = false;
  </script>
  
  <div class="player-profile {isDealer ? 'dealer' : 'player'}">
    <div class="avatar {isDealer ? 'dealer-avatar' : 'player-avatar'}">
      <i class="fas {isDealer ? 'fa-user-tie' : 'fa-user'}"></i>
    </div>
    <div class="player-info">
      <h3>{name}</h3>
      <div class="stats">
        <span class="wins"><i class="fas fa-trophy"></i> {wins}</span>
        <span class="losses"><i class="fas fa-times-circle"></i> {losses}</span>
      </div>
    </div>
    <!-- Badge optionnel pour le joueur actif -->
    {#if isDealer && $gameStore.isPlayerTurn === false || !isDealer && $gameStore.isPlayerTurn === true}
      <div class="active-badge">
        <div class="pulse"></div>
      </div>
    {/if}
  </div>
  
  <style>
    .player-profile {
      display: flex;
      align-items: center;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 12px;
      padding: 0.8rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      width: 200px;
      margin: 0 auto 1rem auto;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(5px);
      position: relative;
      transition: all 0.3s ease;
    }
    
    .player-profile.dealer {
      border-bottom: 2px solid #d63031;
    }
    
    .player-profile.player {
      border-bottom: 2px solid #0984e3;
    }
    
    .avatar {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
      font-size: 1.3rem;
      position: relative;
      flex-shrink: 0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    
    .avatar::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.2);
      pointer-events: none;
    }
    
    .dealer-avatar {
      background: linear-gradient(135deg, #e84393 0%, #d63031 100%);
    }
    
    .player-avatar {
      background: linear-gradient(135deg, #0984e3 0%, #6c5ce7 100%);
    }
    
    .player-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
    }
    
    .player-info h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }
    
    .stats {
      display: flex;
      gap: 0.8rem;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.7);
    }
    
    .stats span {
      display: flex;
      align-items: center;
    }
    
    .stats span i {
      margin-right: 3px;
      font-size: 0.8rem;
    }
    
    .wins {
      color: #2ecc71;
    }
    
    .losses {
      color: #e74c3c;
    }
    
    /* Badge pour le joueur actif */
    .active-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #2ecc71;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .pulse {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: rgba(46, 204, 113, 0.6);
      animation: pulse 1.5s infinite;
    }
    
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(2.5);
        opacity: 0;
      }
    }
    
    /* Pour le responsive */
    @media (max-width: 480px) {
      .player-profile {
        width: 175px;
        padding: 0.6rem;
      }
      
      .avatar {
        width: 40px;
        height: 40px;
        font-size: 1.1rem;
      }
      
      .player-info h3 {
        font-size: 0.9rem;
      }
      
      .stats {
        font-size: 0.75rem;
      }
    }
  </style>