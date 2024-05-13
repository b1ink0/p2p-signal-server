import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

app.get("/", async (req, res) => {
  res.json({ message: "P2P Signaling Server is running!" });
});

app.post("/offer", async (req, res) => {
  if (!req.body) return res.status(400).json({ message: "Invalid offer" });

  const { offer, id } = req.body;

  if (!offer || !id) return res.status(400).json({ message: "Invalid offer" });

  // checking if id is 4 digit number
  if (!/^\d{4}$/.test(id))
    return res.status(400).json({ message: "Invalid id" });

  try {
    const response = await fetch(
      `${process.env.KV_REST_API_URL}/set/${id}-offer?ex=300`,
      {
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
        body: JSON.stringify(offer),
        method: "POST",
      }
    );

    await response.json();

    res.status(200).json({ message: "Offer saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save offer" });
  }
});

app.get("/getoffer/:id", async (req, res) => {
  if (!req.params) return res.status(400).json({ message: "Invalid id" });

  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Invalid id" });

  // checking if id is 4 digit number
  if (!/^\d{4}$/.test(id))
    return res.status(400).json({ message: "Invalid id" });

  try {
    const response = await fetch(
      `${process.env.KV_REST_API_URL}/get/${id}-offer`,
      {
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
      }
    );
    const data = await response.json();

    res
      .status(200)
      .json({ message: "Offer fetched successfully", offer: data?.result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch offer" });
  }
});

app.post("/answer", async (req, res) => {
  if (!req.body) return res.status(400).json({ message: "Invalid answer" });

  const { answer, id } = req.body;

  if (!answer || !id)
    return res.status(400).json({ message: "Invalid answer" });

  // checking if id is 4 digit number
  if (!/^\d{4}$/.test(id))
    return res.status(400).json({ message: "Invalid id" });

  try {
    const response = await fetch(
      `${process.env.KV_REST_API_URL}/set/${id}-answer?ex=300`,
      {
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
        body: JSON.stringify(answer),
        method: "POST",
      }
    );

    await response.json();

    res.status(200).json({ message: "Answer saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save answer" });
  }
});

app.get("/getanswer/:id", async (req, res) => {
  if (!req.params) return res.status(400).json({ message: "Invalid id" });

  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Invalid id" });

  // checking if id is 4 digit number
  if (!/^\d{4}$/.test(id))
    return res.status(400).json({ message: "Invalid id" });

  try {
    const response = await fetch(
      `${process.env.KV_REST_API_URL}/get/${id}-answer`,
      {
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
      }
    );
    const data = await response.json();

    res
      .status(200)
      .json({ message: "Answer fetched successfully", answer: data?.result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch answer" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
