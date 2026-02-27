# Studio Ghibli Films - Truckpag Front End Challenge

Aplicação web em **React + TypeScript** que consome a API pública do **Studio Ghibli** e permite listar filmes, aplicar filtros/ordenação e gerenciar estado local (assistido/favorito/anotações/avaliação pessoal) com persistência em `localStorage`.

---

## S — Summary

### O que foi construído

- Lista de filmes (imagem, título, ano, duração, sinopse, diretor/produtor e `rt_score`).
- Marcar/desmarcar **assistido** e **favorito**.
- **Busca por título** e opção **“Incluir sinopse na busca”** (com destaque do termo na sinopse).
- **Anotações** por filme + **avaliação pessoal (1–5 estrelas)** em **modal**.
- Filtros: assistido, favorito, com anotação e por número de estrelas.
- Ordenação (asc/desc): título, duração, avaliação pessoal e `rt_score`.
- **Detalhes completos em Sheet** (evita cards com alturas diferentes ao “ler mais”).
- **Persistência** (metas + filtros + ordenação) em `localStorage`.
- **Toasts** para feedback das ações.
- **Dark/Light mode** com Design Tokens “cozy” inspirados em tons pastéis/amarelados.

### Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind v4 (CSS-first)** + Design Tokens via CSS vars
- **TanStack Query** (estado assíncrono/cache)
- **Zustand** (estado global + persist)
- **Axios** (HTTP)
- **Vitest + React Testing Library** (testes)

---

## I — Installation & Running

### Pré-requisitos

- Node 20+ (recomendado)
- pnpm

### Rodando localmente

```bash
pnpm install
pnpm dev
```

> Opcional: copie `.env.example` para `.env` se quiser sobrescrever a base URL da API.

Build/preview:

```bash
pnpm build
pnpm preview
```

---

## R — Requisitos implementados

### ✅ Obrigatórios

- [x] Listagem com imagem, título, ano, duração, sinopse, diretor/produtor e `rt_score`
- [x] Marcar como assistido
- [x] Marcar como favorito
- [x] Filtrar por título
- [x] “Incluir sinopse na busca” + highlight do texto
- [x] Adicionar/editar anotações
- [x] Avaliação pessoal 1–5 estrelas
- [x] Filtrar por assistido, favorito, com anotação e estrelas
- [x] Ordenar por título, duração, avaliação pessoal e `rt_score` (asc/desc)

### ✨ Desejáveis

- [x] TypeScript
- [x] Responsividade básica
- [x] Persistência no LocalStorage (metas + filtros + ordenação)
- [x] Toasts nas operações
- [x] Testes unitários/de componente (Vitest + RTL)
- [x] Separação clara de responsabilidades (camadas)
- [x] Tailwind + design system com tokens
- [x] Estado global (Zustand)
- [x] Estado assíncrono (TanStack Query)

---

## E — Engineering (arquitetura e decisões)

### Camadas e responsabilidades

Estrutura do projeto:

```txt
src/
  app/                 # store global (zustand)
  core/                # domínio (entidades OO, types, serviços puros)
  infrastructure/      # integração externa (API client, http)
  presentation/        # páginas, componentes e hooks de UI
  shared/              # utilitários (cn, highlight), componentes base etc.
  styles/              # design tokens e globals
```

- **core/**: contém `FilmEntity` (wrapper) e `queryFilms` (serviço puro) para filtros/ordenação.
- **infrastructure/**: encapsula consumo HTTP (Axios) e contrato com a API.
- **presentation/**: UI + hooks (React Query) e orquestração de eventos.
- **app/**: estado global com persistência (metas dos filmes + filtros/ordenação).

### Design System (Tailwind v4)

Tokens definidos em `src/styles/globals.css` via CSS vars (ex.: `--color-bg`, `--color-surface`, `--color-primary`, `--color-warning`…), com override em `.dark { ... }`.

### Persistência

O estado do usuário (assistido/favorito/anotações/estrelas) e também filtros/ordenação são persistidos via `zustand/persist`.

---

## Testes

Os testes usam **Vitest** (runner) e **React Testing Library** (UI).

```bash
pnpm test
```

Modo watch:

```bash
pnpm test:watch
```

UI do Vitest:

```bash
pnpm test:ui
```

### O que está coberto

- **Unidade (domínio):** `queryFilms` (filtros + ordenação e regra de nulos no final).
- **Unidade (estado):** actions do `useGhibliStore` (favorito e notas).
- **Componente:** `StarRating` (evento de clique e readonly).

---

## N — Notes

### API

Endpoint principal:

- `GET https://ghibliapi.vercel.app/films`
---
