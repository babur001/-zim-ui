import { z } from "zod";
import { publicProcedure, router } from "../lib/trpc";

const users = [
  {
    uuid: "c620c03e-6981-49c3-9a0d-a3e9ca0bb503",
    name: "Babur",
    birthDate: "07-04-2001",
    phone: "+998907271449",
    email: "saburovbabur@gmail.com",
  },
  {
    uuid: "73316234-b33a-48b6-83ea-ead7982ecd76",
    name: "Sanjar",
    birthDate: "12-02-2001",
    phone: "+998907212321",
    email: "sanjar001@gmail.com",
  },
];

export const appRouter = router({
  users: publicProcedure.query(async () => {
    await new Promise((res, rej) => setTimeout(() => res("success"), 2000));

    return users;
  }),
  userById: publicProcedure
    .input(
      z.object({
        uuid: z.string().uuid(),
      })
    )
    .query(async (props) => {
      const { input } = props;

      return users.find((user) => user.uuid === input.uuid);
    }),
});

export type AppRouter = typeof appRouter;
