import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./features/home/home").then((m) => m.Home),
    title: "Início | ArtGallery",
  },
  {
    path: "sobre",
    loadComponent: () => import("./features/sobre/sobre").then((m) => m.Sobre),
    title: "Sobre | ArtGallery",
  },
  {
    path: "obras",
    loadComponent: () => import("./features/obras/obras").then((m) => m.Obras),
    title: "Galeria | ArtGallery",
  },
  {
    path: "obras/:id",
    loadComponent: () =>
      import("./features/detalhe-obra/detalhe-obra").then((m) => m.DetalheObra),
    title: "Detalhes da obra | ArtGallery",
  },
  {
    path: "admin",
    loadComponent: () => import("./features/admin/admin").then((m) => m.Admin),
    title: "Admin | ArtGallery",
  },
  {
    path: "admin/form",
    loadComponent: () =>
      import("./features/manutencao-obra/manutencao-obra").then(
        (m) => m.ManutencaoObra,
      ),
    title: "Nova obra | ArtGallery",
  },
  {
    path: "admin/form/:id",
    loadComponent: () =>
      import("./features/manutencao-obra/manutencao-obra").then(
        (m) => m.ManutencaoObra,
      ),
    title: "Editar obra | ArtGallery",
  },
  { path: "**", redirectTo: "" },
];
