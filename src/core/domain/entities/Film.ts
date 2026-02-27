/**
 * Film
 *
 * Modelo do filme conforme payload da API pública do Studio Ghibli.
 * Campos numéricos vêm como string (ex: `running_time`, `rt_score`).
 */
export type Film = {
  id: string;
  title: string;
  original_title: string;
  original_title_romanised: string;
  image: string;
  movie_banner: string;
  description: string;
  director: string;
  producer: string;
  release_date: string;
  running_time: string;
  rt_score: string;
  people: string[];
  species: string[];
  locations: string[];
  vehicles: string[];
  url: string;
};

/**
 * FilmEntity
 *
 * Wrapper OO para expor helpers de leitura (conversões e formatadores)
 * sem espalhar regra de negócio/transformação pela camada de UI.
 */
export class FilmEntity {
  constructor(private readonly props: Film) {}

  get raw() {
    return this.props;
  }

  get id() {
    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get director() {
    return this.props.director;
  }

  get producer() {
    return this.props.producer;
  }

  /**
   * Ano de lançamento (número), ou `null` quando inválido.
   */
  get releaseYear(): number | null {
    const n = Number(this.props.release_date);
    return Number.isFinite(n) ? n : null;
  }

  /**
   * Duração em minutos (número), ou `null` quando inválido.
   */
  get runningTimeMinutes(): number | null {
    const n = Number(this.props.running_time);
    return Number.isFinite(n) ? n : null;
  }

  /**
   * Rotten Tomatoes score como número (0–100), ou `null` quando inválido.
   */
  get rtScore(): number | null {
    const n = Number(this.props.rt_score);
    return Number.isFinite(n) ? n : null;
  }

  /**
   * Retorna uma duração amigável (ex: "125 min"), ou "—" se não houver.
   */
  get runningTimeLabel(): string {
    const minutes = this.runningTimeMinutes;
    return minutes == null ? "—" : `${minutes} min`;
  }

  /**
   * Retorna uma duração no formato "0h 00m" ,
   * ou "—" se não houver.
   */
  get runningTimeHhMmLabel(): string {
    const minutes = this.runningTimeMinutes;
    if (minutes == null) return "—";

    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    if (h <= 0) return `${m}m`;
    return `${h}h ${m}m`;
  }
}