<script>
    import DealerHand from './DealerHand.svelte';
    import PlayerHand from './PlayerHand.svelte';
    import Controls from './Controls.svelte';
    import GameStatus from './GameStatus.svelte';
  </script>
  
  <div class="game-board">
    <GameStatus />
    
    <div class="game-table">
      <DealerHand />
      <div class="table-divider"></div>
      <PlayerHand />
    </div>
    
    <Controls />
  </div>
  
  <style>
    .game-board {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }
    
    .game-table {
      background-color: #2c8646;
      border-radius: 50% / 10%;
      padding: 30px;
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
      position: relative;
      min-height: 400px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .table-divider {
      width: 90%;
      height: 2px;
      background-color: rgba(255, 255, 255, 0.2);
      margin: 20px auto;
      border-radius: 1px;
    }
  </style>