import random
from cardClass import Card

class Deck:

    def __init__(self):
        self.cards = [
            Card(rank, suit)
            for suit in Card.SUITS
            for rank in Card.RANKS
        ]

    def shuffle(self):
        random.shuffle(self.cards)

    def draw(self, amount=1):
        if amount > len(self.cards):
            raise ValueError("Not enough cards in deck")

        if amount == 1:
            return self.cards.pop()

        cards = self.cards[-amount:]
        self.cards = self.cards[:-amount]

        return cards
    def draw_specific(self, rank, suit):
        """
        Remove and return the exact card matching rank/suit from the
        deck. Raises ValueError if that card isn't available (already
        drawn, or not a valid rank/suit).
        """
        for i, card in enumerate(self.cards):
            if card.rank == rank and card.suit == suit:
                return self.cards.pop(i)

        raise ValueError(f"Card {rank}{suit} is not available in the deck "
                          f"(already drawn, or not a valid card).")

    def reset(self):
        self.__init__()
