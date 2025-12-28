import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import { AutoAwesome, Schedule, Email } from '@mui/icons-material';

interface AISchedulerProps {
  backendBaseUrl?: string;
}

interface ParsedReminder {
  name: string;
  scheduledTime: string;
  mode?: string;
  applications?: string;
  location?: string;
  link?: string;
}

const defaultBackend = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

interface GeminiModelInfo {
  name: string;
  temperature: number;
  max_tokens: number;
  info?: {
    display_name?: string;
    description?: string;
  };
}

const AIScheduler: React.FC<AISchedulerProps> = ({ backendBaseUrl = defaultBackend }) => {
  const [userInput, setUserInput] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedReminder | null>(null);
  const [modelInfo, setModelInfo] = useState<GeminiModelInfo | null>(null);

  // Fetch Gemini model info on component mount
  useEffect(() => {
    const fetchModelInfo = async () => {
      try {
        const res = await fetch(`${backendBaseUrl}/api/gemini/info`);
        if (res.ok) {
          const data = await res.json();
          setModelInfo(data.model);
        }
      } catch (e) {
        // Silently fail - model info is optional
        console.log('Could not fetch Gemini model info');
      }
    };
    fetchModelInfo();
  }, [backendBaseUrl]);

  const handleParseAndSchedule = async () => {
    if (!userInput.trim()) {
      setErrorMsg('Please enter meeting text or link');
      return;
    }

    if (!receiverEmail.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setStatusMsg(null);
    setParsedData(null);

    try {
      const res = await fetch(`${backendBaseUrl}/api/reminders/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: userInput.trim(),
          receiverEmail: receiverEmail.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to schedule reminder');

      setParsedData({
        name: json.reminder.name,
        scheduledTime: json.reminder.scheduledTime,
        mode: json.reminder.jsonData.mode,
        applications: json.reminder.jsonData.applications,
        location: json.reminder.jsonData.location,
        link: json.reminder.jsonData.link,
      });

      setStatusMsg(
        `Reminder scheduled successfully! Email will be sent on ${new Date(
          json.reminder.scheduledTime
        ).toLocaleString()}`
      );

      // Clear input after successful scheduling
      setUserInput('');
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <AutoAwesome sx={{ color: 'primary.main' }} />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          AI Scheduler & Reminder
        </Typography>
        {modelInfo && (
          <Chip
            label={modelInfo.name}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ ml: 'auto' }}
          />
        )}
      </Box>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Enter meeting details as text or paste a meeting link. Our AI will automatically extract
        the information and schedule your reminder!
      </Typography>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Your Email"
                fullWidth
                type="email"
                value={receiverEmail}
                onChange={(e) => setReceiverEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Meeting Text or Link"
                fullWidth
                multiline
                minRows={4}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Paste meeting link or describe your meeting. Examples:&#10;&#10;• https://meet.google.com/abc-defg-hij&#10;• Team standup meeting tomorrow at 10 AM on Zoom&#10;• Client meeting on Dec 20, 2025 at 2:30 PM at Office Building"
                required
                helperText="Enter meeting link (Google Meet, Zoom, Teams) or describe your meeting with date/time"
              />
            </Grid>

            {parsedData && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Parsed Information:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Meeting Name:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {parsedData.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Scheduled Time:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {new Date(parsedData.scheduledTime).toLocaleString()}
                    </Typography>
                  </Box>
                  {parsedData.mode && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Mode:
                      </Typography>
                      <Chip
                        label={parsedData.mode}
                        size="small"
                        color={parsedData.mode === 'online' ? 'primary' : 'default'}
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  )}
                  {parsedData.applications && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Applications:
                      </Typography>
                      <Typography variant="body2">{parsedData.applications}</Typography>
                    </Box>
                  )}
                  {parsedData.location && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Location:
                      </Typography>
                      <Typography variant="body2">{parsedData.location}</Typography>
                    </Box>
                  )}
                  {parsedData.link && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Meeting Link:
                      </Typography>
                      <Typography
                        variant="body2"
                        component="a"
                        href={parsedData.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: 'primary.main', textDecoration: 'none' }}
                      >
                        {parsedData.link}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleParseAndSchedule}
                disabled={loading || !userInput.trim() || !receiverEmail.trim()}
                size="large"
                startIcon={loading ? <CircularProgress size={20} /> : <Schedule />}
                sx={{ mt: 2 }}
              >
                {loading ? 'Processing...' : 'Parse & Schedule Reminder'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3 }}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email fontSize="small" />
              How it works:
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>Enter your email and meeting information (text or link)</li>
                <li>AI extracts: Name, Time, Mode (online/offline), Applications, Location, Link</li>
                <li>Reminder is automatically scheduled using APScheduler</li>
                <li>You'll receive an email reminder at the scheduled time</li>
                <li>All times are converted to IST (Indian Standard Time)</li>
              </ul>
            </Typography>
            {modelInfo && (
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Powered by: {modelInfo.info?.display_name || modelInfo.name}
                </Typography>
                {modelInfo.info?.description && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                    {modelInfo.info.description}
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={!!statusMsg}
        autoHideDuration={6000}
        onClose={() => setStatusMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setStatusMsg(null)} severity="success" variant="filled">
          {statusMsg}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!errorMsg}
        autoHideDuration={6000}
        onClose={() => setErrorMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setErrorMsg(null)} severity="error" variant="filled">
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AIScheduler;

