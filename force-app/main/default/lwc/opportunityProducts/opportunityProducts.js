import { LightningElement, api, wire } from 'lwc';
import getProducts from '@salesforce/apex/OpportunityProductsController.getProducts';
import getCurrentUserProfileId from '@salesforce/apex/ProfileSelector.getCurrentUserProfileId';
import getCurrentUserProfileName from '@salesforce/apex/ProfileSelector.getCurrentUserProfileName';
import deleteOpportunityLine from '@salesforce/apex/OpportunityProductsController.deleteOpportunityLine'; 
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';



//traduction internationale
import OPTY_PRODUCTS from '@salesforce/label/c.OPTY_PRODUCTS';
import SALES_REP from '@salesforce/label/c.SALES_REP';
import OPTY_COL_PRODUCT_NAME from '@salesforce/label/c.OPTY_COL_PRODUCT_NAME';
import OPTY_COL_UNIT_PRICE from '@salesforce/label/c.OPTY_COL_UNIT_PRICE';
import OPTY_COL_TOTAL_PRICE from '@salesforce/label/c.OPTY_COL_TOTAL_PRICE';
import OPTY_COL_QUANTITY from '@salesforce/label/c.OPTY_COL_QUANTITY';
import OPTY_COL_STOCK_LEFT from '@salesforce/label/c.OPTY_COL_STOCK_LEFT';
import OPTY_COL_DELETE from '@salesforce/label/c.OPTY_COL_DELETE';
import OPTY_COL_VIEW_PRODUCT from '@salesforce/label/c.OPTY_COL_VIEW_PRODUCT';
import OPTY_ACTION_DELETE from '@salesforce/label/c.OPTY_ACTION_DELETE';
import OPTY_EMPTY_TEXT from '@salesforce/label/c.OPTY_EMPTY_TEXT';
import OPTY_QUANTITY_WARNING_TEXT from '@salesforce/label/c.OPTY_QUANTITY_WARNING_TEXT';


//rafraichissement auto au focus
import { getRecord } from 'lightning/uiRecordApi';
import UI_REFRESH_TIMESTAMP from '@salesforce/schema/Opportunity.UI_Refresh_Timestamp__c';



export default class OpportunityProducts extends NavigationMixin(LightningElement) {
    @api recordId;
    products = [];
    profileName;
    profileId;

    

    // Pour refreshApex
    wiredProductsResult;

    // ===== Refresh full page when Flow updates Opportunity =====
lastRefreshValue;

@wire(getRecord, { recordId: '$recordId', fields: [UI_REFRESH_TIMESTAMP] })
wiredOpportunity({ data, error }) {
    if (data) {
        const currentValue = data.fields.UI_Refresh_Timestamp__c.value;

        // 1ère fois = on stocke juste, pas de reload
        if (!this.lastRefreshValue) {
            this.lastRefreshValue = currentValue;
            return;
        }

        // Si le champ change => reload page
        if (currentValue && currentValue !== this.lastRefreshValue) {
            this.lastRefreshValue = currentValue;
            window.location.reload();
        }
    } else if (error) {
        console.error('Erreur wiredOpportunity:', error);
    }
}
    // ===== Fin Refresh full page when Flow updates Opportunity =====

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
                window.location.reload();
            })
            .catch(error => {
                this.showToast('Erreur', error.body.message, 'error');
            });
    }

    
    connectedCallback() {
  window.addEventListener('focus', this.handleWindowFocus);
}

disconnectedCallback() {
  window.removeEventListener('focus', this.handleWindowFocus);
}

handleWindowFocus = () => {
  console.log('REFRESH on focus');
  if (this.wiredProductsResult) {
    refreshApex(this.wiredProductsResult);
  }
};

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
    if (this.profileName === 'Commercial') {
        return `${OPTY_PRODUCTS} (${SALES_REP})`;
    }
    return `${OPTY_PRODUCTS} (${this.profileName})`;
    }


    get isAdmin() {
        return this.profileId === '00ed200000F8HRFAA3';
    }
    
    labels = {
                emptyText: OPTY_EMPTY_TEXT,
                quantityWarningText: OPTY_QUANTITY_WARNING_TEXT
    };


    setColumns() {
    const baseColumns = [
        { label: OPTY_COL_PRODUCT_NAME, fieldName: 'productName', type: 'text' },
        { label: OPTY_COL_UNIT_PRICE, fieldName: 'UnitPrice', type: 'currency' },
        { label: OPTY_COL_TOTAL_PRICE, fieldName: 'TotalPrice', type: 'currency' },
        { 
            label: OPTY_COL_QUANTITY, 
            fieldName: 'Quantity', 
            type: 'number', 
            cellAttributes: { 
                class: { fieldName: 'quantityClass' } 
            } 
        },
        { label: OPTY_COL_STOCK_LEFT, fieldName: 'QuantityInStock__c', type: 'number' },
        {
            label: OPTY_COL_DELETE,
            type: 'button-icon',
            typeAttributes: {
                iconName: 'utility:delete',
                name: 'delete_line',
                alternativeText: OPTY_ACTION_DELETE,
                title: OPTY_ACTION_DELETE,
                variant: 'bare'
            }
        }
    ];

    if (this.isAdmin) {
        baseColumns.push({
            label: OPTY_COL_VIEW_PRODUCT,
            type: 'button',
            typeAttributes: {
                label: OPTY_COL_VIEW_PRODUCT,
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
