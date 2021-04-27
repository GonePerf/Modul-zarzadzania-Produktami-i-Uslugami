import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  product = new Product();
  constructor(private http: HttpClient) {}
  private baseUrl = 'https://radiant-river-64861.herokuapp.com/api';

  saveToDatabase(product: Product): Observable<any>{
    return this.http.post<Product>(`${this.baseUrl}/product`, product);
  }
  updateProduct(product: Product): Observable<any>{
    return this.http.patch<Product>(`${this.baseUrl}/product/${product.id}`, product);
  }
  getProducts(){
    return this.http.get<Product[]>(`${this.baseUrl}/product`);
  }
  getCategories(){
    return this.http.get<Category[]>(`${this.baseUrl}/getCategories`);
  }
  // getContractors(){
  //   return this.http.get<Contractor[]>(`{URL}}`);
  // }
  // saveContractor(contractor: Contractor){
  //   return this.http.post<Contractor>(`${this.baseUrl}/contractor`, contractor);
  // }
  getContractors(){
    return this.http.get<Contractor[]>(`http://www.contractorsapi.somee.com/api/kontrahenci/`);
  }
  saveContractor(contractor: Contractor){
    return this.http.post<Contractor>(`${this.baseUrl}/contractor`, contractor);
  }
  getProduct(id: number){
    return this.http.get<Product>(`${this.baseUrl}/product/${id}`);
  }
  deleteProduct(product: Product){
    return this.http.delete<Product>(`${this.baseUrl}/product/${product.id}`);
  }
}

export class Product {
  id?: number;
  name: string;
  type: boolean;
  VAT: number;
  price: number;
  category: number;
  unit: string;
  constructor(){}
}

export class Category {
  name: string;
}

export class Contractor{
  kontrahentID?: number;
  nazwaFirmy: string;
  nip: string;
}
