import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ObraArte, ObraArteDados } from "../models/obra-arte.model";

type FirebaseObra = Partial<ObraArteDados> & { id?: unknown };

@Injectable({ providedIn: "root" })
export class ObrasService {
  private http = inject(HttpClient);

  // URL do Realtime Database + nó "obras" (sem barra no final).
  // As regras só liberam /obras; a raiz (/.json) responde 401.
  private apiUrl = "https://art-gallery-8e394-default-rtdb.firebaseio.com/obras";
  private sufix = ".json";

  getAll(): Observable<ObraArte[]> {
    return this.http
      .get<Record<string, FirebaseObra> | null>(this.apiUrl + this.sufix)
      .pipe(
        map((response) => {
          if (!response) {
            return [];
          }
          return Object.entries(response).map(([id, obra]) =>
            this.toObra(id, obra),
          );
        }),
      );
  }

  getById(id: string): Observable<ObraArte> {
    return this.http
      .get<FirebaseObra | null>(`${this.apiUrl}/${id}${this.sufix}`)
      .pipe(
        map((response) => {
          if (!response) {
            throw new Error("Obra não encontrada!");
          }
          return this.toObra(id, response);
        }),
      );
  }

  create(obra: ObraArteDados): Observable<ObraArte> {
    return this.http
      .post<{ name: string }>(this.apiUrl + this.sufix, obra)
      .pipe(map((response) => ({ id: response.name, ...obra })));
  }

  update(id: string, obra: ObraArteDados): Observable<ObraArte> {
    return this.http
      .put<ObraArteDados>(`${this.apiUrl}/${id}${this.sufix}`, obra)
      .pipe(map(() => ({ id, ...obra })));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}${this.sufix}`);
  }

  // Garante os tipos certos mesmo se algum dado foi cadastrado "torto" no console
  private toObra(id: string, obra: FirebaseObra): ObraArte {
    return {
      id,
      titulo: obra.titulo ?? "",
      artista: obra.artista ?? "",
      tecnica: obra.tecnica ?? "",
      anoCriacao: Number(obra.anoCriacao) || 0,
      descricao: obra.descricao ?? "",
      valorEstimado: Number(obra.valorEstimado) || 0,
      emExposicao: Boolean(obra.emExposicao),
    };
  }
}
