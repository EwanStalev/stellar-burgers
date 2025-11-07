/// <reference types="cypress" />

before(() => {
  cy.request({
    url: 'http://localhost:4000',
    failOnStatusCode: false,
    timeout: 30000
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error(`localhost:4000 не запущен.`);
    }
  });
});

Cypress.on('uncaught:exception', (err) => {
  console.error('Uncaught exception:', err);
  return false;
});
