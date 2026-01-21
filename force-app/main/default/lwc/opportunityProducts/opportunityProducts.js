import { LightningElement, api, wire } from 'lwc';
import getProducts from '@salesforce/apex/OpportunityProductsController.getProducts';
import getCurrentUserProfileId from '@salesforce/apex/ProfileSelector.getCurrentUserProfileId';
import getCurrentUserProfileName from '@salesforce/apex/ProfileSelector.getCurrentUserProfileName';

export default class OpportunityProducts extends LightningElement {
    @api recordId;
    products = [];
    profileName;
    profileId;

    // Colonnes dynamiques (remplies après chargement du profil)
    columns = [];

    // Récupération du nom du profil (pour le titre)
    @wire(getCurrentUserProfileName)
    wiredProfileName({ data, error }) {
        if (data) {
            this.profileName = data;
        } else if (error) {
            console.error(error);
        }
    }

    // Récupération du ProfileId (pour savoir si Admin)
    @wire(getCurrentUserProfileId)
    wiredProfileId({ data, error }) {
        if (data) {
            this.profileId = data;
            this.setColumns(); // <-- Mise à jour des colonnes ici
        } else if (error) {
            console.error(error);
        }
    }

    // Titre dynamique
    get dynamicTitle() {
        return `Opportunity Products (${this.profileName})`;
    }

    // Vérification Admin via ProfileId
    get isAdmin() {
        return this.profileId === '00ed200000F8HRFAA3'; // Ton ID Admin
    }

    // Construction dynamique des colonnes
    setColumns() {
        const baseColumns = [
            { label: 'Nom du produit', fieldName: 'productName', type: 'text' },
            { label: 'Prix unitaire', fieldName: 'UnitPrice', type: 'currency' },
            { label: 'Prix total', fieldName: 'TotalPrice', type: 'currency' },
            { label: 'Quantité', fieldName: 'Quantity', type: 'number' },
            { label: 'Stock restant', fieldName: 'QuantityInStock__c', type: 'number' },
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
            }
        ];

        if (this.isAdmin) {
            baseColumns.push({
                label: 'Voir produit', type: 'button', typeAttributes: { label: 'Voir produit', name: 'view_product', iconName: 'utility:preview', variant: 'brand-outline'
                }
            });
        }

        this.columns = baseColumns;
    }

    // Récupération des produits
    @wire(getProducts, { opportunityId: '$recordId' })
    wiredProducts({ data, error }) {
        if (data) {
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
                break;

            case 'view_product':
                console.log('Voir produit : ', row);
                break;
        }
    }
}
