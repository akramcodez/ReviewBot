import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { Button, Container, Row, Col, Navbar, Form } from 'react-bootstrap';
import { Sun, Moon } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export default function ReviewBotUI() {
  const [code, setCode] = useState('// Paste your code here...');
  const [theme, setTheme] = useState('light');
  const [review, setReview] = useState(null);
  const [err, setErr] = useState(null);
  const [language, setLanguage] = useState('javascript'); 

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
        language,
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
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Code Input</h5>
                <Form.Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-auto"
                  style={{
                    backgroundColor: theme === 'dark' ? '#343a40' : '#ffffff',
                    color: theme === 'dark' ? '#ffffff' : '#000000',
                    border:
                      theme === 'dark'
                        ? '1px solid #6c757d'
                        : '1px solid #ced4da',
                  }}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                  <option value="php">PHP</option>
                  <option value="ruby">Ruby</option>
                  <option value="typescript">TypeScript</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="swift">Swift</option>
                  <option value="kotlin">Kotlin</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="sql">SQL</option>
                </Form.Select>
              </div>

              <Editor
                height="450px"
                language={language}
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
              className={`border rounded-3 shadow-sm flex-grow-1 border border-secondary ${
                theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'
              } p-0 pt-0 px-3 pb-3`}
              whileHover={{ scale: 1.02 }}
              style={{
                overflowY: 'auto',
                maxHeight: '590px',
                scrollbarWidth: 'thin',
                scrollbarColor: 'gray',
              }}
            >
              <nav
                className={`navbar sticky-top shadow-sm px-3 pt-3 pb-3 ${
                  theme === 'dark'
                    ? 'bg-dark text-white border-bottom border-secondary'
                    : 'bg-light text-dark border-bottom border-light'
                }`}
              >
                <div className="container-fluid d-flex align-items-center">
                  <h5 className="mb-0 fw-bold">Review Output</h5>
                </div>
              </nav>
              <Markdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeHighlight]}
              >
                {review}
              </Markdown>
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
}
