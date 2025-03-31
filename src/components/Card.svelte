<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { dealCardAnimation, flipCardAnimation } from '../animations';
  import { gsap } from 'gsap';
  
  // Props
  export let card = null;
  export let faceDown = false;
  export let index = 0;
  export let isWinningCard = false;
  export let isBusted = false;
  export let isDealer = false;
  export let totalCards = 2;
  
  // État interne de la carte
  let isFlipped = faceDown;
  let cardElement;
  let frontFace;
  let backFace;
  let isInitialized = false;
  
  const dispatch = createEventDispatcher();
  
  onMount(() => {
    // Animer l'entrée de la carte
    dealCardAnimation(cardElement, { 
      index, 
      isDealer, 
      totalCards 
    });
    
    isInitialized = true;
  });
  
  // Retourner la carte avec animation
  export function flip(showFace = true) {
    if (!isInitialized) return;
    
    // Ne pas retourner si déjà dans l'état désiré
    if ((showFace && !isFlipped) || (!showFace && isFlipped)) return;
    
    isFlipped = !showFace;
    
    // Animation de retournement
    const tl = gsap.timeline();
    
    tl.to(cardElement, {
      duration: 0.15,
      scaleX: 0,
      ease: "power1.in",
      onComplete: () => {
        if (isFlipped) {
          frontFace.style.display = 'none';
          backFace.style.display = 'block';
        } else {
          frontFace.style.display = 'block';
          backFace.style.display = 'none';
        }
      }
    }).to(cardElement, {
      duration: 0.15,
      scaleX: 1,
      ease: "power1.out"
    });
    
    return tl;
  }
  
  // Observer les changements de faceDown
  $: if (isInitialized && faceDown !== isFlipped) {
    flip(!faceDown);
  }
  
  // Appliquer des effets spéciaux basés sur l'état de la carte
  $: cardClasses = `
    card-container
    ${isWinningCard ? 'winning' : ''}
    ${isBusted ? 'busted' : ''}
  `;
</script>

<div 
  class={cardClasses}
  bind:this={cardElement}
>
  <div class="card-inner">
    <div class="card-face front" bind:this={frontFace} style="display: {isFlipped ? 'none' : 'block'}">
      {#if card}
        <img 
          src={card.image} 
          alt="{card.value} of {card.suit}" 
          class="card-img"
        />
        <div class="card-glare"></div>
      {:else}
        <div class="card-placeholder"></div>
      {/if}
    </div>
    <div class="card-face back" bind:this={backFace} style="display: {isFlipped ? 'block' : 'none'}">
      <img 
        src="https://deckofcardsapi.com/static/img/back.png" 
        alt="Card back" 
        class="card-img"
      />
      <div class="card-glare"></div>
    </div>
  </div>
  
  {#if isWinningCard}
    <div class="card-highlight"></div>
  {/if}
  
  {#if isBusted}
    <div class="bust-marker">
      <span>BUST</span>
    </div>
  {/if}
</div>

<style>
  .card-container {
    position: relative;
    width: 120px;
    height: 165px;
    margin: 0 -25px;
    perspective: 1000px;
    transform-style: preserve-3d;
    transition: transform 0.3s ease, z-index 0.2s;
    z-index: 1;
    will-change: transform;
  }
  
  .card-container:hover {
    transform: translateY(-10px) scale(1.02);
    z-index: 10;
  }
  
  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
  }
  
  .card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    backface-visibility: hidden;
  }
  
  .card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  
  /* Effet de brillance sur la carte */
  .card-glare {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.25) 0%,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, 0) 60%,
      rgba(255, 255, 255, 0.1) 100%
    );
    pointer-events: none;
  }
  
  /* Carte qui gagne */
  .winning {
    z-index: 5;
  }
  
  .winning .card-face {
    box-shadow: 0 0 20px 5px rgba(255, 215, 0, 0.5);
  }
  
  .card-highlight {
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 12px;
    border: 2px solid rgba(255, 215, 0, 0.7);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
    pointer-events: none;
    animation: pulse 1.5s infinite;
  }
  
  /* Carte qui "busts" (dépasse 21) */
  .busted .card-face {
    box-shadow: 0 0 15px rgba(231, 76, 60, 0.6);
    filter: grayscale(40%);
  }
  
  .bust-marker {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-15deg);
    background-color: rgba(231, 76, 60, 0.9);
    color: white;
    padding: 3px 10px;
    font-weight: bold;
    font-size: 16px;
    border-radius: 4px;
    text-transform: uppercase;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    z-index: 10;
  }
  
  .card-placeholder {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    border: 2px dashed rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
</style>