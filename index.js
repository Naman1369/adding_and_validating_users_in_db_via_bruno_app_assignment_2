const express = require('express');
const { resolve } = require('path');
const bcrypt = require('bcrypt');
const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json()); 

const users = [
  {
    email: 'test@example.com',
    password: '$2b$10$9k0JErKchV4UmskSbdUj/OW/qjkccVNaB8Z0V8RzDJ3HFNQArWmtC' 
  }
];

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  try {
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    res.json({ message: 'Login successful', user: { email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
