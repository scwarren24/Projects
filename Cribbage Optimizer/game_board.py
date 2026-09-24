from cardClass import Card
from deckClass import Deck
from scoringClass import Scoring
from itertools import combinations
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
    base_score_val = base_score(cards)

    total_added = 0
    for card in deck.cards:

        new_score = scoring.score_hand(cards, card)

        added_points = new_score - base_score_val

        total_added += added_points

    return (total_added / len(deck.cards))

def crib_expected_points2(cards, deck):
    total_expected = 0
    n = 0
    for combo in combinations(deck.cards, 2):
        cards_to_score = cards + list(combo)
        total_expected += (base_score(cards_to_score) + expected_points_with_starter(cards_to_score, deck))
        n += 1
    return total_expected / n

def crib_expected_points3(cards, deck):
    total_expected = 0
    n = 0
    for combo in combinations(deck.cards, 3):
        cards_to_score = cards + list(combo)
        total_expected += (base_score(cards_to_score) + expected_points_with_starter(cards_to_score, deck))
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
            relative_score = (base_score(keep) + expected_points_with_starter(keep, deck) + crib_expected_points2(discard, deck))

        else:
            relative_score = (base_score(keep) + expected_points_with_starter(keep, deck) - crib_expected_points2(discard, deck))

        results.append((keep, discard, relative_score))

    results.sort(key=lambda r: r[2], reverse=True)

    keep_str_width = max(len(str(r[0])) for r in results)
    discard_str_width = max(len(str(r[1])) for r in results)

    header = f"{'Keep':<{keep_str_width}}  {'Discard':<{discard_str_width}}  {'Est. Score':>10}"
    print()
    print(header)
    print("-" * len(header))
    for keep, discard, score in results:
        print(f"{str(keep):<{keep_str_width}}  {str(discard):<{discard_str_width}}  {score:>10.2f}")