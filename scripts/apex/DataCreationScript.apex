// Créer un Pricebook2
Pricebook2 pb = new Pricebook2(Name='Liste des prix - FRANCE', IsActive=true);
insert pb;

/**
 * Pour éviter les erreurs de compilation lorsque le champ personnalisé QuantityInStock__c
 * n'est pas encore déployé dans l'org, on évite la référence statique au champ
 * et on l'affecte dynamiquement uniquement s'il existe.
 */
Boolean qtyFieldExists = false;
Schema.SObjectType p2Type = Schema.getGlobalDescribe().get('Product2');
if (p2Type != null) {
    Map<String, Schema.SObjectField> fmap = p2Type.getDescribe().fields.getMap();
    qtyFieldExists = fmap != null && fmap.containsKey('QuantityInStock__c');
}

// Créer des produits
List<Product2> products = new List<Product2>();

Product2 p0 = new Product2(
    Name='Tesla Model S',
    ProductCode='TES-MS',
    Description='Voiture électrique haut de gamme avec une autonomie de 652 km et une accélération de 0 à 100 km/h en 2,5 secondes',
    Family='Voitures électriques',
    StockKeepingUnit='TES-MS-2022'
);
if (qtyFieldExists) p0.put('QuantityInStock__c', 50);
products.add(p0);

Product2 p1 = new Product2(
    Name='Ford Mustang Mach-E',
    ProductCode='FORD-MM',
    Description='SUV électrique avec une autonomie de 491 km et une accélération de 0 à 100 km/h en 3,7 secondes',
    Family='Voitures électriques',
    StockKeepingUnit='FORD-MM-2022'
);
if (qtyFieldExists) p1.put('QuantityInStock__c', 75);
products.add(p1);

Product2 p2 = new Product2(
    Name='Audi e-Tron',
    ProductCode='AUDI-ET',
    Description='SUV électrique avec une autonomie de 436 km et une accélération de 0 à 100 km/h en 5,7 secondes',
    Family='Voitures électriques',
    StockKeepingUnit='AUDI-ET-2022'
);
if (qtyFieldExists) p2.put('QuantityInStock__c', 100);
products.add(p2);

Product2 p3 = new Product2(
    Name='Toyota Corolla Hybride',
    ProductCode='TOY-CH',
    Description='Voiture hybride compacte avec une consommation de carburant de 4,2 L/100 km et une puissance de 122 ch',
    Family='Voitures hybrides',
    StockKeepingUnit='TOY-CH-2022'
);
if (qtyFieldExists) p3.put('QuantityInStock__c', 150);
products.add(p3);

Product2 p4 = new Product2(
    Name='Honda Civic',
    ProductCode='HON-CIV',
    Description='Voiture compacte avec une consommation de carburant de 6,2 L/100 km et une puissance de 158 ch',
    Family='Voitures à essence',
    StockKeepingUnit='HON-CIV-2022'
);
if (qtyFieldExists) p4.put('QuantityInStock__c', 200);
products.add(p4);

insert products;

// Récupérer le Pricebook standard
Pricebook2 standardPb = [SELECT Id FROM Pricebook2 WHERE IsStandard=true]; // Étape obligatoire pour créer ensuite des pricebookentries dans le pricebook créé
List<PricebookEntry> pbeList = new List<PricebookEntry>();
// Créer des PricebookEntries

pbeList.add(new PricebookEntry(Pricebook2Id=standardPb.Id, Product2Id=products[0].Id, UnitPrice=25000, IsActive=true));
pbeList.add(new PricebookEntry(Pricebook2Id=standardPb.Id, Product2Id=products[1].Id, UnitPrice=25000, IsActive=true));
pbeList.add(new PricebookEntry(Pricebook2Id=standardPb.Id, Product2Id=products[2].Id, UnitPrice=25000, IsActive=true));
pbeList.add(new PricebookEntry(Pricebook2Id=standardPb.Id, Product2Id=products[3].Id, UnitPrice=25000, IsActive=true));
pbeList.add(new PricebookEntry(Pricebook2Id=standardPb.Id, Product2Id=products[4].Id, UnitPrice=25000, IsActive=true));

// Créer des PricebookEntries
pbeList.add(new PricebookEntry(Pricebook2Id=pb.Id, Product2Id=products[0].Id, UnitPrice=99990, IsActive=true));
pbeList.add(new PricebookEntry(Pricebook2Id=pb.Id, Product2Id=products[1].Id, UnitPrice=69900, IsActive=true));
pbeList.add(new PricebookEntry(Pricebook2Id=pb.Id, Product2Id=products[2].Id, UnitPrice=82400, IsActive=true));
pbeList.add(new PricebookEntry(Pricebook2Id=pb.Id, Product2Id=products[3].Id, UnitPrice=28990, IsActive=true));
pbeList.add(new PricebookEntry(Pricebook2Id=pb.Id, Product2Id=products[4].Id, UnitPrice=26990, IsActive=true));

// Insérer les Pbentries standard & du pricebook "Liste des prix - FRANCE"
insert pbeList;
