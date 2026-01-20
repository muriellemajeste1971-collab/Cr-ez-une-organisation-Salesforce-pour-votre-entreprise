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
public class TestDataFactory {

    public static OpportunityLineItem createOpportunityLineItem() {

        // 1. Récupération du Standard Price Book via la méthode officielle
        Id stdPbId = Test.getStandardPricebookId();

        // 2. Activation forcée du Standard Price Book (nécessaire dans les Playgrounds)
        Pricebook2 stdPb = new Pricebook2(
            Id = stdPbId,
            IsActive = true
        );
        update stdPb;

        // 3. Création du produit
        Product2 p = new Product2(
            Name = 'Audi e-Tron',
            ProductCode = 'AUDI-ET',
            QuantityInStock__c = 100,
            IsActive = true
        );
        insert p;

        // 4. Standard Price obligatoire pour tout produit
        PricebookEntry stdPbe = new PricebookEntry(
            Pricebook2Id = stdPbId,
            Product2Id = p.Id,
            UnitPrice = 50000,
            IsActive = true
        );
        insert stdPbe;

        // 5. Création d’un Price Book custom (pour simuler un vrai cas)
        Pricebook2 customPb = new Pricebook2(
            Name = 'Test Pricebook',
            IsActive = true
        );
        insert customPb;

        // 6. PricebookEntry custom
        PricebookEntry customPbe = new PricebookEntry(
            Pricebook2Id = customPb.Id,
            Product2Id = p.Id,
            UnitPrice = 50000,
            IsActive = true
        );
        insert customPbe;

        // 7. Opportunity
        Opportunity opp = new Opportunity(
            Name = 'Test Opportunity',
            StageName = 'Prospecting',
            CloseDate = Date.today()
        );
        insert opp;

// 8. OpportunityLineItem
OpportunityLineItem oli = new OpportunityLineItem(
    OpportunityId = opp.Id,
    PricebookEntryId = customPbe.Id,
    Quantity = 2,
    UnitPrice = 50000
);
insert oli;

return oli;

    }
}
