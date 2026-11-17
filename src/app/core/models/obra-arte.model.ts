export interface ObraArte {
  // No Firebase Realtime Database a chave gerada pelo POST é texto
  // (ex.: "-OAbC123xyz"), por isso o id é string — igual ao projeto modelo.
  id: string;
  titulo: string;
  artista: string;
  tecnica: string;
  anoCriacao: number;
  descricao: string;
  valorEstimado: number;
  emExposicao: boolean;
}

// Dados enviados para a API (o id fica na chave do Firebase, não no corpo)
export type ObraArteDados = Omit<ObraArte, "id">;
