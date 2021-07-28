describe('Toolbox', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.getByTestId('card-top').as('card-top');
    cy.getByTestId('card-bottom').as('card-bottom');
    cy.getByTestId('root-container').as('root-container');
    cy.getByTestId('frame-container').as('frame-container');
  });

  describe('Test Toolbox Button', () => {
    beforeEach(() => {
      cy.getByTestId('toolbox-button')
        .as('toolbox-button')
        .should('have.attr', 'draggable', 'true');
    });

    it('should be possible to drag buttons to the bottom of the card', () => {
      cy.getByTestId('card-bottom-button').as('target-button');
      // we verify that there only is one button in the CardBottom component
      cy.get('@card-bottom').children().should('have.length', 1);

      // we drag the button from the toolbox over the button inside the CardBottom
      cy.get('@toolbox-button').dragOver('@target-button', {
        position: 'right',
      });

      // the success DropIndicator should be visible
      cy.getDropIndicator('success').should('exist');

      // we trigger the drop
      cy.get('@toolbox-button').drop();

      // there should be two components now
      cy.get('@card-bottom').children().should('have.length', 2);

      // and both should be buttons
      cy.get('@target-button').parent().find('button').should('have.length', 2);

      // we now drop a button to the left of the target button
      cy.get('@toolbox-button').dragAndDrop('@target-button', {
        position: 'left',
      });

      // there should be three components now
      cy.get('@target-button').parent().children().should('have.length', 3);

      // and all of them should be buttons
      cy.get('@target-button').parent().find('button').should('have.length', 3);

      // the @target-button should be in the middle
      cy.get('@card-bottom')
        .children()
        .then((children) => children[1])
        .contains('Only buttons down here');
    });

    it('should not be possible to drag buttons to the top of the card', () => {
      cy.getByTestId('card-top-text-1').as('target-text');

      // we verify that CardTop has currently only 2 elements inside
      cy.get('@card-top').children().should('have.length', 2);

      // we drag the button to the CardTop
      cy.get('@toolbox-button').dragOver('@target-text');

      // the error indicator should indicate that it is not possible to drop here
      cy.getDropIndicator('error').should('exist');

      // we trigger the drop
      cy.get('@toolbox-button').drop();

      // there still should only be 2 children
      cy.get('@card-top').children().should('have.length', 2);
    });

    it('should be possible to drop buttons anywhere else', () => {
      cy.getByTestId('frame-button').as('target-button');

      // there should be only one button in the editor
      cy.get('@root-container').contains('Click me').should('have.length', 1);

      // let's first drop next to the "Click me" button
      cy.get('@toolbox-button').dragAndDrop('@target-button', {
        position: 'right',
      });

      // there should now be two buttons
      cy.get('@root-container')
        .find('button:contains("Click me")')
        .should('have.length', 2);

      // we now drop the button below "Hi world!"
      cy.getByTestId('frame-text').as('target-text');

      cy.get('@toolbox-button').dragAndDrop('@target-text', {
        position: 'below',
      });

      // there should now be three buttons
      cy.get('@root-container')
        .find('button:contains("Click me")')
        .should('have.length', 3);

      // lastly we try to drop the button inside the Container
      // this time we do not want to drop the button on one element already inside the container
      // but directly into the container
      // before we drag & drop there should be only one element inside the container
      cy.get('@frame-container').children().should('have.length', 1);

      // we drop inside the container
      cy.get('@toolbox-button').dragAndDrop('@frame-container', {
        position: 'inside',
      });

      // there now should be two elements inside the container
      cy.get('@frame-container').children().should('have.length', 2);
    });
  });

  describe('Test Toolbox Text', () => {
    beforeEach(() => {
      cy.getByTestId('toolbox-text')
        .as('toolbox-text')
        .should('have.attr', 'draggable', 'true');
    });

    // this is basically the same test as the button test
    it('should be possible to drop texts inside the CardTop component', () => {
      cy.getByTestId('card-top-text-2').as('target-text');

      // before we start we verify that CardTop currently has 2 elements
      cy.get('@card-top').children().should('have.length', 2);

      // this time we test if it's possible to drop between elements by dropping above the second element
      cy.get('@toolbox-text').dragAndDrop('@target-text', {
        position: 'above',
      });

      // we now should have 3 elements
      cy.get('@card-top').children().should('have.length', 3);

      // the element in the middle should be the dropped element
      cy.get('@card-top')
        .children()
        .then(($children) => $children[1])
        .contains('Hi world');
    });

    // this too, is basically the same test as the one we used to test the Toolbox Button
    it('should not be possible to drop texts inside the CardBottom component', () => {
      // before we start we verify that the CardBottom currently has only one element
      cy.get('@card-bottom').children().should('have.length', 1);

      // we drag the Text from the toolbox over the CardBottom component
      cy.get('@toolbox-text').dragOver('@card-bottom', {
        position: 'inside',
      });

      // the error indicator should be visible (in the button test, we tested for existence which in our case is the same as being visible)
      cy.getDropIndicator('error').should('be.visible');

      // we drop the text (inside the CardBottom)...
      cy.get('@toolbox-text').drop();

      // ... which should not be possible. That's why we verify that the CardBottom still only has one element
      cy.get('@card-bottom').children().should('have.length', 1);
    });

    const numberOfElements = 25;
    // because we do not want to copy the whole button test, we try to test something different
    // TODO cypress or craft get slower which each Text element dropped. Investigate whether it's cypress, or craft
    //      currently my money is on cypress
    it(`should be possible to drop ${numberOfElements} texts somewhere under root`, () => {
      // before we drop $numberOfElements elements we verify that we start with 4 elements
      cy.get('@root-container').children().should('have.length', 4);

      for (let count = 0; count < numberOfElements; count++) {
        cy.get('@toolbox-text').dragAndDrop('@root-container', {
          position: 'inside',
        });
        // we add the wait (for 1ms) here, otherwise cypress tries to bulk run the drag and drop and seems to freeze
        cy.wait(1);
      }

      // afterwards there should be $numberOfElements + the starting 4 elements under root
      cy.get('@root-container')
        .children()
        .should('have.length', numberOfElements + 4);
    });
  });

  describe('Test Toolbox Container', () => {
    beforeEach(() => {
      cy.getByTestId('toolbox-container')
        .as('toolbox-container')
        .should('have.attr', 'draggable', 'true');
    });

    it('should neither be possible to drop Container inside CardTop nor CardBottom', () => {
      [
        {
          cardPosition: 'top',
          expectedChildren: 2,
        },
        {
          cardPosition: 'bottom',
          expectedChildren: 1,
        },
      ].forEach(({ cardPosition, expectedChildren }) => {
        // like in the other tests we first verify the number of children
        cy.get(`@card-${cardPosition}`)
          .children()
          .should('have.length', expectedChildren);
        // then drag the container over the CardTop or CardBottom component
        cy.get('@toolbox-container').dragOver(`@card-${cardPosition}`, {
          position: 'inside',
        });
        // we expect the error drop indicator to exist
        cy.getDropIndicator('error').should('exist');
        cy.get('@toolbox-container').drop();
        // after dropping we expect the number of children to be the same as before
        cy.get(`@card-${cardPosition}`)
          .children()
          .should('have.length', expectedChildren);
      });
    });

    // in this test we want to test if ware able to nest containers (drop Containers inside Containers)
    it('should be possible to nest Containers', () => {
      // again: before we start we verify the number of elements under root
      cy.get('@root-container').children().should('have.length', 4);

      // the first container will be dropped under root
      cy.get('@toolbox-container').dragAndDrop('@root-container', {
        position: 'inside',
      });

      // the first container we dropped, is the first container under root
      cy.get('@root-container')
        .children()
        .then(($children) => $children[0])
        .as('first-container');

      // we drop the second container inside the first container
      cy.get('@toolbox-container').dragAndDrop('@first-container', {
        position: 'inside',
      });

      cy.get('@first-container')
        .children()
        .then(($children) => $children[0])
        .as('second-container');

      // and the third container is dropped inside the second container
      cy.get('@toolbox-container').dragAndDrop('@second-container', {
        position: 'inside',
      });

      // we now verify that we dropped correctly
      cy.get('@root-container').children().should('have.length', 5);
      cy.get('@first-container').children().should('have.length', 1);
      cy.get('@second-container').children().should('have.length', 1);
    });
  });

  describe('Test Toolbox Card', () => {
    beforeEach(() => {
      cy.getByTestId('toolbox-card')
        .as('toolbox-card')
        .should('have.attr', 'draggable', 'true');
    });

    it('should not be possible to drop the Card in CardTop or CardBottom', () => {
      [
        {
          cardPosition: 'top',
          expectedChildren: 2,
        },
        {
          cardPosition: 'bottom',
          expectedChildren: 1,
        },
      ].forEach(({ cardPosition, expectedChildren }) => {
        // like in the other tests we first verify the number of children
        cy.get(`@card-${cardPosition}`)
          .children()
          .should('have.length', expectedChildren);
        // then drag the Card over the CardTop or CardBottom component
        cy.get('@toolbox-card').dragOver(`@card-${cardPosition}`, {
          position: 'inside',
        });
        // we expect the error drop indicator to exist
        cy.getDropIndicator('error').should('exist');
        cy.get('@toolbox-card').drop();
        // after dropping we expect the number of children to be the same as before
        cy.get(`@card-${cardPosition}`)
          .children()
          .should('have.length', expectedChildren);
      });
    });

    it('should be possible to drop the Card in root as the last element', () => {
      cy.get('@root-container').children().should('have.length', 4);
      cy.get('@toolbox-card').dragAndDrop('@frame-container', {
        position: 'below',
      });
      cy.get('@root-container').children().should('have.length', 5);

      cy.get('@root-container')
        .children()
        .then(($children) => $children[$children.length - 1])
        .within(() => {
          cy.contains('Only texts');
          cy.contains('are allowed up here');
          cy.contains('Only buttons down here');
        });
    });
  });

  describe('Test Toolbox when editor is disabled', () => {
    it('should not be possible to drag elements when the editor is disabled', () => {
      // first we disable the editor
      cy.contains('Enable').click();

      // since we want to reuse the "toolbox-component" alias we use cy.wrap().each()
      cy.wrap(['button', 'text', 'container', 'card']).each((component) => {
        cy.get('@root-container').children().should('have.length', 4);
        // none of the components should have the 'draggable' attribute
        cy.getByTestId(`toolbox-${component}`)
          .as(`toolbox-component`)
          .should('not.have.attr', 'draggable');
        // it should not be possible to drag the elements.
        cy.get('@toolbox-component').dragAndDrop('@root-container', {
          position: 'inside',
        });
        cy.get('@root-container').children().should('have.length', 4);
      });
    });
  });
});
