import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ObraArteDados } from "../../core/models/obra-arte.model";
import { ObrasService } from "../../core/services/obras.service";

type CampoObra =
  | "titulo"
  | "artista"
  | "tecnica"
  | "anoCriacao"
  | "descricao"
  | "valorEstimado";

@Component({
  selector: "app-manutencao-obra",
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./manutencao-obra.html",
  styleUrl: "./manutencao-obra.css",
})
export class ManutencaoObra implements OnInit {
  private fb = inject(FormBuilder);
  private obrasService = inject(ObrasService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly anoAtual = new Date().getFullYear();
  readonly tecnicasSugeridas = [
    "Óleo sobre tela",
    "Acrílica sobre tela",
    "Aquarela",
    "Guache",
    "Têmpera",
    "Afresco",
    "Desenho a grafite",
    "Carvão sobre papel",
    "Nanquim",
    "Xilogravura",
    "Litografia",
    "Escultura em bronze",
    "Escultura em mármore",
    "Fotografia",
    "Arte digital",
    "Técnica mista",
  ];

  editingId = signal<string | null>(null);
  loading = signal(false);
  loadingData = signal(false);
  successMessage = signal("");
  errorMessage = signal("");

  form = this.fb.nonNullable.group({
    titulo: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    artista: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    tecnica: ["", [Validators.required, Validators.minLength(3)]],
    anoCriacao: [this.anoAtual, [Validators.required, Validators.min(1), Validators.max(this.anoAtual)]],
    descricao: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    valorEstimado: [0, [Validators.required, Validators.min(0)]],
    emExposicao: [true],
  });

  ngOnInit(): void {
    // Aceita /admin/form/:id e também /admin/form?id= (como no modelo)
    const id =
      this.route.snapshot.paramMap.get("id") ??
      this.route.snapshot.queryParamMap.get("id");
    if (id) {
      this.editingId.set(id);
      this.loadObra(id);
    }
  }

  invalido(campo: CampoObra): boolean {
    const control = this.form.controls[campo];
    return control.touched && control.invalid;
  }

  loadObra(id: string): void {
    this.loadingData.set(true);
    this.obrasService.getById(id).subscribe({
      next: (obra) => {
        this.form.patchValue({
          titulo: obra.titulo,
          artista: obra.artista,
          tecnica: obra.tecnica,
          anoCriacao: obra.anoCriacao,
          descricao: obra.descricao,
          valorEstimado: obra.valorEstimado,
          emExposicao: obra.emExposicao,
        });
        this.loadingData.set(false);
      },
      error: (error) => {
        this.errorMessage.set("Erro ao carregar obra: " + error.message);
        this.loadingData.set(false);
      },
    });
  }

  submit(): void {
    this.successMessage.set("");
    this.errorMessage.set("");
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.form.getRawValue();
    const obraData: ObraArteDados = {
      titulo: formValue.titulo.trim(),
      artista: formValue.artista.trim(),
      tecnica: formValue.tecnica.trim(),
      anoCriacao: Number(formValue.anoCriacao),
      descricao: formValue.descricao.trim(),
      valorEstimado: Number(formValue.valorEstimado),
      emExposicao: formValue.emExposicao,
    };

    const id = this.editingId();
    if (id !== null) {
      this.obrasService.update(id, obraData).subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set("Obra atualizada com sucesso!");
          setTimeout(() => this.router.navigate(["/admin"]), 1000);
        },
        error: () => {
          this.loading.set(false);
          this.errorMessage.set("Erro ao atualizar obra.");
        },
      });
      return;
    }

    this.obrasService.create(obraData).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set("Obra cadastrada com sucesso!");
        this.form.reset();
        setTimeout(() => this.router.navigate(["/admin"]), 1000);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set("Erro ao cadastrar obra.");
      },
    });
  }
}
