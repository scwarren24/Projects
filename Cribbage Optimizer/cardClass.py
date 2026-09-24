class Card:
    RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    SUITS = ["C", "D", "H", "S"]
    #SUITS = ['♠', '♣', '♥', '♦']
    suitFormat = {
        "C": '♣',
        "D": '♦',
        "H": '♥',
        "S": '♠'
    }
    PegValues = {
        "A": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
        "10": 10,
        "J": 10,
        "Q": 10,
        "K": 10
    }
    RunValues = {
            "A": 1,
            "2": 2,
            "3": 3,
            "4": 4,
            "5": 5,
            "6": 6,
            "7": 7,
            "8": 8,
            "9": 9,
            "10": 10,
            "J": 11,
            "Q": 12,
            "K": 13
        }

    def __init__(self, rank, suit):
        self.rank = rank
        self.suit = suit

    def get_Pegvalue(self):
        return self.PegValues[self.rank]
    
    def get_Runvalue(self):
            return self.RunValues[self.rank]
    
    def get_suit(self):
        return self.suit
    def __repr__(self):
        return f"{self.rank}{self.suit}"
    
    def __str__(self):
        return f"{self.rank}{self.suit}"