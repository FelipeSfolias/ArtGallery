import { Component, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";
import { catchError, of } from "rxjs";
import { ObraArte } from "../../core/models/obra-arte.model";
import { ObrasService } from "../../core/services/obras.service";
import { CapaObra } from "../../shared/components/capa-obra/capa-obra";

@Component({
  selector: "app-home",
  imports: [RouterLink, CapaObra],
  templateUrl: "./home.html",
  styleUrl: "./home.css",
})
export class Home {
  private obrasService = inject(ObrasService);

  // null = ainda carregando
  readonly obras = toSignal(
    this.obrasService.getAll().pipe(catchError(() => of([] as ObraArte[]))),
    { initialValue: null },
  );

  // Destaques: até 4 obras em exposição
  readonly destaques = computed(() =>
    (this.obras() ?? []).filter((obra) => obra.emExposicao).slice(0, 4),
  );

  readonly resumo = computed(() => {
    const obras = this.obras() ?? [];
    return {
      total: obras.length,
      expostas: obras.filter((obra) => obra.emExposicao).length,
      artistas: new Set(obras.map((obra) => obra.artista.trim().toLowerCase())).size,
    };
  });
}
