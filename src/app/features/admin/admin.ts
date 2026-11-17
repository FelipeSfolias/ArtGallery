import { CurrencyPipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { ObraArte } from "../../core/models/obra-arte.model";
import { ObrasService } from "../../core/services/obras.service";

@Component({
  selector: "app-admin",
  imports: [RouterLink, CurrencyPipe],
  templateUrl: "./admin.html",
  styleUrl: "./admin.css",
})
export class Admin implements OnInit {
  private obrasService = inject(ObrasService);
  private router = inject(Router);

  // Signals: mantém a tela atualizada no Angular 21+ (zoneless)
  obras = signal<ObraArte[]>([]);
  loading = signal(true);
  errorMessage = signal("");
  successMessage = signal("");

  ngOnInit(): void {
    this.loadObras();
  }

  loadObras(): void {
    this.loading.set(true);
    this.errorMessage.set("");
    this.obrasService.getAll().subscribe({
      next: (response) => {
        this.obras.set(response);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set("Erro ao carregar obras: " + error.message);
        this.loading.set(false);
      },
    });
  }

  edit(id: string): void {
    this.router.navigate(["/admin/form", id]);
  }

  remove(obra: ObraArte): void {
    if (!confirm(`Excluir a obra "${obra.titulo}"?`)) {
      return;
    }

    this.obrasService.delete(obra.id).subscribe({
      next: () => {
        this.successMessage.set("Obra removida com sucesso!");
        this.loadObras();
        setTimeout(() => this.successMessage.set(""), 2000);
      },
      error: (error) => {
        this.errorMessage.set("Erro ao remover obra: " + error.message);
      },
    });
  }
}
