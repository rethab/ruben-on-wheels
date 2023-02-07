import { test, expect } from "@playwright/test";
import { GamePage } from "./GamePage";

// See here how to get started:
// https://playwright.dev/docs/intro
test("plays a game", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Welcome to Ruben on Wheels")).toBeVisible();

  await page.getByRole("button", { name: "Begin" }).click();

  await expect(page.getByText("Start new Game")).toBeVisible();

  await page.getByLabel("Player 1").first().fill("Alice");
  await page.getByLabel("Player 2").first().fill("Bob");
  await page.getByRole("button", { name: "Add More Players" }).click();
  await page.getByLabel("Player 3").first().fill("Carl");

  await page.getByRole("button", { name: "Start" }).click();

  const gamePage = new GamePage(page);

  await gamePage.boostMotivation("Alice", "Zurich");
  await gamePage.cycleFromTo("Bob", "Zurich", "Basel");
  await gamePage.cycleFromTo("Carl", "Zurich", "Basel");

  await gamePage.boostMotivation("Alice", "Zurich");
  await gamePage.boostPoints("Bob", "Basel");
  await gamePage.boostPoints("Carl", "Basel");

  await gamePage.boostPoints("Alice", "Zurich");
  await gamePage.boostPoints("Bob", "Basel");
  await gamePage.boostPoints("Carl", "Basel");

  const cities = [
    "Zurich",
    "Basel",
    "Köln",
    "Duisburg",
    "Arnhem",
    "Wageningen",
  ];

  for (let i = 0; i < cities.length - 1; i++) {
    await gamePage.cycleFromTo("Alice", cities[i], cities[i + 1]);

    if (!(await gamePage.wonGame("Alice"))) {
      await gamePage.boostPoints("Bob", "Basel");
      await gamePage.boostPoints("Carl", "Basel");
    }
  }

  await gamePage.expectWinner("Alice");
});
