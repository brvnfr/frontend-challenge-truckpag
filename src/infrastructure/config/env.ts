import { z } from "zod";

const EnvSchema = z.object({
  VITE_GHIBLI_API_BASE_URL: z.string().url().optional(),
});

type Env = z.infer<typeof EnvSchema>;

/**
 * getEnv
 *
 * Centraliza leitura/validação das variáveis de ambiente.
 * Mantemos fallback para facilitar o setup local.
 */
export function getEnv(): Required<Env> {
  const parsed = EnvSchema.safeParse(import.meta.env);
  const env = parsed.success ? parsed.data : {};

  return {
    VITE_GHIBLI_API_BASE_URL: env.VITE_GHIBLI_API_BASE_URL ?? "https://ghibliapi.vercel.app",
  };
}