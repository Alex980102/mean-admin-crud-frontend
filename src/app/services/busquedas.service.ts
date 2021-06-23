import { Medico } from './../models/medico.model';
import { Hospital } from './../models/hospital.model';
import { Usuario } from './../models/usuario.model';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token' || '');
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  private transformarUsuarios(resultados: any[]): Usuario[]{
    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.id)
    )
  }

  private transformarHospitales(resultados: any[]): Hospital[]{
    return resultados;
  }

  private transformarMedicos(resultados: any[]): Medico[]{
    return resultados;
  }

  busquedaGlobal(termino: string){
    const url = `${base_url}/todo/${termino}`;
    return this.http.get(url, this.headers);
  }

  buscar(
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    termino: string
    ){
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get(url, this.headers )
        .pipe(
          map((res: any) => {
            switch (tipo) {
              case 'usuarios':
                return this.transformarUsuarios(res.data);

              case 'hospitales':
                return this.transformarHospitales(res.data);

              case 'medicos':
                return this.transformarMedicos(res.data);

              default:
                return [];
            }
          })
        )
  }
}
