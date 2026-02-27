import { useEffect, type ReactNode } from "react";
import { useThemeStore } from "./theme.store";

type Props = {
  children: ReactNode;
};

/**
 * ThemeProvider
 *
 * Aplica a classe `.dark` no `<html>` conforme o tema selecionado.
 */
export function ThemeProvider({ children }: Props) {
  const mode = useThemeStore((s) => s.mode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  return children;
}