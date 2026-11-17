import { Component, computed, input } from "@angular/core";
import { ObraArte } from "../../../core/models/obra-arte.model";
import { iconeDaObra, imagemDaObra } from "../../../core/utils/obra-visual";

// Mostra a ilustração SVG da obra; se não existir, mostra um ícone pela técnica.
@Component({
  selector: "app-capa-obra",
  template: `
    @if (imagem(); as src) {
      <img [src]="src" [alt]="'Ilustração de ' + obra().titulo" loading="lazy" />
    } @else {
      <span class="icone" aria-hidden="true">{{ icone() }}</span>
    }
  `,
  styles: `
    :host {
      display: grid;
      place-items: center;
      aspect-ratio: 4 / 3;
      overflow: hidden;
      background: var(--fundo-suave);
    }
    img { width: 100%; height: 100%; display: block; object-fit: cover; }
    .icone { font-size: 3rem; }
  `,
})
export class CapaObra {
  obra = input.required<Pick<ObraArte, "titulo" | "tecnica">>();

  imagem = computed(() => imagemDaObra(this.obra().titulo));
  icone = computed(() => iconeDaObra(this.obra().tecnica));
}
