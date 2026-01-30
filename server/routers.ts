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

          // Send confirmation email to applicant
          const { sendEmail, generateConfirmationEmail, generateAdminNotificationEmail } = await import("./email");
          const { ENV } = await import("./_core/env");
          
          const confirmationEmailSent = await sendEmail({
            to: input.email,
            subject: "【申し込み完了】人材業界の営業のためのGemini活用セミナー",
            html: generateConfirmationEmail({
              name: input.name,
              company: input.company,
              position: input.position,
              email: input.email,
              phone: input.phone,
              challenge: input.challenge || null,
            }),
          });

          // Send notification email to admin
          await sendEmail({
            to: "info@anyenv-inc.com",
            subject: "【新規申し込み】Gemini活用セミナー",
            html: generateAdminNotificationEmail({
              name: input.name,
              company: input.company,
              position: input.position,
              email: input.email,
              phone: input.phone,
              challenge: input.challenge || null,
            }),
          });

          return { success: true, emailSent: confirmationEmailSent };
        } catch (error) {
          console.error("Failed to insert seminar registration:", error);
          return { success: false };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
