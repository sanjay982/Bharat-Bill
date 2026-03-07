import express from "express";
import { createServer as createViteServer } from "vite";
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/feedback", async (req, res) => {
    const { name, business, mobile, comments } = req.body;

    try {
      const { data, error } = await resend.emails.send({
        from: 'Johar Billing Feedback <onboarding@resend.dev>',
        to: ['sanju13july@gmail.com'],
        subject: `New Feedback from ${name} (${business})`,
        html: `
          <h3>New Feedback Received</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Business:</strong> ${business}</p>
          <p><strong>Mobile:</strong> ${mobile}</p>
          <p><strong>Comments:</strong> ${comments || 'No comments provided'}</p>
        `,
      });

      if (error) {
        console.error('Email error:', error);
        return res.status(500).json({ error: 'Failed to send email' });
      }

      res.json({ success: true });
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
