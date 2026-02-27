import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { StarRating } from "./StarRating";

describe("StarRating", () => {
  it("chama onChange com a estrela clicada", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<StarRating value={null} onChange={onChange} />);

    await user.click(screen.getByLabelText("Avaliar com 4 estrela(s)"));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("não renderiza botões quando readonly", () => {
    render(<StarRating value={3} readonly />);

    // não deve haver botões clicáveis
    expect(screen.queryByRole("button", { name: /Avaliar com/i })).toBeNull();
  });
});
