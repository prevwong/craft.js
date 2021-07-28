// In this test we use the settings panel to change the props of the components
// we verify that the selection worked by checking the classNames
// In a real world application this could potentially be brittle. We do not want to test implementation details.
// It would be better to use a visual testing instead of checking for the existence of the classNames
// see more:  https://docs.cypress.io/guides/tooling/visual-testing.html
describe('Props / SettingsPanel', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should be possible to change the props of a Text element', () => {
    // first we select a text component
    cy.getByTestId('card-top-text-1')
      .as('text')
      // The text component renders a ContentEditable which receives the font-size
      .find('p')
      .should('have.css', 'font-size', '20px')
      .click();

    // the settings panel should be visible and render an editor for one prop
    cy.getByTestId('settings-panel')
      .should('exist')
      .find('fieldset')
      .should('have.length', 1);

    // it should say, that we selected the Text component
    cy.getByTestId('chip-selected').contains('Text');

    // to keep it simple we select the max value in the slider
    cy.get('.MuiSlider-root').click('right');
    cy.get('@text').find('p').should('have.css', 'font-size', '50px');

    // and afterwards the min value
    cy.get('.MuiSlider-root').click('left');
    cy.get('@text').find('p').should('have.css', 'font-size', '1px');
  });

  it('should be possible to change the props for the button', () => {
    // the other tests follow the same schema as above:
    // 1. select the component
    // 2. verify that the settings panel is visible and shows the correct information
    // 3. change the props by using the SettingsPanel
    // 4. verify the changes

    cy.getByTestId('frame-button').as('button').click();
    cy.get('@button')
      .should('have.class', 'MuiButton-sizeSmall')
      .should('have.class', 'MuiButton-contained')
      .should('have.class', 'MuiButton-containedPrimary');

    cy.getByTestId('settings-panel')
      .should('exist')
      .find('fieldset')
      // this time we should have three props we can edit
      .should('have.length', 3);

    cy.getByTestId('chip-selected').contains('Button');

    cy.contains('Medium').click();
    cy.contains('Outlined').click();
    cy.contains('Secondary').click();

    cy.get('@button')
      // size medium is the default the button does not receive a class for that
      .should('have.class', 'MuiButton-outlined')
      .should('have.class', 'MuiButton-outlinedSecondary');

    cy.contains('Large').click();
    cy.get('[role="radiogroup"]').within(() => {
      cy.contains('Text').click();
    });
    cy.contains('Default').click();

    cy.get('@button')
      .should('have.class', 'MuiButton-sizeLarge')
      .should('have.class', 'MuiButton-text')
      .should('have.class', 'MuiButton-textSizeLarge');
  });

  it('should be possible to change the props for the container', () => {
    // The Card component renders a Container so we test both the Card and the Container by itself
    [
      {
        componentName: 'Card',
        testId: 'frame-card',
        initialBackgroundColor: 'rgb(255, 255, 255)',
        initialPadding: '3px',
      },
      {
        componentName: 'Container',
        testId: 'frame-container',
        initialBackgroundColor: 'rgb(153, 153, 153)',
        initialPadding: '6px',
      },
    ].forEach(
      ({ testId, initialBackgroundColor, initialPadding, componentName }) => {
        // we click left to not accidentally click the text inside the container/card
        cy.getByTestId(testId).as('container').click('left');

        cy.get('@container')
          .should('have.css', 'background-color', initialBackgroundColor)
          .should('have.css', 'padding', initialPadding);

        cy.getByTestId('settings-panel')
          .should('exist')
          .find('fieldset')
          .should('have.length', 2);

        cy.getByTestId('chip-selected').contains(componentName);

        cy.get('[name="background-color"]')
          .as('input-background-color')
          // we focus the input to be able to close the color picker
          .focus()
          // instead of using the color picker we directly enter the value inside the input
          .type('{selectAll}#FF0000')
          // we call blur to close the color picker
          .blur();
        cy.get('.MuiSlider-root').as('input-padding').click('right');

        cy.get('@container')
          .should('have.css', 'background-color', 'rgb(255, 0, 0)')
          .should('have.css', 'padding', '100px');

        cy.get('@input-background-color')
          .focus()
          .type('{selectAll}#FFFF00')
          .blur();
        cy.get('@input-padding').click('left');

        cy.get('@container')
          .should('have.css', 'background-color', 'rgb(255, 255, 0)')
          .should('have.css', 'padding', '0px');
      }
    );
  });

  it('CardTop and CardBottom should not have settings', () => {
    // both CardTop and CardBottom don't have a prop editor
    // we select each component
    cy.getByTestId('card-top').click('left');
    // the settings panel should exist but should not be visible
    cy.getByTestId('settings-panel').should('exist').should('not.be.visible');
    cy.getByTestId('chip-selected').contains('CardTop');

    cy.getByTestId('card-bottom').click('left');
    cy.getByTestId('settings-panel').should('exist').should('not.be.visible');
    cy.getByTestId('chip-selected').contains('CardBottom');
  });

  it('should not be possible to edit the props / open the SettingsPanel when the editor is disabled', () => {
    cy.contains('Enable').click();

    // for each element...
    [
      'frame-text',
      'frame-button',
      'frame-container',
      'frame-card',
      'card-top',
      'card-bottom',
    ].forEach((testId) => {
      // ... we select the element ...
      cy.getByTestId(testId).click();
      // ... and expect the settings panel to not be in the DOM
      cy.getByTestId('settings-panel').should('not.exist');
    });
  });
});
