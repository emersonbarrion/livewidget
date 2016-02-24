Feature: SSK-399 System bets
    As a customer
    I want to be able to place system bets
    So that I think that I can secure some win even if I don't get all the games right

    Scenario: SSK-405 System bets should not be visible and disabled if there are less than 3 selections.
        Given that I am on the sportsbook page
        And that I have less than 3 selections
        Then the system bets tab should be disabled

    Scenario: SSK-405 System bets should be available if there are 3 or more selections.
        Given that I am on the sportsbook page
        And that the system bets tab is disabled
        When I make 3 or more selections
        Then the system bets tab should be enabled

    Scenario: SSK-405 The system bets tab should display the system bets view.
        Given that I am on the sportsbook page
        And that the system bets tab is enabled
        When I click on the system bets tab
        Then the system bets view should be displayed

    Scenario: SSK-405 The combi bets view should be displayed if we go below 3 selections.
        Given that I am on the system bets view
        And that I have 3 selections
        When I remove a selection
        Then the combi bet view should be displayed

    Scenario: SSK-406 Permutations should be displayed for 3 selections.
        Given that I am on the sportsbook page
        And that I have 3 selections
        And that I am on the system bets view        
        Then I should see 1 bet identified by ".x3"
        And then I should see 3 bets identified by ".x2"
        And then I should see 3 bets identified by ".x1"

    Scenario: SSK-406 Permutations should be displayed for 4 selections.
        Given that I am on the sportsbook page
        And that I have 3 selections
        And that I am on the system bets view   s
        When I pick a selection
        Then I should see 1 bet identified by ".x4"
        And then I should see 4 bets identified by ".x3"
        And then I should see 6 bets identified by ".x2"
        And then I should see 4 bets identified by ".x1"

    Scenario: SSK-406 Permutations should be updated when removing selections.
        Given that I am on the sportsbook page
        And that I have 4 selections
        And that I am on the system bets view   
        When I remove a selection
        Then I should see 1 bet identified by ".x3"
        And then I should see 3 bets identified by ".x2"
        And then I should see 3 bets identified by ".x1"