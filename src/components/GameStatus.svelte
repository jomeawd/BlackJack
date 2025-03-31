<script>
    import { gameStore } from '../stores/gameStore';
    
    // Map pour les classes CSS selon l'état du jeu
    const statusClasses = {
      'idle': 'info',
      'playing': 'info',
      'playerWin': 'success',
      'dealerWin': 'danger',
      'push': 'warning',
      'playerBlackjack': 'success',
      'playerBust': 'danger',
      'dealerBust': 'success'
    };
    
    // Classe calculée selon l'état du jeu
    $: statusClass = statusClasses[$gameStore.gameStatus] || 'info';
  </script>
  
  <div class="game-status">
    <div class="message status-{statusClass}">
      {$gameStore.message}
    </div>
    
    {#if $gameStore.remainingCards > 0}
      <div class="deck-info">
        <span>Cartes restantes: {$gameStore.remainingCards}</span>
      </div>
    {/if}
  </div>
  
  <style>
    .game-status {
      width: 100%;
      max-width: 600px;
      margin: 0 auto 20px;
      text-align: center;
    }
    
    .message {
      padding: 10px 15px;
      border-radius: 5px;
      margin-bottom: 10px;
      font-weight: bold;
      transition: all 0.3s;
    }
    
    .status-info {
      background-color: #E9ECEF;
      color: #495057;
    }
    
    .status-success {
      background-color: #D4EDDA;
      color: #155724;
    }
    
    .status-danger {
      background-color: #F8D7DA;
      color: #721C24;
    }
    
    .status-warning {
      background-color: #FFF3CD;
      color: #856404;
    }
    
    .deck-info {
      font-size: 0.9rem;
      color: #6C757D;
    }
  </style>