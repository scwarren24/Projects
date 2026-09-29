import random

def draw(mu, sigma):
    return max(0.0, random.gauss(mu, sigma))

def simulate_win_prob(score_A, score_B, A_is_dealer, target=121, trials=200_000, max_rounds=25):
    wins_A = 0
    dealer_peg = (3.5, 1.2578125)
    dealer_hand = (7.96, 3.93)
    dealer_crib = (4.67, 3.14)
    nondealer_peg = (2.1, 1.20638297872)
    nondealer_hand = (8.12, 3.64)

    for _ in range(trials):
        a, b = score_A, score_B
        a_dealer = A_is_dealer

        for _round in range(max_rounds):
            if a_dealer:
                dealer_score, nondealer_score = a, b
            else:
                dealer_score, nondealer_score = b, a

            nondealer_score += draw(*nondealer_peg)
            dealer_score += draw(*dealer_peg)

            winner = None
            if nondealer_score >= target:
                winner = 'nondealer'
            elif dealer_score >= target:
                winner = 'dealer'

            if winner is None:
                nondealer_score += draw(*nondealer_hand)
                if nondealer_score >= target:
                    winner = 'nondealer'

            if winner is None:
                dealer_score += draw(*dealer_hand)
                if dealer_score >= target:
                    winner = 'dealer'

            if winner is None:
                dealer_score += draw(*dealer_crib)
                if dealer_score >= target:
                    winner = 'dealer'

            if a_dealer:
                a, b = dealer_score, nondealer_score
            else:
                b, a = dealer_score, nondealer_score

            if winner == 'dealer':
                if a_dealer:
                    wins_A += 1
                break
            elif winner == 'nondealer':
                if not a_dealer:
                    wins_A += 1
                break

            a_dealer = not a_dealer

    return wins_A / trials


if __name__ == "__main__":
    p_A = simulate_win_prob(0, 0, True)
    print(f"P(A wins) at 0-0, A dealer = {p_A:.3f}")
    print(f"P(B wins) at 0-0, A dealer = {1 - p_A:.3f}")