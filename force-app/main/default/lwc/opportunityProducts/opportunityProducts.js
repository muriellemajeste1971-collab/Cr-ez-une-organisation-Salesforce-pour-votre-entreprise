import { LightningElement, api, wire } from 'lwc';
import getProducts from '@salesforce/apex/OpportunityProductsController.getProducts';

export default class OpportunityProducts extends LightningElement {
    @api recordId;
    products = [];

    columns = [
        { label: 'Nom du produit', fieldName: 'productName', type: 'text' },
        { label: 'Prix unitaire', fieldName: 'UnitPrice', type: 'currency' },
        { label: 'Prix total', fieldName: 'TotalPrice', type: 'currency' },
        { label: 'Quantité', fieldName: 'Quantity', type: 'number' },
        { label: 'Stock restant', fieldName: 'QuantityInStock__c', type: 'number' },

        // 🗑️ Supprimer (en premier)
        {
            label: 'Supprimer',
            type: 'button-icon',
            typeAttributes: {
                iconName: 'utility:delete',
                name: 'delete_line',
                alternativeText: 'Supprimer',
                title: 'Supprimer',
                variant: 'bare'
            }
        },

        // 👁️ Voir produit (en deuxième)
        {
            label: 'Voir produit',
            type: 'button-icon',
            typeAttributes: {
                iconName: 'utility:preview',
                name: 'view_product',
                alternativeText: 'Voir produit',
                title: 'Voir produit',
                variant: 'bare'
            }
        }
    ];

    @wire(getProducts, { opportunityId: '$recordId' })
    wiredProducts({ data, error }) {
        if (data) {
            console.log('Produits reçus :', data);
            this.products = data.map(item => ({
                Id: item.Id,
                UnitPrice: item.UnitPrice,
                TotalPrice: item.TotalPrice,
                Quantity: item.Quantity,
                productName: item.PricebookEntry?.Product2?.Name,
                QuantityInStock__c: item.PricebookEntry?.Product2?.QuantityInStock__c
            }));
        } else if (error) {
            console.error('Erreur lors du chargement des produits :', error);
            this.products = [];
        }
    }

    get hasProducts() {
        return Array.isArray(this.products) && this.products.length > 0;
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        switch (actionName) {
            case 'delete_line':
                console.log('Supprimer ligne : ', row);
                // TODO: appel Apex pour supprimer la ligne
                break;

            case 'view_product':
                console.log('Voir produit : ', row);
                // TODO: navigation vers la fiche produit
                break;

            default:
                break;
        }
    }
}
