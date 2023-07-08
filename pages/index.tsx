import { Alert, Avatar, Button, Snackbar, Stack, TextField } from '@mui/material';
import { red } from '@mui/material/colors';
import { YouTube, Send } from '@mui/icons-material';
import { useState } from 'react';
import { Configuration, OpenAIApi } from "openai";
import _prompt from '@components/prompt';


export default function App() {
  const [script, setScript] = useState('');
  const [topic, setTopic] = useState('');
  const [openaiKey, setKey] = useState('');
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertText, setAlerttext] = useState('All Fields Are Required');

  async function GenerateScript() {
    setAlertStatus(false);
    if (topic == '' || openaiKey == '') {
      setAlertStatus(true);
    }
    const configuration = new Configuration({
      apiKey: openaiKey,
    });
    const openai = new OpenAIApi(configuration);
    try {
      let completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {"role": "system", "content": _prompt},
          {role: "user", content: topic}
        ],
        temperature: 1.3,
        max_tokens: 2048,
      });
      // @ts-ignore: Object is possibly 'null'.
      setScript(String(completion.data.choices[0].message['content'] || '[Script Genertion Failed]'));
    } catch (error) {
      setAlerttext('Either the API is wrong or ur plan has expired');
      setAlertStatus(true);
    }
    setAlerttext('All Fields Are Required');
  }
  
  return (
    <main className='h-full w-full fixed flex flex-col font-sans items-center justify-center gap-4 pt-2 pb-4'>
      <Stack direction={'row'} className='font-semibold text-xl md:text-3xl lg:text-5xl gap-4 items-center justify-center'>
        Youtube Script Generator
        <Avatar sx={{ bgcolor: red[500] }} variant="circular">
          <YouTube />
        </Avatar>
      </Stack>
      {/* The Place where script will be displayed */}
      <textarea name="script_output" value={script} disabled className='resize-none outline-none rounded w-4/5 h-full bg-[#1C2321] p-2 font-mono font-semibold text-white'></textarea>
      <TextField value={topic} autoComplete='off' onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setTopic(event.target.value);}} className='w-10/12' fullWidth={true} label="Provide A Topic" variant="filled" />
      <Stack direction={'row'} className='gap-3 w-10/12'><TextField value={openaiKey} autoComplete='off' onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setKey(event.target.value);}} className='w-full' fullWidth={true} label="Your OpenAI API" variant="filled" />
        <Button className='bg-sky-500 hover:bg-blue-500 font-sans' variant="contained" onClick={GenerateScript} endIcon={<Send />}>
          Send
        </Button>
      </Stack>
      <Snackbar open={alertStatus} autoHideDuration={6000}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {alertText}
        </Alert>
      </Snackbar>
    </main>
  );
}

App.noLayout = true;
