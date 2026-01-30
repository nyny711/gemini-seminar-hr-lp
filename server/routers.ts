import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  seminar: router({
    submitRegistration: publicProcedure
      .input(z.object({
        company: z.string().min(1, "会社名は必須です"),
        name: z.string().min(1, "名前は必須です"),
        position: z.string().min(1, "役職は必須です"),
        email: z.string().email("有効なメールアドレスを入力してください"),
        phone: z.string().min(1, "電話番号は必須です"),
        challenge: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const { insertSeminarRegistration } = await import("./db");
          await insertSeminarRegistration({
            companyName: input.company,
            name: input.name,
            position: input.position,
            email: input.email,
            phone: input.phone,
            challenge: input.challenge || null,
          });
          return { success: true };
        } catch (error) {
          console.error("Failed to insert seminar registration:", error);
          return { success: false };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
