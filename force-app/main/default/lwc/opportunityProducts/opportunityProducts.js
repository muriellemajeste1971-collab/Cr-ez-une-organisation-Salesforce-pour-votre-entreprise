import { LightningElement, api, wire } from 'lwc';
import getProducts from '@salesforce/apex/OpportunityProductsController.getProducts';

export default class OpportunityProducts extends LightningElement {
    @api recordId;          // Id de l'opportunité
    products = [];          // Liste des produits
    hasProducts = false;    // Indique si l'opportunité contient des produits

    @wire(getProducts, { opportunityId: '$recordId' })
    wiredProducts({ data, error }) {
        if (data) {
            this.products = data;
            this.hasProducts = data.length > 0;
        } else if (error) {
            console.error('Erreur lors de la récupération des produits : ', error);
            this.products = [];
            this.hasProducts = false;
        }
    }
}
