const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve the 'image' directory so frontend can display uploaded photos
app.use('/image', express.static(path.join(__dirname, 'image')));

// Multer configuration for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Make sure an 'image' folder exists in your root directory!
    cb(null, 'image/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


// ==========================================
// ROUTES
// ==========================================

// 1. GET: Fetch all students
app.get('/api/students', (req, res) => {
  fs.readFile('data/student.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading data');
    }
    res.json(JSON.parse(data || '[]'));
  });
});

// DELETE: Remove an existing student
app.delete('/api/students/:id', (req, res) => {
  const studentId = req.params.id;

  fs.readFile('data/student.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading data');
    }

    let students = JSON.parse(data || '[]');
    const updatedStudents = students.filter(s => s.id !== studentId);

    // Check if a student was actually removed
    if (students.length === updatedStudents.length) {
      return res.status(404).send('Student not found');
    }

    // Save the updated array back to JSON file
    fs.writeFile('data/student.json', JSON.stringify(updatedStudents, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error deleting data');
      }
      res.status(200).send({ message: 'Student deleted successfully' });
    });
  });
});
app.patch('/api/students/:id/status', (req, res) => {
  const studentId = req.params.id;
  const newStatus = req.body.status; // 'active' or 'inactive'

  fs.readFile('data/student.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading data');

    let students = JSON.parse(data || '[]');
    const studentIndex = students.findIndex(s => s.id === studentId);

    if (studentIndex === -1) {
      return res.status(404).send('Student not found');
    }

    // Update the status
    students[studentIndex].status = newStatus;

    // Save back to JSON file
    fs.writeFile('data/student.json', JSON.stringify(students, null, 2), (err) => {
      if (err) return res.status(500).send('Error updating status');
      res.status(200).json(students[studentIndex]);
    });
  });
});
// 2. POST: Add a new student
app.post('/api/students', upload.single('image'), (req, res) => {
  fs.readFile('data/student.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading data');
    }

    const students = JSON.parse(data || '[]');
    const newStudent = req.body;

    // If an image was uploaded, store its path
    if (req.file) {
      newStudent.image = 'image/' + req.file.filename;
    }

    // Auto-generate the detail page routing link
    newStudent.detailPage = `student.html?id=${newStudent.id}`;

    // Add to array
    students.push(newStudent);

    // Save back to JSON file
    fs.writeFile('data/student.json', JSON.stringify(students, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error saving data');
      }
      res.status(200).json(newStudent);
    });
  });
});


// 3. PUT: Edit/Update an existing student
app.put('/api/students/:id', upload.single('image'), (req, res) => {
  const studentId = req.params.id;

  fs.readFile('data/student.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading data');
    }

    let students = JSON.parse(data || '[]');
    const studentIndex = students.findIndex(s => s.id === studentId);

    if (studentIndex === -1) {
      return res.status(404).send('Student not found');
    }

    // Merge existing data with new data from the form
    const updatedStudent = {
      ...students[studentIndex],
      ...req.body
    };

    // If a new image was uploaded, update the path. Otherwise, keep the old one.
    if (req.file) {
      updatedStudent.image = 'image/' + req.file.filename;
    }

    // Ensure link remains accurate
    updatedStudent.detailPage = `student.html?id=${updatedStudent.id}`;

    // Overwrite the student in the array
    students[studentIndex] = updatedStudent;

    // Save back to JSON file
    fs.writeFile('data/student.json', JSON.stringify(students, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error updating data');
      }
      res.status(200).json(updatedStudent);
    });
  });
});


// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Make sure you have 'data/student.json' and 'image/' folders created!`);
});