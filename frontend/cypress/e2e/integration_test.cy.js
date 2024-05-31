describe('Integration Test for FastAPI and Frontend', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('should display correctly data in the frontend', () => {
    // Check if the data is displayed correctly
    cy.get('.chakra-stack').should('contain.text', 'Cycle around town.');
  });

  it('should handle form input submission and display correctly data from FastAPI', () => {
    // Fill the form
    cy.get('.chakra-input').type('Test Data{enter}');

    // Check if the data is displayed correctly
    cy.get('.chakra-stack').should('contain.text', 'Test Data');
  });

  it('should handle form update submission and display correctly data from FastAPI', () => {
    // Update data
    cy.get(':nth-child(3) > .css-gg4vpm > .chakra-text > .css-1yl4gnp > :nth-child(1)').click();
    cy.get('[data-testid="update-todo-field"]').clear().type('Update Data');
    cy.get('[data-testid="update-todo-button"]').click();

    // Check if the data is displayed correctly
    cy.get('.chakra-stack').should('contain.text', 'Update Data');
  });

  it('should delete a todo item successfully', () => {
    // Fetch initial todos
    cy.request('GET', 'http://localhost:8000/todo')
      .its('body')
      .then((response) => {
        // Find the todo item with content "Read a book."
        const todo = response.data.find((todo) => todo.item === 'Update Data');

        // Ensure the todo item exists
        expect(todo).to.not.be.undefined;
        const todoId = todo.id;

        // Delete the first todo item
        cy.request('DELETE', `http://localhost:8000/todo/${todoId}`)
          .its('body')
          .should('have.property', 'data', `Todo with id ${todoId} has been removed.`);

        // Verify the todo item is removed
        cy.request('GET', 'http://localhost:8000/todo')
          .its('body.data')
          .should('not.deep.include', { id: todoId });

        cy.reload()
        cy.contains('Update Data').should('not.exist');
      });
  });
});
