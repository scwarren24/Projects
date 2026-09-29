import random
from cardClass import Card

class Deck:

    def __init__(self):
        self.cards = [
            Card(rank, suit)
            for suit in Card.SUITS
            for rank in Card.RANKS
        ]
        self.DeckRanks ={"A": 4,
                        "2": 4,
                        "3": 4,
                         "4": 4, "5": 4, "6": 4, "7": 4, "8": 4, "9": 4, "10": 4, "J": 4, "Q": 4, "K": 4}

    def shuffle(self):
        random.shuffle(self.cards)

    def draw(self, amount=1):
        if amount > len(self.cards):
            raise ValueError("Not enough cards in deck")
        
        if amount == 1:
            card = self.cards.pop()
            self.DeckRanks[card.rank] -= 1
            return card

        cards = self.cards[-amount:]
        self.cards = self.cards[:-amount]
        for i in cards:
            self.DeckRanks[i.rank] -= 1

        return cards
    def draw_specific(self, rank, suit):
        """
        Remove and return the exact card matching rank/suit from the
        deck. Raises ValueError if that card isn't available (already
        drawn, or not a valid rank/suit).
        """
        for i, card in enumerate(self.cards):
            if card.rank == rank and card.suit == suit:
                self.DeckRanks[card.rank] -=1
                return self.cards.pop(i)

        raise ValueError(f"Card {rank}{suit} is not available in the deck "
                          f"(already drawn, or not a valid card).")

    def reset(self):
        self.__init__()
