import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const formatted = err.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        }));
        res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: formatted,
        });
      }

      res.status(500).json({
        status: "error",
        message: "Something went wrong during validation",
      });
    }
  };

export default validate;
