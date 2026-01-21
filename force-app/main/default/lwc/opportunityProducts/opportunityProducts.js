import { LightningElement, api, wire } from 'lwc';
import getProducts from '@salesforce/apex/OpportunityProductsController.getProducts';
import getCurrentUserProfileId from '@salesforce/apex/ProfileSelector.getCurrentUserProfileId';
import getCurrentUserProfileName from '@salesforce/apex/ProfileSelector.getCurrentUserProfileName';
import deleteOpportunityLine from '@salesforce/apex/OpportunityProductsController.deleteOpportunityLine'; 
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';


export default class OpportunityProducts extends NavigationMixin(LightningElement) {
    @api recordId;
    products = [];
    profileName;
    profileId;

    // Pour refreshApex
    wiredProductsResult;

    // Wire UNIQUE et fonctionnel
@wire(getProducts, { opportunityId: '$recordId' })
wiredProducts(result) {
    this.wiredProductsResult = result;

    if (result.data) {
        this.products = result.data.map(item => {
            const diff = item.PricebookEntry?.Product2?.QuantityInStock__c - item.Quantity;

            return {
                Id: item.Id,
                UnitPrice: item.UnitPrice,
                TotalPrice: item.TotalPrice,
                Quantity: item.Quantity,
                productName: item.PricebookEntry?.Product2?.Name,
                QuantityInStock__c: item.PricebookEntry?.Product2?.QuantityInStock__c,
                productId: item.PricebookEntry?.Product2?.Id,

                // Tu avais déjà stockDiff, je le garde
                stockDiff: diff,

                // 🔥 Ajout de la classe CSS conditionnelle
                quantityClass: diff < 0 ? 'slds-text-color_error slds-theme_shade' : '', 
                rowClass: diff < 0 ? 'slds-text-color_error slds-theme_shade' : ''
            };
        });

        this.hasStockError = this.products.some(p => p.stockDiff < 0);

    } else if (result.error) {
        console.error('Erreur lors du chargement des produits :', result.error);
        this.products = [];
    }
}


    // Toast générique
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }

    // Actions du tableau
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        switch (actionName) {
            case 'delete_line':
                this.deleteLine(row.Id);
                break;

            case 'view_product':
                this.navigateToProduct(row.productId);
                break;
        }
    }
    // Navigation vers la fiche produit
    navigateToProduct(productId) {
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: productId,
            objectApiName: 'Product2',
            actionName: 'view'
        }
    });
}


    // Suppression + refresh automatique
    deleteLine(lineId) {
        deleteOpportunityLine({ oppLineId: lineId })
            .then(() => {
                this.showToast('Succès', 'Ligne supprimée', 'success');
                return refreshApex(this.wiredProductsResult);
            })
            .catch(error => {
                this.showToast('Erreur', error.body.message, 'error');
            });
    }

    // Colonnes dynamiques
    columns = [];

    @wire(getCurrentUserProfileName)
    wiredProfileName({ data, error }) {
        if (data) {
            this.profileName = data;
        } else if (error) {
            console.error(error);
        }
    }

    @wire(getCurrentUserProfileId)
    wiredProfileId({ data, error }) {
        if (data) {
            this.profileId = data;
            this.setColumns();
        } else if (error) {
            console.error(error);
        }
    }

    get dynamicTitle() {
        return `Opportunity Products (${this.profileName})`;
    }

    get isAdmin() {
        return this.profileId === '00ed200000F8HRFAA3';
    }

    setColumns() {
        const baseColumns = [
            { label: 'Nom du produit', fieldName: 'productName', type: 'text' },
            { label: 'Prix unitaire', fieldName: 'UnitPrice', type: 'currency' },
            { label: 'Prix total', fieldName: 'TotalPrice', type: 'currency' },
            { 
                label: 'Quantité', 
                fieldName: 'Quantity', 
                type: 'number', 
                cellAttributes: { class: { fieldName: 'quantityClass' } 
                } 
            },
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
                label: 'Voir produit',
                type: 'button',
                typeAttributes: {
                    label: 'Voir produit',
                    name: 'view_product',
                    iconName: 'utility:preview',
                    variant: 'brand-outline'
                }
            });
        }

        this.columns = baseColumns;
    }

    getRowClass(row) { 
        return row.rowClass; 
    }

    get hasProducts() {
        return Array.isArray(this.products) && this.products.length > 0;
    }
}
