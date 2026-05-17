import { chromium, type Page, type BrowserContext } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const BASE_URL = "https://responduct.vercel.app";
const OUT = path.join(process.cwd(), "public", "tutorial");
const DESKTOP = { width: 1280, height: 800 };
const MOBILE = { width: 390, height: 844 };

const ADMIN_EMAIL = process.env.TUTORIAL_ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.TUTORIAL_ADMIN_PASSWORD!;
const SALES_EMAIL = process.env.TUTORIAL_SALES_EMAIL!;
const SALES_PASSWORD = process.env.TUTORIAL_SALES_PASSWORD!;

async function shot(page: Page, name: string) {
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
  console.log(`  ✓ ${name}`);
}

async function login(ctx: BrowserContext, email: string, password: string): Promise<Page> {
  const page = await ctx.newPage();
  await page.goto(`${BASE_URL}/auth/login`);
  await page.waitForLoadState("networkidle");
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard/**", { timeout: 15000 });
  await page.waitForLoadState("networkidle");
  return page;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  // ── 1. Public pages ────────────────────────────────────────────────
  console.log("\n[1/4] Public sayfalar...");
  {
    const ctx = await browser.newContext({ viewport: DESKTOP });
    const page = await ctx.newPage();

    await page.goto(`${BASE_URL}/auth/login`);
    await page.waitForLoadState("networkidle");
    await shot(page, "login.png");

    await page.goto(`${BASE_URL}/auth/forgot-password`);
    await page.waitForLoadState("networkidle");
    await shot(page, "forgot-password.png");

    await ctx.close();
  }

  // ── 2. Admin pages ─────────────────────────────────────────────────
  console.log("\n[2/4] Admin sayfaları...");
  {
    const ctx = await browser.newContext({ viewport: DESKTOP });
    const page = await login(ctx, ADMIN_EMAIL, ADMIN_PASSWORD);

    // Overview
    await page.goto(`${BASE_URL}/dashboard/admin`);
    await page.waitForLoadState("networkidle");
    await shot(page, "admin-overview.png");

    // Schools list
    await page.goto(`${BASE_URL}/dashboard/admin/schools`);
    await page.waitForLoadState("networkidle");
    await shot(page, "admin-schools.png");

    // Schools — modal open
    const newSchoolBtn = page.locator("button", { hasText: "Yeni Okul" });
    if (await newSchoolBtn.isVisible()) {
      await newSchoolBtn.click();
      await page.waitForTimeout(400);
      await shot(page, "admin-schools-add.png");
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
    }

    // Products list
    await page.goto(`${BASE_URL}/dashboard/admin/products`);
    await page.waitForLoadState("networkidle");
    await shot(page, "admin-products.png");

    // Product questions (first product)
    const questionsLink = page.locator("a", { hasText: "Soruları Düzenle" }).first();
    if (await questionsLink.isVisible()) {
      await questionsLink.click();
      await page.waitForLoadState("networkidle");
      await shot(page, "admin-questions.png");
    }

    // Users
    await page.goto(`${BASE_URL}/dashboard/admin/users`);
    await page.waitForLoadState("networkidle");
    await shot(page, "admin-users.png");

    // Assignments
    await page.goto(`${BASE_URL}/dashboard/admin/assignments`);
    await page.waitForLoadState("networkidle");
    await shot(page, "admin-assignments.png");

    // Reports
    await page.goto(`${BASE_URL}/dashboard/admin/reports`);
    await page.waitForLoadState("networkidle");
    await shot(page, "admin-reports.png");

    await ctx.close();
  }

  // ── 3. Sales pages (desktop) ───────────────────────────────────────
  console.log("\n[3/4] Sales sayfaları (desktop)...");
  {
    const ctx = await browser.newContext({ viewport: DESKTOP });
    const page = await login(ctx, SALES_EMAIL, SALES_PASSWORD);

    // Overview
    await page.goto(`${BASE_URL}/dashboard/sales`);
    await page.waitForLoadState("networkidle");
    await shot(page, "sales-overview.png");

    // Feedback wizard — Step 1: school selection
    await page.goto(`${BASE_URL}/dashboard/sales/feedback`);
    await page.waitForLoadState("networkidle");
    await shot(page, "feedback-school.png");

    // Step 2: product selection — click first school button
    const schoolBtn = page.locator("button").filter({ hasText: /(İlk|Adım)/ }).first();
    const anySchoolBtn = page.locator("div.grid button").first();
    if (await anySchoolBtn.isVisible()) {
      await anySchoolBtn.click();
      await page.waitForTimeout(400);
      await shot(page, "feedback-product.png");

      // Step 3: question — click first product button
      const productBtn = page.locator("div.grid button").first();
      if (await productBtn.isVisible()) {
        await productBtn.click();
        await page.waitForTimeout(400);

        // Check if we landed on questions or went straight to summary
        const isOnQuestions = await page.locator("text=Soru").first().isVisible();
        if (isOnQuestions) {
          await shot(page, "feedback-question.png");

          // Navigate through all questions clicking "İleri" / "Özete Git"
          for (let i = 0; i < 30; i++) {
            const ozeteGit = page.locator("button", { hasText: "Özete Git" });
            const ileri = page.locator("button", { hasText: "İleri" });

            if (await ozeteGit.isVisible()) {
              await ozeteGit.click();
              await page.waitForTimeout(400);
              break;
            } else if (await ileri.isVisible()) {
              await ileri.click();
              await page.waitForTimeout(400);
            } else {
              break;
            }
          }
        }

        // Step 4: Summary
        const onaylaBtn = page.locator("button", { hasText: "Onayla ve Kaydet" });
        if (await onaylaBtn.isVisible()) {
          await shot(page, "feedback-summary.png");

          // Step 5: Done — submit the feedback
          await onaylaBtn.click();
          await page.waitForTimeout(2000);
          const isDone = await page.locator("text=Feedback kaydedildi").isVisible();
          if (isDone) {
            await shot(page, "feedback-done.png");
          }
        }
      }
    }

    // My feedbacks
    await page.goto(`${BASE_URL}/dashboard/sales/feedbacks`);
    await page.waitForLoadState("networkidle");
    await shot(page, "sales-feedbacks.png");

    // Feedback detail modal — click first row
    const firstRow = page.locator("div[class*='divide'] > div").first();
    if (await firstRow.isVisible()) {
      await firstRow.click();
      await page.waitForTimeout(500);
      await shot(page, "sales-feedbacks-detail.png");
      await page.keyboard.press("Escape");
    }

    // My schools
    await page.goto(`${BASE_URL}/dashboard/sales/schools`);
    await page.waitForLoadState("networkidle");
    await shot(page, "sales-schools.png");

    await ctx.close();
  }

  // ── 4. Mobile nav screenshot ───────────────────────────────────────
  console.log("\n[4/4] Mobil görünüm...");
  {
    const ctx = await browser.newContext({ viewport: MOBILE });
    const page = await login(ctx, SALES_EMAIL, SALES_PASSWORD);

    await page.goto(`${BASE_URL}/dashboard/sales`);
    await page.waitForLoadState("networkidle");
    await shot(page, "mobile-nav.png");

    // Mobile feedback wizard
    await page.goto(`${BASE_URL}/dashboard/sales/feedback`);
    await page.waitForLoadState("networkidle");
    await shot(page, "mobile-feedback.png");

    await ctx.close();
  }

  await browser.close();

  const files = fs.readdirSync(OUT);
  console.log(`\nTamamlandı! ${files.length} ekran görüntüsü → public/tutorial/\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
