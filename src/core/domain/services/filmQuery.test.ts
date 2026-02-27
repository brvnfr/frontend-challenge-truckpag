import { describe, it, expect } from "vitest";

import type { Film } from "../entities/Film";
import { FilmEntity } from "../entities/Film";
import type { FilmFilters } from "../types/filmFilters";
import type { FilmMetaById } from "../types/filmMeta";
import type { FilmSort } from "../types/filmSorting";
import { getDefaultFilmFilters, getDefaultFilmMeta, getDefaultFilmSort } from "../types";
import { queryFilms } from "./filmQuery";

function makeFilm(overrides: Partial<Film>): Film {
  return {
    id: "id",
    title: "Title",
    original_title: "Title",
    original_title_romanised: "Title",
    image: "https://example.com/image.jpg",
    movie_banner: "https://example.com/banner.jpg",
    description: "Some description",
    director: "Dir",
    producer: "Prod",
    release_date: "2001",
    running_time: "100",
    rt_score: "90",
    people: [],
    species: [],
    locations: [],
    vehicles: [],
    url: "https://example.com",
    ...overrides,
  };
}

function run(params: {
  films: FilmEntity[];
  metaById?: FilmMetaById;
  filters?: Partial<FilmFilters>;
  sort?: Partial<FilmSort>;
}) {
  const metaById = params.metaById ?? {};
  const filters = { ...getDefaultFilmFilters(), ...(params.filters ?? {}) };
  const sort = { ...getDefaultFilmSort(), ...(params.sort ?? {}) };

  return queryFilms({ films: params.films, metaById, filters, sort });
}

describe("queryFilms", () => {
  it("filtra por título e, opcionalmente, por sinopse", () => {
    const films = [
      new FilmEntity(makeFilm({ id: "1", title: "My Neighbor Totoro", description: "Forest spirits" })),
      new FilmEntity(makeFilm({ id: "2", title: "Castle in the Sky", description: "A floating island" })),
    ];

    // por padrão só título
    const onlyTitle = run({ films, filters: { query: "floating", includeSynopsis: false } });
    expect(onlyTitle.map((f) => f.id)).toEqual([]);

    // com sinopse habilitada
    const withSynopsis = run({ films, filters: { query: "floating", includeSynopsis: true } });
    expect(withSynopsis.map((f) => f.id)).toEqual(["2"]);
  });

  it("filtra por estrelas (rating pessoal)", () => {
    const films = [
      new FilmEntity(makeFilm({ id: "1", title: "A" })),
      new FilmEntity(makeFilm({ id: "2", title: "B" })),
      new FilmEntity(makeFilm({ id: "3", title: "C" })),
    ];

    const metaById: FilmMetaById = {
      "1": { ...getDefaultFilmMeta(), rating: 5, note: "ok" },
      "2": { ...getDefaultFilmMeta(), rating: 3, note: "ok" },
      "3": { ...getDefaultFilmMeta(), rating: null, note: "" },
    };

    const only5 = run({ films, metaById, filters: { stars: 5 } });
    expect(only5.map((f) => f.id)).toEqual(["1"]);

    const unrated = run({ films, metaById, filters: { stars: "unrated" } });
    expect(unrated.map((f) => f.id)).toEqual(["3"]);
  });

  it("ordena por rating pessoal e mantém nulos no final (asc e desc)", () => {
    const films = [
      new FilmEntity(makeFilm({ id: "1", title: "A" })),
      new FilmEntity(makeFilm({ id: "2", title: "B" })),
      new FilmEntity(makeFilm({ id: "3", title: "C" })),
    ];

    const metaById: FilmMetaById = {
      "1": { ...getDefaultFilmMeta(), rating: 5 },
      "2": { ...getDefaultFilmMeta(), rating: null },
      "3": { ...getDefaultFilmMeta(), rating: 2 },
    };

    const asc = run({ films, metaById, sort: { key: "personal_rating", direction: "asc" } });
    expect(asc.map((f) => f.id)).toEqual(["3", "1", "2"]);

    const desc = run({ films, metaById, sort: { key: "personal_rating", direction: "desc" } });
    expect(desc.map((f) => f.id)).toEqual(["1", "3", "2"]);
  });
});
