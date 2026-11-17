import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ObraArte } from "../../core/models/obra-arte.model";
import { ObrasService } from "../../core/services/obras.service";
import { CapaObra } from "../../shared/components/capa-obra/capa-obra";

type Filtro = "todas" | "exposicao" | "acervo";

@Component({
  selector: "app-obras",
  imports: [RouterLink, CapaObra],
  templateUrl: "./obras.html",
  styleUrl: "./obras.css",
})
export class Obras implements OnInit {
  private obrasService = inject(ObrasService);

  obras = signal<ObraArte[]>([]);
  loading = signal(true);
  errorMessage = signal("");
  busca = signal("");
  filtro = signal<Filtro>("todas");

  obrasFiltradas = computed(() => {
    const termo = this.busca().trim().toLowerCase();
    const filtro = this.filtro();

    return this.obras().filter((obra) => {
      const passaFiltro =
        filtro === "todas" ||
        (filtro === "exposicao" ? obra.emExposicao : !obra.emExposicao);
      const passaBusca =
        !termo ||
        [obra.titulo, obra.artista, obra.tecnica].some((campo) =>
          campo.toLowerCase().includes(termo),
        );
      return passaFiltro && passaBusca;
    });
  });

  ngOnInit(): void {
    this.obrasService.getAll().subscribe({
      next: (obras) => {
        this.obras.set(obras);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set("Erro ao carregar a galeria: " + error.message);
        this.loading.set(false);
      },
    });
  }
}
