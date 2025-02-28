import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { Sun, Moon } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

export default function ReviewBotUI() {
  const [code, setCode] = useState('// Paste your code here...');
  const [theme, setTheme] = useState('light');
  const [review, setReview] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    setTheme(systemTheme);
  }, []);

  const handleAnalyze = async () => {
    try {
      const res = await axios.post('http://localhost:3000/ai/get-review/', {
        code,
      });
      setReview(res.data);
    } catch (error) {
      setErr(error);
      console.error('Error fetching review:', err);
      setReview('Failed to fetch review. Try again later.');
    }
  };

  return (
    <Container
      fluid
      className={`vh-100 d-flex align-items-center justify-content-center ${
        theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'
      }`}
    >
      <motion.div
        className="p-4 rounded-3 shadow-lg w-100 border border-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold">
            ⚡ ReviewBot - AI Code Reviewer By{' '}
            <a
              href="https://github.com/akramcodez"
              className="text-primary"
              style={{ textDecoration: 'none', fontFamily: 'cursive' }}
            >
              AKRAM
            </a>
          </h2>
          <Button
            variant={theme === 'dark' ? 'light' : 'dark'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>
        </div>

        <Row className="g-4">
          <Col md={6} className="d-flex flex-column">
            <motion.div
              className={`p-3 border rounded-3 shadow-sm flex-grow-1 border border-secondary ${
                theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <h5 className="mb-2">Code Input</h5>
              <Editor
                height="450px"
                language="javascript"
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                value={code}
                onChange={setCode}
              />
              <Button
                variant="primary"
                className="mt-3 w-100"
                onClick={handleAnalyze}
              >
                Analyze Code
              </Button>
            </motion.div>
          </Col>

          <Col md={6} className="d-flex flex-column">
            <motion.div
              className={`p-3 border rounded-3 shadow-sm flex-grow-1 border border-secondary ${
                theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <h5 className="mb-2">Review Output</h5>
              <hr />
              <div>{review}</div>
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
}
