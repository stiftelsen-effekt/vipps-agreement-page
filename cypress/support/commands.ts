const gotoChargeDay = (recurring: boolean) => {
  // cy.react("RichSelectOption", {
  //   props: { value: recurring ? 0 : 1 },
  // }).click();
  
};

/*
const pickMethod = (methodName: string) => {
  cy.react("MethodButton", { props: { className: methodName } }).click();
  cy.wait(500);
};

const pickAnonymous = () => {
  cy.react("RichSelectOption", {
    props: { value: DonorType.ANONYMOUS },
  }).click();
};

// TODO: Use this in a test
const inputDonorValues = () => {
  cy.react("TextInput", { props: { name: "name" } }).type("Cypress Test");
  cy.react("TextInput", { props: { name: "email" } }).type(
    `cypress@testeffekt.no`
  );
  cy.get("[data-cy=checkboxTaxDeduction]").click("left");
  cy.get("[data-cy=checkboxNewsletter]").click("left");
  cy.get("[data-cy=checkboxPrivacyPolicy]").click("left");

  cy.react("TextInput", { props: { name: "ssn" } }).type("123456789");
  cy.wait(500);
};
*/

Cypress.Commands.add("getState", gotoChargeDay);

export {};
