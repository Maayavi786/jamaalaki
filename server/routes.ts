import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertSalonSchema, insertServiceSchema, 
  insertBookingSchema, insertReviewSchema, loginSchema 
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to handle validation errors
  const validateRequest = (schema: any, data: any) => {
    try {
      return { data: schema.parse(data), error: null };
    } catch (error) {
      if (error instanceof ZodError) {
        return { data: null, error: error.format() };
      }
      return { data: null, error: "Invalid request data" };
    }
  };

  // User routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const { data, error } = validateRequest(insertUserSchema, req.body);
    if (error) {
      return res.status(400).json({ message: "Validation error", errors: error });
    }

    try {
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(data.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(data.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser(data);
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { data, error } = validateRequest(loginSchema, req.body);
    if (error) {
      return res.status(400).json({ message: "Validation error", errors: error });
    }

    try {
      const user = await storage.getUserByUsername(data.username);
      if (!user || user.password !== data.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json({
        message: "Login successful",
        user: userWithoutPassword,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Salon routes
  app.get("/api/salons", async (req: Request, res: Response) => {
    try {
      const filters = {
        isLadiesOnly: req.query.isLadiesOnly === "true",
        hasPrivateRooms: req.query.hasPrivateRooms === "true",
        isHijabFriendly: req.query.isHijabFriendly === "true",
        city: req.query.city as string | undefined,
      };

      // Only apply filters that were actually provided in the query
      const appliedFilters: any = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (req.query[key] !== undefined) {
          appliedFilters[key] = value;
        }
      });

      const salons = await storage.getSalons(Object.keys(appliedFilters).length > 0 ? appliedFilters : undefined);
      res.status(200).json(salons);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/salons/:id", async (req: Request, res: Response) => {
    try {
      const salon = await storage.getSalon(parseInt(req.params.id));
      if (!salon) {
        return res.status(404).json({ message: "Salon not found" });
      }
      
      res.status(200).json(salon);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/salons", async (req: Request, res: Response) => {
    const { data, error } = validateRequest(insertSalonSchema, req.body);
    if (error) {
      return res.status(400).json({ message: "Validation error", errors: error });
    }

    try {
      const salon = await storage.createSalon(data);
      res.status(201).json(salon);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/salons/owner/:ownerId", async (req: Request, res: Response) => {
    try {
      const salons = await storage.getSalonsByOwner(parseInt(req.params.ownerId));
      res.status(200).json(salons);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Service routes
  app.get("/api/services/salon/:salonId", async (req: Request, res: Response) => {
    try {
      const services = await storage.getServicesBySalon(parseInt(req.params.salonId));
      res.status(200).json(services);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/services", async (req: Request, res: Response) => {
    const { data, error } = validateRequest(insertServiceSchema, req.body);
    if (error) {
      return res.status(400).json({ message: "Validation error", errors: error });
    }

    try {
      const service = await storage.createService(data);
      res.status(201).json(service);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Booking routes
  app.get("/api/bookings/user/:userId", async (req: Request, res: Response) => {
    try {
      const bookings = await storage.getBookingsByUser(parseInt(req.params.userId));
      res.status(200).json(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/bookings/salon/:salonId", async (req: Request, res: Response) => {
    try {
      const bookings = await storage.getBookingsBySalon(parseInt(req.params.salonId));
      res.status(200).json(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/bookings", async (req: Request, res: Response) => {
    const { data, error } = validateRequest(insertBookingSchema, req.body);
    if (error) {
      return res.status(400).json({ message: "Validation error", errors: error });
    }

    try {
      const booking = await storage.createBooking(data);
      res.status(201).json(booking);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/bookings/:id/status", async (req: Request, res: Response) => {
    const { status } = req.body;
    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    try {
      const booking = await storage.updateBookingStatus(parseInt(req.params.id), status);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.status(200).json(booking);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Review routes
  app.get("/api/reviews/salon/:salonId", async (req: Request, res: Response) => {
    try {
      const reviews = await storage.getReviewsBySalon(parseInt(req.params.salonId));
      res.status(200).json(reviews);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/reviews", async (req: Request, res: Response) => {
    const { data, error } = validateRequest(insertReviewSchema, req.body);
    if (error) {
      return res.status(400).json({ message: "Validation error", errors: error });
    }

    try {
      const review = await storage.createReview(data);
      res.status(201).json(review);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
