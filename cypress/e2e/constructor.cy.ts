/// <reference types="cypress" />

const SELECTORS = {
  INGREDIENT_BUN: '[data-testid="ingredient-bun"]',
  INGREDIENT_MAIN: '[data-testid="ingredient-main"]',
  CONSTRUCTOR_BUN_TOP: '[data-testid="constructor-bun-top"]',
  CONSTRUCTOR_BUN_BOTTOM: '[data-testid="constructor-bun-bottom"]',
  CONSTRUCTOR_INGREDIENT: '[data-testid="constructor-ingredient"]',
  ORDER_BUTTON: '[data-testid="order-button"]',
  MODAL: '[data-testid="modal"]',
  MODAL_CLOSE: '[data-testid="modal-close"]',
  INGREDIENT_DETAILS: '[data-testid="ingredient-details"]',
  INGREDIENT_DETAILS_NAME: '[data-testid="ingredient-details-name"]',
  ORDER_DETAILS: '[data-testid="order-details"]',
  ORDER_NUMBER: '[data-testid="order-number"]'
};

describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Должен загружать ингредиенты', () => {
    cy.get(SELECTORS.INGREDIENT_BUN).should('exist');
    cy.get(SELECTORS.INGREDIENT_MAIN).should('exist');
  });

  it('Должен добавлять ингредиенты в конструктор через кнопку', () => {
    cy.get(SELECTORS.INGREDIENT_BUN)
      .first()
      .within(() => {
        cy.get('button').click();
      });

    cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('exist');
    cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('exist');

    cy.get(SELECTORS.INGREDIENT_MAIN)
      .first()
      .within(() => {
        cy.get('button').click();
      });

    cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT).should('have.length', 1);
  });

  it('Должен открывать и закрывать модальное окно ингредиента', () => {
    cy.get(SELECTORS.INGREDIENT_BUN).first().click();
    cy.get(SELECTORS.INGREDIENT_DETAILS).should('be.visible');
    cy.get(SELECTORS.INGREDIENT_DETAILS_NAME).should(
      'contain',
      'Краторная булка N-200i'
    );
    cy.get(SELECTORS.MODAL_CLOSE).click();
    cy.get(SELECTORS.INGREDIENT_DETAILS).should('not.exist');
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Перейдем на главную страницу
      cy.visit('/');

      // Ждём, когда подгрузятся ингредиенты
      cy.intercept('GET', '**/ingredients').as('getIngredients');
      cy.wait('@getIngredients');
    });

    it('Должен перенаправлять на страницу логина при неавторизованном пользователе', () => {
      cy.get(SELECTORS.ORDER_BUTTON).click();
      cy.location('pathname').should('eq', '/login');
    });

    it('Должен создавать заказ для авторизованного пользователя', () => {
      // Логинимся "реально"
      cy.visit('/login');
      cy.get('input[name="email"]').type('test22@test.com');
      cy.get('input[name="password"]').type('test22@test.com');
      cy.get('button[type="submit"]').click();

      // Ждём редирект на главную
      cy.url().should('eq', Cypress.config().baseUrl + '/');

      // Ждём загрузку ингредиентов
      cy.wait('@getIngredients');

      // Добавляем булку и начинку через кнопку "Добавить"
      cy.get(SELECTORS.INGREDIENT_BUN)
        .first()
        .within(() => {
          cy.get('button').click();
        });

      cy.get(SELECTORS.INGREDIENT_MAIN)
        .first()
        .within(() => {
          cy.get('button').click();
        });

      // Регистрируем мок POST /orders до клика по кнопке "Оформить заказ"
      cy.intercept('POST', '**/orders', {
        statusCode: 200,
        body: {
          success: true,
          order: { number: 93309 },
          name: 'Test Order'
        }
      }).as('createOrder');

      // Оформляем заказ
      cy.get(SELECTORS.ORDER_BUTTON).click();

      // Ждём POST /orders с увеличенным таймаутом
      cy.wait('@createOrder', { timeout: 20000 });

      // Проверяем модальное окно заказа
      cy.get(SELECTORS.ORDER_DETAILS).should('be.visible');
      cy.get(SELECTORS.ORDER_NUMBER).should('contain', '93309');
    });
  });
});
