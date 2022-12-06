import './App.css';
import { 
  ChakraProvider 
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import Account from './components/Account';

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])
  return (
    <ChakraProvider>
      {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
    </ChakraProvider>
  );
}

export default App;
