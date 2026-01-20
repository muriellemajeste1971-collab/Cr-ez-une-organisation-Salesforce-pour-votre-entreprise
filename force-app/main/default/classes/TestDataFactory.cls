@isTest
public class TestDataFactory {

    // ---------------------------------------------------------
    // 1. Données pour les tests Opportunity / Product
    // ---------------------------------------------------------
    public static OpportunityLineItem createOpportunityLineItem() {
        Id stdPbId = Test.getStandardPricebookId();

        Pricebook2 stdPb = new Pricebook2(
            Id = stdPbId,
            IsActive = true
        );
        update stdPb;

        Product2 p = new Product2(
            Name = 'Audi e-Tron',
            ProductCode = 'AUDI-ET',
            QuantityInStock__c = 100,
            IsActive = true
        );
        insert p;

        PricebookEntry stdPbe = new PricebookEntry(
            Pricebook2Id = stdPbId,
            Product2Id = p.Id,
            UnitPrice = 50000,
            IsActive = true
        );
        insert stdPbe;

        Pricebook2 customPb = new Pricebook2(
            Name = 'Test Pricebook',
            IsActive = true
        );
        insert customPb;

        PricebookEntry customPbe = new PricebookEntry(
            Pricebook2Id = customPb.Id,
            Product2Id = p.Id,
            UnitPrice = 50000,
            IsActive = true
        );
        insert customPbe;

        Opportunity opp = new Opportunity(
            Name = 'Test Opportunity',
            StageName = 'Prospecting',
            CloseDate = Date.today()
        );
        insert opp;

        OpportunityLineItem oli = new OpportunityLineItem(
            OpportunityId = opp.Id,
            PricebookEntryId = customPbe.Id,
            Quantity = 2,
            UnitPrice = 50000
        );
        insert oli;

        return oli;
    }

    // ---------------------------------------------------------
    // 2. Données pour les tests User / Profil
    // ---------------------------------------------------------
    public static User createTestUser() {

        Profile p = [
            SELECT Id
                FROM Profile
                WHERE Name IN ('System Administrator', 'Administrateur Système')
            LIMIT 1
        ];

        User testUser = new User(
            FirstName = 'Test',
            LastName = 'User',
            Email = 'test.user@example.com',
            Username = 'test.user+' + System.currentTimeMillis() + '@example.com',
            Alias = 'tuser',
            TimeZoneSidKey = 'Europe/Paris',
            LocaleSidKey = 'fr_FR',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'fr',
            ProfileId = p.Id
        );

        insert testUser;

        return testUser;
    }
}
