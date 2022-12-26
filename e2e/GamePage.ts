import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class GamePage {
  constructor(private readonly page: Page) {}

  async boostMotivation(player: string, city: string) {
    await this.exploreCity(player, city);
    await this.page.getByLabel("(++ motivation)").first().check();
    await this.runActivity();
    await expect(
      this.page.getByText(`Your motivation increases`)
    ).toBeVisible();
    await this.nextPlayer();
  }

  async boostPoints(player: string, city: string) {
    await this.exploreCity(player, city);
    await this.page.getByLabel("(++ points)").first().check();
    await this.runActivity();
    await expect(this.page.getByText(`Your points increase`)).toBeVisible();
    await this.nextPlayer();
  }

  async cycleFromTo(player: string, from: string, to: string) {
    await this.exploreCity(player, from);
    await this.page.getByLabel("Cycle to the next city").check();
    await this.runActivity();

    if (await this.page.getByText("arrived in Wageningen").isVisible()) {
      return;
    }

    await expect(
      this.page.getByText(`Well done, you have cycled to ${to}`)
    ).toBeVisible();
    await this.nextPlayer();
  }

  async expectWinner(player: string) {
    await this.page.getByText(`${player} has arrived in Wageningen`);
  }

  async wonGame(player: string): Promise<boolean> {
    return this.page
      .getByText(`${player} has arrived in Wageningen`)
      .isVisible();
  }

  private async exploreCity(player: string, city: string) {
    await expect(this.page.getByText(`${player}'s Turn`)).toBeVisible();
    await this.page.getByRole("button", { name: `Explore ${city}` }).click();
  }

  private async runActivity() {
    await this.page.getByRole("button", { name: "Run Activity" }).click();
  }

  private async nextPlayer() {
    await this.page.getByRole("button", { name: "Next Player" }).click();
  }
}
