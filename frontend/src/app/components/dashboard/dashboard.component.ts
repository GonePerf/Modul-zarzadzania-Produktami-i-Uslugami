import { Component, OnInit } from '@angular/core';
import { ProductService, Product, Category, Contractor } from 'src/app/Services/product.service';
import { Observable } from 'rxjs';
import { SpecialService, Special } from 'src/app/Services/special.service';
import { find, map, first } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  products: Observable<Product[]>;
  contractors: Observable<Contractor[]>;
  specials: Observable<Special[]>;
  categories: Observable<Category[]>;
  product: Observable<Product>;
  lastestValueContractor: Contractor[] = [];
  lastestValueSpecials: Special[] = [];
  lastestValueProduct: Product[] = [];

  productsGroup: Product[];

  categoryId = 0;
  contractorId = 0; 
  addProduct = false;
  addingButton = 'Dodaj';
  public form = {
    id: null,
    name: null,
    type: null,
    VAT: null,
    price: null,
    category: null,
    unit: null
  };
  public formSpec = {
    price: null,
    product_id: null,
    contractor_id: null
  };
  searchFrase = '';
  searchContractor = '';
  productId: number;
  editing = false;
  confirmation = false;
  addSpecial = false;
  editSpecial = false;
  specialId = 0;


  constructor(private productService: ProductService, private specialService: SpecialService) { }


  ngOnInit(): void {
    this.get();
    this.product = this.productService.getProduct(1);
    this.productsGroup = [];
    this.contractors.subscribe(value => this.lastestValueContractor = value);
    this.specials.subscribe(value => this.lastestValueSpecials = value);
    this.products.subscribe(value => this.lastestValueProduct = value);
  }


  // FILTRY DO TABELI Z PRODUKTAMI I USŁUGAMI
  filterByName(product: Product){
    if (product.name.toUpperCase().startsWith(this.searchFrase.toUpperCase())){
      return true;
    }
    else{
      return false;
    }
  }
  filterByContractorName(){
    
  }
  removeProductFromGroup(product: Product){
    this.productsGroup.splice(this.productsGroup.indexOf(product), 1);
  }

  clearGroup(){
    this.productsGroup = [];
  }

  showAddingSpecials(){
    this.addSpecial = !this.addSpecial;
    this.addProduct = false;
    const button = document.getElementById('addingButton');
    button.classList.add('btn-outline-success');
    button.classList.remove('btn-outline-danger');
    this.addingButton = 'Dodaj';
  }

  downloadAsJSON(){
    let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.productsGroup));
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href',     dataStr);
    downloadAnchorNode.setAttribute('download', 'produkty' + '.json');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  addProductToGroup(product: Product){
    if (this.productsGroup.indexOf(product) == -1){
      this.productsGroup.push(product);
      console.log(JSON.stringify(this.productsGroup));
    }
    else{
      alert('Ten produkt znajduje się już na liście!');
    }
  }

  filterByCategory(product: Product){
    if (this.categoryId == 0){
      return true;
    }
    else if (product.category == this.categoryId) {
      return true;
    }
    else{
      return false;
    }
  }

  filterByContractor(id: number){
    if (this.searchContractor == ''){
      return true;
    }
    else{
      for(let i = 0; i < this.lastestValueSpecials.length; i++){
        
        
        if(this.lastestValueSpecials[i].product_id == id){
          for(let j = 0; j < this.lastestValueContractor.length; j++){
            if(this.lastestValueContractor[j].nazwaFirmy.toLowerCase().startsWith(this.searchContractor.toLowerCase()) && this.lastestValueSpecials[i].contractor_id === this.lastestValueContractor[j].kontrahentID){
              return true;
            }
          }
        }
      }
      return false;
    }
  }
  // -----------------------------------------------------

  isSpecial(id: number){
    for(let i = 0; i < this.lastestValueSpecials.length; i++){
      if(this.lastestValueSpecials[i].product_id === id){
        return true;
      }
    }
    return false;
  }

  getContractorName(id: number){
    for(let i = 0; i < this.lastestValueContractor.length; i++){
      if(this.lastestValueContractor[i].kontrahentID === id){
        return this.lastestValueContractor[i].nazwaFirmy;
      }
    }
  }

  checkValid(){
    if (this.form.VAT != null && this.form.category != null && this.form.name != null && this.form.price != null && this.form.type != null){
      return true;
    }
    return false;
  }

  showEditing(id: number){
    this.editing = !this.editing;
    this.productId = id;
    this.confirmation = false;
  }

  showEditSpecial(special: Special){
    this.editSpecial = !this.editSpecial;
    this.specialId = special.id;
  }

  get(){
    this.products = this.productService.getProducts();
    this.categories = this.productService.getCategories();
    this.specials = this.specialService.getSpecials();
    this.contractors = this.productService.getContractors();
  }

  deletingConfirmation(id: number){
    this.confirmation = !this.confirmation;
    this.productId = id;
    this.editing = false;
  }
  getProduct(id: number){
    return this.productService.getProduct(id);
  }
  showAddingPanel(){
    this.addProduct = !this.addProduct;
    this.addSpecial = false;
    const button = document.getElementById('addingButton');
    if (this.addProduct){
      this.addingButton = 'Anuluj';
      button.classList.remove('btn-outline-success');
      button.classList.add('btn-outline-danger');
    }
    else {
      button.classList.add('btn-outline-success');
      button.classList.remove('btn-outline-danger');
      this.addingButton = 'Dodaj';
    }
  }

  deleteProduct(product: Product){
    if (confirm('Na pewno usunąć ' + product.name + '?')) {
      this.productService.deleteProduct(product).subscribe();
      setTimeout(a => { this.get(); }, 500);
    }
  }

  closeOptions(){
    this.editing = false;
    this.confirmation = false;
  }

  updateProduct(product: Product){
    product.name = this.form.name;
    product.type = this.form.type;
    product.price = this.form.price;
    product.category = this.form.category;
    product.VAT = this.form.VAT;
    setTimeout(a => {
      this.get();
      this.form = {
       id: null,
       name: null,
       type: null,
       VAT: null,
       price: null,
       category: null,
       unit: null
     };
    }, 1500);
    this.closeOptions();
    return this.productService.updateProduct(product).subscribe();
  }

  updateSpecial(special: Special){
    special.price = this.formSpec.price;
    special.product_id = this.formSpec.product_id;
    special.contractor_id = this.formSpec.contractor_id;
    setTimeout(a => {
      this.get();
      this.formSpec = {
       price: null,
       product_id: null,
       contractor_id: null
     };
    }, 1500);
    this.closeOptions();
    return this.specialService.updateSpecial(special).subscribe();
  }

  getNIP(id){
    for(let i = 0 ; i < this.lastestValueContractor.length; i++){
      if(this.lastestValueContractor[i].kontrahentID == id){
        return this.lastestValueContractor[i].nip
      }
    }
  }


  saveSpecialToDatabase(){
    let contractorASD: Contractor = new Contractor;
    // contractorASD.kontrahentID = 1;
    // contractorASD.nazwaFirmy = "wsa";
    // contractorASD.nip = 1234;
    for(let i = 0; i < this.lastestValueContractor.length; i++){
      if(this.formSpec.contractor_id == this.lastestValueContractor[i].kontrahentID){
        contractorASD = this.lastestValueContractor[i];
      }
    }
    console.log(contractorASD.nazwaFirmy);
    this.productService.saveContractor(contractorASD).subscribe();
    setTimeout(a => {
       this.get();
       this.formSpec = {
        price: null,
        product_id: null,
        contractor_id: null
      };
    }, 2500);
    this.addProduct = false;
    this.addSpecial = false;
    return this.specialService.saveToDatabase(this.formSpec).subscribe();
  }
  saveToDatabase(){
    this.form.id = this.lastestValueProduct.length +1;
    setTimeout(a => {
       this.get();
       this.form = {
        id: null,
        name: null,
        type: null,
        VAT: null,
        price: null,
        category: null,
        unit: null
      };
    }, 1000);
    this.showAddingPanel();
    return this.productService.saveToDatabase(this.form).subscribe();
  }
}
