public with sharing class OpportunityProductsController {
    
    @AuraEnabled(Cacheable=true)
   
        public static List<OpportunityLineItem> getProducts(Id opportunityId) {
        return ProductSelector.getProductsByOpportunityId(opportunityId);

    }
}