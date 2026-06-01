import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Forge online" });
});

app.listen(3000, () => {
  console.log("Speedy Node running on port 3000");
});
