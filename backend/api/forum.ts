import { Router } from 'express';
import { databaseConnection } from '../connections/DatabaseConnection';

const router = Router();

// GET all forum records
router.get("/", (req, res) => {
  const query = "SELECT * FROM forums INNER JOIN patients ON forums.patient_id = patients.patient_id";

  databaseConnection.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.json(data); 
  });
});

// GET a specific forum record by ID
router.get("/:id", (req, res) => {
  const query = "SELECT * FROM forums WHERE forum_id = ?";
  const id = req.params.id;

  databaseConnection.query(query, id, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// CREATE a new forum record
router.post("/create", (req, res) => {
  const query = `
    INSERT INTO forums (forum_id, title, content, categories, patient_id, created_at) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const created_at = new Date();

  const values = [
    req.body.forum_id,
    req.body.title,
    req.body.content,
    req.body.categories,
    req.body.patient_id,
    created_at
  ];

  databaseConnection.query(query, values, (err, data) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    return res.json({
      ...data,
      message: "Successfully added forum record",
      status: "success",
    });
  });
});

// UPDATE an existing forum record by ID
router.put("/update/:id", (req, res) => {
  const query = `
    UPDATE forums 
    SET
        title = ?,
        content = ?,
        categories = ?
    WHERE forum_id = ?
  `;

  const values = [
    req.body.title,
    req.body.content,
    req.body.categories,
    req.params.id
  ];

  databaseConnection.query(query, values, (err, data) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ error: 'Database update failed' });
    }

    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Forum record not found" });
    }

    return res.json({
      message: "Successfully updated forum record",
      status: "success"
    });
  });
});

// DELETE a forum record by ID
router.delete("/delete/:id", (req, res) => {
  const query = "DELETE FROM forums WHERE forum_id = ?";
  const id = req.params.id;

  databaseConnection.query(query, id, (err, data) => {
    if (err) return res.json(err);
    return res.json({
      ...data,
      message: "Successfully deleted forum record",
      status: "success",
    });
  });
});

export const forumsRouter = router;
