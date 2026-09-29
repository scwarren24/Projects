from cardClass import Card
from deckClass import Deck
from scoringClass import Scoring
from itertools import combinations
from itertools import combinations_with_replacement
#from winProb import simulate_win_prob
#print (  ['♠', '♣', '♥', '♦'])
# deck = Deck()
# deck.shuffle()
# playerCards = deck.draw(6)
# hands = combinations(playerCards, 4)
# deck.reset()

scoring = Scoring()
def base_score(cards):
    return scoring.score_hand(cards, None)

def expected_points_with_starter(cards, deck):
    #base_score_val = base_score(cards)

    total_added = 0
    for card in deck.cards:

        new_score = scoring.score_hand(cards, card)
        # new_score += scoring.fifteens(cards)
        # new_score += scoring.pairs(cards)
        # new_score += scoring.runs(cards)
        # new_score += scoring.flush(cards, card)
        # new_score += scoring.rightJack(cards, card)

        #added_points = new_score - base_score_val

        total_added += new_score

    return (total_added / len(deck.cards))

def crib_expected_points2(cards, deck: Deck):
    total_expected = 0
    n = 0
    
    for c1,c2 in combinations_with_replacement(deck.DeckRanks,2):
        free = [s for s in Card.SUITS if s not in (cards[0].suit, cards[1].suit)]
        card1 = Card(c1, free[0])
        card2 = Card(c2, free[1])
        cards_to_score = cards + [card1, card2]
        if c1 == c2:
            n_left = deck.DeckRanks[c1]
            How_many_times = n_left * (n_left - 1) // 2
        else:
            How_many_times = deck.DeckRanks[c1]*deck.DeckRanks[c2]
        total_expected += (How_many_times * expected_points_with_starter(cards_to_score, deck))

        n += How_many_times
    result = total_expected / n
    if cards[0].suit == cards[1].suit:
        flush_suit = cards[0].suit
        s = 0
        for c in deck.cards:
            if c.suit == flush_suit:
                s += 1
        numSuit = len(deck.cards)

        # 1st suited card
        p1 = s / numSuit
        # 2nd suited card
        p2 = (s - 1) / (numSuit - 1)
        # 3rd suited card
        p3 = (s - 2) / (numSuit - 2)

        # Chance all three suited cards are that suit
        chance_of_flush = p1 * p2 * p3

        # A 5-card flush is worth 5 points
        result += 5 * chance_of_flush
    return result

def crib_expected_points3(cards, deck):
    total_expected = 0
    n = 0
    for combo in combinations(deck.cards, 3):
        cards_to_score = cards + list(combo)
        total_expected += expected_points_with_starter(cards_to_score, deck)
        n += 1
    return total_expected / n


#def crib_expected_points3(cards, deck):
    


if __name__ == "__main__":
    deck = Deck()
    scoring = Scoring()

    deck.shuffle()
    #cards = deck.draw(6)
    card1_input = input("Enter the starting card (e.g., '5H'): ").strip().upper()
    card2_input = input("Enter the starting card (e.g., '5H'): ").strip().upper()
    card3_input = input("Enter the starting card (e.g., '5H'): ").strip().upper()
    card4_input = input("Enter the starting card (e.g., '5H'): ").strip().upper()
    card5_input = input("Enter the starting card (e.g., '5H'): ").strip().upper()
    card6_input = input("Enter the starting card (e.g., '5H'): ").strip().upper()
    cards = [
        deck.draw_specific(card1_input[:-1], card1_input[-1]),
        deck.draw_specific(card2_input[:-1], card2_input[-1]),
        deck.draw_specific(card3_input[:-1], card3_input[-1]),
        deck.draw_specific(card4_input[:-1], card4_input[-1]),
        deck.draw_specific(card5_input[:-1], card5_input[-1]),
        deck.draw_specific(card6_input[:-1], card6_input[-1])
    ]
    print("Dealt:", cards)
    
    
    crib_input = input("Is it your crib? (y/n): ").strip().lower()
    crib = crib_input == "y"

    results = []
    for keep in combinations(cards, 4):
        keep = list(keep)
        discard = [x for x in cards if x not in keep]

        if crib:
            #base = base_score(keep)
            expected_points = expected_points_with_starter(keep, deck)
            cribs = crib_expected_points2(discard, deck)
            relative_score = expected_points + cribs

        else:
            #base = base_score(keep)
            expected_points = expected_points_with_starter(keep, deck)
            cribs = crib_expected_points2(discard, deck)
            cribs = cribs * -1
            relative_score = expected_points + cribs

        results.append((keep, discard, relative_score, expected_points, cribs))

    results.sort(key=lambda r: r[2], reverse=True)

    keep_str_width = max(len(str(r[0])) for r in results)
    discard_str_width = max(len(str(r[1])) for r in results)

    header = f"{'Keep':<{keep_str_width}}  {'Discard':<{discard_str_width}}  {'Est. Score':>10}  {'Expected':>10}  {'Crib':>10}"
    print()
    print(header)
    print("-" * len(header))
    for keep, discard, score, expected_points, cribs in results:
        print(f"{str(keep):<{keep_str_width}}  {str(discard):<{discard_str_width}}  {score:>10.2f}  {expected_points:>10.2f}  {cribs:>10.2f}")