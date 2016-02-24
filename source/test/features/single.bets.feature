Feature: Single bets
    As a customer
    I want to be able to place single bets
    So that I can win something.

    Scenario: The bet button should be hidden if I have no selections.
        Given that I am on the sportsbook page
        And that I have no selections
        Then the bet button should be hidden
		And the potential win should be "€0.00"

	Scenario: Selections should be added to the betslip as they are clicked by the user.
        Given that I am on the sportsbook page
        And that I have no selections
        When I pick a selection
        Then the selection should be added to the betslip
        And the bet button should be displayed

    Scenario: Potential win should be updated when I set a stake.
        Given that I am on the sportsbook page
        And that I have 1 selection
        When I set a stake of "2"
        Then the potential win should be updated

    Scenario: The combi bets view should be activated if I pick two selections.
        Given that I am on the sportsbook page
        And that I have 1 selection
        When I pick a selection
        Then the combi bet view should be displayed