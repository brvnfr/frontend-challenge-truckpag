import { describe, it, expect, beforeEach } from "vitest";

import { useGhibliStore } from "./ghibli.store";
import { getDefaultFilmFilters, getDefaultFilmSort, getDefaultFilmMeta } from "@/core/domain/types";

function resetStore() {
  // limpa persistência (localStorage) e reseta estado em memória
  useGhibliStore.persist?.clearStorage?.();

  useGhibliStore.setState({
    catalog: { items: [], updatedAt: null },
    metaById: {},
    filters: getDefaultFilmFilters(),
    sort: getDefaultFilmSort(),
  });
}

describe("useGhibliStore", () => {
  beforeEach(() => {
    resetStore();
  });

  it("toggleFavorite alterna o valor e retorna o novo estado", () => {
    const id = "film-1";

    const first = useGhibliStore.getState().toggleFavorite(id);
    expect(first).toBe(true);
    expect(useGhibliStore.getState().metaById[id].favorite).toBe(true);

    const second = useGhibliStore.getState().toggleFavorite(id);
    expect(second).toBe(false);
    expect(useGhibliStore.getState().metaById[id].favorite).toBe(false);
  });

  it("saveNote e removeNote atualizam nota e avaliação pessoal", () => {
    const id = "film-2";

    useGhibliStore.getState().saveNote(id, "Muito bom", 5);
    expect(useGhibliStore.getState().metaById[id]).toMatchObject({
      ...getDefaultFilmMeta(),
      note: "Muito bom",
      rating: 5,
    });

    useGhibliStore.getState().removeNote(id);
    expect(useGhibliStore.getState().metaById[id]).toMatchObject({
      ...getDefaultFilmMeta(),
      note: "",
      rating: null,
    });
  });
});
