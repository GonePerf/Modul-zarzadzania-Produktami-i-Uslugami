import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpecialService {
  special = new Special();
  constructor(private http: HttpClient) {}
  private baseUrl = 'https://radiant-river-64861.herokuapp.com/api';

  saveToDatabase(special: Special): Observable<any>{
    return this.http.post<Special>(`${this.baseUrl}/specials`, special);
  }
  updateSpecial(special: Special): Observable<any>{
    return this.http.patch<Special>(`${this.baseUrl}/specials/${special.id}`, special);
  }
  getSpecials(){
    return this.http.get<Special[]>(`${this.baseUrl}/specials`);
  }
  getSpecial(id: number){
    return this.http.get<Special>(`${this.baseUrl}/specials/${id}`);
  }
}

export class Special{
  id?: number;
  price: number;
  product_id: number;
  contractor_id: number;
}
