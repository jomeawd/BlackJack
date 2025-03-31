<script>
  import { onMount } from 'svelte';
  import { gameStore, playerHandValue, dealerHandValue, isGameOver, canHit, canStand } from './stores/gameStore';
  import { fade, fly, scale } from 'svelte/transition';
  import { elasticOut } from 'svelte/easing';
  import { gsap } from 'gsap';
  import { playWinSound, playLoseSound, playStartSound } from './animations';
  
  // Importation des composants améliorés
  import GameTable from './components/GameTable.svelte';
  import Card from './components/Card.svelte';
  import GameNotification from './components/GameNotification.svelte';
  import SpecialEffects from './components/SpecialEffects.svelte';
  
  // Statistiques (à connecter à une base de données plus tard)
  let stats = {
    dealer: { name: "Croupier", wins: 0, losses: 0 },
    player: { name: "Joueur", wins: 0, losses: 0 }
  };

  // Pour les notifications modales
  let showNotification = false;
  let notification = { title: "", message: "", type: "info" };
  
  // Pour les effets spéciaux
  let currentEffect = "";
  
  // Variables pour les animations de transition
  let isClearing = false;
  let isNewHand = false;
  
  // Garder une trace des états traités pour éviter les doublons
  let processedGameStatus = '';
  
  // Observer les changements d'état et mettre à jour les statistiques
  $: {
    // Vérifier si l'état actuel est différent de celui déjà traité
    if ($gameStore.gameStatus !== processedGameStatus && 
        $gameStore.gameStatus !== 'idle' && 
        $gameStore.gameStatus !== 'playing') {
      
      if ($gameStore.gameStatus === 'playerWin' || $gameStore.gameStatus === 'playerBlackjack' || $gameStore.gameStatus === 'dealerBust') {
        // Jouer le son de victoire directement ici
        playWinSound();

        stats.player.wins++;
        stats.dealer.losses++;
        showGameNotification("Victoire !", $gameStore.message, "success");
        
        // Déterminer l'effet spécial à afficher
        currentEffect = $gameStore.gameStatus === 'playerBlackjack' ? 'blackjack' : 'win';
        
      } else if ($gameStore.gameStatus === 'dealerWin' || $gameStore.gameStatus === 'playerBust') {
        // Jouer le son de défaite directement ici
        playLoseSound();

        stats.dealer.wins++;
        stats.player.losses++;
        showGameNotification("Défaite", $gameStore.message, "error");
        
        // Déterminer l'effet spécial à afficher
        currentEffect = $gameStore.gameStatus === 'playerBust' ? 'bust' : 'lose';
        
      } else if ($gameStore.gameStatus === 'push') {
        playWinSound();
        showGameNotification("Égalité", $gameStore.message, "info");
        currentEffect = 'draw';
      }
      
      processedGameStatus = $gameStore.gameStatus;
    }
    
    // Réinitialiser l'état traité lorsqu'on commence une nouvelle partie
    if ($gameStore.gameStatus === 'playing' && processedGameStatus !== '') {
      processedGameStatus = '';
      currentEffect = '';
    }
  }

  // Fonction pour afficher une notification
  function showGameNotification(title, message, type) {
    if ($gameStore.gameStatus !== 'playing' && $gameStore.gameStatus !== 'idle') {
      notification = { title, message, type };
      showNotification = true;
      
      // La notification sera masquée automatiquement par le composant
    }
  }
  
  // Fonction pour démarrer une nouvelle partie avec réinitialisation propre
  function startNewGame() {
    // Animation de nettoyage avant de commencer une nouvelle partie
    if ($gameStore.playerHand.length > 0 || $gameStore.dealerHand.length > 0) {
      isClearing = true;
      
      setTimeout(() => {
        // Masquer immédiatement tout effet spécial en cours
        currentEffect = '';
        
        // Réinitialiser l'animation de nettoyage
        isClearing = false;
        
        // Assurer que nous ne réagissons pas à nouveau à l'ancien état
        processedGameStatus = $gameStore.gameStatus;
        
        // Masquer les notifications
        showNotification = false;
        
        // Appeler la fonction newGame du store
        gameStore.newGame();
        
        // Déclencher l'animation de nouvelle main
        setTimeout(() => {
          isNewHand = true;
          setTimeout(() => isNewHand = false, 500);
        }, 100);
      }, 500);
    } else {
      // Si pas de cartes, démarrer directement une nouvelle partie
      currentEffect = '';
      processedGameStatus = $gameStore.gameStatus;
      showNotification = false;
      gameStore.newGame();
    }
  }

  // Assurez-vous également de bien réinitialiser currentEffect quand l'état du jeu passe à 'playing'
  $: {
    if ($gameStore.gameStatus === 'playing') {
      currentEffect = '';
    }
  }
  
  // Animation des boutons
  function pulseAnimation(node) {
    gsap.to(node, {
      duration: 0.5,
      scale: 1.05,
      repeat: 1,
      yoyo: true,
      ease: "power1.inOut"
    });
  }
  
  // Détecter un Blackjack dans la main
  function hasBlackjack(hand) {
    return hand.length === 2 && 
           ((hand[0].value === 'ACE' && ['10', 'JACK', 'QUEEN', 'KING'].includes(hand[1].value)) ||
            (hand[1].value === 'ACE' && ['10', 'JACK', 'QUEEN', 'KING'].includes(hand[0].value)));
  }
  
  // Calculer si une main a dépassé 21
  function isBusted(handValue) {
    return handValue > 21;
  }
  
  // Déterminer si une carte est gagnante (utilisé pour les animations)
  function isWinningCard(card, hand) {
    if ($gameStore.gameStatus === 'playerBlackjack' && hasBlackjack($gameStore.playerHand)) {
      // Dans le cas d'un blackjack, toutes les cartes du joueur sont gagnantes
      return hand === 'player';
    }
    return false;
  }
</script>

<SpecialEffects effect={currentEffect} duration={4000} />

{#if showNotification}
  <GameNotification
    title={notification.title}
    message={notification.message}
    type={notification.type}
    position="center"
    on:close={() => showNotification = false}
  />
{/if}

<!-- Overlay de chargement -->
{#if $gameStore.isLoading}
  <div class="loading-overlay" transition:fade={{ duration: 300 }}>
    <div class="spinner"></div>
    <p>Chargement...</p>
  </div>
{/if}

<GameTable>
  <div slot="dealer">
    <div class="layout-container">
      <!-- Profil du croupier déplacé à gauche -->
      <div class="profile-container left">
        <div class="player-profile dealer {!$gameStore.isPlayerTurn && $gameStore.gameStatus === 'playing' ? 'active' : ''}">
          <div class="avatar dealer-avatar">
            <span>👔</span>
          </div>
          <div class="player-info">
            <h3>{stats.dealer.name}</h3>
            <div class="stats">
              <span class="wins"><span class="emoji">🏆</span> {stats.dealer.wins}</span>
              <span class="losses"><span class="emoji">❌</span> {stats.dealer.losses}</span>
            </div>
          </div>
          {#if !$gameStore.isPlayerTurn && $gameStore.gameStatus === 'playing'}
            <div class="active-indicator">
              <div class="pulse"></div>
            </div>
          {/if}
        </div>
      </div>
      
      <div class="cards-and-score">
        <div class="hand-value {$dealerHandValue >= 17 ? 'high' : ''} {$dealerHandValue > 21 ? 'danger' : ''}">
          {#if $gameStore.isPlayerTurn && $gameStore.gameStatus === 'playing'}
            <span class="score">?</span>
          {:else}
            <span class="score">{$dealerHandValue}</span>
          {/if}
        </div>
        
        <!-- Cartes du croupier -->
        <div class="cards-container dealer-cards {$gameStore.dealerHand.length === 0 ? 'empty' : ''} {$gameStore.isLoading ? 'dealing' : ''}" 
             class:clear-animation={isClearing} 
             class:new-hand-animation={isNewHand}>
          {#each $gameStore.dealerHand as card, i}
            <Card 
              {card} 
              faceDown={i !== 0 && $gameStore.isPlayerTurn && $gameStore.gameStatus === 'playing'}
              index={i}
              isDealer={true}
              totalCards={$gameStore.dealerHand.length}
              isWinningCard={isWinningCard(card, 'dealer')}
              isBusted={$gameStore.gameStatus === 'dealerBust'}
            />
          {/each}
        </div>
      </div>
      
      <!-- Espace vide à droite pour équilibrer -->
      <div class="profile-container right"></div>
    </div>
  </div>
  
  <div slot="center">
    <div class="game-status">
      <p class="message">{$gameStore.message}</p>
      <p class="cards-remaining">
        <span class="cards-remaining-icon">🃏</span>
        Cartes restantes: {$gameStore.remainingCards}
      </p>
    </div>
    
    <!-- Contrôles du jeu -->
    <div class="controls">
      {#if $gameStore.gameStatus === 'idle' || $isGameOver}
        <button 
          class="btn new-game" 
          on:click={() => { pulseAnimation(event.target); startNewGame(); }}
          transition:scale={{ duration: 300, start: 0.8 }}
        >
          {$gameStore.gameStatus === 'idle' ? 'Nouvelle partie' : 'Rejouer'}
        </button>
      {:else}
        <div class="action-buttons" transition:fly={{ y: 50, duration: 300 }}>
          <button 
            class="btn hit" 
            disabled={!$canHit} 
            on:click={() => { pulseAnimation(event.target); gameStore.hit(); }}
          >
            Tirer
          </button>
          <button 
            class="btn stand" 
            disabled={!$canStand} 
            on:click={() => { pulseAnimation(event.target); gameStore.stand(); }}
          >
            Rester
          </button>
        </div>
      {/if}
    </div>
  </div>
  
  <div slot="player">
    <div class="layout-container">
      <!-- Espace vide à gauche pour équilibrer -->
      <div class="profile-container left"></div>
      
      <div class="cards-and-score">
        <!-- Cartes du joueur -->
        <div class="cards-container player-cards {$gameStore.playerHand.length === 0 ? 'empty' : ''} {$gameStore.isLoading ? 'dealing' : ''}"
             class:clear-animation={isClearing} 
             class:new-hand-animation={isNewHand}>
          {#each $gameStore.playerHand as card, i}
            <Card 
              {card} 
              faceDown={false}
              index={i}
              isDealer={false}
              totalCards={$gameStore.playerHand.length}
              isWinningCard={isWinningCard(card, 'player')}
              isBusted={$gameStore.gameStatus === 'playerBust'}
            />
          {/each}
        </div>
        
        <div class="hand-value {$playerHandValue >= 17 && $playerHandValue <= 21 ? 'high' : ''} {$playerHandValue > 21 ? 'danger' : ''}">
          <span class="score">{$playerHandValue}</span>
        </div>
      </div>
      
      <!-- Profil du joueur déplacé à droite -->
      <div class="profile-container right">
        <div class="player-profile player {$gameStore.isPlayerTurn && $gameStore.gameStatus === 'playing' ? 'active' : ''}">
          <div class="avatar player-avatar">
            <span>👤</span>
          </div>
          <div class="player-info">
            <h3>{stats.player.name}</h3>
            <div class="stats">
              <span class="wins"><span class="emoji">🏆</span> {stats.player.wins}</span>
              <span class="losses"><span class="emoji">❌</span> {stats.player.losses}</span>
            </div>
          </div>
          {#if $gameStore.isPlayerTurn && $gameStore.gameStatus === 'playing'}
            <div class="active-indicator">
              <div class="pulse"></div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</GameTable>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
  
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
    color: #ffffff;
    height: 100vh;
    overflow: hidden;
  }
  
  /* Conteneur pour la nouvelle disposition */
  .layout-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    /* position: relative; */
  }
  
  .profile-container {
    width: 200px;
    position: absolute;
    top: 10px;
    z-index: 10;
  }
  
  .profile-container.left {
    left: 10px;
  }
  
  .profile-container.right {
    right: 10px;
  }
  
  .cards-and-score {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  
  /* Profils des joueurs améliorés */
  .player-profile {
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 12px;
    padding: 0.8rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    width: 200px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    position: relative;
    transition: all 0.3s ease;
  }
  
  .player-profile.active {
    box-shadow: 0 0 15px rgba(46, 204, 113, 0.6);
    border-color: rgba(46, 204, 113, 0.6);
  }
  
  .avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    font-size: 1.5rem;
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
  
  .emoji {
    margin-right: 3px;
    font-size: 1rem;
  }
  
  .wins {
    color: #2ecc71;
  }
  
  .losses {
    color: #e74c3c;
  }
  
  /* Indicateur de tour actif */
  .active-indicator {
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
  
  /* Animation des conteneurs de cartes */
  .cards-container {
    display: flex;
    justify-content: center;
    min-height: 160px; /* Réduit légèrement */
    position: relative;
    margin: 0.5rem 0; /* Réduit les marges */
    perspective: 1000px;
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  
  .cards-container.empty {
    opacity: 0.3;
  }
  
  .cards-container.dealing {
    animation: dealingPulse 2s infinite;
  }
  
  @keyframes dealingPulse {
    0% { box-shadow: 0 0 0 rgba(52, 152, 219, 0); }
    50% { box-shadow: 0 0 20px rgba(52, 152, 219, 0.3); }
    100% { box-shadow: 0 0 0 rgba(52, 152, 219, 0); }
  }
  
  /* Animation pour effacer les cartes */
  .clear-animation {
    animation: clearCards 0.5s forwards;
  }
  
  @keyframes clearCards {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(20px) scale(0.9);
    }
  }
  
  /* Animation pour la nouvelle main */
  .new-hand-animation {
    animation: newHand 0.5s forwards;
  }
  
  @keyframes newHand {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  /* Améliorations pour les valeurs des mains */
  .hand-value {
    background: rgba(0, 0, 0, 0.6);
    border-radius: 20px;
    padding: 0.3rem 1rem; /* Légèrement réduit */
    margin: 0.5rem 0; /* Réduit les marges */
    display: inline-block;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
  }
  
  .hand-value.high {
    background: rgba(46, 204, 113, 0.3);
    box-shadow: 0 0 10px rgba(46, 204, 113, 0.3);
  }
  
  .hand-value.danger {
    background: rgba(231, 76, 60, 0.3);
    box-shadow: 0 0 10px rgba(231, 76, 60, 0.3);
  }
  
  .score {
    font-weight: bold;
    font-size: 1.3rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  /* Améliorations pour la zone de statut du jeu
  /* Améliorations pour la zone de statut du jeu */
  .game-status {
    text-align: center;
    padding: 0.7rem 1rem;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    margin-bottom: 1rem; /* Réduit légèrement */
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(5px);
    transition: all 0.3s ease;
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
  
  .message {
    font-weight: 500;
    margin-bottom: 0.5rem;
    letter-spacing: 0.5px;
  }
  
  .cards-remaining {
    font-size: 0.8rem;
    opacity: 0.7;
    margin-top: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
  
  .cards-remaining-icon {
    font-size: 0.9rem;
    margin-right: 3px;
  }
  
  /* Améliorations pour les boutons */
  .btn {
    background: none;
    border: none;
    padding: 0.8rem 1.6rem; /* Légèrement réduit */
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 0.95rem;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: white;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
  }
  
  .btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    z-index: 0;
    opacity: 0.2;
  }
  
  .btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  }
  
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .btn:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }
  
  .new-game {
    background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
  }
  
  .hit {
    background: linear-gradient(135deg, #0984e3 0%, #6c5ce7 100%);
  }
  
  .stand {
    background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%);
  }
  
  .controls {
    display: flex;
    justify-content: center;
    margin: 0.8rem 0; /* Réduit légèrement */
  }
  
  .action-buttons {
    display: flex;
    gap: 1rem;
  }
  
  /* Overlay de chargement */
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(10, 10, 20, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 100;
    backdrop-filter: blur(5px);
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .action-buttons {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .profile-container {
      width: 150px;
    }
    
    .player-profile {
      width: 150px;
      padding: 0.6rem;
    }
    
    .avatar {
      width: 35px;
      height: 35px;
      font-size: 1.1rem;
    }
    
    .player-info h3 {
      font-size: 0.8rem;
    }
    
    .stats {
      font-size: 0.7rem;
      gap: 0.5rem;
    }
    
    .profile-container.left {
      left: 5px;
    }
    
    .profile-container.right {
      right: 5px;
    }
  }
</style>