import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Grid, TextField, Typography, Alert, Snackbar } from '@mui/material';

interface EmailReminderProps {
  backendBaseUrl?: string;
}

const defaultBackend = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const EmailReminder: React.FC<EmailReminderProps> = ({ backendBaseUrl = defaultBackend }) => {
  const [receiverEmail, setReceiverEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [runAtIso, setRunAtIso] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!receiverEmail.trim()) {
      setErrorMsg('Please enter a receiver email');
      return;
    }
    
    setLoading(true);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const res = await fetch(`${backendBaseUrl}/api/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverEmail, subject, body }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to send');
      setStatusMsg('Email sent successfully!');
      setReceiverEmail('');
      setSubject('');
      setBody('');
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!receiverEmail.trim()) {
      setErrorMsg('Please enter a receiver email');
      return;
    }
    if (!runAtIso) {
      setErrorMsg('Please choose a date/time');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const res = await fetch(`${backendBaseUrl}/api/email/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverEmail, subject, body, runAtIso }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to schedule');
      setStatusMsg(`Email scheduled! Will send in ~${Math.round(json.runInSeconds)} seconds`);
      setReceiverEmail('');
      setSubject('');
      setBody('');
      setRunAtIso('');
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Email Reminder</Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Send yourself or others email reminders. Just enter the recipient's email and your message!
      </Typography>
      
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField 
                label="Recipient Email" 
                fullWidth 
                value={receiverEmail} 
                onChange={(e) => setReceiverEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                label="Subject" 
                fullWidth 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Reminder from NexaNote"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label="Message" 
                fullWidth 
                multiline 
                minRows={4} 
                value={body} 
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter your reminder message here..."
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                type="datetime-local" 
                label="Schedule for later (optional)" 
                fullWidth 
                InputLabelProps={{ shrink: true }} 
                value={runAtIso} 
                onChange={(e) => setRunAtIso(e.target.value)} 
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleSend} 
                  disabled={loading || !receiverEmail.trim() || !body.trim()}
                  size="large"
                >
                  Send Now
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={handleSchedule} 
                  disabled={loading || !receiverEmail.trim() || !body.trim() || !runAtIso}
                  size="large"
                >
                  Schedule Email
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Snackbar open={!!statusMsg} autoHideDuration={4000} onClose={() => setStatusMsg(null)}>
        <Alert onClose={() => setStatusMsg(null)} severity="success" variant="filled">{statusMsg}</Alert>
      </Snackbar>
      <Snackbar open={!!errorMsg} autoHideDuration={6000} onClose={() => setErrorMsg(null)}>
        <Alert onClose={() => setErrorMsg(null)} severity="error" variant="filled">{errorMsg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default EmailReminder;


