# ArtGallery — Galeria Virtual de Obras de Arte

Projeto Angular 21+ (standalone, signals, Reactive Forms) consumindo a API REST do **Firebase Realtime Database**.

Cataloga obras com título, artista, técnica, ano de criação, descrição, valor estimado e disponibilidade para exposição.

## Executar

```bash
npm install
npm start
```

Acesse http://localhost:4200.

## Testar a API (ObrasService)

```bash
npm run test:api
```

Roda a própria classe `ObrasService` no Node contra o Firebase real: `getAll`, `create`, `getById`, `update`, `delete` e `getById` de id inexistente. A obra de teste é criada e excluída, então o banco termina como começou.

## Ilustrações das obras

As imagens ficam em `public/obras/*.svg` (releituras simplificadas). Como a interface `ObraArte` não tem campo de imagem, a ilustração é encontrada pelo título (`core/utils/obra-visual.ts`): "A Noite Estrelada" → `obras/a-noite-estrelada.svg`. Obras sem ilustração mostram um ícone pela técnica.

## Configurar o Firebase

1. Crie um projeto em https://console.firebase.google.com (pode desativar o Google Analytics).
2. Menu **Criação > Realtime Database > Criar banco de dados** → escolha o local → **Iniciar no modo de teste**.
3. Aba **Regras**: cole o conteúdo de `firebase/database.rules.json` e clique em **Publicar**.
4. Aba **Dados**: copie a URL do banco (ex.: `https://artgallery-xxxxx-default-rtdb.firebaseio.com/`).
5. Em `src/app/core/services/obras.service.ts`, troque o `apiUrl`:
   ```ts
   private apiUrl = "https://artgallery-xxxxx-default-rtdb.firebaseio.com/obras";
   ```
6. (Opcional) Dados de exemplo: aba **Dados > ⋮ > Importar JSON** → `firebase/obras-seed.json`.
   Atenção: importar na raiz substitui tudo que já existe no banco.

## Endpoints usados (ObrasService)

| Método    | Endpoint            | Uso                          |
|-----------|---------------------|------------------------------|
| GET       | `/obras.json`       | `getAll()` — lista as obras  |
| GET       | `/obras/{id}.json`  | `getById()` — busca uma obra |
| POST      | `/obras.json`       | `create()` — retorna `{ "name": "<id gerado>" }` |
| PUT       | `/obras/{id}.json`  | `update()` — substitui a obra |
| DELETE    | `/obras/{id}.json`  | `delete()` — remove a obra   |

O Firebase devolve a lista como objeto `{ "<id>": { ...obra } }`; o service converte para `ObraArte[]` usando a chave como `id`.

## Rotas

| Rota               | Tela                                  |
|--------------------|---------------------------------------|
| `/`                | Início (destaques + números do acervo) |
| `/obras`           | Galeria pública com busca e filtros   |
| `/obras/:id`       | Detalhe da obra                       |
| `/sobre`           | Sobre o projeto                       |
| `/admin`           | Lista administrativa (editar/excluir) |
| `/admin/form`      | Cadastro de obra                      |
| `/admin/form/:id`  | Edição de obra                        |
