import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  insertSeminarRegistration: vi.fn().mockResolvedValue(undefined),
}));

function createMockContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("seminar.submitRegistration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully submits a valid registration", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.seminar.submitRegistration({
      company: "テスト株式会社",
      name: "山田太郎",
      position: "営業部長",
      email: "test@example.com",
      phone: "090-1234-5678",
      challenge: "提案書作成に時間がかかる",
    });

    expect(result).toEqual({ success: true });
  });

  it("successfully submits registration without optional challenge field", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.seminar.submitRegistration({
      company: "テスト株式会社",
      name: "山田太郎",
      position: "営業部長",
      email: "test@example.com",
      phone: "090-1234-5678",
    });

    expect(result).toEqual({ success: true });
  });

  it("rejects registration with missing required fields", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.seminar.submitRegistration({
        company: "",
        name: "山田太郎",
        position: "営業部長",
        email: "test@example.com",
        phone: "090-1234-5678",
      })
    ).rejects.toThrow();
  });

  it("rejects registration with invalid email", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.seminar.submitRegistration({
        company: "テスト株式会社",
        name: "山田太郎",
        position: "営業部長",
        email: "invalid-email",
        phone: "090-1234-5678",
      })
    ).rejects.toThrow();
  });

  it("handles database errors gracefully", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // Mock database error
    const { insertSeminarRegistration } = await import("./db");
    vi.mocked(insertSeminarRegistration).mockRejectedValueOnce(
      new Error("Database error")
    );

    const result = await caller.seminar.submitRegistration({
      company: "テスト株式会社",
      name: "山田太郎",
      position: "営業部長",
      email: "test@example.com",
      phone: "090-1234-5678",
    });

    expect(result).toEqual({ success: false });
  });
});
