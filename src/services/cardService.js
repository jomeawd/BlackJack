/**
 * Service pour interagir avec l'API Deck of Cards
 */

const API_BASE_URL = 'https://deckofcardsapi.com/api/deck';

/**
 * Crée et mélange un nouveau deck de cartes
 * @returns {Promise<Object>} L'objet deck contenant l'ID et d'autres informations
 */
export const createDeck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/new/shuffle/?deck_count=1`);
    if (!response.ok) {
      throw new Error('Erreur lors de la création du deck');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur dans createDeck:', error);
    throw error;
  }
};

/**
 * Tire un nombre spécifié de cartes du deck
 * @param {string} deckId - L'ID du deck
 * @param {number} count - Le nombre de cartes à tirer
 * @returns {Promise<Object>} Les cartes tirées et des informations sur le deck
 */
export const drawCards = async (deckId, count) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${deckId}/draw/?count=${count}`);
    if (!response.ok) {
      throw new Error('Erreur lors du tirage des cartes');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur dans drawCards:', error);
    throw error;
  }
};

/**
 * Mélange le deck de cartes
 * @param {string} deckId - L'ID du deck
 * @returns {Promise<Object>} Informations sur le deck mélangé
 */
export const shuffleDeck = async (deckId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${deckId}/shuffle/`);
    if (!response.ok) {
      throw new Error('Erreur lors du mélange du deck');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur dans shuffleDeck:', error);
    throw error;
  }
};

/**
 * Calcule la valeur d'une main de blackjack
 * @param {Array} cards - Tableau d'objets carte
 * @returns {Object} La valeur de la main et si c'est un blackjack
 */
export const calculateHandValue = (cards) => {
  let value = 0;
  let aces = 0;
  
  // Première passe: compter les points sans les as
  cards.forEach(card => {
    const cardValue = card.value;
    if (cardValue === 'ACE') {
      aces += 1;
    } else if (['KING', 'QUEEN', 'JACK'].includes(cardValue)) {
      value += 10;
    } else {
      value += parseInt(cardValue, 10);
    }
  });
  
  // Deuxième passe: ajouter les as avec la valeur optimale
  for (let i = 0; i < aces; i++) {
    if (value + 11 <= 21) {
      value += 11;
    } else {
      value += 1;
    }
  }
  
  const isBlackjack = cards.length === 2 && value === 21;
  
  return { value, isBlackjack };
};