<script>
  import { gameStore, canHit, canStand, isGameOver } from '../stores/gameStore';
  
  function handleNewGame() {
    gameStore.newGame();
  }
  
  function handleHit() {
    gameStore.hit();
  }
  
  function handleStand() {
    gameStore.stand();
  }
  
  // Pour le débogage
  console.log("État du jeu:", $gameStore.gameStatus);
  console.log("isGameOver:", $isGameOver);
</script>

<div class="controls">
  {#if $gameStore.gameStatus === 'idle' || $isGameOver}
    <button 
      class="btn btn-primary"
      on:click={handleNewGame}
      disabled={$gameStore.isLoading}
    >
      {#if $gameStore.gameStatus === 'idle'}
        Nouvelle partie
      {:else}
        Rejouer
      {/if}
    </button>
  {:else}
    <div class="game-buttons">
      <button 
        class="btn btn-success" 
        on:click={handleHit}
        disabled={!$canHit || $gameStore.isLoading}
      >
        Tirer
      </button>
      
      <button 
        class="btn btn-danger" 
        on:click={handleStand}
        disabled={!$canStand || $gameStore.isLoading}
      >
        Rester
      </button>
    </div>
  {/if}
  
  {#if $gameStore.isLoading}
    <div class="loading-spinner"></div>
  {/if}
</div>

<style>
  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
  }
  
  .game-buttons {
    display: flex;
    gap: 10px;
  }
  
  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 100px;
  }
  
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .btn-primary {
    background-color: #007BFF;
    color: white;
  }
  
  .btn-success {
    background-color: #28A745;
    color: white;
  }
  
  .btn-danger {
    background-color: #DC3545;
    color: white;
  }
  
  .btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .btn:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .loading-spinner {
    margin-top: 10px;
    width: 30px;
    height: 30px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: #007BFF;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>