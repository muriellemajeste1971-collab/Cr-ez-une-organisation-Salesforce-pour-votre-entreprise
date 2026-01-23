public with sharing class OpportunityProductsController {
    
    @AuraEnabled(Cacheable=true)
   
        public static List<OpportunityLineItem> getProducts(Id opportunityId) {
        return ProductSelector.getProductsByOpportunityId(opportunityId);

    }

    @AuraEnabled(Cacheable=true)
    public static void deleteOpportunityLine(Id oppLineId) {
    delete [SELECT Id FROM OpportunityLineItem WHERE Id = :oppLineId];
}
}