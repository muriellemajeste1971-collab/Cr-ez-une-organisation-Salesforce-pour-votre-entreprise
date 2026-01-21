public with sharing class ProductSelector {
 public static List<OpportunityLineItem> getProductsByOpportunityId(Id opportunityId) {
    return [
        SELECT Id,
               PricebookEntry.Product2.Name,
               PricebookEntry.Product2.Id,
               UnitPrice,
               TotalPrice,
               Quantity,
               PricebookEntry.Product2.QuantityInStock__c
        FROM OpportunityLineItem
        WHERE OpportunityId = :opportunityId
    ];
}

}