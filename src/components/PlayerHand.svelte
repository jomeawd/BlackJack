<script>
    import { gameStore, playerHandValue } from '../stores/gameStore';
    import Card from './Card.svelte';
  </script>
  
  <div class="player-hand">
    <div class="hand-title">
      <h3>Votre main <span class="hand-value">({$playerHandValue})</span></h3>
    </div>
    
    <div class="cards-container">
      {#each $gameStore.playerHand as card, i (card.code)}
        <div class="card-wrapper" style="--index: {i}">
          <Card {card} />
        </div>
      {/each}
    </div>
  </div>
  
  <style>
    .player-hand {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .hand-title {
      margin-bottom: 10px;
      text-align: center;
    }
    
    .hand-value {
      font-weight: normal;
      color: #007BFF;
    }
    
    .cards-container {
      display: flex;
      justify-content: center;
      min-height: 140px;
      padding: 10px;
    }
    
    .card-wrapper {
      transform: translateX(calc(var(--index) * 10px));
      animation: deal-card 0.3s ease-out;
      animation-delay: calc(var(--index) * 0.1s);
    }
    
    @keyframes deal-card {
      from {
        opacity: 0;
        transform: translateY(-50px) translateX(calc(var(--index) * 10px)) rotate(-10deg);
      }
      to {
        opacity: 1;
        transform: translateY(0) translateX(calc(var(--index) * 10px)) rotate(0);
      }
    }
  </style>