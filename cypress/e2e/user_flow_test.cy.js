describe('User Flow Test', () => {
  beforeEach(() => {
    cy.visit('https://practice.expandtesting.com/notes/app/register');
  });

  it('end to end user flow', () => {
    const uuid = () => Cypress._.random(0, 1e6)
    const id = uuid()
    const email = `test_register${id}@test.com`
    // Register 
    cy.get('input[id="email"]').type(email);
    cy.get('input[id="password"]').type('test12345');
    cy.get('input[id="name"]').type('test register');
    cy.get('input[id="confirmPassword"]').type('test12345');
    cy.get('button').contains('Register').click();
    cy.contains('User account created successfully').should('exist');

    // Login
    cy.get('[data-testid="login-view"]').click();
    cy.get('[data-testid="login-email"]').type(email);
    cy.get('[data-testid="login-password"]').type('test12345');
    cy.get('[data-testid="login-submit"]').click();
    cy.get('[data-testid="home"]').should('exist');

    // Create Note
    cy.get('button').contains('Add Note').click();
    cy.get('[data-testid="note-category"]').select('Work');
    cy.get('[data-testid="note-completed"]').click();
    cy.get('[data-testid="note-title"]').type('Test Add Note');
    cy.get('[data-testid="note-description"]').type('Test add description for note');
    cy.get('[data-testid="note-submit"]').click();
    cy.contains('Test Add Note').should('exist');

    // search Note
    cy.get('[data-testid="search-input"]').type('Test');
    cy.get('[data-testid="search-btn"]').click();
    cy.contains('Search Results for "Test":').should('exist');
    cy.contains('Test Add Note').should('exist');

    // Read Note
    cy.get('[data-testid="note-view"]').click();
    cy.contains('Test Add Note').should('exist');

    // Update Note
    cy.get('[data-testid="note-edit"]').click();
    cy.contains('Edit note').should('exist');
    cy.get('[data-testid="note-title"]').clear().type('Test Update Note');
    cy.get('[data-testid="note-description"]').clear().type('Test Update description for note');
    cy.get('[data-testid="note-submit"]').click();
    cy.contains('Test Update Note').should('exist');

    // Delete Note
    cy.get('[data-testid="note-delete"]').click();
    cy.contains('Delete note?').should('exist');
    cy.get('[data-testid="note-delete-confirm"]').click();
    cy.contains('Test Update Note').should('not.exist');

    //Logout
    cy.get('[data-testid="logout"]').click();
    cy.contains('Welcome to Notes App').should('exist');
  })

  it('Should register with already email registered unsuccessfully', () => {
    cy.get('input[id="email"]').type('test_register@test.com');
    cy.get('input[id="password"]').type('test12345');
    cy.get('input[id="name"]').type('test register');
    cy.get('input[id="confirmPassword"]').type('test12345');
    cy.get('button').contains('Register').click();
    cy.contains('An account already exists with the same email address').should('exist');
  })

  it('Should login with invalid email unsuccessfully', () => {
    cy.get('[data-testid="login-view"] > span').click();
    cy.get('[data-testid="login-email"]').type('test');
    cy.get('[data-testid="login-password"]').type('test12345');
    cy.get('[data-testid="login-submit"]').click();
    cy.contains('Email address is invalid').should('exist');
  })

  it('Should login with invalid password unsuccessfully', () => {
    cy.get('[data-testid="login-view"] > span').click();
    cy.get('[data-testid="login-email"]').type('test_register@test.com');
    cy.get('[data-testid="login-password"]').type('9878977');
    cy.get('[data-testid="login-submit"]').click();
    cy.contains('Incorrect email address or password').should('exist');
  })
})