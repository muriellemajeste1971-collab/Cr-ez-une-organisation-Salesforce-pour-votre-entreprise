/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
public class ProductSelectorTest {

    @isTest
    static void testGetProductsByOpportunityId() {
        // Arrange
        OpportunityLineItem oli = TestDataFactory.createOpportunityLineItem();

        // Act
        List<OpportunityLineItem> results =
            ProductSelector.getProductsByOpportunityId(oli.OpportunityId);

        // Assert
        System.assertEquals(1, results.size());
        OpportunityLineItem result = results[0];

        System.assertEquals(oli.Id, result.Id);
        System.assertEquals(2, result.Quantity);
        System.assertEquals(50000, result.UnitPrice);
        System.assertEquals(100000, result.TotalPrice);
        System.assertEquals('Audi e-Tron', result.PricebookEntry.Product2.Name);
        System.assertEquals(100, result.PricebookEntry.Product2.QuantityInStock__c);
    }
}
