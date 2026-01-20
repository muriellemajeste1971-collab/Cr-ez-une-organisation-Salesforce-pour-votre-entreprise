@isTest
public class OpportunityProductsControllerTest {

    @isTest
    static void testGetProducts() {
        // Arrange : création des données via la TestDataFactory
        OpportunityLineItem oli = TestDataFactory.createOpportunityLineItem();

        // Act : appel du controller
        List<OpportunityLineItem> results =
            OpportunityProductController.getProducts(oli.OpportunityId);

        // Assert : vérifications
        System.assertEquals(1, results.size(), 'Une seule ligne doit être retournée');

        OpportunityLineItem result = results[0];

        // Vérification des champs simples
        System.assertEquals(oli.Id, result.Id);
        System.assertEquals(oli.Quantity, result.Quantity);
        System.assertEquals(oli.UnitPrice, result.UnitPrice);

        // TotalPrice est calculé automatiquement par Salesforce
        System.assertEquals(oli.Quantity * oli.UnitPrice, result.TotalPrice);

        // Vérification des champs du produit via PricebookEntry
        System.assertEquals(
            'Audi e-Tron',
            result.PricebookEntry.Product2.Name
        );

        System.assertEquals(
            100,
            result.PricebookEntry.Product2.QuantityInStock__c
        );
    }
}
