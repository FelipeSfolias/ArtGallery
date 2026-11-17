import { CurrencyPipe } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { ObraArte } from "../../core/models/obra-arte.model";
import { ObrasService } from "../../core/services/obras.service";
import { CapaObra } from "../../shared/components/capa-obra/capa-obra";

@Component({
  selector: "app-detalhe-obra",
  imports: [CurrencyPipe, RouterLink, CapaObra],
  templateUrl: "./detalhe-obra.html",
  styleUrl: "./detalhe-obra.css",
})
export class DetalheObra {
  private route = inject(ActivatedRoute);
  private obrasService = inject(ObrasService);

  obra = signal<ObraArte | null>(null);
  loading = signal(true);

  constructor() {
    this.route.paramMap
      .pipe(
        map((parametros) => parametros.get("id") ?? ""),
        tap(() => this.loading.set(true)),
        switchMap((id) =>
          this.obrasService.getById(id).pipe(catchError(() => of(null))),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((obra) => {
        this.obra.set(obra);
        this.loading.set(false);
      });
  }
}
