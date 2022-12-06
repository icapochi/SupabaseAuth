import { 
    Box,
    Button, 
    FormControl, 
    FormLabel, 
    Heading, 
    Input, 
    VStack,
    useToast,
    Text,

 } from '@chakra-ui/react'

import { useState } from 'react'

import { supabase } from '../supabaseClient'
export default function Auth(){
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    const toast = useToast()


    const handleLogin = async (e) => {
        e.preventDefault()

        try{
            setLoading(true)
            const { err } = await supabase.auth.signInWithOtp({ email }) //Sign in with supabase one time password link

            if (err) throw err
            toast({ //Chakra UI toast for email link success, only runs if the error above ISN'T thrown
                title: "Email sent!",
                description: "Check your email for the login link",
                status: 'success',
                duration: 7500,
                isClosable: true,
            })
        } catch(err){
            toast({ //Chakra UI toast for error from above operation
                title: "Error!",
                description: "Please check the email entered.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        } finally{
            setLoading(false)
        }
    }

    return(
        <VStack>
            <Box w='full' h='full' justifyContent='space-between' bg='gray.100'>
                <Heading as='h1' size='2xl'>Sign In</Heading>
                <Text fontSize='lg'>Sign in via magic link with your email</Text>
                {loading ? (toast({
                    title: "Please wait",
                    description: "Sending magic link...",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                })) : (
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input type='email'
                        id='email'
                        value={ email }
                        placeholder='Enter your email'
                        isRequired={true}
                        onChange={e => setEmail(e.target.value)}
                        />
                        <Button 
                        onClick={handleLogin}
                        >Submit</Button>
                    </FormControl>
                )}
            </Box>
        </VStack>
    )
}