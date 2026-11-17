// Teste de integração do ObrasService contra o Firebase real.
// Usa a PRÓPRIA classe do service (não uma cópia), rodando no Node.
// Executar: npm run test:api
//
// Cria uma obra de teste, edita, busca e exclui — o banco termina como começou.
import "@angular/compiler";
import { provideHttpClient, withFetch } from "@angular/common/http";
import { createEnvironmentInjector, EnvironmentInjector, Injector, provideZonelessChangeDetection, ɵINJECTOR_SCOPE } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ObraArteDados } from "../src/app/core/models/obra-arte.model";
import { ObrasService } from "../src/app/core/services/obras.service";

const injector = createEnvironmentInjector(
  [{ provide: ɵINJECTOR_SCOPE, useValue: "root" }, provideZonelessChangeDetection(), provideHttpClient(withFetch()), ObrasService],
  Injector.NULL as unknown as EnvironmentInjector,
);
const service = injector.get(ObrasService);

let falhas = 0;
function ok(condicao: boolean, mensagem: string): void {
  console.log(`${condicao ? "OK  " : "FALHA"} ${mensagem}`);
  if (!condicao) falhas++;
}

async function esperaErro(promessa: Promise<unknown>): Promise<string | null> {
  try {
    await promessa;
    return null;
  } catch (e) {
    return (e as Error).message;
  }
}

const obraTeste: ObraArteDados = {
  titulo: "Obra de teste automatizado",
  artista: "Script de teste",
  tecnica: "Arte digital",
  anoCriacao: 2026,
  descricao: "Registro temporário criado pelo script de teste.",
  valorEstimado: 1234.56,
  emExposicao: false,
};

async function main(): Promise<void> {
  // getAll
  const antes = await firstValueFrom(service.getAll());
  ok(Array.isArray(antes), `getAll() devolve array (${antes.length} obra(s))`);

  // create
  const criada = await firstValueFrom(service.create(obraTeste));
  ok(typeof criada.id === "string" && criada.id.length > 0, `create() devolve id gerado: ${criada.id}`);

  // getById
  const buscada = await firstValueFrom(service.getById(criada.id));
  ok(buscada.titulo === obraTeste.titulo, "getById() encontra a obra criada");
  ok(typeof buscada.anoCriacao === "number" && typeof buscada.emExposicao === "boolean", "getById() mantém os tipos (number/boolean)");

  const depoisCreate = await firstValueFrom(service.getAll());
  ok(depoisCreate.length === antes.length + 1, "getAll() lista a obra nova");

  // update
  await firstValueFrom(service.update(criada.id, { ...obraTeste, titulo: "Obra de teste (editada)", emExposicao: true }));
  const editada = await firstValueFrom(service.getById(criada.id));
  ok(editada.titulo === "Obra de teste (editada)" && editada.emExposicao, "update() grava as alterações");

  // delete
  await firstValueFrom(service.delete(criada.id));
  const erroAposDelete = await esperaErro(firstValueFrom(service.getById(criada.id)));
  ok(erroAposDelete === "Obra não encontrada!", "delete() remove a obra (getById depois dá 'Obra não encontrada!')");

  const depois = await firstValueFrom(service.getAll());
  ok(depois.length === antes.length, "getAll() volta à quantidade original");

  // id inexistente
  const erroInexistente = await esperaErro(firstValueFrom(service.getById("id-que-nao-existe")));
  ok(erroInexistente === "Obra não encontrada!", "getById() de id inexistente lança erro");

  console.log(falhas === 0 ? "\nTodos os testes passaram." : `\n${falhas} teste(s) falharam.`);
  process.exit(falhas === 0 ? 0 : 1);
}

main().catch((erro) => {
  console.error("Erro inesperado:", erro?.message ?? erro);
  process.exit(1);
});
