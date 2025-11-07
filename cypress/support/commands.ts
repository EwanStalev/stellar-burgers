/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

// ***********************************************
// Custom commands for Stellar Burgers tests
// ***********************************************

// -- Auth commands --
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.intercept('POST', `${Cypress.env('apiUrl')}/auth/login`).as(
    'loginRequest'
  );
  cy.visit('/login');
  cy.get('input[name=email]').type(email);
  cy.get('input[name=password]').type(password);
  cy.get('button[type=submit]').click();
  cy.wait('@loginRequest');
});

// -- Constructor commands --
// -- Constructor commands --
Cypress.Commands.add('addIngredientToConstructor', (testId: string) => {
  cy.get(`[data-testid="${testId}"]`)
    .first()
    .within(() => {
      cy.get('button').click(); // клик по кнопке AddButton внутри ингредиента
    });
});

// -- Generic testId selector --
Cypress.Commands.add(
  'getByTestId',
  (
    testId: string,
    options?: Partial<Cypress.Loggable & Cypress.Timeoutable>
  ) => {
    return cy.get(`[data-testid="${testId}"]`, options);
  }
);

// -- Mock API responses --
Cypress.Commands.add('mockIngredients', () => {
  cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );
});

Cypress.Commands.add('mockOrder', () => {
  cy.intercept('POST', `${Cypress.env('apiUrl')}/orders`, {
    fixture: 'order.json'
  }).as('createOrder');
});

// ***********************************************
// Type definitions for custom commands
// ***********************************************
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Login command
       * @example cy.login('test@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Add ingredient to constructor
       * @example cy.addIngredientToConstructor('ingredient-bun')
       */
      addIngredientToConstructor(testId: string): Chainable<void>;

      /**
       * Get element by test-id attribute
       * @example cy.getByTestId('ingredient-item')
       */
      getByTestId(
        testId: string,
        options?: Partial<Cypress.Loggable & Cypress.Timeoutable>
      ): Chainable<JQuery<HTMLElement>>;

      /**
       * Mock ingredients API response
       * @example cy.mockIngredients()
       */
      mockIngredients(): Chainable<void>;

      /**
       * Mock order API response
       * @example cy.mockOrder()
       */
      mockOrder(): Chainable<void>;
    }
  }
}

// Fix for TypeScript module augmentation
export {};
