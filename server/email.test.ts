import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendEmail, generateConfirmationEmail, generateAdminNotificationEmail } from "./email";

// Mock fetch globally
global.fetch = vi.fn();

describe("email", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateConfirmationEmail", () => {
    it("generates confirmation email with all fields", () => {
      const html = generateConfirmationEmail({
        name: "山田太郎",
        company: "テスト株式会社",
        position: "営業部長",
        email: "test@example.com",
        phone: "090-1234-5678",
        challenge: "提案書作成に時間がかかる",
      });

      expect(html).toContain("山田太郎");
      expect(html).toContain("テスト株式会社");
      expect(html).toContain("営業部長");
      expect(html).toContain("test@example.com");
      expect(html).toContain("090-1234-5678");
      expect(html).toContain("提案書作成に時間がかかる");
    });

    it("generates confirmation email without challenge", () => {
      const html = generateConfirmationEmail({
        name: "山田太郎",
        company: "テスト株式会社",
        position: "営業部長",
        email: "test@example.com",
        phone: "090-1234-5678",
        challenge: null,
      });

      expect(html).toContain("山田太郎");
      expect(html).not.toContain("課題:");
    });
  });

  describe("generateAdminNotificationEmail", () => {
    it("generates admin notification email with all fields", () => {
      const html = generateAdminNotificationEmail({
        name: "山田太郎",
        company: "テスト株式会社",
        position: "営業部長",
        email: "test@example.com",
        phone: "090-1234-5678",
        challenge: "提案書作成に時間がかかる",
      });

      expect(html).toContain("山田太郎");
      expect(html).toContain("テスト株式会社");
      expect(html).toContain("新しいセミナー登録がありました");
    });
  });

  describe("sendEmail", () => {
    it("returns false when SendGrid credentials are not configured", async () => {
      // ENV will have empty strings for sendgridApiKey and sendgridFromEmail
      const result = await sendEmail({
        to: "test@example.com",
        subject: "Test",
        html: "<p>Test</p>",
      });

      expect(result).toBe(false);
    });
  });
});
